"use client"
import ProjectCard from "./project-card"

interface ProjectsProps {
    setActiveSection: (section: string) => void
}

export interface Project {
    title: string
    description: string
    image: string
}

export default function Project({setActiveSection}: ProjectsProps) {
    const projects: Project[] = [
        {
            title: "alphine Adventure",
            description: "A breathtaking journey through the Swiss Alps.",
            image: "https://picsum.photos/id/1015/600/400",
        },
        {
            title: "Mountain Lodge",
            description: "Luxury cabins nestled in the heart of nature.",
            image: "https://picsum.photos/id/1016/600/400",
        },
        {
            title: "Summit Experience",
            description: "Experience the thrill of reaching mountain peaks.",
            image: "https://picsum.photos/id/1017/600/400",
        },
        {
            title: "Nature Trails",
            description: "Explore untouched wilderness and scenic paths.",
            image: "https://picsum.photos/id/1018/600/400",
        },
        {
            title: "Winter Escapes",
            description: "Cozy retreats for your snowy season getaway.",
            image: "https://picsum.photos/id/1019/600/400",
        },
        {
            title: "Eco Expeditions",
            description: "Sustainable adventures that protect our planet.",
            image: "https://picsum.photos/id/1020/600/400",
        },
    ]

    return (
        <section id="projects" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">featured Projects</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Take a look at some of our favorite mountain expeditions and travel experiences around the world.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} project={project} setActiveSection={setActiveSection} />
                    ))}
                </div>
            </div>
        </section>
    )
}