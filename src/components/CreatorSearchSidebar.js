// components/CreatorSearchSidebar.js
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faStar } from '@fortawesome/free-solid-svg-icons';
import '../styles/creatorSearchSidebar.scss';

const CreatorSearchSidebar = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100);
  const [creators, setCreators] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/creators/categories', {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          });
        setCategories(response.data.categories);
        
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  const searchCreators = async () => {
    setIsLoading(true);
    try {
      const params = {
        searchTerm,
        categories: selectedCategories,
        minScore,
        maxScore
      };
      
      const response = await axios.get('/api/creators/search',  {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        params: params,  // Params should be in the 'params' key

      },);;
      setCreators(response.data.creators);
    } catch (error) {
      console.error('Error searching creators:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  return (
    <div className={`creator-search-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h3>Find Creators</h3>
        <button onClick={onClose} className="close-btn">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <div className="search-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by username or handle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={searchCreators}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>

        <div className="filter-section">
          <h4>Categories</h4>
          <div className="category-tags">
            {categories.map(category => (
              <button
                key={category}
                className={`tag ${selectedCategories.includes(category) ? 'active' : ''}`}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h4>Score Range</h4>
          <div className="score-range">
            <input
              type="range"
              min="0"
              max="100"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={maxScore}
              onChange={(e) => setMaxScore(Number(e.target.value))}
            />
            <div className="score-values">
              <span>{minScore}</span>
              <span>to</span>
              <span>{maxScore}</span>
            </div>
          </div>
        </div>

        <button 
          className="search-button"
          onClick={searchCreators}
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search Creators'}
        </button>
      </div>

      <div className="search-results">
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {creators.length > 0 ? (
              creators.map(creator => (
                <div key={creator.id} className="creator-card">
                  <div className="creator-header">
                    <img 
                      src={creator.profilePhoto || '/default-profile.png'} 
                      alt={creator.username}
                      className="creator-avatar"
                    />
                    <div className="creator-info">
                      <h4>@{creator.username}</h4>
                      <div className="creator-score">
                        <FontAwesomeIcon icon={faStar} className="star-icon" />
                        <span>{creator.score}</span>
                      </div>
                    </div>
                  </div>
                  <p className="creator-bio">{creator.bio || 'No bio available'}</p>
                  <div className="creator-categories">
                    {creator.categories?.filter(c => c).map(category => (
                      <span key={category} className="category-tag">{category}</span>
                    ))}
                  </div>
                  <div className="creator-actions">
                    <button className="view-profile">View Profile</button>
                    <button className="invite-collab">Invite to Collab</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                {creators.length === 0 && !isLoading && 'No creators found. Try different filters.'}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CreatorSearchSidebar;