import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faEye, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const CampaignsTable = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchCampaigns = async () => {
    try {
        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
          };
      setLoading(true);
      const response = await axios.get("/api/campaigns",config);
      setCampaigns(response.data.campaigns || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.patch(`/api/campaigns/${id}`, { status: "approved" });
      Swal.fire("Success", "Campaign approved successfully", "success");
      fetchCampaigns();
    } catch (error) {
      Swal.fire("Error", "Failed to approve campaign", "error");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(`/api/campaigns/${id}`, { status: "rejected" });
      Swal.fire("Success", "Campaign rejected successfully", "success");
      fetchCampaigns();
    } catch (error) {
      Swal.fire("Error", "Failed to reject campaign", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/campaigns/${id}`);
        Swal.fire("Deleted!", "The campaign has been deleted.", "success");
        fetchCampaigns();
      } catch (error) {
        Swal.fire("Error", "Failed to delete campaign", "error");
      }
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = campaigns.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(campaigns.length / itemsPerPage);

  if (loading) return <div>Loading campaigns...</div>;

  return (
    <div className="admin-table-container">
      <div className="table-header">
        <h2>Manage Campaigns</h2>
        <div className="table-actions">
          <input type="text" placeholder="Search campaigns..." className="search-input" />
        </div>
      </div>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>Brief Title</th>
            <th>Creator</th>
            <th>Status</th>
            <th>Score</th>
            <th>Payment Status</th>
            <th>Submitted At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((campaign) => (
            <tr key={campaign._id}>
              <td>{campaign.briefId?.title || "N/A"}</td>
              <td>{campaign.creatorId?.userId?.username || "N/A"}</td>
              <td>
                <span className={`status-badge ${campaign.status}`}>
                  {campaign.status}
                </span>
              </td>
              <td>{campaign.score || "N/A"}</td>
              <td>
                <span className={`payment-badge ${campaign.paymentStatus}`}>
                  {campaign.paymentStatus || "N/A"}
                </span>
              </td>
              <td>{new Date(campaign.createdAt).toLocaleDateString()}</td>
              <td className="actions-cell">
                <button 
                  className="action-btn view-btn"
                  onClick={() => {/* Implement view functionality */}}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button 
                  className="action-btn edit-btn"
                  onClick={() => {/* Implement edit functionality */}}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                {campaign.status === "pending" && (
                  <>
                    <button 
                      className="action-btn validate-btn"
                      onClick={() => handleApprove(campaign._id)}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                    <button 
                      className="action-btn reject-btn"
                      onClick={() => handleReject(campaign._id)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </>
                )}
                <button 
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(campaign._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination */}
      <div className="pagination">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        
        <span>Page {currentPage} of {totalPages}</span>
        
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CampaignsTable;