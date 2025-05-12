import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2"; // Add at the top if not already imported

import {
  faX,
  faPaperclip,
  faSave,
  faCheck,
  faClock
} from "@fortawesome/free-solid-svg-icons";
import ReactDOM from "react-dom";
import axios from "../api/axios";
import "../styles/CreateCampaignModal.scss";
import { useNavigate } from "react-router-dom";

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
  width: "90%",
  maxWidth: "800px",
  maxHeight: "90vh",
  overflowY: "auto",
  padding: "20px",
  zIndex: 1000
};

const CreateCampaignModal = ({ 
  isOpen, 
  onClose, 
  brief, 
  OVERLAY_STYLES,
  refreshDashboard 
}) => {
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(true);
  const [existingCampaign, setExistingCampaign] = useState(null);
  const navigate = useNavigate();

  // Check for existing draft campaign when brief changes
  useEffect(() => {
    if (!brief) return;

    const checkForExistingCampaign = async () => {
      try {
        const response = await axios.get(`/api/campaigns/brief/${brief._id}`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });

        if (response.data.campaigns && response.data.campaigns.length > 0) {
          const draft = response.data.campaigns.find(c => c.status === "draft");
          if (draft) {
            setExistingCampaign(draft);
            setDescription(draft.description);
            if (draft.attachment?.url) {
              setPreviewUrl(draft.attachment.url);
            }
          }
        }
      } catch (error) {
        console.error("Error checking for existing campaign:", error);
      }
    };

    checkForExistingCampaign();
  }, [brief]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAttachment(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(""); // Clear preview for non-image files
    }
  };

  const handleSaveDraft = async () => {
    if (!description) {
      alert("Please add a description before saving");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("briefId", brief._id);
      formData.append("description", description);
      formData.append("status", "draft");
      if (attachment) {
        formData.append("attachment", attachment);
      }

      let response;
      if (existingCampaign) {
        // Update existing draft
        response = await axios.put(
          `/api/campaign/${existingCampaign._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true
          }
        );
      } else {
        // Create new draft
        response = await axios.post("/api/campaign", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        });
      }

      alert("Draft saved successfully!");
      onClose();
      if (refreshDashboard) refreshDashboard();
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitCampaign = async () => {
    if (!description) {
      alert("Please add a description before submitting");
      return;
    }
  
    const result = await Swal.fire({
      title: "Submit Campaign?",
      text: "You won't be able to edit it after submission.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!"
    });
  
    if (!result.isConfirmed) {
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const formData = new FormData();
      formData.append("briefId", brief._id);
      formData.append("description", description);
      formData.append("status", "pending");
      if (attachment) {
        formData.append("attachment", attachment);
      }
  
      let response;
      if (existingCampaign) {
        response = await axios.put(
          `/api/campaign/${existingCampaign._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true
          }
        );
      } else {
        response = await axios.post("/api/campaign", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        });
      }
  
      Swal.fire("Submitted!", "Your campaign has been submitted.", "success");
      onClose();
      if (refreshDashboard) refreshDashboard();
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting campaign:", error);
      Swal.fire("Error", "Failed to submit campaign. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  if (!isOpen || !brief) return null;

  return ReactDOM.createPortal(
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES} className="campaign-modal">
          <div className="campaign-modal__header">
            <h2>Create Campaign for: {brief.title}</h2>
            <button onClick={onClose} className="campaign-modal__close-btn">
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>

          <div className="campaign-modal__content">
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Campaign Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input"
                rows="6"
                placeholder="Describe your campaign approach and deliverables..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="attachment" className="form-label">
                Attachment (Optional)
              </label>
              <div className="file-upload">
                <label htmlFor="attachment" className="file-upload__label">
                  <FontAwesomeIcon icon={faPaperclip} className="icon-left" />
                  {attachment ? attachment.name : "Choose File"}
                </label>
                <input
                  id="attachment"
                  type="file"
                  onChange={handleFileChange}
                  className="file-upload__input"
                  accept="image/*,video/*"
                />
              </div>
              {previewUrl && (
                <div className="attachment-preview">
                  {attachment?.type.startsWith("image/") ? (
                    <img src={previewUrl} alt="Preview" className="preview-image" />
                  ) : (
                    <div className="file-preview">
                      <p>File ready for upload: {attachment.name}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="campaign-modal__status">
              <p>
                <strong>Current Status:</strong>{" "}
                {existingCampaign ? "Draft (unsubmitted)" : "New Campaign"}
              </p>
            </div>

            <div className="campaign-modal__actions">
              <button
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="btn btn--secondary"
              >
                <FontAwesomeIcon icon={faSave} className="icon-left" />
                {isSubmitting ? "Saving..." : "Save Draft"}
              </button>
              <button
                onClick={handleSubmitCampaign}
                disabled={isSubmitting}
                className="btn btn--primary"
              >
                <FontAwesomeIcon icon={faCheck} className="icon-left" />
                {isSubmitting ? "Submitting..." : "Submit Campaign"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
};

export default CreateCampaignModal;