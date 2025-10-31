'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { createProject, translateFeedback, getProjectTasks, createCheckoutSession } from '@/lib/api';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const {
    user,
    projects,
    currentProject,
    tasks,
    isLoading,
    setUser,
    setProjects,
    addProject,
    setCurrentProject,
    setTasks,
    setLoading,
    loadUser,
    loadProjects,
  } = useAppStore();

  const [newProjectName, setNewProjectName] = useState('');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    loadUser();
    loadProjects();
  }, [router]);

  useEffect(() => {
    if (user && user.subscription_status !== 'active') {
      setShowSubscriptionPrompt(true);
    }
  }, [user]);

  useEffect(() => {
    if (currentProject) {
      loadProjectTasks(currentProject.id);
    }
  }, [currentProject]);

  const loadProjectTasks = async (projectId: string) => {
    try {
      setLoading(true);
      const projectTasks = await getProjectTasks(projectId);
      setTasks(projectTasks);
    } catch (error: any) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      setLoading(true);
      const project = await createProject(newProjectName.trim());
      addProject(project);
      setNewProjectName('');
      setShowNewProjectForm(false);
      setCurrentProject(project);
      toast.success('Project created!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!currentProject) {
      toast.error('Please select or create a project first');
      return;
    }

    if (!feedbackText.trim()) {
      toast.error('Please enter some feedback');
      return;
    }

    if (user?.subscription_status !== 'active') {
      toast.error('Active subscription required. Please subscribe to use this feature.');
      setShowSubscriptionPrompt(true);
      return;
    }

    setIsTranslating(true);

    try {
      const response = await translateFeedback(currentProject.id, feedbackText);
      setTasks(response.tasks);
      setFeedbackText('');
      toast.success(`Generated ${response.tasks.length} actionable tasks!`);
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('Active subscription required');
        setShowSubscriptionPrompt(true);
      } else {
        toast.error(error.response?.data?.detail || 'Translation failed');
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      const response = await createCheckoutSession();
      window.location.href = response.checkout_url;
    } catch (error: any) {
      toast.error('Failed to create checkout session');
    }
  };

  const copyTask = (taskDescription: string) => {
    navigator.clipboard.writeText(taskDescription);
    toast.success('Task copied to clipboard!');
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            FeedbackFix
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user.email}
              {user.subscription_status === 'active' && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                  Active
                </span>
              )}
            </span>
            <button
              onClick={() => {
                localStorage.removeItem('auth_token');
                router.push('/login');
              }}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Subscription Prompt */}
        {showSubscriptionPrompt && user.subscription_status !== 'active' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">Subscription Required</h3>
                <p className="text-sm text-yellow-700">
                  Subscribe to unlock unlimited feedback translations. Just $79/month.
                </p>
              </div>
              <button
                onClick={handleSubscribe}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Subscribe Now
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Projects */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Projects</h2>
                <button
                  onClick={() => setShowNewProjectForm(!showNewProjectForm)}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  + New
                </button>
              </div>

              {showNewProjectForm && (
                <form onSubmit={handleCreateProject} className="mb-4">
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Project name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewProjectForm(false);
                        setNewProjectName('');
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {projects.length === 0 ? (
                  <p className="text-gray-500 text-sm">No projects yet. Create one to get started!</p>
                ) : (
                  projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setCurrentProject(project)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition ${
                        currentProject?.id === project.id
                          ? 'bg-primary-50 text-primary-700 border-2 border-primary-200'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {project.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {!currentProject ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">??</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select or Create a Project
                </h3>
                <p className="text-gray-600">
                  Create a new project to start translating client feedback into actionable tasks.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Feedback Input */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Translate Feedback
                  </h2>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Paste client feedback here... (e.g., 'make it pop', 'needs more pizzazz')"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[150px]"
                  />
                  <button
                    onClick={handleTranslate}
                    disabled={isTranslating || !feedbackText.trim()}
                    className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isTranslating ? 'Translating...' : 'Translate to Tasks'}
                  </button>
                </div>

                {/* Tasks List */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Generated Tasks ({tasks.length})
                  </h2>
                  {tasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No tasks yet. Enter some feedback above to generate actionable tasks!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <input
                            type="checkbox"
                            checked={task.is_completed}
                            readOnly
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className={`text-sm ${task.is_completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                              {task.task_description}
                            </p>
                          </div>
                          <button
                            onClick={() => copyTask(task.task_description)}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium px-3 py-1 border border-primary-200 rounded hover:bg-primary-50 transition"
                          >
                            Copy
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
