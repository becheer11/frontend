import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import AuthContext from "../context/AuthProvider";
import "../styles/createprojectmodal.scss";
import "../styles/dashboard.scss";

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  right: "0%",
  transform: "translate(0%, -50%)",
  backgroundColor: "#fefcfb",
  zIndex: 1000,
};

const CreateBriefModal = ({ isOpen, onClose, OVERLAY_STYLES }) => {
  const { auth } = useAuth(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [phrases, setPhrases] = useState([]);
  const [tags, setTags] = useState([]);
  const [budget, setBudget] = useState("");
  const [targetPlatform, setTargetPlatform] = useState("Instagram");
  const [reviewDeadline, setReviewDeadline] = useState("");
  const [deadline, setDeadline] = useState("");
  const [attachment, setAttachment] = useState(null);

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    const value = e.target.value.trim();
    if (!value) return;

    if (e.target.className === "tags-input") {
      setTags([...tags, value]);
    } else if (e.target.className === "phrases-input") {
      setPhrases([...phrases, value]);
    } else if (e.target.className === "categories-input") {
      setCategories([...categories, value]);
    }

    e.target.value = "";
  };

  const removeItem = (e, deleteIndex, type) => {
    if (type === "tags") {
      setTags(tags.filter((_, i) => i !== deleteIndex));
    } else if (type === "phrases") {
      setPhrases(phrases.filter((_, i) => i !== deleteIndex));
    } else if (type === "categories") {
      setCategories(categories.filter((_, i) => i !== deleteIndex));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("budget", Number(budget));
    formData.append("targetPlatform", targetPlatform);
    formData.append("reviewDeadline", reviewDeadline);
    formData.append("deadline", deadline);
    formData.append("attachment", attachment);

    categories.forEach((cat) => formData.append("categories[]", cat));
    phrases.forEach((phrase) => formData.append("phrases[]", phrase));
    tags.forEach((tag) => formData.append("tags[]", tag));

    try {
      const response = await axios.post("/api/brief", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status === 201) {
        alert("Brief created successfully!");
        onClose();
      }
    } catch (err) {
      console.error("Error creating brief:", err);
      alert("Failed to create brief");
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div style={OVERLAY_STYLES}>
      <div style={MODAL_STYLES} className="create-project-modal">
        <div className="btn-container btn-container--right">
          <button className="btn-hide" onClick={onClose} type="button">
            <FontAwesomeIcon icon={faX} className="icon-left" />
          </button>
        </div>
        <form className="form" onSubmit={handleSubmit} encType="multipart/form-data">
          <h2 className="form__text form__text--header">Create a Brief</h2>

          <div className="form-page">
            <h4 className="form__text form__text--subheader">Overview</h4>

            {/* Brief Title */}
            <div className="label-row-container__col">
              <label className="form__label">Brief Title</label>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                className="form__input"
                required
                placeholder="title"
              />
            </div>

            {/* Description */}
            <div className="label-row-container__col">
              <label className="form__label">Description</label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className="form__input form__input--textarea"
                rows="6"
                placeholder="description"
                required
              />
            </div>

            {/* Categories */}
            <div className="label-row-container__col">
              <label className="form__label">Categories</label>
              <input
                onKeyDown={handleKeyDown}
                type="text"
                className="categories-input"
                placeholder="Add a category"
              />
              <div className="keywords-container">
                {categories.map((cat, i) => (
                  <div className="keywords-item" key={i}>
                    <span className="keywords-text">{cat}</span>
                    <span onClick={(e) => removeItem(e, i, "categories")} className="keywords-delete">&times;</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phrases */}
            <div className="label-row-container__col">
              <label className="form__label">Phrases</label>
              <input
                onKeyDown={handleKeyDown}
                type="text"
                className="phrases-input"
                placeholder="Add a phrase"
              />
              <div className="keywords-container">
                {phrases.map((phrase, i) => (
                  <div className="keywords-item" key={i}>
                    <span className="keywords-text">{phrase}</span>
                    <span onClick={(e) => removeItem(e, i, "phrases")} className="phrases-delete">&times;</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="label-row-container__col">
              <label className="form__label">Tags</label>
              <input
                onKeyDown={handleKeyDown}
                type="text"
                className="tags-input"
                placeholder="Add a tag"
              />
              <div className="keywords-container">
                {tags.map((tag, i) => (
                  <div className="keywords-item" key={i}>
                    <span className="keywords-text">{tag}</span>
                    <span onClick={(e) => removeItem(e, i, "tags")} className="tags-delete">&times;</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="label-row-container__col">
              <label className="form__label">Budget (CAD)</label>
              <input
                type="number"
                className="form__input"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>

            {/* Target Platform */}
            <div className="label-row-container__col">
              <label className="form__label">Target Platform</label>
              <select
                value={targetPlatform}
                onChange={(e) => setTargetPlatform(e.target.value)}
                className="form__input form__input--select"
              >
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
              </select>
            </div>

            {/* Review Deadline */}
            <div className="label-row-container__col">
              <label className="form__label">Review Deadline</label>
              <input
                type="date"
                value={reviewDeadline}
                onChange={(e) => setReviewDeadline(e.target.value)}
                className="form__input"
                required
              />
            </div>

            {/* Final Deadline */}
            <div className="label-row-container__col">
              <label className="form__label">Final Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="form__input"
                required
              />
            </div>

            {/* Attachment */}
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
                Create Brief
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default CreateBriefModal;
