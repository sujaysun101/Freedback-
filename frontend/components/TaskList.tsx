import { Task } from '../lib/api-client'
import { translateApi } from '../lib/api-client'
import toast from 'react-hot-toast'

interface TaskListProps {
  tasks: Task[]
  onTaskUpdate: (taskId: number, isCompleted: boolean) => void
}

export default function TaskList({ tasks, onTaskUpdate }: TaskListProps) {
  const handleToggle = async (taskId: number, currentStatus: boolean) => {
    try {
      await translateApi.toggleTask(taskId)
      onTaskUpdate(taskId, !currentStatus)
    } catch (error: any) {
      toast.error('Failed to update task')
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No tasks yet. Translate some feedback to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`flex items-start p-4 bg-white rounded-lg border-2 ${
            task.is_completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
          }`}
        >
          <input
            type="checkbox"
            checked={task.is_completed}
            onChange={() => handleToggle(task.id, task.is_completed)}
            className="mt-1 mr-3 h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <div className="flex-1">
            <p className={`text-sm ${task.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.task_description}
            </p>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(task.task_description)
              toast.success('Copied to clipboard!')
            }}
            className="ml-3 text-gray-400 hover:text-gray-600 text-sm"
            title="Copy task"
          >
            ??
          </button>
        </div>
      ))}
    </div>
  )
}
