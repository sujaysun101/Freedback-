import { api } from './api'

export interface User {
  id: number
  email: string
  subscription_status: string
  created_at: string
}

export interface Project {
  id: number
  user_id: number
  name: string
  created_at: string
  updated_at?: string
}

export interface Task {
  id: number
  input_id: number
  task_description: string
  is_completed: boolean
  created_at: string
}

export interface FeedbackInput {
  id: number
  project_id: number
  original_text: string
  created_at: string
}

export interface TranslateResponse {
  feedback_input: FeedbackInput
  tasks: Task[]
}

export const authApi = {
  register: async (email: string, password: string) => {
    const response = await api.post('/api/auth/register', { email, password })
    return response.data
  },
  login: async (email: string, password: string) => {
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)
    const response = await api.post('/api/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return response.data
  },
  getMe: async () => {
    const response = await api.get('/api/auth/me')
    return response.data
  },
}

export const projectsApi = {
  getAll: async () => {
    const response = await api.get('/api/projects')
    return response.data
  },
  getOne: async (id: number) => {
    const response = await api.get(`/api/projects/${id}`)
    return response.data
  },
  create: async (name: string) => {
    const response = await api.post('/api/projects', { name })
    return response.data
  },
  delete: async (id: number) => {
    const response = await api.delete(`/api/projects/${id}`)
    return response.data
  },
}

export const translateApi = {
  translate: async (projectId: number, inputText: string): Promise<TranslateResponse> => {
    const response = await api.post('/api/translate', {
      project_id: projectId,
      input_text: inputText,
    })
    return response.data
  },
  getTasks: async (feedbackId: number) => {
    const response = await api.get(`/api/translate/feedback/${feedbackId}/tasks`)
    return response.data
  },
  toggleTask: async (taskId: number) => {
    const response = await api.patch(`/api/translate/tasks/${taskId}/complete`)
    return response.data
  },
}
