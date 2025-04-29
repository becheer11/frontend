import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import AuthContext from "../context/AuthProvider";
import "../styles/createprojectmodal.scss";

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  right: "0%",
  transform: "translate(0%, -50%)",
  backgroundColor: "#fefcfb",
  zIndex: 1000,
};

const CreateCampaignModal = ({ isOpen, onClose, OVERLAY_STYLES, brief }) => {
  const { auth } = useAuth(AuthContext);
  const [description, setDescription] = useState("");
  const [contentUrls, setContentUrls] = useState([""]);
  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    console.log("Starting campaign for brief:", brief);
  }, [brief]);

  const handleAddUrl = () => {
    setContentUrls([...contentUrls, ""]);
  };

  const handleRemoveUrl = (index) => {
    const newUrls = [...contentUrls];
    newUrls.splice(index, 1);
    setContentUrls(newUrls);
  };

  const handleUrlChange = (value, index) => {
    const newUrls = [...contentUrls];
    newUrls[index] = value;
    setContentUrls(newUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("briefId", brief._id);
    formData.append("description", description);
    formData.append("contentUrls", JSON.stringify(contentUrls.filter(Boolean))); // Handle URL content
    if (attachment) formData.append("attachment", attachment); // Add attachment file

    try {
      const response = await axios.post("/api/campaign", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.status === 201) {
        alert("Campaign created successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Failed to create campaign");
    }
  };

  if (!isOpen || !brief) return null;

  return ReactDOM.createPortal(
    <div style={OVERLAY_STYLES}>
      <div style={MODAL_STYLES} className="create-project-modal">
        <div className="btn-container btn-container--right">
          <button className="btn-hide" onClick={onClose} type="button">
            <FontAwesomeIcon icon={faX} className="icon-left" />
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit} encType="multipart/form-data">
          <h2 className="form__text form__text--header">Start Campaign for: {brief.title}</h2>

          <div className="form-page">
            <div className="label-row-container__col">
              <label className="form__label">Campaign Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="form__input form__input--textarea"
                placeholder="Describe your campaign submission"
                required
              />
            </div>

         

            {/* Attachment File Input */}
            <div className="label-row-container__col">
              <label className="form__label">Attachment (Image/Video)</label>
              <input
                type="file"
                accept="image/*,video/*"
                className="form__input"
                onChange={(e) => setAttachment(e.target.files[0])}
                required
              />
            </div>

            <div className="btn-container btn-container--center mt-1p5">
              <button
                type="submit"
                className="btn-cta btn-cta--medium btn-cta--active"
              >
                Submit Campaign
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default CreateCampaignModal;
