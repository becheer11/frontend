import React from "react";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTiktok,
  faYoutube,
  faTwitter,
  faFacebook
} from "@fortawesome/free-brands-svg-icons";
const moment = require("moment");

const CreateBriefSummary = ({
  title,
  description,
  categories,
  phrases,
  tags,
  budget,
  targetPlatform,
  reviewDeadline,
  deadline,
  attachment
}) => {
  const platformIcons = {
    Instagram: faInstagram,
    TikTok: faTiktok,
    YouTube: faYoutube,
    Twitter: faTwitter,
    Facebook: faFacebook
  };

  return (
    <div className="preview">
      <h2 className="preview__header">Preview</h2>
      <div className="preview-container">
        <div className="preview-left">
          {/* Brief Overview */}
          <div className="preview-col">
            <div className="preview-row">
              <h5 className="form__label">Brief Overview</h5>
              <FontAwesomeIcon icon={faPencil} className="form__label" />
            </div>
            <table className="preview-table">
              <tbody className="preview-table__tbody">
                <tr className="preview-table__tr">
                  <th className="preview-table__th">Title</th>
                  <td className="preview-table__td">
                    {title?.length > 40
                      ? title.slice(0, 40).concat("...")
                      : title}
                  </td>
                </tr>
                {description && (
                  <tr className="preview-table__tr">
                    <th className="preview-table__th">Description</th>
                    <td className="preview-table__td">
                      {description.length > 30
                        ? description.slice(0, 40).concat("...")
                        : description}
                    </td>
                  </tr>
                )}
                <tr className="preview-table__tr">
                  <th className="preview-table__th">Review Deadline</th>
                  <td className="preview-table__td">
                    {moment(reviewDeadline).format("MMMM Do YYYY")}
                  </td>
                </tr>
                <tr className="preview-table__tr">
                  <th className="preview-table__th">Final Deadline</th>
                  <td className="preview-table__td">
                    {moment(deadline).format("MMMM Do YYYY")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Categories & Tags */}
          <div className="preview-col">
            <div className="preview-row">
              <h5 className="form__label">Categories & Tags</h5>
              <FontAwesomeIcon icon={faPencil} className="form__label" />
            </div>
            <table className="preview-table">
              <tbody className="preview-table__tbody">
                {categories?.length > 0 && (
                  <tr className="preview-table__tr">
                    <th className="preview-table__th">Categories</th>
                    <td className="preview-table__td">
                      {categories.join(", ")}
                    </td>
                  </tr>
                )}
                {phrases?.length > 0 && (
                  <tr className="preview-table__tr">
                    <th className="preview-table__th">Phrases</th>
                    <td className="preview-table__td">
                      {phrases.map(phrase => `"${phrase}"`).join(", ")}
                    </td>
                  </tr>
                )}
                {tags?.length > 0 && (
                  <tr className="preview-table__tr">
                    <th className="preview-table__th">Tags</th>
                    <td className="preview-table__td">
                      {tags.join(", ")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="preview-right">
          {/* Platform & Budget */}
          <div className="preview-col">
            <div className="preview-row">
              <h5 className="form__label">Platform & Budget</h5>
              <FontAwesomeIcon icon={faPencil} className="form__label" />
            </div>
            <table className="preview-table">
              <tbody className="preview-table__tbody">
                <tr className="preview-table__tr">
                  <th className="preview-table__th">Target Platform</th>
                  <td className="preview-table__td">
                    <FontAwesomeIcon 
                      icon={platformIcons[targetPlatform]} 
                      className="icon-left" 
                    />
                    {targetPlatform}
                  </td>
                </tr>
                <tr className="preview-table__tr">
                  <th className="preview-table__th">Budget</th>
                  <td className="preview-table__td">
                    ${budget} CAD
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
            <div className="preview-col">
                      <div className="preview-row">
                        <h5 className="form__label">Contract</h5>
                        <FontAwesomeIcon icon={faPencil} className="form__label" />
                      </div>
                      <table className="preview-table">
                        <tbody className="preview-table__tbody">
                          <tr className="preview-table__tr">
                            <td className="preview-table__td preview-table__td--contract">
                              <p>
                                The creator will provide the following in accordance to
                                the content guidelines:
                              </p>
                              <br />
                              <p>
                                The creator must upload all content on CoLab by{" "}
                                {moment(reviewDeadline).format("MMMM Do YYYY, h:mm:ss a")}{" "}
                                for review by the brand. All content
                                must be uploaded by{" "}
                                {moment(deadline).format("MMMM Do YYYY, h:mm:ss a")} after
                                the Creator receives approval from the brand.
                              </p>
                              <br />
          
                              <p>
                                The Creator grants the Brand a worldwide, irrevocable,
                                royalty-free, fully paid-up, transferrable,
                                sub-licensable, and perpetual right and license to
                                reproduce, publish, distribute, display, repost, share and
                                edit all Creator created for or on behalf of the Brand in
                                any and all media now known or developed in the future.
                              </p>
                              <br />
                              <p>
                                {" "}
                                The Creator accepts the terms of the foregoing proposal
                                and agree to the Privacy Policy and Terms & Conditions.
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
          {/* Attachment */}
          <div className="preview-col">
            <div className="preview-row">
              <h5 className="form__label">Attachment</h5>
              <FontAwesomeIcon icon={faPencil} className="form__label" />
            </div>
            <table className="preview-table">
              <tbody className="preview-table__tbody">
                <tr className="preview-table__tr">
                  <th className="preview-table__th">File</th>
                  <td className="preview-table__td">
                    {attachment ? attachment.name : "No attachment"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBriefSummary;