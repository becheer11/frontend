import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faInstagram, 
  faTiktok,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faSearch, faFilter, faStar } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
import "../styles/creatorssearch.scss";
import CreatorModal from "./CreatorModal";

const CreatorsSearch = () => {
  const [creators, setCreators] = useState([]);
  const [filteredCreators, setFilteredCreators] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [scoreRange, setScoreRange] = useState([0, 100]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();

  const fetchCreators = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/user/creators", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setCreators(response.data.creators);
      setFilteredCreators(response.data.creators);
    } catch (error) {
      console.error("Error fetching creators:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  useEffect(() => {
    let results = creators;

    if (searchQuery) {
      results = results.filter(creator => {
        const user = creator.userId || creator;
        return [user.username, user.description, ...(user.categories || [])]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });
    }

    if (platformFilter.length > 0) {
      results = results.filter(creator => {
        const user = creator.userId || creator;
        return platformFilter.some(platform => {
          if (platform === "Instagram") return user.instaUsername;
          if (platform === "TikTok") return user.tiktokUsername;
          return false;
        });
      });
    }

    if (categoryFilter.length > 0) {
      results = results.filter(creator => {
        const user = creator.userId || creator;
        return (user.categories || []).some(cat => categoryFilter.includes(cat));
      });
    }

    results = results.filter(creator => {
      const score = creator.score?.value || 0;
      return score >= scoreRange[0] && score <= scoreRange[1];
    });

    setFilteredCreators(results);
  }, [searchQuery, platformFilter, categoryFilter, scoreRange, creators]);

  const togglePlatform = (platform) => {
    setPlatformFilter(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const toggleCategory = (category) => {
    setCategoryFilter(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleScoreChange = (index, value) => {
    const newRange = [...scoreRange];
    newRange[index] = parseInt(value);
    setScoreRange(newRange);
  };

  const viewCreatorProfile = (creator) => {
    setSelectedCreator(creator);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCreator(null);
  };

  const allCategories = [...new Set(
    creators.flatMap(creator => {
      const user = creator.userId || creator;
      return user.categories || [];
    })
  )].filter(Boolean);

  return (
    <section className="creators-search">
      <div className="creators-search__header">
        <h2>Discover Creators</h2>
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            className="search-input"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search creators by name, bio or categories..."
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

            <div className="filter-section">
              <h4 className="filter-title">Score Range: {scoreRange[0]} - {scoreRange[1]}</h4>
              <div className="score-range">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scoreRange[0]}
                  onChange={(e) => handleScoreChange(0, e.target.value)}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scoreRange[1]}
                  onChange={(e) => handleScoreChange(1, e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading creators...</p>
        </div>
      ) : (
        <div className="creators-grid">
          {filteredCreators.length > 0 ? (
            filteredCreators.map(creator => {
              const user = creator.userId || creator;
              const followers = creator.audience?.instafollowers || 0;
              const engagementRate = creator.score?.totalScore || 0;
              
              return (
                <div 
                  key={creator._id}
                  className="creator-card"
                  onClick={() => viewCreatorProfile(creator)}
                >
                  <div className="creator-header">
                    <img
                      src={user.profilePhoto?.url }
                      alt={user.username}
                      className="creator-avatar"
                    />
                    <div className="creator-info">
                      <h3 className="creator-username">@{user.username}</h3>
                      <div className="creator-score">
                        <FontAwesomeIcon icon={faStar} className="star-icon" />
                        <span>{creator.score?.value?.toFixed(1) || ''}</span>
                      </div>
                    </div>
                  </div>

                  <p className="creator-bio">
                    {user.description || 'No bio available'}
                  </p>

                  <div className="creator-platforms">
                    {user.instaUsername && (
                      <a 
                        href={`https://instagram.com/${user.instaUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FontAwesomeIcon icon={faInstagram} />
                      </a>
                    )}
                    {user.tiktokUsername && (
                      <a 
                        href={`https://tiktok.com/@${user.tiktokUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FontAwesomeIcon icon={faTiktok} />
                      </a>
                    )}
                  </div>

                  <div className="creator-categories">
                    {user.categories?.filter(Boolean).map(category => (
                      <span key={category} className="category-tag">{category}</span>
                    ))}
                  </div>

                  <div className="creator-stats">
                    <div className="stat">
                      <span className="stat-value">
                        {followers ? (followers / 1000).toFixed(1) + 'M' : 'N/A'}
                      </span>
                      <span className="stat-label">Followers</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">
                        {engagementRate ? engagementRate.toFixed(1) + '' : 'N/A'}
                      </span>
                      <span className="stat-label">Score</span>
                    </div>
                  </div>

                  {auth.roles.includes("Brand") && (
                    <button 
                      className="invite-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle invite logic here
                      }}
                    >
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="no-results">
              <p>No creators found matching your criteria.</p>
              <button 
                className="clear-filters"
                onClick={() => {
                  setSearchQuery('');
                  setPlatformFilter([]);
                  setCategoryFilter([]);
                  setScoreRange([0, 100]);
                }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {selectedCreator && (
        <CreatorModal
          isOpen={isModalOpen}
          onClose={closeModal}
          creator={selectedCreator}
          auth={auth}
        />
      )}
    </section>
  );
};

export default CreatorsSearch;