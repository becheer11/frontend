import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  faArrowRightFromBracket,
  faBell,
  faPlus,
  faUsers,
  faBriefcase,
  faBullhorn,
  faChartLine,
  faTags // Add this for categories icon

} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from "../../hooks/useAuth";
import AuthContext from "../../context/AuthProvider";
import axios from "../../api/axios";
import Swal from "sweetalert2";
import "../../styles/adminDashbord.scss";

// Components for different sections
import BriefsTable from "./BriefsTable";
import CampaignsTable from "./CampaignsTable";
import CreatorsTable from "./CreatorsTable";
import AdvertisersTable from "./AdvertisersTable";
import CategoriesTable from "./CategoriesTable ";

const AdminDashboard = () => {
  const { auth } = useAuth(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    briefs: 0,
    campaigns: 0,
    creators: 0,
    advertisers: 0
  });
  const [loading, setLoading] = useState(true);

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

  const fetchStats = async () => {
    try {
      setLoading(true);
  
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      };
  
      const [briefsRes, campaignsRes, creatorsRes, advertisersRes] = await Promise.all([
        axios.get("/api/briefs/count", config),
        axios.get("/api/campaigns/count", config),
        axios.get("/api/user/creators/count", config),
        axios.get("/api/user/advertisers/count", config)
      ]);
  
      setStats({
        briefs: briefsRes.data.count,
        campaigns: campaignsRes.data.count,
        creators: creatorsRes.data.count,
        advertisers: advertisersRes.data.count
      });
  
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch stats", error);
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchStats();
  }, []);

  // Verify admin role
  useEffect(() => {
    if (!auth.roles?.includes("Admin")) {
      navigate("/dashboard");
    }
  }, [auth.roles, navigate]);

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        
        <nav className="admin-nav">
          <button
            className={`admin-nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <FontAwesomeIcon icon={faChartLine} />
            Dashboard
          </button>
          
          <button
            className={`admin-nav-item ${activeTab === "briefs" ? "active" : ""}`}
            onClick={() => setActiveTab("briefs")}
          >
            <FontAwesomeIcon icon={faBriefcase} />
            Briefs
          </button>
          
          <button
            className={`admin-nav-item ${activeTab === "campaigns" ? "active" : ""}`}
            onClick={() => setActiveTab("campaigns")}
          >
            <FontAwesomeIcon icon={faBullhorn} />
            Campaigns
          </button>
          
          <button
            className={`admin-nav-item ${activeTab === "creators" ? "active" : ""}`}
            onClick={() => setActiveTab("creators")}
          >
            <FontAwesomeIcon icon={faUsers} />
            Creators
          </button>
          
          <button
            className={`admin-nav-item ${activeTab === "advertisers" ? "active" : ""}`}
            onClick={() => setActiveTab("advertisers")}
          >
            <FontAwesomeIcon icon={faUsers} />
            Advertisers
          </button>
          <button
  className={`admin-nav-item ${activeTab === "categories" ? "active" : ""}`}
  onClick={() => setActiveTab("categories")}
>
  <FontAwesomeIcon icon={faTags} />
  Categories
</button>
        </nav>

        
        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="admin-content">
        <header className="admin-header">
          <h1>
            {activeTab === "dashboard" && "Admin Dashboard"}
            {activeTab === "briefs" && "Briefs Management"}
            {activeTab === "campaigns" && "Campaigns Management"}
            {activeTab === "creators" && "Creators Management"}
            {activeTab === "advertisers" && "Advertisers Management"}
            {activeTab === "categories" && <CategoriesTable />}
          </h1>
          <div className="admin-header-actions">
            <button className="notification-btn">
              <FontAwesomeIcon icon={faBell} />
            </button>
            <span className="admin-username">{auth.username}</span>
          </div>
        </header>
        
        <div className="admin-main">
          {activeTab === "dashboard" && (
            <div className="dashboard-overview">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Briefs</h3>
                  <p>{loading ? "Loading..." : stats.briefs}</p>
                  <FontAwesomeIcon icon={faBriefcase} className="stat-icon" />
                </div>
                
                <div className="stat-card">
                  <h3>Total Campaigns</h3>
                  <p>{loading ? "Loading..." : stats.campaigns}</p>
                  <FontAwesomeIcon icon={faBullhorn} className="stat-icon" />
                </div>
                
                <div className="stat-card">
                  <h3>Active Creators</h3>
                  <p>{loading ? "Loading..." : stats.creators}</p>
                  <FontAwesomeIcon icon={faUsers} className="stat-icon" />
                </div>
                
                <div className="stat-card">
                  <h3>Registered Advertisers</h3>
                  <p>{loading ? "Loading..." : stats.advertisers}</p>
                  <FontAwesomeIcon icon={faUsers} className="stat-icon" />
                </div>
              </div>
              
              <div className="recent-activity">
                <h2>Recent Activity</h2>
                {/* Placeholder for recent activity feed */}
                <div className="activity-feed">
                  <p>System updates will appear here</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "briefs" && <BriefsTable />}
          {activeTab === "campaigns" && <CampaignsTable />}
          {activeTab === "creators" && <CreatorsTable />}
          {activeTab === "advertisers" && <AdvertisersTable />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;