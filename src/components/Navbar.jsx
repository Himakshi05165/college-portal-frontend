function Navbar() {
  const scrollTo = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="w-full bg-black text-white border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-14 px-6 flex items-center justify-between">

        <h1 className="text-xl font-bold tracking-widest cursor-pointer" onClick={() => scrollTo("home")}>
          BRIAR UNIVERSITY
        </h1>

        <ul className="flex items-center space-x-6 text-sm font-medium">
          <li className="cursor-pointer hover:text-gray-400" onClick={() => scrollTo("home")}>
            Home
          </li>
          <li className="cursor-pointer hover:text-gray-400" onClick={() => scrollTo("about")}>
            About
          </li>
          <li className="cursor-pointer hover:text-gray-400" onClick={() => scrollTo("courses")}>
            Courses
          </li>
          <li className="cursor-pointer hover:text-gray-400" onClick={() => scrollTo("admissions")}>
            Admissions
          </li>
          <li className="cursor-pointer hover:text-gray-400" onClick={() => scrollTo("contact")}>
            Contact
          </li>
          <li>
            <button
              onClick={() => window.location.href = "/login"}
              className="border border-white px-4 py-1.5 text-sm hover:bg-white hover:text-black transition duration-300"
            >
              Login
            </button>
          </li>
        </ul>

      </div>
    </nav>
  )
}

export default Navbar