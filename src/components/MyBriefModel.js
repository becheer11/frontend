import React, { useEffect, useState } from "react";
import { 
  faX, 
  faCalendarAlt, 
  faDollarSign, 
  faHashtag, 
  faCheckCircle,
  faBullseye,
  faFileAlt,
  faUserTie,
  faPlus,
  faChartLine,
  faTrash,
  faEdit
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from "react-dom";
import axios from "../api/axios";
import { ToastContainer, toast } from 'react-toastify';

import CreateCampaignModal from "./CreateCampaignModal";
import UpdateBriefModal from "./UpdateBriefModal"; // You'll need to create this
import "../styles/mybrief-modal.scss";

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

const MyBriefModel = ({ isOpen, onClose, brief, role = [], OVERLAY_STYLES, user, refreshDashboard }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [activeTab, setActiveTab] = useState("brief");
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showUpdateBrief, setShowUpdateBrief] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (brief && brief._id) {
      const fetchCampaigns = async () => {
        try {
          const res = await axios.get(`/api/campaigns/brief/${brief._id}`, {
            withCredentials: true,
          });
          setCampaigns(res.data.campaigns || []);
        } catch (err) {
          console.error("Error fetching campaigns:", err);
        }
      };
      fetchCampaigns();
    }
  }, [brief]);

  const handleDeleteBrief = async () => {
    if (!window.confirm("Are you sure you want to delete this brief? This action cannot be undone.")) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await axios.delete(`/api/brief/${brief._id}`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
        withCredentials: true,
      });
      toast.success("Brief deleted successfully!");
      refreshDashboard();
      onClose();
    } catch (err) {
      console.error("Error deleting brief:", err);
      toast.error(err.response?.data?.message || "Failed to delete brief");
    } finally {
      setIsDeleting(false);
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
                  <FontAwesomeIcon icon={faCheckCircle} className="icon-status" />
                  {brief.validationStatus || "Pending"}
                </span>
                <span className="brief-modal__date">
                  <FontAwesomeIcon icon={faCalendarAlt} className="icon-meta" />
                  Due: {new Date(brief.deadline).toLocaleDateString()}
                </span>
                {brief.budget && (
                  <span className="brief-modal__budget">
                    <FontAwesomeIcon icon={faDollarSign} className="icon-meta" />
                    Budget: DT{brief.budget}
                  </span>
                )}
              </div>
            </div>
            
            <div className="brief-modal__header-actions">
              {/* Only show edit/delete buttons if user is advertiser and owns this brief */}
              {brief.advertiserId?.userId?._id && (
                <>
                  <button 
                    onClick={() => setShowUpdateBrief(true)}
                    className="brief-modal__action-btn brief-modal__action-btn--edit"
                    disabled={isDeleting}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Edit
                  </button>
                  <button 
                    onClick={handleDeleteBrief}
                    className="brief-modal__action-btn brief-modal__action-btn--delete"
                    disabled={isDeleting}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </>
              )}
              
              <button onClick={onClose} className="brief-modal__close-btn">
                <FontAwesomeIcon icon={faX} />
              </button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="brief-modal__content">
            {/* Navigation Tabs */}
            <div className="brief-modal__tabs">
              <button
                className={`brief-modal__tab ${activeTab === "brief" ? "active" : ""}`}
                onClick={() => setActiveTab("brief")}
              >
                <FontAwesomeIcon icon={faFileAlt} className="icon-tab" />
                Brief Details
              </button>
              <button
                className={`brief-modal__tab ${activeTab === "campaigns" ? "active" : ""}`}
                onClick={() => setActiveTab("campaigns")}
              >
                <FontAwesomeIcon icon={faUserTie} className="icon-tab" />
                Campaigns ({campaigns.length})
              </button>
              <button
                className={`brief-modal__tab ${activeTab === "analytics" ? "active" : ""}`}
                onClick={() => setActiveTab("analytics")}
              >
                <FontAwesomeIcon icon={faChartLine} className="icon-tab" />
                Performance
              </button>
            </div>

            {/* Tab Content */}
            <div className="brief-modal__tab-content">
              {activeTab === "brief" && (
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
                        Requirements
                      </h3>
                      <ul className="brief-details__list">
                        {brief.categories?.map((category, index) => (
                          <li key={index} className="brief-details__list-item">
                            {category}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="brief-details__card">
                      <h3 className="brief-details__card-title">
                        <FontAwesomeIcon icon={faCheckCircle} className="icon-card" />
                        Deliverables
                      </h3>
                      <ul className="brief-details__list">
                        <li className="brief-details__list-item">Platform: {brief.targetPlatform}</li>
                        <li className="brief-details__list-item">Deadline: {new Date(brief.deadline).toLocaleDateString()}</li>
                        <li className="brief-details__list-item">Revisions: {brief.numberOfRevisions || 1}</li>
                      </ul>
                    </div>

                    <div className="brief-details__card">
                      <h3 className="brief-details__card-title">
                        <FontAwesomeIcon icon={faDollarSign} className="icon-card" />
                        Budget & Payment
                      </h3>
                      <div className="brief-stats">
                        <div className="brief-stat">
                          <span className="brief-stat__value">DT{brief.budget}</span>
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

              {activeTab === "campaigns" && (
                <div className="brief-campaigns">
                  <div className="brief-campaigns__header">
                    <h2 className="brief-campaigns__title">Campaigns for This Brief</h2>
                    {role.includes("Influencer") && (
                      <button 
                        onClick={() => setShowCreateCampaign(true)}
                        className="brief-campaigns__create-btn"
                      >
                        <FontAwesomeIcon icon={faPlus} className="icon-btn" />
                        Create Campaign
                      </button>
                    )}
                  </div>

                  {campaigns.length > 0 ? (
                    <div className="brief-campaigns__grid">
                      {campaigns.map((campaign) => (
                        <div key={campaign._id} className="campaign-card">
                          <div className="campaign-card__header">
                            <div className="campaign-card__creator">
                              {campaign.creatorId?.userId?.profilePhoto?.url ? (
                                <img 
                                  src={campaign.creatorId.userId.profilePhoto.url} 
                                  alt="Creator" 
                                  className="campaign-card__avatar"
                                />
                              ) : (
                                <div className="campaign-card__avatar--default">
                                  {campaign.creatorId?.userId?.username?.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <span className="campaign-card__username">
                                {campaign.creatorId?.userId?.username || "Unknown Creator"}
                              </span>
                            </div>
                            <span className={`campaign-card__status campaign-card__status--${campaign.status?.toLowerCase().replace(' ', '-')}`}>
                              {campaign.status}
                            </span>
                          </div>
                          
                          <p className="campaign-card__description">
                            {campaign.description?.length > 150 
                              ? `${campaign.description.substring(0, 150)}...` 
                              : campaign.description}
                          </p>
                          
                          {campaign.attachment?.url && (
                            <div className="campaign-card__media">
                              {campaign.attachment.resourceType === "image" ? (
                                <img 
                                  src={campaign.attachment.url} 
                                  alt="Campaign media" 
                                  className="campaign-card__media-image"
                                />
                              ) : (
                                <video 
                                  src={campaign.attachment.url} 
                                  className="campaign-card__media-video"
                                  controls
                                />
                              )}
                            </div>
                          )}
                          
                          <div className="campaign-card__footer">
                            <div className="campaign-card__stat">
                              <FontAwesomeIcon icon={faChartLine} className="icon-stat" />
                              <span>Score: {campaign.score || "N/A"}</span>
                            </div>
                            <div className="campaign-card__stat">
                              <FontAwesomeIcon icon={faDollarSign} className="icon-stat" />
                              <span>Payment: {campaign.paymentStatus || "Pending"}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="brief-campaigns__empty">
                      <p>No campaigns have been created for this brief yet.</p>
                      {role.includes("Influencer") && (
                        <button 
                          onClick={() => setShowCreateCampaign(true)}
                          className="brief-campaigns__create-btn brief-campaigns__create-btn--center"
                        >
                          <FontAwesomeIcon icon={faPlus} className="icon-btn" />
                          Be the first to create a campaign
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="brief-analytics">
                  <h2 className="brief-analytics__title">Performance Overview</h2>
                  <div className="brief-analytics__grid">
                    <div className="analytics-card analytics-card--primary">
                      <h3 className="analytics-card__title">Total Campaigns</h3>
                      <div className="analytics-card__value">{campaigns.length}</div>
                    </div>
                    
                    <div className="analytics-card">
                      <h3 className="analytics-card__title">Average Score</h3>
                      <div className="analytics-card__value">
                        {campaigns.length > 0 
                          ? (campaigns.reduce((sum, c) => sum + (c.score || 0), 0) / campaigns.length).toFixed(1)
                          : "N/A"}
                      </div>
                    </div>
                    
                    <div className="analytics-card">
                      <h3 className="analytics-card__title">Completed</h3>
                      <div className="analytics-card__value">
                        {campaigns.filter(c => c.status === "completed").length}
                      </div>
                    </div>
                    
                    <div className="analytics-card">
                      <h3 className="analytics-card__title">In Progress</h3>
                      <div className="analytics-card__value">
                        {campaigns.filter(c => c.status === "in progress").length}
                      </div>
                    </div>
                  </div>
                  
                  <div className="brief-analytics__chart">
                    <h3 className="brief-analytics__subtitle">Engagement Distribution</h3>
                    <div className="chart-placeholder">
                      {/* This would be replaced with an actual chart component */}
                      <div className="chart-bar" style={{ width: "70%" }}></div>
                      <div className="chart-bar" style={{ width: "45%" }}></div>
                      <div className="chart-bar" style={{ width: "85%" }}></div>
                      <div className="chart-bar" style={{ width: "60%" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


          {/* Rest of your existing component remains the same */}
          {/* ... */}


      {showCreateCampaign && (
        <CreateCampaignModal
          isOpen={showCreateCampaign}
          onClose={() => setShowCreateCampaign(false)}
          briefId={brief._id}
          refreshDashboard={() => {
            refreshDashboard();
            const fetchCampaigns = async () => {
              try {
                const res = await axios.get(`/api/campaigns/brief/${brief._id}`, {
                  withCredentials: true,
                });
                setCampaigns(res.data.campaigns || []);
              } catch (err) {
                console.error("Error fetching campaigns:", err);
              }
            };
            fetchCampaigns();
          }}
        />
      )}

      {showUpdateBrief && (
        <UpdateBriefModal
          isOpen={showUpdateBrief}
          onClose={() => setShowUpdateBrief(false)}
          brief={brief}
          refreshBrief={() => {
            refreshDashboard();
            onClose(); // Close the modal to show updated data
          }}
        />
      )}
    </>,
    document.getElementById("portal")
  );
};

export default MyBriefModel;