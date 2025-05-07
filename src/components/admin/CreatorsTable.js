import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faEye, faCheck, faTimes, faUserShield } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const CreatorsTable = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchCreators = async () => {
    try {
        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
          };

      setLoading(true);
      const response = await axios.get("/api/user/creators",config);
      setCreators(response.data.creators || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching creators:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  const handleVerify = async (id) => {
    try {
      await axios.patch(`/api/creators/${id}/verify`, { isVerified: true });
      Swal.fire("Success", "Creator verified successfully", "success");
      fetchCreators();
    } catch (error) {
      Swal.fire("Error", "Failed to verify creator", "error");
    }
  };

  const handleSuspend = async (id) => {
    try {
      await axios.patch(`/api/creators/${id}/suspend`, { isSuspended: true });
      Swal.fire("Success", "Creator suspended successfully", "success");
      fetchCreators();
    } catch (error) {
      Swal.fire("Error", "Failed to suspend creator", "error");
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
        await axios.delete(`/api/creators/${id}`);
        Swal.fire("Deleted!", "The creator has been deleted.", "success");
        fetchCreators();
      } catch (error) {
        Swal.fire("Error", "Failed to delete creator", "error");
      }
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = creators.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(creators.length / itemsPerPage);

  if (loading) return <div>Loading creators...</div>;

  return (
    <div className="admin-table-container">
      <div className="table-header">
        <h2>Manage Creators</h2>
        <div className="table-actions">
          <input type="text" placeholder="Search creators..." className="search-input" />
        </div>
      </div>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Followers</th>
            <th>Score</th>
            <th>Joined At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((creator) => (
            <tr key={creator._id}>
              <td>{creator.userId?.username || "N/A"}</td>
              <td>{creator.userId?.email || "N/A"}</td>
              <td>
                <span className={`status-badge ${creator.isSuspended ? "suspended" : "active"}`}>
                  {creator.isSuspended ? "Suspended" : "Active"}
                </span>
              </td>
              <td>
                {creator.audience?.instafollowers || 0}K (IG) / {creator.audience?.tiktokfollowers || 0}K (TT)
              </td>
              <td>{creator.score || "N/A"}</td>
              <td>{new Date(creator.createdAt).toLocaleDateString()}</td>
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
                {!creator.isVerified && (
                  <button 
                    className="action-btn verify-btn"
                    onClick={() => handleVerify(creator._id)}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                )}
                {!creator.isSuspended ? (
                  <button 
                    className="action-btn suspend-btn"
                    onClick={() => handleSuspend(creator._id)}
                  >
                    <FontAwesomeIcon icon={faUserShield} />
                  </button>
                ) : (
                  <button 
                    className="action-btn unsuspend-btn"
                    onClick={() => handleSuspend(creator._id)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}
                <button 
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(creator._id)}
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

export default CreatorsTable;