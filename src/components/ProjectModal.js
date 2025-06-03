import React, { useEffect, useState } from "react";
import { 
  faX, 
  faCheck, 
  faPencil, 
  faPlus,
  faCalendarAlt,
  faDollarSign,
  faHashtag,
  faBullseye,
  faFileAlt,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from "react-dom";
import useAuth from "../hooks/useAuth";
import AuthContext from "../context/AuthProvider";
import axios from "../api/axios";
import CreateCampaignModal from "./CreateCampaignModal";
import "../styles/projectmodal.scss";
const moment = require("moment");

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
  borderRadius: "24px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  width: "85vw",
  maxWidth: "1100px",
  height: "85vh",
  overflowY: "auto",
  padding: "0",
  zIndex: 1000,
  border: "1px solid rgba(255, 255, 255, 0.3)",
};

const ProjectModal = ({ isOpen, onClose, brief, role = [], OVERLAY_STYLES, user, refreshDashboard }) => {
  const [showAddComment, setShowAddComment] = useState(false);
  const [comment, setComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const { auth } = useAuth(AuthContext);

  useEffect(() => {
    if (brief) {
      console.log("Brief Data:", brief);
    }
  }, [brief]);

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
    <>
      <div style={OVERLAY_STYLES} className="brief-modal-overlay">
        <div style={MODAL_STYLES} className="brief-modal">
          {/* Header Section */}
          <div className="brief-modal__header">
            <div className="brief-modal__header-content">
              <h1 className="brief-modal__title">{brief.title}</h1>
              <div className="brief-modal__meta">
                <span className="brief-modal__status">
                  {brief.validationStatus === "accepted" ? (
                    <>
                      <FontAwesomeIcon icon={faCheck} className="icon-status" />
                      Accepted
                    </>
                  ) : (
                    "Pending Approval"
                  )}
                </span>
                <span className="brief-modal__date">
                  <FontAwesomeIcon icon={faCalendarAlt} className="icon-meta" />
                  Due: {new Date(brief.deadline).toLocaleDateString()}
                </span>
                <span className="brief-modal__budget">
                  <FontAwesomeIcon icon={faDollarSign} className="icon-meta" />
                  Budget: {brief.budget} DT
                </span>
              </div>
            </div>
            <button onClick={onClose} className="brief-modal__close-btn">
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>

          {/* Main Content */}
          <div className="brief-modal__content">
            {/* Navigation Tabs */}
            <div className="brief-modal__tabs">
              <button
                className={`brief-modal__tab ${activeTab === "details" ? "active" : ""}`}
                onClick={() => setActiveTab("details")}
              >
                <FontAwesomeIcon icon={faFileAlt} className="icon-tab" />
                Brief Details
              </button>
              <button
                className={`brief-modal__tab ${activeTab === "actions" ? "active" : ""}`}
                onClick={() => setActiveTab("actions")}
              >
                <FontAwesomeIcon icon={faBullseye} className="icon-tab" />
                Available Actions
              </button>
            </div>

            {/* Tab Content */}
            <div className="brief-modal__tab-content">
              {activeTab === "details" && (
                <div className="brief-details">
                  <div className="brief-details__section">
                    <h2 className="brief-details__section-title">
                      <FontAwesomeIcon icon={faHashtag} className="icon-section" />
                      Campaign Brief
                    </h2>
                    <p className="brief-details__description">{brief.description}</p>
                  </div>

                  <div className="brief-details__grid">
                    <div className="brief-details__card">
                      <h3 className="brief-details__card-title">
                        <FontAwesomeIcon icon={faBullseye} className="icon-card" />
                        Categories
                      </h3>
                      <div className="brief-tags">
                                   
              {brief.categories?.map((category, index) => (
  <li key={index} className="brief-tags">
    {typeof category === "object" ? category.name : category}
  </li>
))}
                      </div>
                    </div>

                    <div className="brief-details__card">
                      <h3 className="brief-details__card-title">
                        <FontAwesomeIcon icon={faCheck} className="icon-card" />
                        Deliverables
                      </h3>
                      <ul className="brief-details__list">
                        <li className="brief-details__list-item">
                          Platform: {brief.targetPlatform}
                        </li>
                        <li className="brief-details__list-item">
                          Deadline: {new Date(brief.deadline).toLocaleDateString()}
                        </li>
                        <li className="brief-details__list-item">
                          Revisions: {brief.numberOfInterests || 1}
                        </li>
                      </ul>
                    </div>

                    <div className="brief-details__card">
                      <h3 className="brief-details__card-title">
                        <FontAwesomeIcon icon={faDollarSign} className="icon-card" />
                        Budget & Payment
                      </h3>
                      <div className="brief-stats">
                        <div className="brief-stat">
                          <span className="brief-stat__value"> {brief.budget} DT </span>
                          <span className="brief-stat__label">Total Budget</span>
                        </div>
                      </div>
                    </div>

                    {brief.attachment?.url && (
                      <div className="brief-details__card brief-details__card--full">
                        <h3 className="brief-details__card-title">Reference Materials</h3>
                        <div className="brief-media">
                          {brief.attachment.resourceType === "image" ? (
                            <img 
                              src={brief.attachment.url} 
                              alt="Brief attachment" 
                              className="brief-media__image" 
                            />
                          ) : (
                            <video 
                              controls 
                              src={brief.attachment.url} 
                              className="brief-media__video"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "actions" && (
                
                <div className="brief-actions">
                   <div className="preview-col">
                                        <div className="preview-row">
                                          <h5 className="form__label">Contract</h5>
                                        </div>
                                        <table className="preview-table">
                                          <tbody className="preview-table__tbody">
                                            <tr className="preview-table__tr">
                                              <td className="preview-table__td preview-table__td--contract">
                                                <p>
                                                  The creator will provide the following in accordance to
                                                  the content guidelines:
                                                </p>
                                                <br />
                                                <p>
                                                  The creator must upload all content on CoLab by{" "}
                                                  {moment(brief.reviewDeadline).format("MMMM Do YYYY, h:mm:ss a")}{" "}
                                                  for review by the brand. All content
                                                  must be uploaded by{" "}
                                                  {moment(brief.deadline).format("MMMM Do YYYY, h:mm:ss a")} after
                                                  the Creator receives approval from the brand.
                                                </p>
                                                <br />
                            
                                                <p>
                                                  The Creator grants the Brand a worldwide, irrevocable,
                                                  royalty-free, fully paid-up, transferrable,
                                                  sub-licensable, and perpetual right and license to
                                                  reproduce, publish, distribute, display, repost, share and
                                                  edit all Creator created for or on behalf of the Brand in
                                                  any and all media now known or developed in the future.
                                                </p>
                                                <br />
                                                <p>
                                                  {" "}
                                                  The Creator accepts the terms of the foregoing proposal
                                                  and agree to the Privacy Policy and Terms & Conditions.
                                                </p>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                    
                                    </div>
                                    
                  { !showAddComment && !showSuccess &&  role.includes("Influencer") && (
                    
                    <div className="action-card action-card--primary">
                      <h3 className="action-card__title">Accept This Brief</h3>
                      <p className="action-card__description">
                        By accepting this brief, you agree to the terms and will be able to create a campaign.
                      </p>
                      <button 
                        onClick={(e) => handleSubmitReviewContract("accept", e)} 
                        className="action-card__btn"
                      >
                        <FontAwesomeIcon icon={faCheck} className="icon-btn" />
                        Accept Brief
                      </button>
                    </div>
                  )}

                  {showSuccess && (
                    <div className="action-card action-card--success">
                      <h3 className="action-card__title">Brief Accepted Successfully!</h3>
                      <p className="action-card__description">
                        You can now create a campaign for this brief. Click the button below to get started.
                      </p>
                      {showSuccess && (
                <button 
                onClick={() => {

                  setTimeout(() => {
                    setShowCreateCampaign(true); // Open campaign modal after a small delay
                  }, 100);                }}

                  className="btn-accept bg-blue-600 hover:bg-blue-700"
                >
                  <FontAwesomeIcon icon={faPlus} className="icon-left" />
                  Create Campaign
                </button>
              )}
            </div>

                  )}
               

                 
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateCampaignModal
  isOpen={showCreateCampaign}
  onClose={() => setShowCreateCampaign(false)}
  brief={brief}  // Make sure you're passing the brief prop
  OVERLAY_STYLES={OVERLAY_STYLES}  // Add this line
  refreshDashboard={refreshDashboard}
/>

    </>,
    document.getElementById("portal")
  );
};

export default ProjectModal;