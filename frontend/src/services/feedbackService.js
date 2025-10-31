import api from './api';

export const createFeedback = async (feedbackData) => {
  const response = await api.post('/feedback', feedbackData);
  return response.data;
};

export const getAllFeedback = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await api.get(`/feedback?${params}`);
  return response.data;
};

export const getFeedbackById = async (id) => {
  const response = await api.get(`/feedback/${id}`);
  return response.data;
};

export const updateFeedback = async (id, feedbackData) => {
  const response = await api.put(`/feedback/${id}`, feedbackData);
  return response.data;
};

export const deleteFeedback = async (id) => {
  const response = await api.delete(`/feedback/${id}`);
  return response.data;
};
