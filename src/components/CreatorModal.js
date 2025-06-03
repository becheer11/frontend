import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTiktok,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faStar, faLink, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../styles/creatorModal.scss";

const CreatorModal = ({ isOpen, onClose, creator, auth }) => {
  if (!isOpen || !creator) return null;

  // Extract creator data from the backend structure
  const creatorData = creator.userId || creator;
  const socialLinks = {
    instagram: creatorData.instaUsername,
    tiktok: creatorData.tiktokUsername
  };
  const followers = creator.audience?.instafollowers || 0;
  const engagementRate = creator.score?.engagementRate || 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="creator-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="modal-header">
          <div className="creator-profile">
            <img
              src={creatorData.profilePhoto?.url || '/default-profile.png'}
              alt={creatorData.username}
              className="profile-image"
            />
            <div className="profile-info">
              <h2>@{creatorData.username}</h2>
              <div className="creator-score">
                <FontAwesomeIcon icon={faStar} className="star-icon" />
                <span>{creator.score?.value?.toFixed(1) || 'N/A'}</span>
                <span className="score-max">/100</span>
              </div>
            </div>
          </div>

          <div className="social-links">
            {socialLinks.instagram && (
              <a
                href={`https://instagram.com/${socialLinks.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <FontAwesomeIcon icon={faInstagram} />
                <span>@{socialLinks.instagram}</span>
              </a>
            )}
            {socialLinks.tiktok && (
              <a
                href={`https://tiktok.com/@${socialLinks.tiktok}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <FontAwesomeIcon icon={faTiktok} />
                <span>@{socialLinks.tiktok}</span>
              </a>
            )}
          </div>
        </div>

        <div className="modal-content">
          <div className="content-section">
            <h3>About</h3>
            <p className="creator-bio">
              {creatorData.description || 'No bio available'}
            </p>
          </div>

          <div className="content-section">
            <h3>Categories</h3>
            <div className="categories-list">
              {creatorData.categories?.filter(Boolean).map((category) => (
                <span key={category} className="category-tag">
                  {category}
                </span>
              ))}
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h4>Followers</h4>
              <p className="stat-value">
                {followers ? (followers / 1000).toFixed(1) + 'K' : 'N/A'}
              </p>
            </div>
            <div className="stat-card">
              <h4>Engagement Rate</h4>
              <p className="stat-value">
                {engagementRate ? engagementRate.toFixed(1) + '%' : 'N/A'}
              </p>
            </div>
            <div className="stat-card">
              <h4>Content Type</h4>
              <p className="stat-value">
                {creatorData.tags?.[0] || 'N/A'}
              </p>
            </div>
            <div className="stat-card">
              <h4>Location</h4>
              <p className="stat-value">
                {creator.location || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {auth.roles.includes("Brand") && (
            <button className="invite-button">
              Invite to Collaboration
            </button>
          )}
          <button className="save-button">
            Save to Favorites
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorModal;