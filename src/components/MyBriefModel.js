import React, { useEffect, useState } from "react";
import { faCheck, faPencil, faX, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from "react-dom";
import axios from "../api/axios";
import CreateCampaignModal from "./CreateCampaignModal";

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

const MyBriefModel = ({ isOpen, onClose, brief, role = [], OVERLAY_STYLES, user, refreshDashboard }) => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    if (brief && brief._id) {
      const fetchCampaigns = async () => {
        try {
          const res = await axios.get(`/api/campaigns/brief/${brief._id}`, {
            withCredentials: true,
          });
          setCampaigns(res.data.campaigns || []);
        } catch (err) {
          console.error("Error fetching campaigns:", err);
        }
      };
      fetchCampaigns();
    }
  }, [brief]);

  if (!isOpen || !brief) return null;

  return ReactDOM.createPortal(
    <div style={OVERLAY_STYLES} className="modal-overlay">
      <div style={MODAL_STYLES} className="project-modal rounded-xl">
        <div className="flex justify-between items-start mb-6">
          <button onClick={onClose} className="text-xl text-gray-600 hover:text-black">
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>
        <div className="text-gray-800">
          <h1 className="text-4xl font-bold mb-4">{brief.title}</h1>
          <p className="text-lg mb-2"><strong>Description:</strong> {brief.description}</p>
          <p className="text-sm mb-2"><strong>Platform:</strong> {brief.targetPlatform}</p>

          {/* Display related campaigns */}
          <div className="my-8">
            <h2 className="text-2xl font-semibold">Campaigns Related to This Brief</h2>
            {campaigns.length > 0 ? (
              <ul>
                {campaigns.map((campaign) => (
                  <li key={campaign._id} className="my-4 p-4 bg-gray-100 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold">{campaign.creatorId?.userId?.username}</h3>
                    <p className="text-sm">{campaign.description}</p>
                    {campaign.attachment?.url && (
            <div className="mb-6">
              <p className="font-medium mb-2">Attachment:</p>
              {campaign.attachment.resourceType === "image" ? (
                <img src={campaign.attachment.url} alt="attachment" className="rounded-lg w-full max-h-80 object-contain shadow-md" />
              ) : (
                <video controls src={campaign.attachment.url} className="rounded-lg w-full max-h-80 object-contain shadow-md" />
              )}
            </div>
          )}
                    <p className="text-sm"> Score : {campaign.score}</p>

                    <p className="text-sm">Status: {campaign.status}</p>
                    <p className="text-sm">Payment Status: {campaign.paymentStatus}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No campaigns have been created for this brief yet.</p>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button onClick={() => {}} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow">
              <FontAwesomeIcon icon={faPlus} className="mr-2" /> Create Campaign
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default MyBriefModel;
