import React, { useEffect, useState } from "react";
import { faCheck, faPencil, faX, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from "react-dom";
import useAuth from "../hooks/useAuth";
import AuthContext from "../context/AuthProvider";
import axios from "../api/axios";
import CreateCampaignModal from "./CreateCampaignModal";
import ProjectModalPageOneReview from "./ProjectModalPageOneReview";
import ProjectModalPageOneInProgress from "./ProjectModalPageOneInProgress";
import ProjectModalPageOneSubmitted from "./ProjectModalPageOneSubmitted";
import ProjectModalPageOneBrandReview from "./ProjectModalPageOneBrandReview";
import ProjectModalPayment from "./ProjectModalPayment";
import holidayBackground from "../assets/holiday-background.png";
import "../styles/projectmodal.scss";
import "../styles/createprojectmodal.scss";

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  right: "0%",
  transform: "translate(0%, -50%)",
  background: "linear-gradient(145deg, #f5f7fa, #c3cfe2)",
  borderRadius: "24px",
  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.2)",
  width: "90vw",
  maxWidth: "1200px",
  height: "90vh",
  overflowY: "scroll",
  padding: "2rem 3rem",
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
    console.log("User Roles:", role); // Log the roles to verify it's an array and contains "Influencer"
  }, [brief, role])
  ;

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
      setShowCreateCampaign(true);
    } catch (err) {
      console.error("Error updating brief:", err);
    }
  };

  if (!isOpen || !brief) return null;

  return ReactDOM.createPortal(
    <div style={OVERLAY_STYLES} className="modal-overlay">
      <div style={MODAL_STYLES} className="project-modal-page__group">
        <div className="flex justify-between items-start mb-6">
         
          <button onClick={onClose} className="text-xl text-gray-600 hover:text-black">
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>

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

        

          <div className="mt-8 flex flex-wrap gap-4">
            {["no influencer assigned"].includes(brief.status) && !showAddComment && (
              <>
                <button onClick={() => setShowAddComment(true)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-5 py-2 rounded-lg shadow">
                  <FontAwesomeIcon icon={faPencil} className="mr-2" /> Negotiate
                </button>
                <button onClick={(e) => handleSubmitReviewContract("accept", e)} className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow">
                  <FontAwesomeIcon icon={faCheck} className="mr-2" /> Accept
                </button>
              </>
            )}

       {/* Button to trigger the creation of a new campaign
       <button 
  onClick={() => setShowCreateCampaign(true)}  // Sets the state to show the create campaign modal
  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"  // Tailwind CSS classes for styling the button
>
  <FontAwesomeIcon icon={faPlus} className="mr-2" />  {/* Font Awesome icon for the plus symbol
  Create Campaign
</button> */ }

          </div>

          {showAddComment && (
            <form onSubmit={(e) => handleSubmitReviewContract("modify", e)} className="mt-6">
              <label htmlFor="comments" className="block text-sm font-medium mb-2">Request Changes</label>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              />
              <button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-lg shadow">
                <FontAwesomeIcon icon={faPencil} className="mr-2" /> Submit
              </button>
            </form>
          )}

          {showSuccess && (
            <div className="mt-6 text-green-600 font-medium">✅ Brief has been {brief.validationStatus === "accepted" ? "accepted" : "rejected"} successfully.</div>
          )}
        </div>

        <CreateCampaignModal
          isOpen={showCreateCampaign}
          onClose={() => setShowCreateCampaign(false)}
          OVERLAY_STYLES={OVERLAY_STYLES}
          brief={brief}
        />
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default ProjectModal;