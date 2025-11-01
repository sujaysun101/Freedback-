/**
 * Zustand store for global state management
 */

import { create } from 'zustand';
import { User, Project, Task } from './api';
import { getCurrentUser, getProjects as fetchProjects } from './api';

interface AppState {
  user: User | null;
  projects: Project[];
  currentProject: Project | null;
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  setCurrentProject: (project: Project | null) => void;
  setTasks: (tasks: Task[]) => void;
  addTasks: (tasks: Task[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadUser: () => Promise<void>;
  loadProjects: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  projects: [],
  currentProject: null,
  tasks: [],
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  setCurrentProject: (project) => set({ currentProject: project }),
  setTasks: (tasks) => set({ tasks }),
  addTasks: (tasks) => set((state) => ({ tasks: [...state.tasks, ...tasks] })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  loadUser: async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) {
        set({ user: null });
        return;
      }
      const user = await getCurrentUser();
      set({ user });
    } catch (error) {
      set({ user: null });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
    }
  },

  loadProjects: async () => {
    try {
      set({ isLoading: true, error: null });
      const projects = await fetchProjects();
      set({ projects, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to load projects', isLoading: false });
    }
  },
}));
