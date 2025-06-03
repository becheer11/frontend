import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const CategoriesTable = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const fetchCategories = async () => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      };
      setLoading(true);
      const response = await axios.get("/api/categories", config);
      setCategories(response.data.categories || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      Swal.fire("Error", "Category name cannot be empty", "error");
      return;
    }

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      };
      await axios.post("/api/category", { name: newCategoryName }, config);
      Swal.fire("Success", "Category added successfully", "success");
      setNewCategoryName("");
      setIsAdding(false);
      fetchCategories();
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed to add category", "error");
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
        await axios.delete(`/api/categories/${id}`, config);
        Swal.fire("Deleted!", "The category has been deleted.", "success");
        fetchCategories();
      } catch (error) {
        Swal.fire("Error", error.response?.data?.message || "Failed to delete category", "error");
      }
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="admin-table-container">
      <div className="table-header">
        <h2>Manage Categories</h2>
        <div className="table-actions">
          <button 
            className="add-btn"
            onClick={() => setIsAdding(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> Add Category
          </button>
        </div>
      </div>
      
      {isAdding && (
        <div className="add-category-form">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter category name"
          />
          <button onClick={handleAddCategory}>Save</button>
          <button onClick={() => setIsAdding(false)}>Cancel</button>
        </div>
      )}
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((category) => (
            <tr key={category._id}>
              <td>{category.name}</td>
              <td>{new Date(category.createdAt).toLocaleDateString()}</td>
              <td className="actions-cell">
                <button 
                  className="action-btn edit-btn"
                  onClick={() => {/* Implement edit functionality */}}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(category._id)}
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

export default CategoriesTable;