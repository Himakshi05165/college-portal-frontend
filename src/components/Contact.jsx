import contactBg from "../assets/pexels-tima-miroshnichenko-6614757.jpg"

function Contact() {
  return (
    <section id="contact"
      className="text-white py-24 px-10 relative"
      style={{
        backgroundImage: `url(${contactBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-75"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">

        <h2 className="text-6xl font-bold text-center mb-16">
          Contact Us
        </h2>

        <div className="grid md:grid-cols-2 gap-16">

          <div>
            <h3 className="text-3xl font-bold mb-6">
              Fashion Institute of Modern Design
            </h3>
            <p className="text-gray-400 mb-4">
              Jaipur, Rajasthan
            </p>
            <p className="text-gray-400 mb-4">
              +91 9876543210
            </p>
            <p className="text-gray-400">
              admissions@briar.com
            </p>
          </div>

          <form className="flex flex-col gap-6">
            <input
              type="text"
              placeholder="Your Name"
              className="p-4 bg-transparent border border-gray-500 focus:outline-none focus:border-white"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="p-4 bg-transparent border border-gray-500 focus:outline-none focus:border-white"
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              className="p-4 bg-transparent border border-gray-500 focus:outline-none focus:border-white"
            ></textarea>
            <button className="border border-white py-4 hover:bg-white hover:text-black transition duration-300">
              Send Message
            </button>
          </form>

        </div>

      </div>
    </section>
  )
}

export default Contact