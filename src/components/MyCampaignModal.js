import React, { useEffect, useState } from "react";
import { faX, faCalendarAlt, faDollarSign, faHashtag, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from "react-dom";
import axios from "../api/axios";
import '../styles/campaign-modal.scss';

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

const MyCampaignModal = ({ isOpen, onClose, campaign, user, OVERLAY_STYLES, refreshDashboard }) => {
  const [relatedCampaigns, setRelatedCampaigns] = useState([]);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (campaign && campaign._id) {
      const fetchRelatedCampaigns = async () => {
        try {
          const res = await axios.get(`/api/my-campaigns`, {
            withCredentials: true,
          });
          setRelatedCampaigns(res.data.campaigns || []);
        } catch (err) {
          console.error("Error fetching campaigns:", err);
        }
      };
      fetchRelatedCampaigns();
    }
  }, [campaign]);

  if (!isOpen || !campaign) return null;

  return ReactDOM.createPortal(
    <div style={OVERLAY_STYLES} className="campaign-modal-overlay">
      <div style={MODAL_STYLES} className="campaign-modal">
        {/* Header Section */}
        <div className="campaign-modal__header">
          <div className="campaign-modal__header-content">
            <h1 className="campaign-modal__title">{campaign.title}</h1>
            <div className="campaign-modal__meta">
              <span className="campaign-modal__status">
                <FontAwesomeIcon icon={faCheckCircle} className="icon-status" />
                {campaign.status || "Active"}
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
          <button onClick={onClose} className="campaign-modal__close-btn">
            <FontAwesomeIcon icon={faX} />
          </button>
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
              className={`campaign-modal__tab ${activeTab === "related" ? "active" : ""}`}
              onClick={() => setActiveTab("related")}
            >
              Related Campaigns
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
                    <h3 className="campaign-details__card-title">Requirements</h3>
                    <ul className="campaign-details__list">
                      {campaign.briefId.description}
                    </ul>
                  </div>

                  <div className="campaign-details__card">
                    <h3 className="campaign-details__card-title">Deliverables</h3>
                    <ul className="campaign-details__list">
                      {campaign.deliverables?.map((del, index) => (
                        <li key={index} className="campaign-details__list-item">
                          {del}
                        </li>
                      )) || <li>No specific deliverables</li>}
                    </ul>
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
                <div className="campaign-media__gallery">
                  {/* Additional media items would go here */}
                </div>
              </div>
            )}

            {activeTab === "related" && (
              <div className="related-campaigns">
                <h2 className="related-campaigns__title">Similar Campaigns You Might Like</h2>
                <div className="related-campaigns__grid">
                  {relatedCampaigns.slice(0, 3).map((campaign) => (
                    <div key={campaign._id} className="related-campaign">
                      <h3 className="related-campaign__title">{campaign.title}</h3>
                      <p className="related-campaign__description">
                        {campaign.description.substring(0, 100)}...
                      </p>
                    </div>
                  ))}
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

export default MyCampaignModal;