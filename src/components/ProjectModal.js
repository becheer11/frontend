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

const ProjectModal = ({ isOpen,role, onClose, brief, OVERLAY_STYLES, refreshDashboard }) => {
  const [showAddComment, setShowAddComment] = useState(false);
  const [comment, setComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const { auth } = useAuth(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');



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
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (!isOpen || !brief) return null;

  return ReactDOM.createPortal(
    <div style={OVERLAY_STYLES} className="modal-overlay">
      <div style={MODAL_STYLES} className="project-modal">
        <div className="flex justify-between items-start mb-6">
          <button onClick={onClose} className="text-xl text-gray-600 hover:text-black">
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>

        <div className="text-gray-800">
          <h1 className="text-4xl font-bold mb-4">{brief.title}</h1>
          <div className="tabs mb-4">
            <button 
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => handleTabChange('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab ${activeTab === 'compensation' ? 'active' : ''}`}
              onClick={() => handleTabChange('compensation')}
            >
              Compensation
            </button>
           
            <button 
              className={`tab ${activeTab === 'guidelines' ? 'active' : ''}`}
              onClick={() => handleTabChange('guidelines')}
            >
              Guidelines
            </button>
          </div>

          {/* Overview Section */}
          {activeTab === 'overview' && (
            <div className="section-content">
              <p><strong>Description:</strong> {brief.description}</p>
              <p><strong>Platform:</strong> {brief.targetPlatform}</p>
              <p><strong>Tags:</strong> {brief.tags?.join(", ")}</p>
              <p><strong>Categories:</strong> {brief.categories?.join(", ")}</p>
              <p><strong>Budget:</strong> ${brief.budget}</p>
              <p><strong>Deadline:</strong> {new Date(brief.deadline).toLocaleDateString()}</p>
            </div>
          )}

          {/* Compensation Section */}
          {activeTab === 'compensation' && (
            <div className="section-content">
              <p><strong>Compensation Type:</strong> Payment</p>
              <p><strong>Payment Method:</strong> Stripe</p>
              <p><strong>Amount:</strong> ${brief.budget}</p>
            </div>
          )}

          {/* Deliverables Section */}
          

          {/* Guidelines Section */}
          {activeTab === 'guidelines' && (
            <div className="section-content">
              <p><strong>Required Phrases:</strong> {brief.phrases?.join(", ")}</p>
              <p><strong>more :</strong>  {brief.attachment?.url && (
            <div className="mb-6">
              <p className="font-medium mb-2">Attachment:</p>
              {brief.attachment.resourceType === "image" ? (
                <img src={brief.attachment.url} alt="attachment" className="rounded-lg w-full max-h-80 object-contain shadow-md" />
              ) : (
                <video controls src={brief.attachment.url} className="rounded-lg w-full max-h-80 object-contain shadow-md" />
              )}
            </div>
          )}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            { ["no influencer assigned"].includes(brief.status) && !showAddComment && (
              <>
                <button onClick={() => setShowAddComment(true)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-5 py-2 rounded-lg shadow">
                  <FontAwesomeIcon icon={faPencil} className="mr-2" /> Negotiate
                </button>
                <button onClick={(e) => handleSubmitReviewContract("accept", e)} className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow">
                  <FontAwesomeIcon icon={faCheck} className="mr-2" /> Accept
                </button>
              </>
            )}
            </div>
            </div>
          )}
 
          <div className="mt-8 flex flex-wrap gap-4">
            <button 
              onClick={onClose} 
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow"
            >
              Close
            </button>
            <button
              onClick={() => refreshDashboard?.()} 
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow"
            >
              Refresh Dashboard
            </button>
          </div>
          
        </div>
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default ProjectModal;
