import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  faArrowRightFromBracket,
  faBell,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from "../hooks/useAuth";
import AuthContext from "../context/AuthProvider";
import projectCard from "../assets/project-card.png";
import ProjectModal from "./ProjectModal";
import NewCollabs from "./NewCollabs";
import CreateProjectModal from "./CreateProjectModal";
import CreateBriefModal from "./CreateBriefModal";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import "../styles/dashboard.scss";
import colabFolder from "../assets/colab-logo.png";
import colabTextTransparent from "../assets/colab-text-transparent.png";
import axios from "../api/axios";
import MyBriefModel from "./MyBriefModel"; // Import MyBriefModel

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
  zIndex: 100,
};

const Dashboard = () => {
  const { auth } = useAuth(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [items, setItems] = useState([]);
  const [showNewCollabs, setShowNewCollabs] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [projectModal, setProjectModal] = useState({});
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showCreateBriefModal, setShowCreateBriefModal] = useState(false);

  // Define fetchData here
  const fetchData = async () => {
    try {
      const endpoint = auth.roles.includes("Influencer")
        ? "/api/my-campaigns"
        : "/api/mybriefs";
      const res = await axios.get(endpoint, {
        withCredentials: true,
      });
      setItems(auth.roles.includes("Influencer") ? res.data.campaigns : res.data.briefs);
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

  const expandItem = (item) => {
    setProjectModal(item);
    setShowModal(true);
  };

  showModal ? disableBodyScroll(document) : enableBodyScroll(document);

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
                className={`dashboard-links__link ${!showNewCollabs ? "dashboard-links__link--active" : ""}`}
                onClick={() => setShowNewCollabs(false)}
              >
                Dashboard
              </button>
            </li>
            <li className="dashboard-links__li">
              <button
                className={`dashboard-links__link ${showNewCollabs ? "dashboard-links__link--active" : ""}`}
                onClick={() => setShowNewCollabs(true)}
              >
                New Collabs
              </button>
            </li>
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
            <div className="profile-avatar-info__username">
              <h3>Welcome back, {user.username}!</h3>
            </div>
            <div className="dashboard-header-left">
              <h3 className="dashboard-header-left__greeting">My Profile Stats</h3>
              <div className="profile-stats-section">
                <div className="profile-avatar-info">
                  <img className="profile-avatar-info__avatar" src={user.profilePhoto.url} alt="profile" />
                  <div className="profile-avatar-info__details">
                    <div className="profile-avatar-info__username">
                      <span>{user.username}</span>
                    </div>
                    <div className="profile-avatar-info__categories">
                      <span className="category">health</span>
                      <span className="category">food</span>
                      <span className="category">game</span>
                    </div>
                  </div>
                </div>
                <div className="profile-social-stats">
                  <div className="profile-social-stats__item">
                    <a href={`https://www.tiktok.com/${user.username}`} target="_blank" rel="noopener noreferrer">
                      <img src={colabTextTransparent} alt="tiktok" className="tiktok-icon" />
                    </a>
                    <div className="profile-social-stats__details">
                      <div className="profile-social-stats__followers">
                        <span className="number">
                          {user.creator.audience ? user.creator.audience.tiktokfollowers : "N/A"}K
                        </span>
                        <span className="text">followers</span>
                      </div>
                      <div className="profile-social-stats__posts">
                        <span className="number">22</span>
                        <span className="text">posts</span>
                      </div>
                    </div>
                  </div>
                  <div className="profile-social-stats__item">
                    <a href={`https://www.instagram.com/${user.username}`} target="_blank" rel="noopener noreferrer">
                      <img src={colabTextTransparent} alt="Instagram" className="instagram-icon" />
                    </a>
                    <div className="profile-social-stats__details">
                      <div className="profile-social-stats__followers">
                        <span className="number">
                          {user.creator.audience ? user.creator.audience.instafollowers : "N/A"}K
                        </span>
                        <span className="text">followers</span>
                      </div>
                      <div className="profile-social-stats__posts">
                        <span className="number">22</span>
                        <span className="text">posts</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="profile-score">
                  <span className="score-label">score</span>
                  <span className="score-value">
                    <span className="number">{user.creator.score}</span>
                    <span className="slash">/</span>
                    <span className="max-score">100</span>
                  </span>
                </div>
                <div className="profile-update-link">
                  <p className="register__text register__text--subtle">
                    <Link to="/updateprofile" className="register__text register__text--subtle text--underline">
                      update your profile
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            <div className="dashboard-header-right">
              <FontAwesomeIcon icon={faBell} className="icon-medium" />
              <Link to="/login" className="link link--dark">
                <FontAwesomeIcon icon={faArrowRightFromBracket} className="icon-medium" />
              </Link>
              {user.avatar && (
                <Link to="/updateprofile" className="register__text register__text--subtle text--underline">
                  <img className="dashboard-header-right__avatar" src={user.avatar} alt="profile" />
                </Link>
              )}
            </div>
          </header>
        ) : user && user.advertiser ? (
          <header className="dashboard-header dashboard-header--light">
            <div className="profile-avatar-info__username">
              <h3>Welcome back, {user.username}!</h3>
            </div>
            <div className="dashboard-header-left">
              <h3 className="dashboard-header-left__greeting">Advertiser Profile</h3>
              <div className="profile-stats-section">
                <div className="profile-avatar-info">
                  <img className="profile-avatar-info__avatar" src={user.profilePhoto.url} alt="profile" />
                  <div className="profile-avatar-info__details">
                    <div className="profile-avatar-info__username">
                      <span>{user.username}</span>
                    </div>
                    <div className="profile-avatar-info__categories">
                      <span className="category">Company: {user.advertiser.companyName}</span>
                      <span className="category">Industry: {user.advertiser.industry}</span>
                    </div>
                  </div>
                </div>
                <div className="profile-update-link">
                  <p className="register__text register__text--subtle">
                    <Link to="/updateprofile" className="register__text register__text--subtle text--underline">
                      update your profile
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            <div className="dashboard-header-right">
              <FontAwesomeIcon icon={faBell} className="icon-medium" />
              <Link to="/login" className="link link--dark">
                <FontAwesomeIcon icon={faArrowRightFromBracket} className="icon-medium" />
              </Link>
              {user.avatar && (
                <Link to="/updateprofile" className="register__text register__text--subtle text--underline">
                  <img className="dashboard-header-right__avatar" src={user.avatar} alt="profile" />
                </Link>
              )}
            </div>
          </header>
        ) : null}

        {auth.roles.includes("Brand") && !showNewCollabs && (
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

        {!showNewCollabs ? (
          <section className="project-container">
            <h2 className="dashboard-section-title">
              {auth.roles.includes("Influencer") ? "My Campaigns" : "My Briefs"}
            </h2>
            <br />
            {items.map((item) => (
              <button key={item._id} onClick={() => expandItem(item)} className="dashboard__btn">
                <div className="img-container">
                  <img
                      src={   item.advertiserId?.userId.profilePhoto.url 
                      ||
                      item.briefId?.advertiserId?.userId?.profilePhoto?.url  ||
                        projectCard}

                    alt="project"
                    className="project-container__img"
                  />
                  <p className="img-container__text">
                    {item.validationStatus === "accepted" ? "✅ Validated" : "🕒 Pending"}
                  </p>
                </div>
                <div className="project-container__text-container">
                  <h4 className="project-container__text project-container__text--company">
                    {item.advertiserId?.companyName ||
                      item.creatorId?.userId?.username ||
                      "Unknown"}
                  </h4>
                  <h5 className="project-container__text project-container__text--title">
                    {item.title?.length > 20 ? item.title.slice(0, 20) + "..." : item.title}
                  </h5>
                  <h7 className="project-container__text project-container__text--title">
                    {item.description?.length > 20
                      ? item.description.slice(0, 20) + "..."
                      : item.description}
                  </h7>
                  <h6 className="project-container__text project-container__text--date">
                    Due Date:{" "}
                    {item.deadline ? new Date(item.deadline).toLocaleDateString() : "N/A"}
                  </h6>
                  <div className="project-container__text project-container__text--status">
                    {item.status && `📌 ${item.status}`}
                    {item.budget && ` | 💰 $${item.budget}`}
                    {item.paymentStatus && ` | 💳 ${item.paymentStatus}`}
                  </div>
                </div>
              </button>
            ))}
          </section>
        ) : (
          <NewCollabs />
        )}


        <div style={BUTTON_WRAPPER_STYLES}>
          {showModal && (
            <MyBriefModel
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              brief={projectModal}
              role={auth.roles}
              OVERLAY_STYLES={OVERLAY_STYLES}
              user={user}
              refreshDashboard={fetchData} // Call fetchData here
            />
          )}
        </div>

        {showCreateProjectModal && (
          <CreateProjectModal
            isOpen={showCreateProjectModal}
            onClose={() => setShowCreateProjectModal(false)}
            project={projectModal}
            role={auth.roles}
            brand={user?.firstName}
            OVERLAY_STYLES={OVERLAY_STYLES}
          />
        )}

        {showCreateBriefModal && (
          <CreateBriefModal
            isOpen={showCreateBriefModal}
            onClose={() => setShowCreateBriefModal(false)}
          />
        )}
      </div>
    </section>
  );
};

export default Dashboard;

