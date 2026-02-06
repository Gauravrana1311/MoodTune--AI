import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const analyzeAudio = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getRecommendations = async (mood) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/recommend`, { mood });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createRemix = async (filename, mood) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/remix`, {
      filename,
      mood
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const downloadRemix = (filename) => {
  window.open(`${API_BASE_URL}/download/${filename}`, '_blank');
};
