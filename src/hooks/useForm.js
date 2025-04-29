import { useState } from 'react';

export const useForm = (initialState) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, array, value) => {
    if (!array.includes(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...array, value]
      }));
    }
  };

  const handleFileChange = (field, file) => {
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const resetForm = () => {
    setFormData(initialState);
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleArrayChange,
    handleFileChange,
    resetForm
  };
};