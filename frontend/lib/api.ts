/**
 * API client for FeedbackFix backend
 */

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  email: string;
  subscription_status: string;
}

export interface Project {
  id: string;
  name: string;
  created_at: string;
}

export interface Task {
  id: string;
  task_description: string;
  is_completed: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface TranslateResponse {
  feedback_input_id: string;
  tasks: Task[];
}

// Auth endpoints
export const register = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/api/auth/register', { email, password });
  // After registration, automatically log in
  return login(email, password);
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/api/auth/login', { email, password });
  if (response.data.access_token) {
    localStorage.setItem('auth_token', response.data.access_token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('auth_token');
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

// Project endpoints
export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get('/api/projects');
  return response.data;
};

export const createProject = async (name: string): Promise<Project> => {
  const response = await api.post('/api/projects', { name });
  return response.data;
};

// Translation endpoint
export const translateFeedback = async (
  projectId: string,
  feedbackText: string
): Promise<TranslateResponse> => {
  const response = await api.post('/api/translate', {
    project_id: projectId,
    feedback_text: feedbackText,
  });
  return response.data;
};

// Tasks endpoint
export const getProjectTasks = async (projectId: string): Promise<Task[]> => {
  const response = await api.get(`/api/projects/${projectId}/tasks`);
  return response.data;
};

// Stripe endpoint
export const createCheckoutSession = async (): Promise<{ checkout_url: string }> => {
  const response = await api.post('/api/stripe/create-checkout-session');
  return response.data;
};

export default api;
