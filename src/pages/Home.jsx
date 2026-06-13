import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import About from "../components/About"
import Courses from "../components/Courses"
import Admissions from "../components/Admissions"
import Contact from "../components/Contact"
import Footer from "../components/Footer"

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Courses />
      <Admissions />
      <div className="py-8 bg-black"></div>
      <Contact />
      <Footer />
    </>
  )
}

export default Home
