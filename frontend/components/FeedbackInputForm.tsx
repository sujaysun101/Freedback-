import { useState } from 'react'
import { translateApi, Task } from '../lib/api-client'
import toast from 'react-hot-toast'

interface FeedbackInputFormProps {
  projectId: number
  onTranslate: (tasks: Task[]) => void
}

export default function FeedbackInputForm({ projectId, onTranslate }: FeedbackInputFormProps) {
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) {
      toast.error('Please enter some feedback')
      return
    }

    setIsLoading(true)
    try {
      const response = await translateApi.translate(projectId, inputText)
      toast.success(`Generated ${response.tasks.length} tasks!`)
      onTranslate(response.tasks)
      setInputText('')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to translate feedback')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
          Paste client feedback here
        </label>
        <textarea
          id="feedback"
          rows={6}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Example: 'make it pop', 'needs more pizzazz', 'feels empty'..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Translating...' : 'Translate to Tasks'}
      </button>
    </form>
  )
}
