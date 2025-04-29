import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import AuthContext from "../context/AuthProvider";
import "../styles/createprojectmodal.scss";
import "../styles/dashboard.scss";
import { validateBrief, validateFile } from "../validators/briefValidator";
import { useForm } from "../hooks/useForm";
import { toast } from "react-toastify";
import CreateBriefSummary from "./CreateBriefSummary";

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  right: "0%",
  transform: "translate(0%, -50%)",
  backgroundColor: "#fefcfb",
  zIndex: 1000,
};

const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  zIndex: 1000,
};

const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  categories: [],
  phrases: [],
  tags: [],
  budget: "",
  targetPlatform: "Instagram",
  reviewDeadline: "",
  deadline: "",
  attachment: null,
};

const CreateBriefModal = ({ isOpen, onClose }) => {
  const { auth } = useAuth(AuthContext);
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  
  const {
    formData,
    setFormData,
    handleChange,
    handleArrayChange,
    handleFileChange,
    resetForm
  } = useForm(INITIAL_FORM_STATE);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
      setErrors({});
      setCurrentPage(0);
      setServerError(null);
      setShowSuccess(false);
    }
  }, [isOpen, resetForm]);

  const handleKeyDown = (e, field) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    
    const value = e.target.value.trim();
    if (!value) return;

    if (formData[field] === undefined) {
      toast.error(`Field ${field} is not defined in form data`);
      return;
    }

    if (!Array.isArray(formData[field])) {
      toast.error(`Field ${field} is not an array`);
      return;
    }

    if (!formData[field].includes(value)) {
      handleChange(field, [...formData[field], value]);
    } else {
      toast.warning(`${value} already exists in ${field}`);
    }
    
    e.target.value = "";
  };

  const removeItem = (field, index) => {
    if (formData[field] === undefined) {
      toast.error(`Field ${field} is not defined in form data`);
      return;
    }

    if (!Array.isArray(formData[field])) {
      toast.error(`Field ${field} is not an array`);
      return;
    }

    const newArray = formData[field].filter((_, i) => i !== index);
    handleChange(field, newArray);
  };

  const nextPage = () => {
    const pageErrors = validateCurrentPage();
    if (Object.keys(pageErrors).length === 0) {
      setCurrentPage((prev) => prev + 1);
      setErrors({});
    } else {
      setErrors(pageErrors);
      const firstError = Object.values(pageErrors)[0];
      toast.error(firstError);
    }
  };

  const previousPage = () => {
    setCurrentPage((prev) => prev - 1);
    setErrors({});
  };

  const validateCurrentPage = () => {
    const pageValidations = {
      0: () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (formData.description.length > 1000) newErrors.description = "Description must be less than 1000 characters";
        if (!formData.reviewDeadline) newErrors.reviewDeadline = "Review deadline is required";
        if (!formData.deadline) newErrors.deadline = "Final deadline is required";
        
        if (formData.reviewDeadline && formData.deadline) {
          const reviewDate = new Date(formData.reviewDeadline);
          const deadlineDate = new Date(formData.deadline);
          if (reviewDate >= deadlineDate) {
            newErrors.reviewDeadline = "Review deadline must be before final deadline";
          }
          if (deadlineDate < new Date()) {
            newErrors.deadline = "Deadline must be in the future";
          }
        }
        return newErrors;
      },
      1: () => {
        const newErrors = {};
        if (!formData.categories || formData.categories.length === 0) {
          newErrors.categories = "At least one category is required";
        }
        if (!formData.targetPlatform) newErrors.targetPlatform = "Platform is required";
        return newErrors;
      },
      2: () => {
        const newErrors = {};
        if (!formData.budget) newErrors.budget = "Budget is required";
        if (formData.budget && (isNaN(formData.budget) || formData.budget <= 0)) {
          newErrors.budget = "Budget must be a positive number";
        }
        return newErrors;
      },
      3: () => {
        const newErrors = {};
        if (formData.attachment) {
          const fileError = validateFile(formData.attachment);
          if (fileError) newErrors.attachment = fileError;
        }
        return newErrors;
      }
    };

    return pageValidations[currentPage] ? pageValidations[currentPage]() : {};
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError(null);

    const validationErrors = validateBrief(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      toast.error("Please fix all errors before submitting");
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "attachment" && value) {
          formDataToSend.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach(item => formDataToSend.append(`${key}[]`, item));
        } else {
          formDataToSend.append(key, value);
        }
      });

      const response = await axios.post("/api/brief", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${auth?.accessToken}`,
        },
        withCredentials: true,
      });

      if (response.status === 201) {
        toast.success("Brief created successfully!");
        setShowSuccess(true);
        setTimeout(() => {
          onClose();
          resetForm();
        }, 1500);
      }
    } catch (err) {
      console.error("Error creating brief:", err);
      const errorMessage = err.response?.data?.message || 
        "Failed to create brief. Please try again later.";
      setServerError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div style={OVERLAY_STYLES}>
      <div style={MODAL_STYLES} className="create-project-modal">
        <div className="btn-container btn-container--right">
          <button 
            className="btn-hide" 
            onClick={onClose} 
            type="button"
            disabled={isSubmitting}
          >
            <FontAwesomeIcon icon={faX} className="icon-left" />
          </button>
        </div>
        
        <form className="form" onSubmit={handleSubmit}>
          <h2 className="form__text form__text--header">
            {showSuccess ? "Brief Created Successfully!" : "Create a Brief"}
          </h2>

          {serverError && (
            <div className="form-error">
              <p>{serverError}</p>
            </div>
          )}

          {showSuccess ? (
            <div className="form-success">
              <p>Your brief has been successfully created!</p>
            </div>
          ) : (
            <>
              {/* Page 0: Overview */}
              {currentPage === 0 && (
                <div className="form-page">
                  <h4 className="form__text form__text--subheader">Overview</h4>

                  <div className="label-row-container__col">
                    <label htmlFor="title" className="form__label">
                      Campaign Title*
                    </label>
                    <input
                      onChange={(e) => handleChange("title", e.target.value)}
                      type="text"
                      id="title"
                      autoComplete="off"
                      value={formData.title}
                      placeholder="Title"
                      className={`form__input ${errors.title ? "input-error" : ""}`}
                    />
                    {errors.title && <span className="error-message">{errors.title}</span>}
                  </div>

                  <div className="label-row-container__col">
                    <label htmlFor="description" className="form__label">
                      Brief Description (200 Words Max)*
                    </label>
                    <textarea
                      onChange={(e) => handleChange("description", e.target.value)}
                      type="text"
                      id="description"
                      autoComplete="off"
                      value={formData.description}
                      placeholder="Description"
                      className={`form__input form__input--textarea ${errors.description ? "input-error" : ""}`}
                      rows="6"
                      cols="50"
                    />
                    {errors.description && <span className="error-message">{errors.description}</span>}
                  </div>

                  <div className="label-row-container__col">
                    <label className="form__label">Review Deadline*</label>
                    <input
                      type="date"
                      value={formData.reviewDeadline}
                      onChange={(e) => handleChange("reviewDeadline", e.target.value)}
                      className={`form__input ${errors.reviewDeadline ? "input-error" : ""}`}
                    />
                    {errors.reviewDeadline && <span className="error-message">{errors.reviewDeadline}</span>}
                  </div>

                  <div className="label-row-container__col">
                    <label className="form__label">Final Deadline*</label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleChange("deadline", e.target.value)}
                      className={`form__input ${errors.deadline ? "input-error" : ""}`}
                    />
                    {errors.deadline && <span className="error-message">{errors.deadline}</span>}
                  </div>

                  <div className="btn-container btn-container--center mt-1p5">
                    <button
                      onClick={nextPage}
                      type="button"
                      disabled={!formData.title || !formData.description || !formData.reviewDeadline || !formData.deadline}
                      className="btn-cta btn-cta--medium"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Page 1: Deliverables */}
              {currentPage === 1 && (
                <div className="form-page">
                  <h4 className="form__text form__text--subheader">Deliverables</h4>

                  <div className="label-row-container__col">
                    <label className="form__label">Categories*</label>
                    <input
                      onKeyDown={(e) => handleKeyDown(e, "categories")}
                      type="text"
                      className={`categories-input ${errors.categories ? "input-error" : ""}`}
                      placeholder="Add a category"
                    />
                    <div className="keywords-container">
                      {formData.categories && formData.categories.map((cat, i) => (
                        <div className="keywords-item" key={i}>
                          <span className="keywords-text">{cat}</span>
                          <span
                            onClick={() => removeItem("categories", i)}
                            className="keywords-delete"
                          >
                            &times;
                          </span>
                        </div>
                      ))}
                    </div>
                    {errors.categories && <span className="error-message">{errors.categories}</span>}
                  </div>

                  <div className="label-row-container__col">
                    <label className="form__label">Phrases</label>
                    <input
                      onKeyDown={(e) => handleKeyDown(e, "phrases")}
                      type="text"
                      className="phrases-input"
                      placeholder="Add a phrase"
                    />
                    <div className="keywords-container">
                      {formData.phrases && formData.phrases.map((phrase, i) => (
                        <div className="keywords-item" key={i}>
                          <span className="keywords-text">{phrase}</span>
                          <span
                            onClick={() => removeItem("phrases", i)}
                            className="phrases-delete"
                          >
                            &times;
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="label-row-container__col">
                    <label className="form__label">Tags</label>
                    <input
                      onKeyDown={(e) => handleKeyDown(e, "tags")}
                      type="text"
                      className="tags-input"
                      placeholder="Add a tag"
                    />
                    <div className="keywords-container">
                      {formData.tags && formData.tags.map((tag, i) => (
                        <div className="keywords-item" key={i}>
                          <span className="keywords-text">{tag}</span>
                          <span
                            onClick={() => removeItem("tags", i)}
                            className="tags-delete"
                          >
                            &times;
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="label-row-container__col">
                    <label htmlFor="platform" className="form__label">
                      Platform*
                    </label>
                    <select
                      value={formData.targetPlatform}
                      onChange={(e) => handleChange("targetPlatform", e.target.value)}
                      className={`form__input form__input--select ${errors.targetPlatform ? "input-error" : ""}`}
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="TikTok">TikTok</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Twitter">Twitter</option>
                      <option value="Facebook">Facebook</option>
                    </select>
                    {errors.targetPlatform && <span className="error-message">{errors.targetPlatform}</span>}
                  </div>

                  <div className="btn-container btn-container--center mt-1p5">
                    <button
                      onClick={previousPage}
                      type="button"
                      className="btn-cta btn-cta--medium btn-cta--secondary"
                    >
                      Previous
                    </button>
                    <button
                      onClick={nextPage}
                      type="button"
                      disabled={!formData.categories || formData.categories.length === 0}
                      className="btn-cta btn-cta--medium"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Page 2: Payment Details */}
              {currentPage === 2 && (
                <div className="form-page">
                  <h4 className="form__text form__text--subheader">Payment Details</h4>
                  <div className="label-row-container__col">
                    <label className="form__label">Budget (CAD)*</label>
                    <input
                      type="number"
                      className={`form__input ${errors.budget ? "input-error" : ""}`}
                      value={formData.budget}
                      onChange={(e) => handleChange("budget", e.target.value)}
                      min="0"
                      step="0.01"
                    />
                    {errors.budget && <span className="error-message">{errors.budget}</span>}
                  </div>

                  <div className="btn-container btn-container--center mt-1p5">
                    <button
                      onClick={previousPage}
                      type="button"
                      className="btn-cta btn-cta--medium btn-cta--secondary"
                    >
                      Previous
                    </button>
                    <button
                      onClick={nextPage}
                      type="button"
                      disabled={!formData.budget || isNaN(formData.budget) || formData.budget <= 0}
                      className="btn-cta btn-cta--medium"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Page 3: Attachment */}
              {currentPage === 3 && (
                <div className="form-page">
                  <div className="label-row-container__col">
                    <label className="form__label">Attachment (Optional)</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*,video/*"
                      className={`form__input ${errors.attachment ? "input-error" : ""}`}
                      onChange={(e) => handleFileChange("attachment", e.target.files[0])}
                    />
                    {formData.attachment && (
                      <div className="file-preview">
                        <p>Selected file: {formData.attachment.name}</p>
                        <button 
                          type="button" 
                          className="btn-text"
                          onClick={() => {
                            handleChange("attachment", null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                        >
                          Remove File
                        </button>
                      </div>
                    )}
                    {errors.attachment && <span className="error-message">{errors.attachment}</span>}
                  </div>

                  <div className="btn-container btn-container--center mt-1p5">
                    <button
                      onClick={previousPage}
                      type="button"
                      className="btn-cta btn-cta--medium btn-cta--secondary"
                    >
                      Previous
                    </button>
                    <button
                      onClick={nextPage}
                      type="button"
                      className="btn-cta btn-cta--medium"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Page 4: Summary */}
              {currentPage === 4 && (
                <div className="form-page">
                  <CreateBriefSummary
                    title={formData.title}
                    description={formData.description}
                    categories={formData.categories}
                    phrases={formData.phrases}
                    tags={formData.tags}
                    budget={formData.budget}
                    targetPlatform={formData.targetPlatform}
                    reviewDeadline={formData.reviewDeadline}
                    deadline={formData.deadline}
                    attachment={formData.attachment}
                  />

                  <div className="btn-container btn-container--center mt-1p5">
                    <button
                      onClick={previousPage}
                      type="button"
                      className="btn-cta btn-cta--medium btn-cta--secondary"
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      className="btn-cta btn-cta--medium"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating..." : "Create Brief"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </form>
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default CreateBriefModal;