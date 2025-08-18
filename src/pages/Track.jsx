import { useState } from "react"
import axios from "axios"

const Track = () => {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [parcel, setParcel] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleTrack = (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setParcel(null)

    axios
      .get(`http://localhost:8000/api/track/${trackingNumber}/` && `https://api-n7hd.onrender.com/api/track/${trackingNumber}/`)
      .then((response) => {
        setParcel(response.data)
        setError("")
      })
      .catch(() => {
        setError("Parcel not found. Please check the tracking number.")
        setParcel(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 sm:p-10">
        {/* Page Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Track Your Parcel
        </h2>

        {/* Tracking Form */}
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter Tracking Number"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Searching..." : "Track"}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-center font-medium mb-4">{error}</p>
        )}

        {/* Parcel Info */}
        {parcel && (
          <div className="p-5 sm:p-6 bg-gray-100 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
              Parcel Details
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
              <li>
                <strong>Tracking Number:</strong> {parcel.tracking_number}
              </li>
              <li>
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    parcel.status === "Delivered"
                      ? "text-green-600"
                      : "text-yellow-600"
                  } font-medium`}
                >
                  {parcel.status}
                </span>
              </li>
              <li>
                <strong>Sender:</strong> {parcel.sender_name}
              </li>
              <li>
                <strong>Receiver:</strong> {parcel.receiver_name}
              </li>
              <li>
                <strong>Pickup Location:</strong> {parcel.pickup_location}
              </li>
              <li>
                <strong>Delivery Location:</strong> {parcel.delivery_location}
              </li>
              <li>
                <strong>Weight:</strong> {parcel.weight} kg
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Track
