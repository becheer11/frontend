import React, { useState } from "react";
import ReactDOM from "react-dom";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import AuthContext from "../context/AuthProvider";
import "../styles/createprojectmodal.scss";
import "../styles/dashboard.scss";

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  right: "0%",
  transform: "translate(0%, -50%)",
  backgroundColor: "#fefcfb",
  zIndex: 1000,
};

const CreateBriefModal = ({ isOpen, onClose, OVERLAY_STYLES }) => {
  const { auth } = useAuth(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [phrases, setPhrases] = useState([]);
  const [tags, setTags] = useState([]);
  const [budget, setBudget] = useState("");
  const [targetPlatform, setTargetPlatform] = useState("Instagram");
  const [reviewDeadline, setReviewDeadline] = useState("");
  const [deadline, setDeadline] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const [currentPage, setCurrentPage] = useState(0); // To control page navigation
   const [showSuccess, setShowSuccess] = useState(false);
 
  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    const value = e.target.value.trim();
    if (!value) return;

    if (e.target.className === "tags-input") {
      setTags((prevTags) => [...prevTags, value]);
    } else if (e.target.className === "phrases-input") {
      setPhrases((prevPhrases) => [...prevPhrases, value]);
    } else if (e.target.className === "categories-input") {
      setCategories((prevCategories) => [...prevCategories, value]);
    }

    e.target.value = ""; // Clear the input field after pressing Enter
  };

  const removeItem = (e, deleteIndex, type) => {
    if (type === "tags") {
      setTags(tags.filter((_, i) => i !== deleteIndex));
    } else if (type === "phrases") {
      setPhrases(phrases.filter((_, i) => i !== deleteIndex));
    } else if (type === "categories") {
      setCategories(categories.filter((_, i) => i !== deleteIndex));
    }
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const previousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("budget", Number(budget));
    formData.append("targetPlatform", targetPlatform);
    formData.append("reviewDeadline", reviewDeadline);
    formData.append("deadline", deadline);

    categories.forEach((cat) => formData.append("categories[]", cat));
    phrases.forEach((phrase) => formData.append("phrases[]", phrase));
    tags.forEach((tag) => formData.append("tags[]", tag));

    // Attach the file only when it's on the last step
    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      const response = await axios.post("/api/brief", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status === 201) {
        alert("Brief created successfully!");
        onClose();
      }
    } catch (err) {
      console.error("Error creating brief:", err);
      alert("Failed to create brief");
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div style={OVERLAY_STYLES}>
      <div style={MODAL_STYLES} className="create-project-modal">
        <div className="btn-container btn-container--right">
          <button className="btn-hide" onClick={onClose} type="button">
            <FontAwesomeIcon icon={faX} className="icon-left" />
          </button>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <h2 className="form__text form__text--header">
            {!showSuccess ? "Create a Brief" : "Success!"}
          </h2>

          {/* Page 0: Contract Details */}
          {currentPage === 0 && (
            <div className="form-page">
              <h4 className="form__text form__text--subheader">Overview</h4>

              <div className="label-row-container__col">
                <label htmlFor="title" className="form__label">
                  Campaign Title
                </label>
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  id="title"
                  autoComplete="off"
                  value={title}
                  required
                  placeholder="Title"
                  className="form__input"
                />
              </div>

              <div className="label-row-container__col">
                <label htmlFor="description" className="form__label">
                  Brief Description (200 Words Max)
                </label>
                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  type="text"
                  id="description"
                  autoComplete="off"
                  value={description}
                  required
                  placeholder="Description"
                  className="form__input form__input--textarea"
                  rows="6"
                  cols="50"
                />
              </div>

              <div className="label-row-container__col">
                <label className="form__label">Review Deadline</label>
                <input
                  type="date"
                  value={reviewDeadline}
                  onChange={(e) => setReviewDeadline(e.target.value)}
                  className="form__input"
                  required
                />
              </div>

              <div className="label-row-container__col">
                <label className="form__label">Final Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="form__input"
                  required
                />
              </div>

              <div className="btn-container btn-container--center mt-1p5">
                <button
                  onClick={nextPage}
                  type="button"
                  disabled={title && description ? false : true}
                  className={
                    title && description
                      ? "btn-cta btn-cta--medium btn-cta--active"
                      : "btn-cta btn-cta--medium btn-cta--inactive"
                  }
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

              {/* Categories */}
              <div className="label-row-container__col">
                <label className="form__label">Categories</label>
                <input
                  onKeyDown={handleKeyDown}
                  type="text"
                  className="categories-input"
                  placeholder="Add a category"
                />
                <div className="keywords-container">
                  {categories.map((cat, i) => (
                    <div className="keywords-item" key={i}>
                      <span className="keywords-text">{cat}</span>
                      <span
                        onClick={(e) => removeItem(e, i, "categories")}
                        className="keywords-delete"
                      >
                        &times;
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phrases */}
              <div className="label-row-container__col">
                <label className="form__label">Phrases</label>
                <input
                  onKeyDown={handleKeyDown}
                  type="text"
                  className="phrases-input"
                  placeholder="Add a phrase"
                />
                <div className="keywords-container">
                  {phrases.map((phrase, i) => (
                    <div className="keywords-item" key={i}>
                      <span className="keywords-text">{phrase}</span>
                      <span
                        onClick={(e) => removeItem(e, i, "phrases")}
                        className="phrases-delete"
                      >
                        &times;
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="label-row-container__col">
                <label className="form__label">Tags</label>
                <input
                  onKeyDown={handleKeyDown}
                  type="text"
                  className="tags-input"
                  placeholder="Add a tag"
                />
                <div className="keywords-container">
                  {tags.map((tag, i) => (
                    <div className="keywords-item" key={i}>
                      <span className="keywords-text">{tag}</span>
                      <span
                        onClick={(e) => removeItem(e, i, "tags")}
                        className="tags-delete"
                      >
                        &times;
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Platform */}
              <div className="label-row-container__col">
                <label htmlFor="platform" className="form__label">
                  Platform
                </label>
                <select
                  value={targetPlatform}
                  onChange={(e) => setTargetPlatform(e.target.value)}
                  className="form__input form__input--select"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="YouTube">YouTube</option>
                </select>
              </div>

              <div className="btn-container btn-container--center mt-1p5">
                <button
                  onClick={previousPage}
                  type="button"
                  className="btn-cta btn-cta--medium btn-cta--inactive"
                >
                  Previous Page
                </button>
                <button
                  onClick={nextPage}
                  type="button"
                  disabled={!targetPlatform}
                  className={
                    targetPlatform
                      ? "btn-cta btn-cta--medium btn-cta--active"
                      : "btn-cta btn-cta--medium btn-cta--inactive"
                  }
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
              <label className="form__label">Budget (CAD)</label>
              <input
                type="number"
                className="form__input"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
              <div className="btn-container btn-container--center mt-1p5">
                <button
                  onClick={previousPage}
                  type="button"
                  className="btn-cta btn-cta--medium btn-cta--inactive"
                >
                  Previous Page
                </button>
                <button
                  onClick={nextPage}
                  type="button"
                  disabled={budget ? false : true}
                  className={
                    budget ? "btn-cta btn-cta--medium btn-cta--active" : "btn-cta btn-cta--medium btn-cta--inactive"
                  }
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Page 3: Attachment (Final Step) */}
          {currentPage === 3 && (
            <div className="form-page">
              <div className="label-row-container__col">
                <label className="form__label">Attachment (Image/Video)</label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="form__input"
                  onChange={(e) => setAttachment(e.target.files[0])}
                  required
                />
              </div>

              <div className="btn-container btn-container--center mt-1p5">
                <button
                  onClick={previousPage}
                  type="button"
                  className="btn-cta btn-cta--medium btn-cta--inactive"
                >
                  Previous Page
                </button>
                <button
                  type="submit"
                  className="btn-cta btn-cta--medium btn-cta--active"
                >
                  Create Brief
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default CreateBriefModal;
