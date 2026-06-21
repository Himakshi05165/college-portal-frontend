import heroBg from "../assets/pexels-ron-lach-9849323.jpg"

function Hero() {
  return (
    <section
      id="home"
      className="h-screen text-white flex flex-col justify-center items-center text-center px-6 relative"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Content */}
      <div className="relative z-10">
        <p className="uppercase tracking-[8px] text-gray-400 mb-4">
          Admissions Open 2026
        </p>

        <h1 className="text-7xl font-bold max-w-5xl leading-tight">
          Fashion Institute of Modern Design
        </h1>

        <p className="text-gray-400 text-xl mt-6 max-w-2xl mx-auto">
          Build your future in fashion, creativity, luxury branding and modern design.
        </p>

        <button
          onClick={() => {
            document.getElementById("admissions").scrollIntoView({ behavior: "smooth" })
          }}
          className="mt-10 border border-white px-8 py-4 hover:bg-white hover:text-black transition duration-300"
        >
          Apply Now
        </button>
      </div>
    </section>
  )
}

export default Hero