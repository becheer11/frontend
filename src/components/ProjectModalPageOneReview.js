import React from "react";
import "../styles/createprojectmodal.scss";
import "../styles/dashboard.scss";
const moment = require("moment");

// Project Modal Page for Review with all relevant project fields
const ProjectModalPageOneReview = ({
  description,
  reviewDeadline,
  targetPlatform,
  deadline,
  tags,
  categories,
  budget,
  title,
  company,
  attachment,
}) => {
  return (
    <>
      <div className="page">
        {/* Project Overview Section */}
        <div className="project-modal-page__group">
          <h4 className="project-modal-page__label">Title</h4>
          <p>{title}</p>
        </div>

        <div className="project-modal-page__group">
          <h4 className="project-modal-page__label">Company</h4>
          <p>{company}</p>
        </div>

        {/* Description Section */}
        <div className="project-modal-page__group">
          <h4 className="project-modal-page__label">Description</h4>
          <p>{description}</p>
        </div>

        {/* Target Platform Section */}
        <div className="project-modal-page__group">
          <h4 className="project-modal-page__label">Target Platform</h4>
          <p>{targetPlatform}</p>
        </div>

        {/* Tags Section */}
        <div className="project-modal-page__group">
          <h4 className="project-modal-page__label">Tags</h4>
          <p>{tags?.join(", ")}</p>
        </div>

        {/* Categories Section */}
        <div className="project-modal-page__group">
          <h4 className="project-modal-page__label">Categories</h4>
          <p>{categories?.join(", ")}</p>
        </div>

        {/* Budget Section */}
        <div className="project-modal-page__group">
          <h4 className="project-modal-page__label">Budget</h4>
          <p>${budget}</p>
        </div>

        {/* Review Deadline Section */}
        <div className="project-modal-page__group">
          <h4 className="project-modal-page__label">Review Deadline</h4>
          <p className="project-modal-page__value">
            {moment(reviewDeadline).format("MMMM Do YYYY, h:mm A")}
          </p>
        </div>

        {/* Publish Deadline Section */}
        <div className="project-modal-page__group">
          <h4 className="project-modal-page__label">Publish Deadline</h4>
          <p className="project-modal-page__value">
            {moment(deadline).format("MMMM Do YYYY, h:mm A")}
          </p>
        </div>

        {/* Attachment Section */}
        {attachment?.url && (
          <div className="project-modal-page__group">
            <h4 className="project-modal-page__label">Attachment</h4>
            {attachment.resourceType === "image" ? (
              <img
                src={attachment.url}
                alt="attachment"
                className="rounded-lg w-full max-h-80 object-contain shadow-md"
              />
            ) : (
              <video
                controls
                src={attachment.url}
                className="rounded-lg w-full max-h-80 object-contain shadow-md"
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectModalPageOneReview;
