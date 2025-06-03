import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBell, 
  faCircle, 
  faTimes, 
  faCheck,
  faEnvelope,
  faCheckDouble
} from "@fortawesome/free-solid-svg-icons";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import "../styles/notifications.scss";

const Notifications = () => {
  const { auth } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debugging logs
  console.log('Current auth:', auth);
  console.log('Current notifications:', notifications);

  useEffect(() => {
    {  // Changed from auth?.userId to auth?.token
      fetchNotifications();
      
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [auth?.token]);  // Changed dependency to auth?.token

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching notifications with token:', auth.token);  // Debug log
      
      const response = await axios.get("/api/notifications", {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.token}`
        },
        withCredentials: true,
      });

      console.log('API Response:', response.data);  // Debug log

      if (!response.data?.notifications) {
        throw new Error("Invalid notifications response structure");
      }

      setNotifications(response.data.notifications || []);
      const unread = (response.data.notifications || []).filter(n => !n.read).length;
      setUnreadCount(unread);
      
      if (unread > 0 && !isOpen) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
    } catch (error) {
      console.error("Notification fetch error:", error);
      setError(error.response?.data?.message || error.message || "Failed to load notifications");
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };


  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`/api/notifications/${notificationId}/read`, {}, {
        headers: {
          "Authorization": `Bearer ${auth.token}`
        },
        withCredentials: true,
      });
      fetchNotifications();
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch("/api/notifications/mark-all-read", {}, {
        headers: {
          "Authorization": `Bearer ${auth.token}`
        },
        withCredentials: true,
      });
      fetchNotifications();
    } catch (error) {
      console.error("Mark all as read error:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'submission':
        return <FontAwesomeIcon icon={faEnvelope} className="notification-type-icon" />;
      case 'approval':
        return <FontAwesomeIcon icon={faCheckDouble} className="notification-type-icon" />;
      default:
        return <FontAwesomeIcon icon={faBell} className="notification-type-icon" />;
    }
  };

  return (
    <div className="notifications-container">
      <button 
        className={`notifications-icon ${isAnimating ? 'pulse' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        disabled={loading}
      >
        <FontAwesomeIcon icon={faBell} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <div className="notifications-actions">
              {unreadCount > 0 && (
                <button 
                  className="mark-all-btn" 
                  onClick={markAllAsRead}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faCheck} /> Mark all as read
                </button>
              )}
              <button 
                className="close-btn" 
                onClick={() => setIsOpen(false)}
                aria-label="Close notifications"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>

          <div className="notifications-list">
            {loading ? (
              <div className="notification-loading">Loading notifications...</div>
            ) : error ? (
              <div className="notification-error">
                <p>{error}</p>
                <button onClick={fetchNotifications}>Retry</button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <div className="empty-icon">
                  <FontAwesomeIcon icon={faBell} />
                </div>
                <p>No notifications yet</p>
                <small>You'll see notifications here when you get them</small>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification._id} 
                  className={`notification-item ${!notification.read ? "unread" : ""}`}
                  onClick={() => {
                    markAsRead(notification._id);
                    if (notification.link) {
                      window.location.href = notification.link;
                    }
                  }}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <p className="notification-message">{notification.message}</p>
                    <div className="notification-meta">
                      <small className="notification-time">{formatDate(notification.createdAt)}</small>
                      {!notification.read && (
                        <FontAwesomeIcon icon={faCircle} className="unread-dot" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;