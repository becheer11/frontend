import React, { useEffect, useState } from "react";
import { faCheck, faPencil, faX, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from "react-dom";
import useAuth from "../hooks/useAuth";
import AuthContext from "../context/AuthProvider";
import axios from "../api/axios";
import CreateCampaignModal from "./CreateCampaignModal";
import holidayBackground from "../assets/holiday-background.png";
import "../styles/projectmodal.scss";
import "../styles/createprojectmodal.scss";

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  right: "0%",
  transform: "translate(0%, -50%)",
  backgroundColor: "#fefcfb",
  borderRadius: "24px",
  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.2)",
  width: "90vw",
  maxWidth: "1200px",
  height: "90vh",
  overflow: "hidden", // Changed from scroll to hidden to contain inner scrolling
  zIndex: 1000,
};

const ProjectModal = ({ isOpen, onClose, brief, role = [], OVERLAY_STYLES, user, refreshDashboard }) => {
  const [showAddComment, setShowAddComment] = useState(false);
  const [comment, setComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const { auth } = useAuth(AuthContext);

  useEffect(() => {
    console.log("Brief Modal:", brief);
    console.log("User Roles:", role);
  }, [brief, role]);

  const handleSubmitReviewContract = async (action, e) => {
    e.preventDefault();
    if (action !== "accept") return;
    try {
      const payload = {
        status: "in progress/waiting for submission",
        validationStatus: "accepted",
      };
      await axios.put(`/api/brief/${brief._id}`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      refreshDashboard?.();
      setShowSuccess(true);
    } catch (err) {
      console.error("Error updating brief:", err);
    }
  };

  if (!isOpen || !brief) return null;

  return ReactDOM.createPortal(
    <div style={OVERLAY_STYLES} className="modal-overlay">
      <div style={MODAL_STYLES} className="project-modal">
        <div className="stack">
          <img src={holidayBackground} alt="" className="stack__under" />
          <button onClick={onClose} className="btn-hide stack__over">
            <FontAwesomeIcon icon={faX} className="icon-medium" />
          </button>
        </div>

        {/* Scrollable content container */}
        <div className="project-modal-container" style={{ height: "calc(100% - 60px)", overflowY: "auto" }}>
          <div className="label-row-container">
            <h1 className="project-modal__heading">{brief.title}</h1>
            <p className="project-modal__text">${brief.budget}</p>
          </div>
          <h4 className="project-modal__subheading">{brief.company}</h4>

          <div className="project-modal-content" style={{ padding: "0 20px" }}>
            <div className="text-gray-800">
              <h1 className="text-4xl font-bold mb-4">{brief.title}</h1>
              <p className="text-lg mb-2"><strong>Description:</strong> {brief.description}</p>
              <p className="text-sm mb-2"><strong>Platform:</strong> {brief.targetPlatform}</p>
              <p className="text-sm mb-2"><strong>Tags:</strong> {brief.tags?.join(", ")}</p>
              <p className="text-sm mb-2"><strong>Categories:</strong> {brief.categories?.join(", ")}</p>
              <p className="text-sm mb-2"><strong>Budget:</strong> ${brief.budget}</p>
              <p className="text-sm mb-6"><strong>Deadline:</strong> {new Date(brief.deadline).toLocaleDateString()}</p>

              {brief.attachment?.url && (
                <div className="mb-6">
                  <p className="font-medium mb-2">Attachment:</p>
                  {brief.attachment.resourceType === "image" ? (
                    <img src={brief.attachment.url} alt="attachment" className="rounded-lg w-full max-h-80 object-contain shadow-md" />
                  ) : (
                    <video controls src={brief.attachment.url} className="rounded-lg w-full max-h-80 object-contain shadow-md" />
                  )}
                </div>
              )}
            </div>

            <div className="btn-container btn-container--center mt-4">
              {["no influencer assigned"].includes(brief.status) && !showAddComment && !showSuccess && (
                <>
               
                  <button 
                    onClick={(e) => handleSubmitReviewContract("accept", e)} 
                    className="btn-accept"
                  >
                    <FontAwesomeIcon icon={faCheck} className="icon-left" />
                    Accept
                  </button>
                </>
              )}

              {showSuccess && (
                <button 
                  onClick={() => setShowCreateCampaign(true)}
                  className="btn-accept bg-blue-600 hover:bg-blue-700"
                >
                  <FontAwesomeIcon icon={faPlus} className="icon-left" />
                  Create Campaign
                </button>
              )}
            </div>

            {showAddComment && (
              <form onSubmit={(e) => handleSubmitReviewContract("modify", e)} className="mt-6">
                <div className="label-col-container">
                  <label htmlFor="comments" className="form__label">Request Changes</label>
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="form__input"
                  />
                </div>
                <div className="btn-container btn-container--center">
                  <button 
                    type="submit" 
                    className="btn-accept"
                  >
                    <FontAwesomeIcon icon={faPencil} className="icon-left icon-small" />
                    Submit
                  </button>
                </div>
              </form>
            )}

            {showSuccess && !showCreateCampaign && (
              <div className="mt-6 text-green-600 font-medium text-center">
                ✅ Brief has been accepted successfully. Click "Create Campaign" to proceed.
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateCampaignModal
        isOpen={showCreateCampaign}
        onClose={() => setShowCreateCampaign(false)}
        OVERLAY_STYLES={OVERLAY_STYLES}
        brief={brief}
      />
    </div>,
    document.getElementById("portal")
  );
};

export default ProjectModal;