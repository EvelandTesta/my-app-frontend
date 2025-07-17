"use client"
import type { Project } from "./projects"

interface ProjectCardProps {
    project: Project
    setActiveSection: (section: string) => void
}

export default function ProjectCard({ project, setActiveSection}: ProjectCardProps){
    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-lg group hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold mb-2">
                    {project.title}
                </h3>
                <p className="text-gray-600 mb-4">
                    {project.description}
                </p>
                <a 
                    href="#contact"
                    className="text-black font-semibold hover:text-gray-700 transition-colors duration-300 inline-flex items-center"
                    onClick={() => setActiveSection("contact")}
                >
                    View Details
                    <svg 
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1"
                    >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
                </a>
            </div>
        </div>
    )
}