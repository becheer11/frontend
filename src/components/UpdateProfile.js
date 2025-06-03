import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import AuthContext from '../context/AuthProvider';
import pageOneImg from '../assets/updateprofile.png';
import pageTwoImg from '../assets/update-profile-photo.png';
import greyCircle from '../assets/greycircle.jpg';
import Links from './Links';
import '../styles/updateprofile.scss';

const MultiSelectDropdown = ({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const removeItem = (option, e) => {
    e.stopPropagation();
    onChange(selected.filter(item => item !== option));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div 
      className={`multi-select-dropdown ${isOpen ? "open" : ""} ${error ? "error" : ""}`}
      ref={dropdownRef}
    >
      <div className="dropdown-header" onClick={toggleDropdown}>
        {selected.length === 0 ? (
          <span className="placeholder">{placeholder}</span>
        ) : (
          <div className="selected-items">
            {selected.map(item => (
              <span key={item} className="selected-item">
                {item}
                <span 
                  className="remove-btn"
                  onClick={(e) => removeItem(item, e)}
                >
                  ×
                </span>
              </span>
            ))}
          </div>
        )}
        <span className="dropdown-arrow">▾</span>
      </div>
      
      {isOpen && (
        <div className="dropdown-options">
          {options.map(option => (
            <div
              key={option._id}
              className={`dropdown-option ${selected.some(cat => cat._id === option._id) ? "selected" : ""}`}
              onClick={() => handleSelect(option)}
            >
              {option.name}
              {selected.some(cat => cat._id === option._id) && (
                <span className="checkmark">✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const UpdateProfile = () => {
  const { auth } = useAuth(AuthContext);
  const navigate = useNavigate();

  // State for pages
  const [pageOne, showPageOne] = useState(true);
  const [pageTwo, showPageTwo] = useState(false);

  // User data state
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
    instaUsername: '',
    tiktokUsername: '',
    instafollowers: 0,
    tiktokfollowers: 0,
    companyName: '',
    industry: '',
    website: '',
    address: '',
  });

  const [availableCategories, setAvailableCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    // Fetch the user profile and available categories
    const fetchData = async () => {
      try {
        // Fetch user profile
        const userResponse = await axios.get('/api/user/getuser', { withCredentials: true });
        
        // Fetch available categories
        const categoriesResponse = await axios.get('/api/categories');
        
        setUserData({
          ...userResponse.data.userProfile,
          tags: userResponse.data.userProfile.tags || [],
          categories: userResponse.data.userProfile.categories || []
        });
        
        setAvailableCategories(categoriesResponse.data.categories);
        
        if (userResponse.data.userProfile.profilePhoto) {
          setImagePreview(userResponse.data.userProfile.profilePhoto.url);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
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
      setSelectedFile(file);
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

  const handleTagChange = (e) => {
    const value = e.target.value;
    if (value.includes(',')) {
      const newTags = value.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      if (newTags.length > 0) {
        setUserData(prev => ({
          ...prev,
          tags: [...prev.tags, ...newTags]
        }));
        setNewTag('');
      }
    }
  };

  const removeTag = (index) => {
    setUserData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleCategoryChange = (selectedCategories) => {
    setUserData(prev => ({
      ...prev,
      categories: selectedCategories
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Add the new tag if there's one
    if (newTag.trim()) {
      setUserData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
    
    // Prepare categories data - we need to send just the IDs to the backend
    const categoryIds = userData.categories.map(cat => cat._id || cat);

    // Append all fields to formData
    formData.append('username', userData.username);
    formData.append('firstName', userData.firstName);
    formData.append('lastName', userData.lastName);
    formData.append('description', userData.description);
    formData.append('instaUsername', userData.instaUsername);
    formData.append('tiktokUsername', userData.tiktokUsername);
    formData.append('instagram', userData.instagram);
    formData.append('tiktok', userData.tiktok);
    formData.append('companyName', userData.companyName);
    formData.append('industry', userData.industry);
    formData.append('website', userData.website);
    formData.append('address', userData.address);
    
    // Append arrays
    userData.tags.forEach(tag => formData.append('tags[]', tag));
    categoryIds.forEach(catId => formData.append('categories[]', catId));
    
    if (selectedFile) {
      formData.append('profilePhoto', selectedFile);
    }
  
    try {
      const response = await axios.put('/api/user/updateProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        setSuccessMsg('Profile updated successfully!');
        if (auth.roles.includes('brand')) {
          navigate('/dashboard');
        } else {
          showPageOne(false);
          showPageTwo(true);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrMsg('Failed to update profile. Please try again.');
    }
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('profilePhoto', selectedFile);

    try {
      const response = await axios.put('/api/user/updateProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        setSuccessMsg('Profile photo updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile photo:', error);
      setErrMsg('Failed to update profile photo. Please try again.');
    }
  };

  return (
    <main className="app-outer">
      <div className="app-inner--narrow">
        <Links />

        <section className="update-profile">
          <div className="update-profile__container-left">
            <h1 className="heading heading--large">
              Hey, <br /> {userData.firstName || 'User'}
            </h1>
            <p className="update-profile__description mb-1p5">
              {auth.roles.includes('Influancer')
                ? "Please complete your profile so we can match you with the right brands."
                : `Please update your company profile.`}
            </p>

            {pageOne && (
              <>
                <p className="update-profile__description mb-1p5 text--bold">
                  Build Your Profile
                </p>
                <form className="update-profile-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="username" className="update-profile-form__label">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={userData.username}
                      onChange={handleInputChange}
                      required
                      className="update-profile-form__input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="firstName" className="update-profile-form__label">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handleInputChange}
                      required
                      className="update-profile-form__input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName" className="update-profile-form__label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleInputChange}
                      required
                      className="update-profile-form__input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description" className="update-profile-form__label">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={userData.description}
                      onChange={handleInputChange}
                      required
                      className="update-profile-form__input update-profile-form__textarea"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="tags" className="update-profile-form__label">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      id="tags"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newTag.trim()) {
                            setUserData(prev => ({
                              ...prev,
                              tags: [...prev.tags, newTag.trim()]
                            }));
                            setNewTag('');
                          }
                        }
                      }}
                      placeholder="Enter tags separated by commas"
                      className="update-profile-form__input"
                    />
                    <div className="keywords-container">
                      {userData.tags.map((tag, index) => (
                        <div className="keywords-item" key={index}>
                          <span className="keywords-text">{tag}</span>
                          <span
                            onClick={() => removeTag(index)}
                            className="keywords-delete"
                          >
                            &times;
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="categories" className="update-profile-form__label">
                      Categories
                    </label>
                    <MultiSelectDropdown
                      options={availableCategories}
                      selected={userData.categories}
                      onChange={handleCategoryChange}
                      placeholder="Select categories..."
                    />
                  </div>

                  {auth.roles.includes('Influancer') && (
                    <>
                      <div className="form-group">
                        <label htmlFor="instaUsername" className="update-profile-form__label">
                          Instagram Username
                        </label>
                        <input
                          type="text"
                          id="instaUsername"
                          name="instaUsername"
                          value={userData.instaUsername}
                          onChange={handleInputChange}
                          className="update-profile-form__input"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="tiktokUsername" className="update-profile-form__label">
                          TikTok Username
                        </label>
                        <input
                          type="text"
                          id="tiktokUsername"
                          name="tiktokUsername"
                          value={userData.tiktokUsername}
                          onChange={handleInputChange}
                          className="update-profile-form__input"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="instagram" className="update-profile-form__label">
                          Instagram URL
                        </label>
                        <input
                          type="text"
                          id="instagram"
                          name="instagram"
                          value={userData.instagram}
                          onChange={handleInputChange}
                          className="update-profile-form__input"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="tiktok" className="update-profile-form__label">
                          TikTok URL
                        </label>
                        <input
                          type="text"
                          id="tiktok"
                          name="tiktok"
                          value={userData.tiktok}
                          onChange={handleInputChange}
                          className="update-profile-form__input"
                        />
                      </div>
                    </>
                  )}

                  {auth.roles.includes('Brand') && (
                    <>
                      <div className="form-group">
                        <label htmlFor="companyName" className="update-profile-form__label">
                          Company Name
                        </label>
                        <input
                          type="text"
                          id="companyName"
                          name="companyName"
                          value={userData.companyName}
                          onChange={handleInputChange}
                          className="update-profile-form__input"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="industry" className="update-profile-form__label">
                          Industry
                        </label>
                        <input
                          type="text"
                          id="industry"
                          name="industry"
                          value={userData.industry}
                          onChange={handleInputChange}
                          className="update-profile-form__input"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex-col-center">
                    {errMsg && (
                      <p aria-live="assertive" className="update-profile__error">
                        {errMsg}
                      </p>
                    )}
                    {successMsg && (
                      <p className="update-profile__success">
                        {successMsg}
                      </p>
                    )}
                    <div className="btn-container btn-container--col">
                      <button
                        type="submit"
                        className="btn-cta btn-cta--active"
                      >
                        Save Profile
                      </button>
                      <button
                        type="button"
                        className="btn-skip"
                        onClick={() => {
                          showPageOne(false);
                          showPageTwo(true);
                        }}
                      >
                        Skip Photo Upload
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}

            {pageTwo && (
              <>
                <p className="update-profile__description mb-1p5 text--bold">
                  Upload Profile Picture
                </p>
                <form className="update-profile-form" onSubmit={handlePhotoSubmit}>
                  <label htmlFor="profilePhoto" className="form__label">
                    Upload File
                  </label>
                  <input
                    type="file"
                    id="profilePhoto"
                    name="profilePhoto"
                    onChange={handleImageChange}
                    className="update-profile-form__input--file"
                  />

                  <p id="uidnote" className="login-form__instructions">
                    Max 2MB, .png/.jpg/.jpeg only
                  </p>

                  <div className="flex-col-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="update-profile__profile-pic"
                      />
                    ) : (
                      <img
                        src={greyCircle}
                        alt="blank avatar"
                        className="update-profile__profile-pic"
                      />
                    )}

                    {successMsg && (
                      <p className="update-profile__success">
                        {successMsg}
                      </p>
                    )}

                    <div className="btn-container btn-container--center">
                      <button
                        type="submit"
                        className="btn-cta"
                        disabled={!selectedFile}
                      >
                        Update Profile Photo
                      </button>
                      <button
                        type="button"
                        className="btn-skip"
                        onClick={() => navigate('/dashboard')}
                      >
                        Go to Dashboard
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default UpdateProfile;