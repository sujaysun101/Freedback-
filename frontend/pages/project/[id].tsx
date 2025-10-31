import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import FeedbackInputForm from '../components/FeedbackInputForm'
import TaskList from '../components/TaskList'
import { Task } from '../lib/api-client'
import { projectsApi } from '../lib/api-client'
import toast from 'react-hot-toast'

export default function ProjectPage() {
  const router = useRouter()
  const { id } = router.query
  const projectId = parseInt(id as string)
  const [tasks, setTasks] = useState<Task[]>([])
  const [projectName, setProjectName] = useState('')

  useEffect(() => {
    if (projectId) {
      projectsApi.getOne(projectId).then((project) => {
        setProjectName(project.name)
      }).catch(() => {
        toast.error('Failed to load project')
        router.push('/dashboard')
      })
    }
  }, [projectId, router])

  const handleTaskUpdate = (taskId: number, isCompleted: boolean) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, is_completed: isCompleted } : task
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-primary-600 hover:text-primary-700 mb-4"
          >
            ? Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{projectName || 'Project'}</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Translate Feedback</h2>
          <FeedbackInputForm projectId={projectId} onTranslate={(newTasks) => setTasks([...tasks, ...newTasks])} />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Tasks</h2>
          <TaskList tasks={tasks} onTaskUpdate={handleTaskUpdate} />
        </div>
      </div>
    </div>
  )
}
