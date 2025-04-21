import React, { useEffect, useState } from "react";
import { faCheck, faPencil, faX, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from "react-dom";
import axios from "../api/axios";

const MODAL_STYLES = {
    position: "fixed",
    top: "50%",
    right: "0%",
    transform: "translate(0%, -50%)",
    background: "linear-gradient(145deg, #f5f7fa, #c3cfe2)",
    borderRadius: "24px",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.2)",
    width: "90vw",
    maxWidth: "1200px",
    height: "90vh",
    overflowY: "scroll",
    padding: "2rem 3rem",
    zIndex: 1000,
  };

const MyCampaignModal = ({ isOpen, onClose, campaign, user,OVERLAY_STYLES, refreshDashboard }) => {
  const [relatedCampaigns, setRelatedCampaigns] = useState([]);

  useEffect(() => {
    if (campaign && campaign._id) {
      const fetchRelatedCampaigns = async () => {
        try {
          const res = await axios.get(`/api/my-campaigns`, {
            withCredentials: true,
          });
          setRelatedCampaigns(res.data.campaigns || []);
        } catch (err) {
          console.error("Error fetching campaigns:", err);
        }
      };
      fetchRelatedCampaigns();
    }
  }, [campaign]);

  if (!isOpen || !campaign) return null;

  return ReactDOM.createPortal(
    <div style={OVERLAY_STYLES} className="modal-overlay">
      <div style={MODAL_STYLES} className="project-modal">
        <div className="flex justify-between items-start mb-6">
          <button onClick={onClose} className="text-xl text-gray-600 hover:text-black">
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>
        <div className="text-gray-800">
        <h1 className="text-4xl font-bold">{campaign.title}</h1>
        <h2 className="text-4xl font-bold"> Description: </h2>
        <p>{campaign.description}</p>
        <div className="mb-6">
              <p className="font-medium mb-2">Attachment:</p>
              {campaign.attachment.resourceType === "image" ? (
                <img src={campaign.attachment.url} alt="attachment" className="rounded-lg w-full max-h-80 object-contain shadow-md" />
              ) : (
                <video controls src={campaign.attachment.url} className="rounded-lg w-full max-h-80 object-contain shadow-md" />
              )}
            </div>
        </div>
        <h3  className="text-4xl font-bold"> Score:</h3>
        <p>{campaign.score}</p>

        <h3>{campaign.briefId?.title}</h3> 
        {/* Display related campaigns */}
       

       
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default MyCampaignModal;
