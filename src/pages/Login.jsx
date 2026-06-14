import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import loginBg from "../assets/pexels-d-ng-hoang-giang-921242705-31779396.jpg"

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: ""
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await axios.post("https://college-portal-backend-xao0.onrender.com/api/auth/login", formData)
      const { token, user } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      if (user.role === "admin") navigate("/admin")
      else if (user.role === "faculty") navigate("/faculty")
      else navigate("/student")

    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen text-white flex items-center justify-center px-6 relative"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "50% 30%",
        backgroundColor: "black",
      }}
    >
      <div className="absolute inset-0"
        style={{
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          background: "rgba(0, 0, 0, 0.65)",
        }}
      ></div>

      <div className="relative z-10 w-full max-w-md border border-gray-700 p-10 bg-black/30">

        <h1 className="text-4xl font-bold text-center mb-2">
          BRIAR UNIVERSITY
        </h1>

        <p className="text-center text-gray-400 mb-10 tracking-widest uppercase text-sm">
          Portal Login
        </p>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          <div className="flex flex-col gap-2">
            <label className="text-gray-400 text-sm uppercase tracking-widest">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="bg-black/50 border border-gray-600 text-white p-3 focus:outline-none focus:border-white"
              required
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400 text-sm uppercase tracking-widest">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="bg-black/50 border border-gray-600 text-white p-3 focus:outline-none focus:border-white"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400 text-sm uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="bg-black/50 border border-gray-600 text-white p-3 focus:outline-none focus:border-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 border border-white py-3 hover:bg-white hover:text-black transition duration-300 uppercase tracking-widest"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>
    </div>
  )
}

export default Login