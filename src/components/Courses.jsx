import fashionImg from "../assets/pexels-d-ng-hoang-giang-921242705-31779396.jpg"
import textileImg from "../assets/pexels-ekrulila-8318195.jpg"
import luxuryImg from "../assets/pexels-emrecan-2079428.jpg"

function Courses() {
  return (
    <section id="courses" className="bg-white py-20 px-10">

      <h2 className="text-5xl font-bold text-center mb-16">
        Our Courses
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        <div className="bg-gray-100 rounded-lg shadow overflow-hidden">
          <img
            src={fashionImg}
            alt="Fashion Designing"
            className="w-full h-96 object-cover object-top"
          />
          <div className="p-8">
            <h3 className="text-2xl font-bold mb-4">
              Fashion Designing
            </h3>
            <p className="text-gray-600">
              Learn garment construction, illustration and styling.
            </p>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg shadow overflow-hidden">
          <img
            src={textileImg}
            alt="Textile Design"
            className="w-full h-96 object-cover object-top"
          />
          <div className="p-8">
            <h3 className="text-2xl font-bold mb-4">
              Textile Design
            </h3>
            <p className="text-gray-600">
              Explore fabrics, textures and textile innovation.
            </p>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg shadow overflow-hidden">
          <img
            src={luxuryImg}
            alt="Luxury Brand Management"
            className="w-full h-96 object-cover object-top"
          />
          <div className="p-8">
            <h3 className="text-2xl font-bold mb-4">
              Luxury Brand Management
            </h3>
            <p className="text-gray-600">
              Study branding, marketing and luxury fashion business.
            </p>
          </div>
        </div>

      </div>

    </section>
  )
}

export default Courses