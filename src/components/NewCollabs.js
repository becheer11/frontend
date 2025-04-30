import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faTiktok } from "@fortawesome/free-brands-svg-icons";
import projectCard from "../assets/project-card.png";
import moment from "moment";
import "../styles/chippycheckbox.scss";
import ProjectModal from "./ProjectModal";

const NewCollabs = () => {
  const [briefs, setBriefs] = useState([]);
  const [filteredBriefs, setFilteredBriefs] = useState([]);
  const [textQuery, setTextQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrief, setSelectedBrief] = useState(null);

  const getAllBriefs = async () => {
    try {
      const response = await axios.get("/api/briefs", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setBriefs(response.data.briefs || []);
    } catch (error) {
      console.error("Error fetching briefs:", error);
    }
  };

  useEffect(() => {
    getAllBriefs();
  }, []);

  useEffect(() => {
    let results = briefs;

    if (textQuery) {
      results = results.filter((brief) =>
        [brief.title,  ...brief.categories, ...brief.tags]
          .join(" ")
          .toLowerCase()
          .includes(textQuery.toLowerCase())
      );
    }

    if (platformFilter.length > 0) {
      results = results.filter((brief) =>
        platformFilter.includes(brief.targetPlatform)
      );
    }

    setFilteredBriefs(results);
  }, [textQuery, platformFilter, briefs]);

  const togglePlatform = (platform) => {
    setPlatformFilter((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const expandProject = (brief) => {
    setIsModalOpen(true);
    setSelectedBrief(brief);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBrief(null);
  };

  return (
    <section className="new-collabs">
      <div className="new-collabs__header">
        <form>
          <input
            type="text"
            className="form__input form__input--full"
            onChange={(e) => setTextQuery(e.target.value)}
            placeholder="Search keywords, brands, etc"
          />
          <div className="label-col-container__row">
            <ul className="chippy">
              <li className="chippy__li">
                <input
                  type="checkbox"
                  id="instagram"
                  onChange={() => togglePlatform("Instagram")}
                  checked={platformFilter.includes("Instagram")}
                  className="chippy__input"
                />
                <label htmlFor="instagram" className="chippy__label">
                  <FontAwesomeIcon className="icon-left" icon={faInstagram} />
                  Instagram
                </label>
              </li>
              <li className="chippy__li">
                <input
                  type="checkbox"
                  id="tiktok"
                  onChange={() => togglePlatform("TikTok")}
                  checked={platformFilter.includes("TikTok")}
                  className="chippy__input"
                />
                <label htmlFor="tiktok" className="chippy__label">
                  <FontAwesomeIcon className="icon-left" icon={faTiktok} />
                  TikTok
                </label>
              </li>
            </ul>
          </div>
        </form>
      </div>

      <section className="project-container">
        {(filteredBriefs.length ? filteredBriefs : briefs).map((brief) => (
          <button
            key={brief._id}
            onClick={() => expandProject(brief)}
            className="dashboard__btn"
          >
            <div className="img-container">
            {brief.advertiserId && brief.advertiserId.userId ? (
  <img
    src={brief.advertiserId.userId.profilePhoto.url || projectCard}
    alt="advertiser"
    className="project-container__img"
  />
) : (
  <img
    src={projectCard} // Default image if profilePhoto is not available
    alt="project"
    className="project-container__img"
  />
)}

              <p className="img-container__text">
                {brief.validationStatus === "accepted" ? "✅ Validated" : "🕒 Pending"}
              </p>
            </div>
            <div className="project-container__text-container">
              <h4 className="project-container__text project-container__text--company">
                {brief.advertiserId?.companyName}
              </h4>
              <h5 className="project-container__text project-container__text--title">
                {brief.title.length > 20
                  ? brief.title.slice(0, 20).concat("...")
                  : brief.title}
              </h5>
              <h6 className="project-container__text project-container__text--date">
                Due Date: {moment(brief.deadline).format("MMMM Do YYYY")}
              </h6>
              <div className="">
                {brief.targetPlatform === "Instagram" && (
                  <FontAwesomeIcon className="icon-left" icon={faInstagram} />
                )}
                {brief.targetPlatform === "TikTok" && (
                  <FontAwesomeIcon className="icon-left" icon={faTiktok} />
                )}
              </div>
            </div>
          </button>
        ))}
      </section>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        brief={selectedBrief}
        OVERLAY_STYLES={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      />
    </section>
  );
};

export default NewCollabs;
