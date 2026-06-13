import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function StudentDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))
  const token = localStorage.getItem("token")
  const [active, setActive] = useState("dashboard")
  const [notices, setNotices] = useState([])
  const [grievances, setGrievances] = useState([])
  const [attendance, setAttendance] = useState([])
  const [results, setResults] = useState([])
  const [studentProfile, setStudentProfile] = useState(null)
  const [grievanceForm, setGrievanceForm] = useState({
    studentName: user?.name || "",
    email: user?.email || "",
    subject: "", description: "", category: "academic"
  })
  const [submitted, setSubmitted] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  const fetchStudentProfile = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/students/user/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setStudentProfile(res.data.student)
    return res.data.student
  } catch (error) {
    console.log(error)
  }
}

  const fetchNotices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notices", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNotices(res.data.notices)
    } catch (error) { console.log(error) }
  }

  const fetchAttendance = async (profile) => {
    try {
      if (!profile?._id) return
      const res = await axios.get(`http://localhost:5000/api/attendance/student/${profile._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAttendance(res.data.attendance)
    } catch (error) { console.log(error) }
  }

  const fetchResults = async (profile) => {
    try {
      if (!profile?._id) return
      const res = await axios.get(`http://localhost:5000/api/results/student/${profile._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setResults(res.data.results)
    } catch (error) { console.log(error) }
  }

  const fetchGrievances = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/grievances", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const myGrievances = res.data.grievances.filter(g => g.email === user?.email)
      setGrievances(myGrievances)
    } catch (error) { console.log(error) }
  }

  const deleteGrievance = async (id) => {
    if (!window.confirm("Are you sure?")) return
    try {
      await axios.delete(`http://localhost:5000/api/grievances/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchGrievances()
    } catch (error) { console.log(error) }
  }

  const submitGrievance = async (e) => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:5000/api/grievances", grievanceForm, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSubmitted(true)
      fetchGrievances()
    } catch (error) { console.log(error) }
  }

  const getAttendancePercentage = () => {
    if (attendance.length === 0) return 0
    const present = attendance.filter(a => a.status === "present").length
    return Math.round((present / attendance.length) * 100)
  }

  useEffect(() => {
    fetchNotices()
    fetchStudentProfile().then(profile => {
      if (profile) {
        fetchAttendance(profile)
        fetchResults(profile)
      }
    })
  }, [])

  useEffect(() => {
    if (active === "grievances") fetchGrievances()
  }, [active])

  const renderContent = () => {
    switch (active) {
      case "dashboard":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
            <p className="text-gray-500 mb-8">Welcome back, {user?.name}!</p>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500 text-sm uppercase tracking-widest">Attendance</p>
                <h3 className="text-4xl font-bold mt-2">{getAttendancePercentage()}%</h3>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500 text-sm uppercase tracking-widest">Results</p>
                <h3 className="text-4xl font-bold mt-2">{results.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500 text-sm uppercase tracking-widest">Notices</p>
                <h3 className="text-4xl font-bold mt-2">{notices.length}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">Latest Notices</h3>
              {notices.length === 0 ? (
                <p className="text-gray-400">No notices yet.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {notices.slice(0, 3).map((notice) => (
                    <div key={notice._id} className="border-l-4 border-black pl-4">
                      <h4 className="font-bold">{notice.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{notice.content}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      case "attendance":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-8">My Attendance</h2>
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold">{getAttendancePercentage()}%</div>
                <div>
                  <p className="text-gray-500">Overall Attendance</p>
                  <p className="text-sm text-gray-400">{attendance.filter(a => a.status === "present").length} present out of {attendance.length} classes</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {attendance.length === 0 ? (
                <p className="text-gray-400 p-6">No attendance records yet.</p>
              ) : (
                <table className="w-full">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="text-left p-4">Course</th>
                      <th className="text-left p-4">Date</th>
                      <th className="text-left p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((a, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="p-4">{a.course?.name}</td>
                        <td className="p-4">{new Date(a.date).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            a.status === "present" ? "bg-green-100 text-green-700" :
                            a.status === "late" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>{a.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )

      case "results":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-8">My Results</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {results.length === 0 ? (
                <p className="text-gray-400 p-6">No results published yet.</p>
              ) : (
                <table className="w-full">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="text-left p-4">Course</th>
                      <th className="text-left p-4">Internal</th>
                      <th className="text-left p-4">External</th>
                      <th className="text-left p-4">Total</th>
                      <th className="text-left p-4">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result._id} className="border-b border-gray-100">
                        <td className="p-4">{result.course?.name}</td>
                        <td className="p-4">{result.internalMarks}</td>
                        <td className="p-4">{result.externalMarks}</td>
                        <td className="p-4">{result.totalMarks}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-sm font-bold ${
                            result.grade === "F" ? "bg-red-100 text-red-700" :
                            result.grade === "C" ? "bg-yellow-100 text-yellow-700" :
                            "bg-green-100 text-green-700"
                          }`}>{result.grade}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )

      case "notices":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-8">Notices</h2>
            <div className="flex flex-col gap-4">
              {notices.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-400">No notices yet.</p>
                </div>
              ) : (
                notices.map((notice) => (
                  <div key={notice._id} className="bg-white p-6 rounded-lg shadow">
                    <h4 className="font-bold text-lg">{notice.title}</h4>
                    <p className="text-gray-600 mt-1">{notice.content}</p>
                    <p className="text-gray-400 text-sm mt-2">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )

      case "grievances":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-8">Grievances</h2>
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-xl font-bold mb-4">Submit a Grievance</h3>
              {submitted ? (
                <div>
                  <p className="text-green-600">✅ Grievance submitted successfully!</p>
                  <button onClick={() => setSubmitted(false)} className="mt-4 border border-black px-4 py-2 text-sm hover:bg-black hover:text-white transition">
                    Submit Another
                  </button>
                </div>
              ) : (
                <form onSubmit={submitGrievance} className="flex flex-col gap-4">
                  <input type="text" placeholder="Subject"
                    value={grievanceForm.subject}
                    onChange={(e) => setGrievanceForm({ ...grievanceForm, subject: e.target.value })}
                    className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black" required />
                  <select value={grievanceForm.category}
                    onChange={(e) => setGrievanceForm({ ...grievanceForm, category: e.target.value })}
                    className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black">
                    <option value="academic">Academic</option>
                    <option value="administrative">Administrative</option>
                    <option value="facility">Facility</option>
                    <option value="other">Other</option>
                  </select>
                  <textarea placeholder="Describe your grievance" rows="4"
                    value={grievanceForm.description}
                    onChange={(e) => setGrievanceForm({ ...grievanceForm, description: e.target.value })}
                    className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black" required />
                  <button type="submit" className="bg-black text-white py-3 rounded hover:bg-gray-800 transition">
                    Submit Grievance
                  </button>
                </form>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold">My Grievances</h3>
              {grievances.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-400">No grievances submitted yet.</p>
                </div>
              ) : (
                grievances.map((g) => (
                  <div key={g._id} className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg">{g.subject}</h4>
                        <p className="text-gray-600 mt-1">{g.description}</p>
                        {g.response && <p className="text-green-600 mt-2 text-sm">Response: {g.response}</p>}
                        <p className="text-gray-400 text-xs mt-2">{new Date(g.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          g.status === "resolved" ? "bg-green-100 text-green-700" :
                          g.status === "in-progress" ? "bg-blue-100 text-blue-700" :
                          g.status === "closed" ? "bg-gray-100 text-gray-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>{g.status}</span>
                        <button onClick={() => deleteGrievance(g._id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-black text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold tracking-widest">BRIAR</h1>
          <p className="text-gray-400 text-sm mt-1">Student Panel</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {[
            { key: "dashboard", label: "Dashboard" },
            { key: "attendance", label: "Attendance" },
            { key: "results", label: "Results" },
            { key: "notices", label: "Notices" },
            { key: "grievances", label: "Grievances" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`text-left px-4 py-3 rounded transition ${
                active === item.key ? "bg-white text-black font-bold" : "hover:bg-gray-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="w-full text-left px-4 py-3 hover:bg-gray-800 rounded text-red-400">
            Logout
          </button>
        </div>
      </div>
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  )
}

export default StudentDashboard