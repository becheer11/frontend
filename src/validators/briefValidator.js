export const validateBrief = (formData) => {
    const errors = {};
    
    // Title validation
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    } else if (formData.title.length > 100) {
      errors.title = "Title must be less than 100 characters";
    }
    
    // Description validation
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.length > 1000) {
      errors.description = "Description must be less than 1000 characters";
    }
    
    // Categories validation
    if (formData.categories.length === 0) {
      errors.categories = "At least one category is required";
    }
    
    // Budget validation
    if (!formData.budget) {
      errors.budget = "Budget is required";
    } else if (isNaN(formData.budget)) {
      errors.budget = "Budget must be a number";
    } else if (formData.budget <= 0) {
      errors.budget = "Budget must be positive";
    }
    
    // Deadline validation
    if (!formData.deadline) {
      errors.deadline = "Deadline is required";
    } else {
      const deadlineDate = new Date(formData.deadline);
      if (deadlineDate < new Date()) {
        errors.deadline = "Deadline must be in the future";
      }
    }
    
    // Review deadline validation
    if (formData.reviewDeadline) {
      const reviewDate = new Date(formData.reviewDeadline);
      const deadlineDate = new Date(formData.deadline);
      if (reviewDate >= deadlineDate) {
        errors.reviewDeadline = "Review deadline must be before final deadline";
      }
    }
    
    // File validation
    if (formData.attachment) {
      const fileError = validateFile(formData.attachment);
      if (fileError) errors.attachment = fileError;
    }
    
    return errors;
  };
  
  export const validateFile = (file) => {
    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'video/quicktime'
    ];
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    if (!validTypes.includes(file.type)) {
      return "Invalid file type. Only images (JPEG, PNG, GIF) and videos (MP4, MOV) are allowed.";
    }
    
    if (file.size > maxSize) {
      return "File too large. Maximum size is 50MB.";
    }
    
    return null;
  };