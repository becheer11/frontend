import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import  useAuth  from '../hooks/useAuth'; // Assuming useAuth is a custom hook for authentication

const UpdateProfile = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    description: '',
    tags: [],
    categories: [],
    profilePhoto: null,
    instagram: '',
    tiktok: '',
    instafollowers: 0,
    tiktokfollowers: 0,
    companyName: '',
    industry: '',
    website: '',
    address: '',
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // Fetch the user profile on page load
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/user/getuser', { withCredentials: true });
        setUserData(response.data.userProfile);
        if (response.data.userProfile.profilePhoto) {
          setImagePreview(response.data.userProfile.profilePhoto.url);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData((prev) => ({
        ...prev,
        profilePhoto: file,
      }));

      // Generate image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('firstName', userData.firstName);
    formData.append('lastName', userData.lastName);
    formData.append('description', userData.description);
    formData.append('tags', JSON.stringify(userData.tags));
    formData.append('categories', JSON.stringify(userData.categories));

    if (userData.profilePhoto) {
      formData.append('profilePhoto', userData.profilePhoto);
    }

    // Handle creator-specific fields
    formData.append('instagram', userData.instagram);
    formData.append('tiktok', userData.tiktok);
    formData.append('instafollowers', userData.instafollowers);
    formData.append('tiktokfollowers', userData.tiktokfollowers);

    // Handle advertiser-specific fields
    formData.append('companyName', userData.companyName);
    formData.append('industry', userData.industry);
    formData.append('website', userData.website);
    formData.append('address', userData.address);

    try {
      const response = await axios.put('/api/user/updateProfile', formData, { withCredentials: true });
      if (response.data.success) {
        alert('Profile updated successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again later.');
    }
  };

  return (
    <div className="update-profile-container">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={userData.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={userData.tags.join(', ')}
            onChange={(e) => handleInputChange({ target: { name: 'tags', value: e.target.value.split(', ') } })}
          />
        </div>

        <div className="form-group">
          <label>categories (comma separated)</label>
          <input
            type="text"
            name="categories"
            value={userData.categories.join(', ')}
            onChange={(e) => handleInputChange({ target: { name: 'categories', value: e.target.value.split(', ') } })}
          />
        </div>

        <div className="form-group">
          <label>Profile Photo</label>
          <input type="file" onChange={handleImageChange} />
          {imagePreview && <img src={imagePreview} alt="Profile Preview" className="image-preview" />}
        </div>

        {auth.roles.includes('Influencer') && (
          <>
            <div className="form-group">
              <label>Instagram</label>
              <input
                type="text"
                name="instagram"
                value={userData.instagram}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>TikTok</label>
              <input
                type="text"
                name="tiktok"
                value={userData.tiktok}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Instagram Followers</label>
              <input
                type="number"
                name="instafollowers"
                value={userData.instafollowers}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>TikTok Followers</label>
              <input
                type="number"
                name="tiktokfollowers"
                value={userData.tiktokfollowers}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}

        {auth.roles.includes('Brand') && (
          <>
            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                value={userData.companyName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Industry</label>
              <input
                type="text"
                name="industry"
                value={userData.industry}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input
                type="url"
                name="website"
                value={userData.website}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={userData.address}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}

        <button type="submit" className="btn">Update Profile</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
