import { useState } from "react"
import axios from "axios"
import admissionImg from "../assets/pexels-silverkblack-36731204.jpg"

function Admissions() {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    applicantName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "male",
    address: "",
    department: "",
    previousMarks: ""
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post("http://localhost:5000/api/admissions", formData)
      setSubmitted(true)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="admissions"
      className="text-white py-24 px-10 relative"
      style={{
        backgroundImage: `url(${admissionImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-70"></div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">

        <p className="uppercase tracking-[6px] text-gray-400 mb-4">
          Admissions 2026
        </p>

        <h2 className="text-6xl font-bold mb-10">
          Begin Your Fashion Journey
        </h2>

        <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-8 mb-12">
          Applications are now open for undergraduate and diploma programs
          in fashion designing, textile innovation, luxury branding and
          fashion communication.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="border border-gray-500 p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4">Eligibility</h3>
            <p className="text-gray-400">Students must have completed 12th grade from a recognized board.</p>
          </div>
          <div className="border border-gray-500 p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4">Duration</h3>
            <p className="text-gray-400">3-year undergraduate and 1-year diploma programs available.</p>
          </div>
          <div className="border border-gray-500 p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4">Apply Online</h3>
            <p className="text-gray-400">Submit your admission application through our online portal.</p>
          </div>
        </div>

        {!showForm && !submitted && (
          <button
            onClick={() => setShowForm(true)}
            className="mt-16 border border-white px-10 py-4 hover:bg-white hover:text-black transition duration-300"
          >
            Apply for Admission
          </button>
        )}

        {showForm && !submitted && (
          <div className="mt-16 bg-black/60 p-10 max-w-2xl mx-auto text-left">
            <h3 className="text-2xl font-bold mb-6 text-center">Admission Application</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="applicantName"
                placeholder="Full Name"
                value={formData.applicantName}
                onChange={handleChange}
                className="bg-transparent border border-gray-600 p-3 text-white focus:outline-none focus:border-white"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="bg-transparent border border-gray-600 p-3 text-white focus:outline-none focus:border-white"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="bg-transparent border border-gray-600 p-3 text-white focus:outline-none focus:border-white"
                required
              />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="bg-transparent border border-gray-600 p-3 text-white focus:outline-none focus:border-white"
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="bg-black border border-gray-600 p-3 text-white focus:outline-none focus:border-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="bg-black border border-gray-600 p-3 text-white focus:outline-none focus:border-white"
                required
              >
                <option value="">Select Department</option>
                <option value="Fashion Designing">Fashion Designing</option>
                <option value="Textile Design">Textile Design</option>
                <option value="Luxury Brand Management">Luxury Brand Management</option>
              </select>
              <input
                type="number"
                name="previousMarks"
                placeholder="Previous Marks (%)"
                value={formData.previousMarks}
                onChange={handleChange}
                className="bg-transparent border border-gray-600 p-3 text-white focus:outline-none focus:border-white"
              />
              <textarea
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="bg-transparent border border-gray-600 p-3 text-white focus:outline-none focus:border-white"
                rows="1"
              />
              <button
                type="submit"
                disabled={loading}
                className="col-span-2 border border-white py-3 hover:bg-white hover:text-black transition duration-300"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        )}

        {submitted && (
          <div className="mt-16 border border-white p-10 max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-4">Application Submitted! ✅</h3>
            <p className="text-gray-400">We will review your application and get back to you soon.</p>
          </div>
        )}

      </div>
    </section>
  )
}

export default Admissions