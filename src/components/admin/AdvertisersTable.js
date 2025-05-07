import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faEye, faCheck, faTimes, faBuilding } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const AdvertisersTable = () => {
  const [advertisers, setAdvertisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchAdvertisers = async () => {
    try {
        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
          };
      setLoading(true);
      const response = await axios.get("/api/user/advertisers",config);
      setAdvertisers(response.data.advertisers || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching advertisers:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvertisers();
  }, []);

  const handleVerify = async (id) => {
    try {
      await axios.patch(`/api/advertisers/${id}/verify`, { isVerified: true });
      Swal.fire("Success", "Advertiser verified successfully", "success");
      fetchAdvertisers();
    } catch (error) {
      Swal.fire("Error", "Failed to verify advertiser", "error");
    }
  };

  const handleSuspend = async (id) => {
    try {
      await axios.patch(`/api/advertisers/${id}/suspend`, { isSuspended: true });
      Swal.fire("Success", "Advertiser suspended successfully", "success");
      fetchAdvertisers();
    } catch (error) {
      Swal.fire("Error", "Failed to suspend advertiser", "error");
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
        await axios.delete(`/api/advertisers/${id}`);
        Swal.fire("Deleted!", "The advertiser has been deleted.", "success");
        fetchAdvertisers();
      } catch (error) {
        Swal.fire("Error", "Failed to delete advertiser", "error");
      }
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = advertisers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(advertisers.length / itemsPerPage);

  if (loading) return <div>Loading advertisers...</div>;

  return (
    <div className="admin-table-container">
      <div className="table-header">
        <h2>Manage Advertisers</h2>
        <div className="table-actions">
          <input type="text" placeholder="Search advertisers..." className="search-input" />
        </div>
      </div>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Industry</th>
            <th>Briefs</th>
            <th>Joined At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((advertiser) => (
            <tr key={advertiser._id}>
              <td>{advertiser.companyName || "N/A"}</td>
              <td>{advertiser.userId?.username || "N/A"}</td>
              <td>{advertiser.userId?.email || "N/A"}</td>
              <td>
                <span className={`status-badge ${advertiser.isSuspended ? "suspended" : "active"}`}>
                  {advertiser.isSuspended ? "Suspended" : "Active"}
                </span>
              </td>
              <td>{advertiser.industry || "N/A"}</td>
              <td>{advertiser.briefsCount || 0}</td>
              <td>{new Date(advertiser.createdAt).toLocaleDateString()}</td>
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
                {!advertiser.isVerified && (
                  <button 
                    className="action-btn verify-btn"
                    onClick={() => handleVerify(advertiser._id)}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                )}
                {!advertiser.isSuspended ? (
                  <button 
                    className="action-btn suspend-btn"
                    onClick={() => handleSuspend(advertiser._id)}
                  >
                    <FontAwesomeIcon icon={faBuilding} />
                  </button>
                ) : (
                  <button 
                    className="action-btn unsuspend-btn"
                    onClick={() => handleSuspend(advertiser._id)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}
                <button 
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(advertiser._id)}
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

export default AdvertisersTable;