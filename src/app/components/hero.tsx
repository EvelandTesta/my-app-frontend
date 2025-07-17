"use client"

interface HeroProps {
  setActiveSection: (section: string) => void
}

export default function Hero({ setActiveSection }: HeroProps) {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://picsum.photos/id/1024/1920/1080"
          alt="Church sanctuary"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 to-blue-900/70"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <p className="uppercase tracking-widest mb-4 opacity-90">Welcome to our community</p>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          GROWING IN FAITH
          <br />
          TOGETHER
        </h1>
        <p className="max-w-xl mx-auto text-lg md:text-xl opacity-90 mb-8">
          Join us in worship, fellowship, and service as we build a stronger community of believers.
        </p>
        <a
          href="about"
          className="inline-block px-8 py-3 bg-white text-blue-800 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300"
          onClick={() => setActiveSection("about")}
        >
          Learn More
        </a>
      </div>
    </section>
  )
}
