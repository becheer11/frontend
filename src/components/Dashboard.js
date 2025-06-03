import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  faArrowRightFromBracket,
  faBell,
  faPlus,
  faCalendarAlt,
  faDollarSign,
  faFilter,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { 
  faInstagram, 
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from "../hooks/useAuth";
import AuthContext from "../context/AuthProvider";
import projectCard from "../assets/project-card.png";
import NewCollabs from "./NewCollabs";
import CreatorsSearch from "./CreatorsSearch";
import CreateBriefModal from "./CreateBriefModal";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import "../styles/dashboard.scss";
import Notifications from "./Notifications";
import Swal from "sweetalert2";
import colabFolder from "../assets/colab-logo.png";
import colabTextTransparent from "../assets/colab-text-transparent.png";
import TiktokLogo from "../assets/tiktok-logo.png";
import InstaLogo from "../assets/insta-logo.png";
import axios from "../api/axios";
import MyBriefModel from "./MyBriefModel";
import MyCampaignModal from "./MyCampaignModal";

const BUTTON_WRAPPER_STYLES = {
  position: "relative",
  zIndex: 1,
};

const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, .7)",
  zIndex: 1000,
};

const Dashboard = () => {
  const { auth } = useAuth(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [projectModal, setProjectModal] = useState({});
  const [showCreateBriefModal, setShowCreateBriefModal] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    title: "",
    categories: [],
    status: "",
    sortBy: "newest",
  });
  
  // Available filter options
  const statusOptions = ["pending", "approved", "rejected", "completed"];
  
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "title-asc", label: "Title (A-Z)" },
    { value: "title-desc", label: "Title (Z-A)" },
    { value: "budget-high", label: "Highest Budget" },
    { value: "budget-low", label: "Lowest Budget" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        console.log("Categories API response:", response.data);
        setCategoryOptions(response.data.categories); // Correct if this is the structure
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    
    
    fetchCategories();
  }, []);
  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      localStorage.clear();
      Swal.fire({
        icon: "success",
        title: "Logged out",
        text: "You have been successfully logged out.",
        confirmButtonColor: "#1E90FF"
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error("Logout failed", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Logout failed. Please try again.",
      });
    }
  };

  const fetchData = async () => {
    try {
      const endpoint = auth.roles.includes("Influencer")
        ? "/api/my-campaigns"
        : "/api/mybriefs";
      const res = await axios.get(endpoint, {
        withCredentials: true,
      });
      const data = auth.roles.includes("Influencer") ? res.data.campaigns : res.data.briefs;
      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/user/getuser", {
          withCredentials: true,
        });
        setUser(res.data.userProfile);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchUser();
    fetchData();
  }, [auth.roles]);

  useEffect(() => {
    applyFilters();
  }, [filters, items]);

  const applyFilters = () => {
    let result = [...items];
    
    if (filters.title) {
      result = result.filter(item => 
        (item.briefId?.title || item.title || "").toLowerCase().includes(filters.title.toLowerCase())
      );
    }
    
    if (filters.categories.length > 0) {
      result = result.filter(item => {
        // Get category names from item (could be from brief or campaign)
        const itemCategories = item.categories?.map(c => typeof c === 'object' ? c.name : c) || 
                             item.briefId?.categories?.map(c => typeof c === 'object' ? c.name : c) || [];
        
        return filters.categories.some(filterCat => 
          itemCategories.includes(filterCat.name || filterCat)
        );
      });
    }
    
    if (filters.status) {
      result = result.filter(item => 
        item.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }
    
    result = sortItems(result);
    setFilteredItems(result);
  };

  const sortItems = (itemsToSort) => {
    const sorted = [...itemsToSort];
    
    switch(filters.sortBy) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "title-asc":
        return sorted.sort((a, b) => 
          (a.briefId?.title || a.title || "").localeCompare(b.briefId?.title || b.title || "")
        );
      case "title-desc":
        return sorted.sort((a, b) => 
          (b.briefId?.title || b.title || "").localeCompare(a.briefId?.title || a.title || "")
        );
      case "budget-high":
        return sorted.sort((a, b) => (b.budget || 0) - (a.budget || 0));
      case "budget-low":
        return sorted.sort((a, b) => (a.budget || 0) - (b.budget || 0));
      default:
        return sorted;
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryToggle = (category) => {
    setFilters(prev => {
      const categoryId = category._id || category; // Handle both object and string cases
      const newCategories = prev.categories.some(c => 
        (c._id || c) === categoryId
      )
        ? prev.categories.filter(c => (c._id || c) !== categoryId)
        : [...prev.categories, category];
      
      return {
        ...prev,
        categories: newCategories
      };
    });
  };

  const resetFilters = () => {
    setFilters({
      title: "",
      categories: [],
      status: "",
      sortBy: "newest",
    });
  };

  const expandItem = (item) => {
    setProjectModal(item);
    setShowModal(true);
    disableBodyScroll(document);
  };

  return (
    <section className="dashboard">
      <div className="dashboard-container-left">
        <Link to="/register" className="header-left links__link">
          <div className="logo-container">
            <img
              src={colabTextTransparent}
              alt="logo text"
              className="logo-container__logo logo-container__logo--colab"
            />
          </div>
        </Link>
        <nav className="dashboard-links">
          <ul className="dashboard-links__ul">
            <li className="dashboard-links__li">
              <button
                className={`dashboard-links__link ${activeTab === "dashboard" ? "dashboard-links__link--active" : ""}`}
                onClick={() => setActiveTab("dashboard")}
              >
                Dashboard
              </button>
            </li>
            <li className="dashboard-links__li">
              <button
                className={`dashboard-links__link ${activeTab === "newCollabs" ? "dashboard-links__link--active" : ""}`}
                onClick={() => setActiveTab("newCollabs")}
              >
                New Briefs
              </button>
            </li>
            {auth.roles.includes("Brand") && (
              <li className="dashboard-links__li">
                <button
                  className={`dashboard-links__link ${activeTab === "discoverCreators" ? "dashboard-links__link--active" : ""}`}
                  onClick={() => setActiveTab("discoverCreators")}
                >
                  Discover Creators
                </button>
              </li>
            )}
            <li className="dashboard-links__li">
              <button className="dashboard-links__link">Invites</button>
            </li>
            <li className="dashboard-links__li dashboard-links__li--last">
              <button className="dashboard-links__link">Settings</button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="dashboard-container-right">
        {user && user.creator ? (
          <header className="dashboard-header dashboard-header--light">
           
            <div className="dashboard-header-left">
              <h3 className="dashboard-header-left__greeting">My Profile Stats</h3>
              <div className="profile-stats-section">
                <div className="profile-avatar-info">
                <Link to="/updateprofile" className="register__text register__text--subtle text--underline">
                <img
                    className="profile-avatar-info__avatar"
                    src={user.profilePhoto?.url || '/default-profile.png'}
                    alt="profile"
                    onError={(e) => e.target.src = "/default-profile.png"}
                  />
                    </Link>
                  
                  <div className="profile-avatar-info__details">
                    <div className="profile-avatar-info__username">
                      <span>{user.username}</span>
                    </div>
                    <div className="profile-avatar-info__categories">
    {user.categories?.slice(0, 2).map((category, index) => (
      <span key={index} className="category">
        {typeof category === 'object' ? category.name : category}
      </span>
    ))}
  </div>
                  </div>
                </div>
                <div className="profile-social-stats">
                  <div className="profile-social-stats__item">
                    <a href={`https://www.tiktok.com/@${user.tiktokUsername}`} target="_blank" rel="noopener noreferrer">
                      <img src={TiktokLogo} alt="tiktok" className="tiktok-icon" />
                    </a>
                    <div className="profile-social-stats__details">
                      <div className="profile-social-stats__followers">
                        <span className="number">
                          {user.creator.audience?.tiktokfollowers || "N/A"}K
                        </span>
                        <span className="text">followers</span>
                      </div>
                    </div>
                  </div>

                  <div className="profile-social-stats__item">
                    <a href={`https://www.instagram.com/${user.instaUsername}`} target="_blank" rel="noopener noreferrer">
                      <img src={InstaLogo} alt="Instagram" className="instagram-icon" />
                    </a>
                    <div className="profile-social-stats__details">
                      <div className="profile-social-stats__followers">
                        <span className="number">
                          {user.creator.audience?.instafollowers || "N/A"}K
                        </span>
                        <span className="text">followers</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="profile-score">
                  <span className="score-label">score</span>
                  <span className="score-value">
                    <span className="number">{user.creator.score.totalScore || 50}</span>
                    <span className="slash">/</span>
                    <span className="max-score">100</span>
                  </span>
                </div>
             
              </div>
            </div>
            <div className="dashboard-header-right">
              <Notifications />
              <button onClick={handleLogout} className="link link--dark" style={{ background: "none", border: "none", cursor: "pointer" }}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} className="icon-medium" />
              </button>
            
            </div>
          </header>
        ) : user && user.advertiser ? (
          <header className="dashboard-header dashboard-header--light">
           
            <div className="dashboard-header-left">
              <div className="profile-stats-section">
                <div className="profile-avatar-info">
                <Link to="/updateprofile" className="register__text register__text--subtle text--underline">
                <img className="profile-avatar-info__avatar" src={user.profilePhoto?.url || '/default-profile.png'} alt="profile" />

                    </Link>
                  <div className="profile-avatar-info__details">
                    <div className="profile-avatar-info__username">
                      <span>{user.username}</span>
                    </div>
                    <div className="profile-avatar-info__categories">
                      <span className="category">Company: {user.advertiser?.companyName || 'N/A'}</span>
                      <span className="category">Industry: {user.advertiser?.industry || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
            <div className="dashboard-header-right">
              <Notifications />
              <button onClick={handleLogout} className="link link--dark" style={{ background: "none", border: "none", cursor: "pointer" }}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} className="icon-medium" />
              </button>
              
            </div>
          </header>
        ) : null}

        {auth.roles.includes("Brand") && activeTab === "dashboard" && (
          <div className="dashboard-header dashboard-header--justify-right">
            <button
              onClick={() => setShowCreateBriefModal(true)}
              className="form__btn-dotted form__btn-dotted--medium"
            >
              <FontAwesomeIcon icon={faPlus} className="icon-left" />
              Create a New Brief
            </button>
          </div>
        )}

        {activeTab === "dashboard" && (
          <section className="dashboard-content">
            <div className="dashboard-content__header">
              <h2 className="dashboard-section-title">
                {auth.roles.includes("Influencer") ? "My Campaigns" : "My Briefs"}
              </h2>
              
              <div className="filter-controls">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="filter-toggle"
                >
                  <FontAwesomeIcon icon={showFilters ? faTimes : faFilter} />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
                
                {showFilters && (
                  <div className="filters-panel">
                    <div className="filter-group">
                      <label>Search by Title</label>
                      <input
                        type="text"
                        name="title"
                        value={filters.title}
                        onChange={handleFilterChange}
                        placeholder="Enter title..."
                      />
                    </div>
                    
                    <div className="filter-group">
        <label>Categories</label>
        <div className="category-filters">
        {categoryOptions.map(category => (
  <button
    key={category._id || category}
    className={`category-filter ${
      filters.categories.some(c => (c._id || c) === (category._id || category)) ? 'active' : ''
    }`}
    onClick={() => handleCategoryToggle(category)}
  >
    {category.name || category}
  </button>
))}

       
        </div>
                    </div>
                    
                    <div className="filter-group">
                      <label>Status</label>
                      <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                      >
                        <option value="">All Statuses</option>
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="filter-group">
                      <label>Sort By</label>
                      <select
                        name="sortBy"
                        value={filters.sortBy}
                        onChange={handleFilterChange}
                      >
                        {sortOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <button onClick={resetFilters} className="reset-filters">
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="content-grid">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div key={item._id} className="content-card" onClick={() => expandItem(item)}>
                    <div className="card-image">
                      <img src={item.advertiserId?.userId?.profilePhoto?.url || projectCard} alt="project" />
                      <span className={`status-badge ${item.status === "approved" ? 'validated' : 'pending'}`}>
                        {item.status}
                      </span>
                      <span className={`status-badge ${item.validationStatus === "approved" ? 'validated' : 'pending'}`}>
                        {item.status.validationSatus}
                      </span>

                    </div>
                    
                    <div className="card-content">
                      <div className="card-header">
                        <h4 className="company-name">
                          {item.advertiserId?.companyName || item.creatorId?.userId?.username}
                        </h4>
                      </div>
                  
                      <h3 className="project-title">
                        {item.briefId?.title || item.title}
                      </h3>        
                      
                      {item.description && (
                        <p className="project-description">
                          {item.description.length > 100 
                            ? `${item.description.substring(0, 100)}...` 
                            : item.description}
                        </p>
                      )}
                  {item.categories?.length > 0 && (
   <div className="profile-avatar-info__categories">
   {item.categories?.slice(0, 3).map((category, index) => (
     <span key={index} className="category">
       {typeof category === 'object' ? category.name : category}
     </span>
   ))}
 </div>
  )}
                  
                      <div className="card-footer">
                        <div className="due-date">
                          Due: 
                          {item.briefId?.deadline 
                            ? new Date(item.briefId.deadline).toLocaleDateString() 
                            : item.deadline 
                              ? new Date(item.deadline).toLocaleDateString() 
                              : "N/A"}
                        </div>
                        {item.budget && (
                          <span className="budget">{item.budget} DT</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <img src={colabFolder} alt="No briefs" />
                  <h3>No matching {auth.roles.includes("Influencer") ? "campaigns" : "briefs"} found</h3>
                  <p>Try adjusting your filters</p>
                  {items.length === 0 && auth.roles.includes("Brand") && (
                    <button
                      onClick={() => setShowCreateBriefModal(true)}
                      className="form__btn form__btn--primary"
                    >
                      <FontAwesomeIcon icon={faPlus} className="icon-left" />
                      Create your first brief
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === "newCollabs" && <NewCollabs />}

        {activeTab === "discoverCreators" && <CreatorsSearch />}

        {showModal && (
          <div style={BUTTON_WRAPPER_STYLES}>
            {auth.roles.includes("Influencer") ? (
             <MyCampaignModal
             isOpen={showModal}
             onClose={() => {
               setShowModal(false);
               enableBodyScroll(document);
             }}
             campaign={projectModal}
             user={user}
             refreshDashboard={fetchData} // Pass the refresh function
             OVERLAY_STYLES={OVERLAY_STYLES}
           />
            ) : (
              <MyBriefModel
                isOpen={showModal}
                onClose={() => {
                  setShowModal(false);
                  enableBodyScroll(document);
                }}
                brief={projectModal}
                role={auth.roles}
                user={user}
                refreshDashboard={fetchData}
              />
            )}
          </div>
        )}

{showCreateBriefModal && (
  <CreateBriefModal
    isOpen={showCreateBriefModal}
    onClose={() => setShowCreateBriefModal(false)}
    refreshDashboard={fetchData} // Pass the fetchData function as prop
  />)}
      </div>
    </section>
  );
};

export default Dashboard;