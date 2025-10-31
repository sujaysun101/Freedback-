import { Project } from '../lib/api-client'
import Link from 'next/link'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/project/${project.id}`}>
      <div className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
        <p className="text-sm text-gray-500">
          Created {new Date(project.created_at).toLocaleDateString()}
        </p>
      </div>
    </Link>
  )
}
