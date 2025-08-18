import { useState, useEffect } from "react"
import axios from "axios"

const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/services/" && "https://api-n7hd.onrender.com/api/services/")
      .then((response) => {
        setServices(response.data)
        setError("")
      })
      .catch(() => setError("Failed to load services. Please try again later."))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 md:pt-28">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-10">
          Our Services
        </h2>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500 font-medium">Loading...</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-500 font-medium mb-4">{error}</p>
        )}

        {/* Services List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition border border-gray-100 hover:border-blue-400"
            >
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                {service.name}
              </h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          ))}
        </div>

        {/* No services available */}
        {!loading && services.length === 0 && !error && (
          <p className="text-center text-gray-500 mt-6">
            No services available at the moment.
          </p>
        )}
      </div>
    </div>
  )
}

export default Services
