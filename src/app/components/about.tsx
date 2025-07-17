"use client"

interface AboutProps {
    setActiveSection: (section: string) => void
}

export default function About({ setActiveSection }: AboutProps) {
    return (
    <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                <img
                    src="https://picsum.photos/id/1025/800/600"
                    alt="Church community"
                    className="rounded-lg shadow-lg w-full h-auto"
                />
            </div>
            <div>
                <h2 className="text-4xl font-bold mb-6 text-blue-800">Our Story</h2>
                <p className="text-gray-600 mb-6">
                    Founded with a heart for serving God and our community, GKBJ Regency has been a beacon of hope and faith
                    for over two decades. Our church family is dedicated to spreading the love of Christ through worship,
                    fellowship, and outreach programs.
                </p>
                <p className="text-gray-600 mb-6">
                    We believe that everyone is welcome in God's house, regardless of background or experience. Whether you're
                    a lifelong believer or just beginning your spiritual journey, we have a place for you in our community.
                </p>
                <a
                    href="events"
                    className="inline-block px-6 py-3 bg-blue-800 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300"
                    onClick={() => setActiveSection("events")}
                >
                    View Our Events
                </a>
            </div>
            </div>
        </div>
    </section>
    )
}
