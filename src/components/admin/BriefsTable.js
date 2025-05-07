import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import ProjectModal from "../../components/ProjectModal"; // Adjust path as needed

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faEye, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const BriefsTable = () => {
  const [selectedBrief, setSelectedBrief] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [briefs, setBriefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchBriefs = async () => {
    try {
      setLoading(true);
  
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      };
  
      const response = await axios.get("/api/briefs", config);
      setBriefs(response.data.briefs || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching briefs:", error);
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchBriefs();
  }, []);

  const handleValidate = async (id) => {
    try {
      await axios.put(
        `/api/brief/${id}`,

        { validationStatus: "accepted" }, // Request body
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      Swal.fire("Success", "Brief validated successfully", "success");
      fetchBriefs();
    } catch (error) {
      Swal.fire("Error", "Failed to validate brief", "error");
    }
  };
  
  const handleReject = async (id) => {
    try {
      await axios.put(
        `/api/brief/${id}`,
        { validationStatus: "rejected" }, // Request body
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      Swal.fire("Success", "Brief rejected successfully", "success");
      fetchBriefs();
    } catch (error) {
      Swal.fire("Error", "Failed to reject brief", "error");
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
        const config = {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        };
        await axios.delete(`/api/briefs/${id}`,config);
        Swal.fire("Deleted!", "The brief has been deleted.", "success");
        fetchBriefs();
      } catch (error) {
        Swal.fire("Error", "Failed to delete brief", "error");
      }
    }
  };
  
  const handleViewBrief = (brief) => {
    setSelectedBrief(brief);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBrief(null);
  };
  


  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = briefs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(briefs.length / itemsPerPage);

  if (loading) return <div>Loading briefs...</div>;

  return (
    <div className="admin-table-container">
      <div className="table-header">
        <h2>Manage Briefs</h2>
        <div className="table-actions">
          <input type="text" placeholder="Search briefs..." className="search-input" />
        </div>
      </div>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Advertiser</th>
            <th>Status</th>
            <th>Validation</th>
            <th>Budget</th>
            <th>Deadline</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((brief) => (
            <tr key={brief._id}>
              <td>{brief.title}</td>
              <td>{brief.advertiserId?.companyName || "N/A"}</td>
              <td>
                <span className={`validation-badge ${brief.status}`}>
                  {brief.status}
                </span>
              </td>
              <td>
                <span className={`validation-badge ${brief.validationStatus}`}>
                  {brief.validationStatus}
                </span>
              </td>
              <td>${brief.budget}</td>
              <td>{new Date(brief.deadline).toLocaleDateString()}</td>
              <td className="actions-cell">
              
                
                <button 
                  className="action-btn edit-btn"
                  onClick={() => {/* Implement edit functionality */}}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                {brief.validationStatus === "pending" && (
                  <>
                    <button 
                      className="action-btn validate-btn"
                      onClick={() => handleValidate(brief._id)}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                    <button 
                      className="action-btn reject-btn"
                      onClick={() => handleReject(brief._id)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </>
                )}
                 {brief.validationStatus === "accepted" && (
                  <>
                  
                    <button 
                      className="action-btn reject-btn"
                      onClick={() => handleReject(brief._id)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </>
                )}
                {brief.validationStatus === "rejected" && (
                  <>
                   <button 
                      className="action-btn validate-btn"
                      onClick={() => handleValidate(brief._id)}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                    
                  </>
                )}

                <button 
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(brief._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button 
    className="action-btn view-btn"
    onClick={() => handleViewBrief(brief)}
  >
    <FontAwesomeIcon icon={faEye} />
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
      {isModalOpen && selectedBrief && (
      <ProjectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        brief={selectedBrief}
        OVERLAY_STYLES={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, .7)",
          zIndex: 1000
        }}
        refreshDashboard={fetchBriefs}
      />
    )}
    </div>
     
    
  );
 
 
};



export default BriefsTable;