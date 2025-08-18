import { useState, useEffect } from 'react'
import axios from 'axios'

const Pricing = () => {
  const [pricing, setPricing] = useState([])
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8000/api/pricing/' && 'https://api-n7hd.onrender.com/api/pricing/'),
      axios.get('http://localhost:8000/api/areas/' && 'https://api-n7hd.onrender.com/api/areas/')
    ])
      .then(([pricingRes, areasRes]) => {
        setPricing(pricingRes.data)
        setAreas(areasRes.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load pricing and service areas.')
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Pricing & Service Areas
        </h2>

        {/* Loading / Error States */}
        {loading && (
          <div className="text-center text-gray-600">Loading data...</div>
        )}
        {error && (
          <div className="text-center text-red-500 font-medium">{error}</div>
        )}

        {/* Pricing Section */}
        {!loading && !error && (
          <>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Service Pricing
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {pricing.map((item, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition"
                >
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    {item.huduma}
                  </h4>
                  <p className="text-blue-600 font-semibold text-lg">
                    {item.bei}
                  </p>
                </div>
              ))}
            </div>

            {/* Areas Section */}
            <h3 className="text-2xl font-semibold text-gray-700 mt-12 mb-4">
              Service Areas
            </h3>
            <div className="bg-white shadow-md rounded-xl p-6 border">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {areas.map((area, index) => (
                  <li
                    key={index}
                    className="p-2 rounded bg-gray-100 hover:bg-gray-200 transition"
                  >
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Pricing
