import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import AuthContext from "../context/AuthProvider";
import "../styles/createprojectmodal.scss";

const CAMPAIGN_MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
  width: "90%",
  maxWidth: "600px",
  zIndex: 2001,
  padding: "2rem",
  maxHeight: "90vh",
  overflowY: "auto"
};

const CAMPAIGN_OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  zIndex: 2000,
  backdropFilter: "blur(5px)"
};

const CreateCampaignModal = ({ isOpen, onClose, brief }) => {
  const { auth } = useAuth(AuthContext);
  const [description, setDescription] = useState("");
  const [contentUrls, setContentUrls] = useState([""]);
  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setDescription("");
      setContentUrls([""]);
      setAttachment(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... your existing submit logic ...
  };

  if (!isOpen || !brief) return null;

  return ReactDOM.createPortal(
    <div style={CAMPAIGN_OVERLAY_STYLES}>
      <div style={CAMPAIGN_MODAL_STYLES} className="create-project-modal">
        {/* ... rest of your modal content ... */}
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default CreateCampaignModal;