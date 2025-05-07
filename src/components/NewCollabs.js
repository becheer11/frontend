import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faInstagram, 
  faTiktok,
  faYoutube,
  
} from "@fortawesome/free-brands-svg-icons";
import { faSearch , faFilter} from "@fortawesome/free-solid-svg-icons";

import projectCard from "../assets/project-card.png";
import moment from "moment";
import "../styles/newCollabs.scss";
import ProjectModal from "./ProjectModal";

const NewCollabs = () => {
  const [briefs, setBriefs] = useState([]);
  const [filteredBriefs, setFilteredBriefs] = useState([]);
  const [textQuery, setTextQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrief, setSelectedBrief] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const getAllBriefs = async () => {
    try {
      const response = await axios.get("/api/briefs", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setBriefs(response.data.briefs || []);
    } catch (error) {
      console.error("Error fetching briefs:", error);
    }
  };

  useEffect(() => {
    getAllBriefs();
  }, []);

  useEffect(() => {
    let results = briefs;

    if (textQuery) {
      results = results.filter((brief) =>
        [brief.title, ...brief.categories, ...brief.tags]
          .join(" ")
          .toLowerCase()
          .includes(textQuery.toLowerCase())
      );
    }

    if (platformFilter.length > 0) {
      results = results.filter((brief) =>
        platformFilter.includes(brief.targetPlatform)
      );
    }

    if (categoryFilter.length > 0) {
      results = results.filter((brief) =>
        brief.categories.some(cat => categoryFilter.includes(cat))
   ) }

    setFilteredBriefs(results);
  }, [textQuery, platformFilter, categoryFilter, briefs]);

  const togglePlatform = (platform) => {
    setPlatformFilter((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const toggleCategory = (category) => {
    setCategoryFilter((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const expandProject = (brief) => {
    setIsModalOpen(true);
    setSelectedBrief(brief);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBrief(null);
  };

  // Extract all unique categories from briefs
  const allCategories = [...new Set(briefs.flatMap(brief => brief.categories))];

  return (
    <section className="new-collabs">
      <div className="new-collabs__header">
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            className="search-input"
            onChange={(e) => setTextQuery(e.target.value)}
            placeholder="Search keywords, brands, categories..."
          />
          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FontAwesomeIcon icon={faFilter} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {showFilters && (
          <div className="filters-container">
            <div className="filter-section">
              <h4 className="filter-title">Platforms</h4>
              <div className="platform-filters">
                <button
                  className={`platform-filter ${platformFilter.includes("Instagram") ? 'active' : ''}`}
                  onClick={() => togglePlatform("Instagram")}
                >
                  <FontAwesomeIcon icon={faInstagram} />
                  Instagram
                </button>
                <button
                  className={`platform-filter ${platformFilter.includes("TikTok") ? 'active' : ''}`}
                  onClick={() => togglePlatform("TikTok")}
                >
                  <FontAwesomeIcon icon={faTiktok} />
                  TikTok
                </button>
                <button
                  className={`platform-filter ${platformFilter.includes("YouTube") ? 'active' : ''}`}
                  onClick={() => togglePlatform("YouTube")}
                >
                  <FontAwesomeIcon icon={faYoutube} />
                  YouTube
                </button>
              </div>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">Categories</h4>
              <div className="category-filters">
                {allCategories.map(category => (
                  <button
                    key={category}
                    className={`category-filter ${categoryFilter.includes(category) ? 'active' : ''}`}
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="collabs-grid">
        {(filteredBriefs.length ? filteredBriefs : briefs).map((brief) => (
          <div 
            key={brief._id}
            className="collab-card"
            onClick={() => expandProject(brief)}
          >
            <div className="card-image">
              {brief.advertiserId && brief.advertiserId.userId ? (
                <img
                  src={brief.advertiserId.userId.profilePhoto.url || projectCard}
                  alt="advertiser"
                />
              ) : (
                <img src={projectCard} alt="project" />
              )}
              <span className={`status-badge ${brief.validationStatus === "accepted" ? 'validated' : 'pending'}`}>
                {brief.validationStatus === "accepted" ? "Validated" : "Pending"}
              </span>
            </div>
            
            <div className="card-content">
              <div className="card-header">
                <h4 className="company-name">{brief.advertiserId?.companyName}</h4>
                <div className="platform-icon">
                  {brief.targetPlatform === "Instagram" && (
                    <FontAwesomeIcon icon={faInstagram} />
                  )}
                  {brief.targetPlatform === "TikTok" && (
                    <FontAwesomeIcon icon={faTiktok} />
                  )}
                  {brief.targetPlatform === "YouTube" && (
                    <FontAwesomeIcon icon={faYoutube} />
                  )}
                </div>
              </div>
              
              <h3 className="project-title">{brief.title}</h3>
              
              <div className="card-categories">
                {brief.categories.map(category => (
                  <span key={category} className="category-tag">{category}</span>
                ))}
              </div>
              
              <div className="card-footer">
                <span className="due-date">
                  Due: {moment(brief.deadline).format("MMM Do")}
                </span>
                {brief.budget && (
                  <span className="budget">{brief.budget} DT</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        brief={selectedBrief}
        OVERLAY_STYLES={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: 1000
        }}
      />
    </section>
  );
};

export default NewCollabs;