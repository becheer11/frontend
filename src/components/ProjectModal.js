import React, { useEffect, useState } from "react";
import {
  faCheck,
  faTimes,
  faPencil,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from "react-dom";

import axios from "../api/axios";
import "../styles/projectmodal.scss";
import "../styles/createprojectmodal.scss";

import ProjectModalPageOneReview from "./ProjectModalPageOneReview";
import ProjectModalPageOneInProgress from "./ProjectModalPageOneInProgress";
import ProjectModalPageOneSubmitted from "./ProjectModalPageOneSubmitted";
import ProjectModalPageTwo from "./ProjectModalPageTwo";
import ProjectModalPageThree from "./ProjectModalPageThree";
import ProjectModalPageFour from "./ProjectModalPageFour";
import ProjectModalPageOneBrandReview from "./ProjectModalPageOneBrandReview";
import holidayBackground from "../assets/holiday-background.png";
import ProjectModalAccept from "./ProjectModalAccept";
import ProjectModalPayment from "./ProjectModalPayment";

const UPDATEPROJECT_URL = "/api/updatebrief";

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  right: "0%",
  transform: "translate(0%, -50%)",
  backgroundColor: "#fefcfb",
  zIndex: 1000,
};

const ProjectModal = ({
  isOpen,
  onClose,
  brief,
  role = [],
  OVERLAY_STYLES,
  user,
  refreshDashboard,
}) => {
  const [showAddComment, setShowAddComment] = useState(false);
  const [comment, setComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    console.log("Brief Modal:", brief);
    console.log("Logged In User:", user);
  }, []);

  const handleSubmitReviewContract = async (action, e) => {
    e.preventDefault();
    if (["accept", "reject", "modify"].includes(action)) {
      try {
        const payload = JSON.stringify({
          token: localStorage.getItem("token"),
          action,
          comment,
          brief,
          user,
        });

        const response = await axios.post(UPDATEPROJECT_URL, payload, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        refreshDashboard();
        console.log("Brief updated:", response);
        if (action !== "modify") setShowSuccess(true);
      } catch (err) {
        console.log(err);
      }
    }
  };

  if (!isOpen || !brief) return null;

  return ReactDOM.createPortal(
    <div style={OVERLAY_STYLES} className="">
      <div style={MODAL_STYLES} className="project-modal">
        <div className="stack">
          <img src={holidayBackground} alt="" className="stack__under" />
          <button onClick={onClose} className="btn-hide stack__over">
            <FontAwesomeIcon icon={faX} className="icon-medium" />
          </button>
        </div>

        <div className="project-modal-container">
          <h1 className="project-modal__heading">{brief.title}</h1>
          <p className="project-modal__text">Platform: {brief.targetPlatform}</p>
          <p className="project-modal__text">Budget: ${brief.budget}</p>
          <p className="project-modal__text">Deadline: {new Date(brief.deadline).toLocaleDateString()}</p>

          <section className="project-modal-page">
            {(brief.status === "Reviewing Contract" || brief.status === "no influencer assigned") && (
              <ProjectModalPageOneReview {...brief} role={role} />
            )}
            {role.includes("Brand") && brief.status === "in progress/waiting for submission" && (
              <ProjectModalPageOneReview {...brief} role={role} />
            )}
            {brief.status === "in progress/waiting for submission" && role.includes("Influancer") && (
              <ProjectModalPageOneInProgress handleSubmit={() => {}} {...brief} role={role} />
            )}
            {role.includes("Influancer") && ["brand reviewing", "ready to publish", "awaiting project payment"].includes(brief.status.toLowerCase()) && (
              <ProjectModalPageOneSubmitted {...brief} role={role} handleSubmit={() => {}} onClose={onClose} />
            )}
            {role.includes("Brand") && brief.status === "brand reviewing" && (
              <ProjectModalPageOneBrandReview {...brief} role={role} handleSubmit={() => {}} onClose={onClose} />
            )}
            {role.includes("Brand") && brief.status === "awaiting project payment" && (
              <ProjectModalPayment {...brief} role={role} project={brief} />
            )}
          </section>

          <div className="btn-container btn-container--center mt-1p5">
            {
              ["no influencer assigned", "Reviewing Contract"].includes(brief.status) && (
                <>
                  {!showAddComment && (
                    <>
                      <button
                        className="btn-negotiate"
                        onClick={() => setShowAddComment(true)}
                      >
                        <FontAwesomeIcon icon={faPencil} className="icon-left" />
                        Negotiate
                      </button>
                      <button
                        type="button"
                        className="btn-accept"
                        onClick={(e) => handleSubmitReviewContract("accept", e)}
                      >
                        <FontAwesomeIcon icon={faCheck} className="icon-left" />
                        Accept
                      </button>
                    </>
                  )}
                </>
              )}
          </div>

          {showAddComment && (
            <form onSubmit={(e) => handleSubmitReviewContract("modify", e)}>
              <div className="label-col-container">
                <label htmlFor="comments" className="form__label">
                  Request Changes
                </label>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="form__input"
                />
              </div>
              <div className="btn-container btn-container--center">
                <button type="submit" className="btn-accept">
                  <FontAwesomeIcon icon={faPencil} className="icon-left icon-small" />
                  Submit
                </button>
              </div>
            </form>
          )}

          {showSuccess && (
            <div className="success-message">
              ✅ Brief has been {brief.validationStatus === "accepted" ? "accepted" : "rejected"} successfully.
            </div>
          )}
        </div>
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default ProjectModal;
