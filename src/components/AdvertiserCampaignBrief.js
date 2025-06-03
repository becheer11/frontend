import ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faX,
  faCalendarAlt,
  faDollarSign,
  faHashtag,
  faCheckCircle,
  faUser,
  faEnvelope,
  faLink,
  faCheck,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { 
    faInstagram, 
    faTiktok,
    faYoutube,
  } from "@fortawesome/free-brands-svg-icons";
import axios from "../api/axios";
import { toast } from 'react-toastify';
import "../styles/admin-campaign-modal.scss";

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

const AdvertiserCampaignBriefModal = ({ isOpen, onClose, campaign, OVERLAY_STYLES, refreshDashboard }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true);
    try {
      const response = await axios.put(
        `/api/campaign/${campaign._id}`,
        { 
          advertiserStatus: newStatus,
          status: newStatus === 'approved' ? 'advertiser-approved' : 'advertiser-rejected'
        },
        { withCredentials: true }
      );
      
      toast.success(`Campaign ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`);
      refreshDashboard();
      onClose();
    } catch (error) {
      console.error("Error updating campaign status:", error);
      toast.error(error.response?.data?.message || "Failed to update campaign status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen || !campaign) return null;

  return ReactDOM.createPortal(
    <div style={OVERLAY_STYLES} className="campaign-modal-overlay">
      <div style={MODAL_STYLES} className="campaign-modal">
        {/* Header Section */}
        <div className="campaign-modal__header">
          <div className="campaign-modal__header-content">
            <h1 className="campaign-modal__title">{campaign.title}</h1>
            <div className="campaign-modal__meta">
              <span className={`campaign-modal__status ${
                campaign.status === 'advertiser-approved' ? 'validated' : 
                campaign.status === 'advertiser-rejected' ? 'rejected' : 'pending'
              }`}>
                <FontAwesomeIcon icon={faCheckCircle} className="icon-status" />
                {campaign.status || "Pending"}
              </span>
              <span className="campaign-modal__date">
                <FontAwesomeIcon icon={faCalendarAlt} className="icon-meta" />
                {new Date(campaign.briefId.deadline).toLocaleDateString()}
              </span>
              {campaign.briefId.budget && (
                <span className="campaign-modal__budget">
                  <FontAwesomeIcon icon={faDollarSign} className="icon-meta" />
                  {campaign.briefId.budget}
                </span>
              )}
            </div>
          </div>
          
          <div className="campaign-modal__header-actions">
            {campaign.status !== 'advertiser-approved' && campaign.status !== 'advertiser-rejected' && (
              <>
                <button
                  onClick={() => handleStatusUpdate('approved')}
                  className="campaign-modal__action-btn campaign-modal__action-btn--approve"
                  disabled={isUpdating}
                >
                  <FontAwesomeIcon icon={faCheck} />
                  {isUpdating ? 'Approving...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleStatusUpdate('rejected')}
                  className="campaign-modal__action-btn campaign-modal__action-btn--reject"
                  disabled={isUpdating}
                >
                  <FontAwesomeIcon icon={faTimes} />
                  {isUpdating ? 'Rejecting...' : 'Reject'}
                </button>
              </>
            )}
            
            <button onClick={onClose} className="campaign-modal__close-btn">
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="campaign-modal__content">
          {/* Navigation Tabs */}
          <div className="campaign-modal__tabs">
            <button
              className={`campaign-modal__tab ${activeTab === "details" ? "active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              Campaign Details
            </button>
            <button
              className={`campaign-modal__tab ${activeTab === "media" ? "active" : ""}`}
              onClick={() => setActiveTab("media")}
            >
              Media & Assets
            </button>
            <button
              className={`campaign-modal__tab ${activeTab === "creator" ? "active" : ""}`}
              onClick={() => setActiveTab("creator")}
            >
              Creator Info
            </button>
          </div>

          {/* Tab Content */}
          <div className="campaign-modal__tab-content">
            {activeTab === "details" && (
              <div className="campaign-details">
                <div className="campaign-details__section">
                  <h2 className="campaign-details__section-title">
                    <FontAwesomeIcon icon={faHashtag} className="icon-section" />
                    Campaign Brief
                  </h2>
                  <p className="campaign-details__description">{campaign.description}</p>
                </div>

                <div className="campaign-details__grid">
                  <div className="campaign-details__card">
                    <h3 className="campaign-details__card-title">Brief </h3>
                    <ul className="campaign-details__list">
                      {campaign.briefId.title}
                    </ul>
                  </div>

                  <div className="campaign-details__card">
                    <h3 className="campaign-details__card-title">Requirements</h3>
                    {campaign.briefId.description}
                  </div>

                  <div className="campaign-details__card">
                    <h3 className="campaign-details__card-title">Tags</h3>
                    <div className="campaign-tags">
                      {campaign.briefId.tags?.map((tag, index) => (
                        <span key={index} className="campaign-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="campaign-details__card">
                    <h3 className="campaign-details__card-title">Categories</h3>
                    <div className="campaign-tags">
                      {campaign.briefId.categories?.map((category, index) => (
                        <span key={index} className="campaign-tag">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="campaign-details__card">
                    <h3 className="campaign-details__card-title">Performance</h3>
                    <div className="campaign-stats">
                      <div className="campaign-stat">
                        <span className="campaign-stat__value">{campaign.score || "N/A"}</span>
                        <span className="campaign-stat__label">Engagement Score</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "media" && (
              <div className="campaign-media">
                <div className="campaign-media__main">
                  {campaign.attachment?.resourceType === "image" ? (
                    <img 
                      src={campaign.attachment.url} 
                      alt="Campaign attachment" 
                      className="campaign-media__image" 
                    />
                  ) : (
                    <video 
                      controls 
                      src={campaign.attachment?.url} 
                      className="campaign-media__video"
                    />
                  )}
                </div>
              </div>
            )}

            {activeTab === "creator" && campaign.creatorId && (
              <div className="creator-info">
                <div className="creator-info__header">
                  {campaign.creatorId.userId.profilePhoto?.url ? (
                    <img 
                      src={campaign.creatorId.userId.profilePhoto.url} 
                      alt="Creator" 
                      className="creator-info__avatar"
                    />
                  ) : (
                    <div className="creator-info__avatar--default">
                      {campaign.creatorId.userId.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <h2 className="creator-info__name">
                    {campaign.creatorId.userId.username}
                  </h2>
                </div>
                
                <div className="creator-info__details">
                  <div className="creator-info__detail">
                    <FontAwesomeIcon icon={faEnvelope} />
                    <span>{campaign.creatorId.userId.email}</span>
                  </div>
                  
                  {campaign.creatorId.socialLinks?.instagram && (
                    <div className="creator-info__detail">
                      <FontAwesomeIcon icon={faInstagram} />
                      <a 
                        href={campaign.creatorId.socialLinks.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {campaign.creatorId.socialLinks.instagram}
                      </a>
                    </div>
                  )}
                  
                  {campaign.creatorId.socialLinks?.tiktok && (
                    <div className="creator-info__detail">
                      <FontAwesomeIcon icon={faTiktok} />
                      <a 
                        href={campaign.creatorId.socialLinks.tiktok} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {campaign.creatorId.socialLinks.tiktok}
                      </a>
                    </div>
                  )}
                  
                  {campaign.creatorId.socialLinks?.youtube && (
                    <div className="creator-info__detail">
                      <FontAwesomeIcon icon={faYoutube} />
                      <a 
                        href={campaign.creatorId.socialLinks.youtube} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {campaign.creatorId.socialLinks.youtube}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default AdvertiserCampaignBriefModal;