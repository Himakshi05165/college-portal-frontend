import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function FacultyDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))
  const token = localStorage.getItem("token")
  const [active, setActive] = useState("dashboard")
  const [notices, setNotices] = useState([])
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [selectedCourse, setSelectedCourse] = useState("")
  const [attendanceDate, setAttendanceDate] = useState("")
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [attendanceSuccess, setAttendanceSuccess] = useState("")
  const [results, setResults] = useState([])
  const [resultForm, setResultForm] = useState({
    student: "", course: "", semester: "", internalMarks: "", externalMarks: "", academicYear: ""
  })

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  const fetchNotices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notices", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNotices(res.data.notices)
    } catch (error) { console.log(error) }
  }

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCourses(res.data.courses)
    } catch (error) { console.log(error) }
  }

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStudents(res.data.students)
    } catch (error) { console.log(error) }
  }

  const loadAttendance = () => {
    const records = students.map(s => ({
      student: s._id,
      name: s.user?.name,
      status: "present"
    }))
    setAttendanceRecords(records)
  }

  const markAttendance = async (e) => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:5000/api/attendance", {
        courseId: selectedCourse,
        facultyId: user.id,
        date: attendanceDate,
        records: attendanceRecords.map(r => ({ student: r.student, status: r.status }))
      }, { headers: { Authorization: `Bearer ${token}` } })
      setAttendanceSuccess("Attendance marked successfully!")
    } catch (error) { console.log(error) }
  }

  const addResult = async (e) => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:5000/api/results", resultForm, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setResultForm({ student: "", course: "", semester: "", internalMarks: "", externalMarks: "", academicYear: "" })
      alert("Result added successfully!")
    } catch (error) { console.log(error) }
  }

  useEffect(() => {
    fetchNotices()
  }, [])

  useEffect(() => {
    if (active === "attendance") { fetchCourses(); fetchStudents() }
    if (active === "marks") { fetchCourses(); fetchStudents() }
  }, [active])

  useEffect(() => {
    if (students.length > 0 && selectedCourse) loadAttendance()
  }, [students, selectedCourse])

  const renderContent = () => {
    switch (active) {
      case "dashboard":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
            <p className="text-gray-500 mb-8">Welcome back, {user?.name}!</p>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500 text-sm uppercase tracking-widest">My Courses</p>
                <h3 className="text-4xl font-bold mt-2">{courses.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500 text-sm uppercase tracking-widest">Students</p>
                <h3 className="text-4xl font-bold mt-2">{students.length}</h3>
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

      case "courses":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-8">My Courses</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {courses.length === 0 ? (
                <p className="text-gray-400 p-6">No courses assigned yet.</p>
              ) : (
                <table className="w-full">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="text-left p-4">Name</th>
                      <th className="text-left p-4">Code</th>
                      <th className="text-left p-4">Department</th>
                      <th className="text-left p-4">Semester</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course._id} className="border-b border-gray-100">
                        <td className="p-4">{course.name}</td>
                        <td className="p-4">{course.code}</td>
                        <td className="p-4">{course.department}</td>
                        <td className="p-4">{course.semester}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )

      case "attendance":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-8">Mark Attendance</h2>
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black"
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black"
                />
              </div>

              {selectedCourse && attendanceDate && attendanceRecords.length > 0 && (
                <form onSubmit={markAttendance}>
                  {attendanceSuccess && <p className="text-green-500 mb-4">{attendanceSuccess}</p>}
                  <table className="w-full mb-4">
                    <thead className="bg-black text-white">
                      <tr>
                        <th className="text-left p-4">Student Name</th>
                        <th className="text-left p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords.map((record, index) => (
                        <tr key={record.student} className="border-b border-gray-100">
                          <td className="p-4">{record.name}</td>
                          <td className="p-4">
                            <select
                              value={record.status}
                              onChange={(e) => {
                                const updated = [...attendanceRecords]
                                updated[index].status = e.target.value
                                setAttendanceRecords(updated)
                              }}
                              className="border border-gray-300 p-2 rounded"
                            >
                              <option value="present">Present</option>
                              <option value="absent">Absent</option>
                              <option value="late">Late</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button type="submit" className="bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition">
                    Submit Attendance
                  </button>
                </form>
              )}
            </div>
          </div>
        )

      case "marks":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-8">Enter Marks</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <form onSubmit={addResult} className="grid grid-cols-2 gap-4">
                <select
                  value={resultForm.student}
                  onChange={(e) => setResultForm({ ...resultForm, student: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black"
                  required
                >
                  <option value="">Select Student</option>
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>{s.user?.name} ({s.rollNumber})</option>
                  ))}
                </select>
                <select
                  value={resultForm.course}
                  onChange={(e) => setResultForm({ ...resultForm, course: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black"
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Semester"
                  value={resultForm.semester}
                  onChange={(e) => setResultForm({ ...resultForm, semester: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black"
                  required
                />
                <input
                  type="text"
                  placeholder="Academic Year (e.g. 2024-25)"
                  value={resultForm.academicYear}
                  onChange={(e) => setResultForm({ ...resultForm, academicYear: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black"
                />
                <input
                  type="number"
                  placeholder="Internal Marks (out of 50)"
                  value={resultForm.internalMarks}
                  onChange={(e) => setResultForm({ ...resultForm, internalMarks: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black"
                  required
                />
                <input
                  type="number"
                  placeholder="External Marks (out of 50)"
                  value={resultForm.externalMarks}
                  onChange={(e) => setResultForm({ ...resultForm, externalMarks: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black"
                  required
                />
                <button type="submit" className="col-span-2 bg-black text-white py-3 rounded hover:bg-gray-800 transition">
                  Submit Marks
                </button>
              </form>
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

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-black text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold tracking-widest">BRIAR</h1>
          <p className="text-gray-400 text-sm mt-1">Faculty Panel</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {[
            { key: "dashboard", label: "Dashboard" },
            { key: "courses", label: "My Courses" },
            { key: "attendance", label: "Attendance" },
            { key: "marks", label: "Marks" },
            { key: "notices", label: "Notices" },
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

export default FacultyDashboard