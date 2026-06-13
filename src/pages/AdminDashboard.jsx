import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function AdminDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))
  const token = localStorage.getItem("token")
  const [active, setActive] = useState("dashboard")
  const [students, setStudents] = useState([])
  const [faculty, setFaculty] = useState([])
  const [notices, setNotices] = useState([])
  const [courses, setCourses] = useState([])
  const [admissions, setAdmissions] = useState([])
  const [grievances, setGrievances] = useState([])
  const [noticeForm, setNoticeForm] = useState({ title: "", content: "", targetRole: "all" })
  const [courseForm, setCourseForm] = useState({ name: "", code: "", department: "", semester: "", credits: 3, faculty: "" })
  const [responseText, setResponseText] = useState({})
  const [studentForm, setStudentForm] = useState({
    name: "", email: "", password: "", rollNumber: "",
    department: "", semester: "", batch: "", phone: "",
    address: "", dob: "", gender: "male"
  })
  const [studentError, setStudentError] = useState("")
  const [studentSuccess, setStudentSuccess] = useState("")

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStudents(res.data.students)
    } catch (error) { console.log(error) }
  }

  const fetchFaculty = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/faculty", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFaculty(res.data.faculty)
    } catch (error) { console.log(error) }
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

  const fetchAdmissions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admissions", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAdmissions(res.data.admissions)
    } catch (error) { console.log(error) }
  }

  const fetchGrievances = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/grievances", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setGrievances(res.data.grievances)
    } catch (error) { console.log(error) }
  }

  const addStudent = async (e) => {
    e.preventDefault()
    setStudentError("")
    setStudentSuccess("")
    try {
      await axios.post("http://localhost:5000/api/students", studentForm, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStudentSuccess("Student added successfully!")
      setStudentForm({
        name: "", email: "", password: "", rollNumber: "",
        department: "", semester: "", batch: "", phone: "",
        address: "", dob: "", gender: "male"
      })
      fetchStudents()
    } catch (error) {
      setStudentError(error.response?.data?.message || "Failed to add student")
    }
  }

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure?")) return
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchStudents()
    } catch (error) { console.log(error) }
  }

  const deleteFaculty = async (id) => {
    if (!window.confirm("Are you sure?")) return
    try {
      await axios.delete(`http://localhost:5000/api/faculty/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchFaculty()
    } catch (error) { console.log(error) }
  }

  const postNotice = async (e) => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:5000/api/notices", {
        ...noticeForm, postedBy: user.id
      }, { headers: { Authorization: `Bearer ${token}` } })
      setNoticeForm({ title: "", content: "", targetRole: "all" })
      fetchNotices()
    } catch (error) { console.log(error) }
  }

  const deleteNotice = async (id) => {
    if (!window.confirm("Are you sure?")) return
    try {
      await axios.delete(`http://localhost:5000/api/notices/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchNotices()
    } catch (error) { console.log(error) }
  }

  const addCourse = async (e) => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:5000/api/courses", courseForm, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCourseForm({ name: "", code: "", department: "", semester: "", credits: 3, faculty: "" })
      fetchCourses()
    } catch (error) { console.log(error) }
  }

  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure?")) return
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCourses()
    } catch (error) { console.log(error) }
  }

  const updateAdmission = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/admissions/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchAdmissions()
    } catch (error) { console.log(error) }
  }

  const deleteAdmission = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admission?")) return
    try {
      await axios.delete(`http://localhost:5000/api/admissions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchAdmissions()
    } catch (error) { console.log(error) }
  }

  const updateGrievance = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/grievances/${id}`, {
        status, response: responseText[id] || ""
      }, { headers: { Authorization: `Bearer ${token}` } })
      fetchGrievances()
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

  useEffect(() => {
    if (active === "students") fetchStudents()
    if (active === "faculty") fetchFaculty()
    if (active === "notices") fetchNotices()
    if (active === "courses") { fetchCourses(); fetchFaculty() }
    if (active === "admissions") fetchAdmissions()
    if (active === "grievances") fetchGrievances()
    if (active === "dashboard") {
      fetchStudents()
      fetchFaculty()
      fetchCourses()
      fetchNotices()
      fetchAdmissions()
    }
  }, [active])

  const renderContent = () => {
    switch (active) {
      case "dashboard":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
            <p className="text-gray-500 mb-8">Welcome back, {user?.name}!</p>
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500 text-sm uppercase tracking-widest">Students</p>
                <h3 className="text-4xl font-bold mt-2">{students.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500 text-sm uppercase tracking-widest">Faculty</p>
                <h3 className="text-4xl font-bold mt-2">{faculty.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500 text-sm uppercase tracking-widest">Courses</p>
                <h3 className="text-4xl font-bold mt-2">{courses.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500 text-sm uppercase tracking-widest">Notices</p>
                <h3 className="text-4xl font-bold mt-2">{notices.length}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">Recent Admissions</h3>
              {admissions.length === 0 ? (
                <p className="text-gray-400">No admissions yet.</p>
              ) : (
                admissions.slice(0, 5).map((a) => (
                  <div key={a._id} className="flex justify-between items-center border-b py-3">
                    <div>
                      <p className="font-medium">{a.applicantName}</p>
                      <p className="text-gray-400 text-sm">{a.department}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
                      a.status === "approved" ? "bg-green-100 text-green-700" :
                      a.status === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{a.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )

      case "students":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-8">Students</h2>
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-xl font-bold mb-4">Add New Student</h3>
              {studentError && <p className="text-red-500 mb-4">{studentError}</p>}
              {studentSuccess && <p className="text-green-500 mb-4">{studentSuccess}</p>}
              <form onSubmit={addStudent} className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black" required />
                <input type="email" placeholder="Email" value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black" required />
                <input type="password" placeholder="Password" value={studentForm.password}
                  onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black" required />
                <input type="text" placeholder="Roll Number" value={studentForm.rollNumber}
                  onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black" required />
                <select value={studentForm.department}
                  onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black" required>
                  <option value="">Select Department</option>
                  <option value="Fashion Designing">Fashion Designing</option>
                  <option value="Textile Design">Textile Design</option>
                  <option value="Luxury Brand Management">Luxury Brand Management</option>
                </select>
                <input type="number" placeholder="Semester" value={studentForm.semester}
                  onChange={(e) => setStudentForm({ ...studentForm, semester: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black" required />
                <input type="text" placeholder="Batch (e.g. 2024-2027)" value={studentForm.batch}
                  onChange={(e) => setStudentForm({ ...studentForm, batch: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black" />
                <input type="text" placeholder="Phone Number" value={studentForm.phone}
                  onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black" />
                <input type="date" value={studentForm.dob}
                  onChange={(e) => setStudentForm({ ...studentForm, dob: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black" />
                <select value={studentForm.gender}
                  onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <textarea placeholder="Address" value={studentForm.address}
                  onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black col-span-2" rows="2" />
                <button type="submit" className="col-span-2 bg-black text-white py-3 rounded hover:bg-gray-800 transition">
                  Add Student
                </button>
              </form>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {students.length === 0 ? (
                <p className="text-gray-400 p-6">No students added yet.</p>
              ) : (
                <table className="w-full">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="text-left p-4">Name</th>
                      <th className="text-left p-4">Email</th>
                      <th className="text-left p-4">Roll No</th>
                      <th className="text-left p-4">Department</th>
                      <th className="text-left p-4">Semester</th>
                      <th className="text-left p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student._id} className="border-b border-gray-100">
                        <td className="p-4">{student.user?.name}</td>
                        <td className="p-4">{student.user?.email}</td>
                        <td className="p-4">{student.rollNumber}</td>
                        <td className="p-4">{student.department}</td>
                        <td className="p-4">{student.semester}</td>
                        <td className="p-4">
                          <button onClick={() => deleteStudent(student._id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )

      case "faculty":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-8">Faculty</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {faculty.length === 0 ? (
                <p className="text-gray-400 p-6">No faculty registered yet.</p>
              ) : (
                <table className="w-full">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="text-left p-4">Name</th>
                      <th className="text-left p-4">Email</th>
                      <th className="text-left p-4">Joined</th>
                      <th className="text-left p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faculty.map((f) => (
                      <tr key={f._id} className="border-b border-gray-100">
                        <td className="p-4">{f.name}</td>
                        <td className="p-4">{f.email}</td>
                        <td className="p-4">{new Date(f.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <button onClick={() => deleteFaculty(f._id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )

      case "courses":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-8">Courses</h2>
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-xl font-bold mb-4">Add New Course</h3>
              <form onSubmit={addCourse} className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Course Name" value={courseForm.name}
                  onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black" required />
                <input type="text" placeholder="Course Code (e.g. FD101)" value={courseForm.code}
                  onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black" required />
                <input type="text" placeholder="Department" value={courseForm.department}
                  onChange={(e) => setCourseForm({ ...courseForm, department: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black" required />
                <input type="number" placeholder="Semester" value={courseForm.semester}
                  onChange={(e) => setCourseForm({ ...courseForm, semester: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black" required />
                <input type="number" placeholder="Credits" value={courseForm.credits}
                  onChange={(e) => setCourseForm({ ...courseForm, credits: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black" />
                <select value={courseForm.faculty}
                  onChange={(e) => setCourseForm({ ...courseForm, faculty: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black">
                  <option value="">Assign Faculty (optional)</option>
                  {faculty.map((f) => (
                    <option key={f._id} value={f._id}>{f.name}</option>
                  ))}
                </select>
                <button type="submit" className="col-span-2 bg-black text-white py-3 rounded hover:bg-gray-800 transition">
                  Add Course
                </button>
              </form>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {courses.length === 0 ? (
                <p className="text-gray-400 p-6">No courses added yet.</p>
              ) : (
                <table className="w-full">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="text-left p-4">Name</th>
                      <th className="text-left p-4">Code</th>
                      <th className="text-left p-4">Department</th>
                      <th className="text-left p-4">Semester</th>
                      <th className="text-left p-4">Faculty</th>
                      <th className="text-left p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course._id} className="border-b border-gray-100">
                        <td className="p-4">{course.name}</td>
                        <td className="p-4">{course.code}</td>
                        <td className="p-4">{course.department}</td>
                        <td className="p-4">{course.semester}</td>
                        <td className="p-4">{course.faculty?.name || "Not assigned"}</td>
                        <td className="p-4">
                          <button onClick={() => deleteCourse(course._id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
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
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-xl font-bold mb-4">Post New Notice</h3>
              <form onSubmit={postNotice} className="flex flex-col gap-4">
                <input type="text" placeholder="Notice Title" value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black" required />
                <textarea placeholder="Notice Content" rows="3" value={noticeForm.content}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black" required />
                <select value={noticeForm.targetRole}
                  onChange={(e) => setNoticeForm({ ...noticeForm, targetRole: e.target.value })}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black">
                  <option value="all">Everyone</option>
                  <option value="student">Students Only</option>
                  <option value="faculty">Faculty Only</option>
                </select>
                <button type="submit" className="bg-black text-white py-3 rounded hover:bg-gray-800 transition">
                  Post Notice
                </button>
              </form>
            </div>
            <div className="flex flex-col gap-4">
              {notices.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-400">No notices posted yet.</p>
                </div>
              ) : (
                notices.map((notice) => (
                  <div key={notice._id} className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg">{notice.title}</h4>
                        <p className="text-gray-600 mt-1">{notice.content}</p>
                        <p className="text-gray-400 text-sm mt-2">
                          For: {notice.targetRole} · {new Date(notice.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button onClick={() => deleteNotice(notice._id)} className="text-red-500 hover:text-red-700 text-sm ml-4">Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )

      case "admissions":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-8">Admissions</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {admissions.length === 0 ? (
                <p className="text-gray-400 p-6">No admission requests yet.</p>
              ) : (
                <table className="w-full">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="text-left p-4">Name</th>
                      <th className="text-left p-4">Email</th>
                      <th className="text-left p-4">Department</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admissions.map((admission) => (
                      <tr key={admission._id} className="border-b border-gray-100">
                        <td className="p-4">{admission.applicantName}</td>
                        <td className="p-4">{admission.email}</td>
                        <td className="p-4">{admission.department}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            admission.status === "approved" ? "bg-green-100 text-green-700" :
                            admission.status === "rejected" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>{admission.status}</span>
                        </td>
                        <td className="p-4 flex gap-2">
                          <button onClick={() => updateAdmission(admission._id, "approved")} className="text-green-500 hover:text-green-700 text-sm">Approve</button>
                          <button onClick={() => updateAdmission(admission._id, "rejected")} className="text-red-500 hover:text-red-700 text-sm">Reject</button>
                          <button onClick={() => deleteAdmission(admission._id)} className="text-gray-500 hover:text-gray-700 text-sm">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )

      case "grievances":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-8">Grievances</h2>
            <div className="flex flex-col gap-4">
              {grievances.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-400">No grievances submitted yet.</p>
                </div>
              ) : (
                grievances.map((g) => (
                  <div key={g._id} className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg">{g.subject}</h4>
                        <p className="text-gray-500 text-sm">From: {g.studentName} ({g.email})</p>
                        <p className="text-gray-600 mt-2">{g.description}</p>
                        <p className="text-gray-400 text-xs mt-2">
                          Category: {g.category} · {new Date(g.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          g.status === "resolved" ? "bg-green-100 text-green-700" :
                          g.status === "in-progress" ? "bg-blue-100 text-blue-700" :
                          g.status === "closed" ? "bg-gray-100 text-gray-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>{g.status}</span>
                        <button onClick={() => deleteGrievance(g._id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <textarea
                        placeholder="Write a response..."
                        rows="2"
                        value={responseText[g._id] || ""}
                        onChange={(e) => setResponseText({ ...responseText, [g._id]: e.target.value })}
                        className="border border-gray-300 p-3 rounded focus:outline-none focus:border-black text-sm"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => updateGrievance(g._id, "in-progress")} className="text-blue-500 hover:text-blue-700 text-sm">In Progress</button>
                        <button onClick={() => updateGrievance(g._id, "resolved")} className="text-green-500 hover:text-green-700 text-sm">Resolve</button>
                        <button onClick={() => updateGrievance(g._id, "closed")} className="text-gray-500 hover:text-gray-700 text-sm">Close</button>
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
          <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {[
            { key: "dashboard", label: "Dashboard" },
            { key: "students", label: "Students" },
            { key: "faculty", label: "Faculty" },
            { key: "courses", label: "Courses" },
            { key: "notices", label: "Notices" },
            { key: "admissions", label: "Admissions" },
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

export default AdminDashboard