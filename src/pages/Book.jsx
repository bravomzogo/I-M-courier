import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { 
  Package, MapPin, User, Phone, Mail, 
  Scale, Calendar, AlertCircle, CheckCircle,
  Loader2, Clock
} from "lucide-react"

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://api-n7hd.onrender.com/api' 
  : 'http://localhost:8000/api'

const Book = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    // Step 1: Parcel Details
    service: "",
    weight: "",
    dimensions: "",
    declared_value: "",
    special_instructions: "",
    
    // Step 2: Sender & Receiver
    sender_name: "",
    sender_email: "",
    sender_phone: "",
    receiver_name: "",
    receiver_email: "",
    receiver_phone: "",
    pickup_location: "",
    delivery_location: "",
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE}/services/`)
      setServices(response.data)
    } catch (err) {
      console.error("Error fetching services:", err)
      setError("Failed to load services. Please refresh the page.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const nextStep = () => {
    if (step === 1 && (!formData.service || !formData.weight)) {
      setError("Please fill in all required fields")
      return
    }
    if (step === 2) {
      if (!formData.sender_name || !formData.sender_email || !formData.sender_phone ||
          !formData.receiver_name || !formData.receiver_email || !formData.receiver_phone ||
          !formData.pickup_location || !formData.delivery_location) {
        setError("Please fill in all required fields")
        return
      }
    }
    setError("")
    setStep(step + 1)
  }

  const prevStep = () => {
    setError("")
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const response = await axios.post(`${API_BASE}/parcels/`, formData)
      setSuccess(`Parcel request submitted successfully! Your tracking number is: ${response.data.tracking_number}`)
      
      setTimeout(() => {
        navigate(`/track/${response.data.tracking_number}`)
      }, 3000)

    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit parcel request")
    } finally {
      setSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-blue-800">
                  Fill in your parcel details. All fields marked with * are required.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="inline w-4 h-4 mr-1" />
                  Service Type *
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - Tsh {service.price_per_kg.toLocaleString()}/kg
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Scale className="inline w-4 h-4 mr-1" />
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  step="0.1"
                  min="0.1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 5.5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions (L x W x H in cm)
                </label>
                <input
                  type="text"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 30x20x15"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Declared Value (Tsh)
                </label>
                <input
                  type="number"
                  name="declared_value"
                  value={formData.declared_value}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions
              </label>
              <textarea
                name="special_instructions"
                value={formData.special_instructions}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any special handling instructions..."
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Sender Information */}
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Sender Information
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="sender_name"
                      value={formData.sender_name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline w-4 h-4 mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="sender_email"
                      value={formData.sender_email}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline w-4 h-4 mr-1" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="sender_phone"
                      value={formData.sender_phone}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Pickup Location *
                    </label>
                    <textarea
                      name="pickup_location"
                      value={formData.pickup_location}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Receiver Information */}
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                  <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Receiver Information
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="receiver_name"
                      value={formData.receiver_name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline w-4 h-4 mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="receiver_email"
                      value={formData.receiver_email}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline w-4 h-4 mr-1" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="receiver_phone"
                      value={formData.receiver_phone}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Delivery Location *
                    </label>
                    <textarea
                      name="delivery_location"
                      value={formData.delivery_location}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        const selectedService = services.find(s => s.id == formData.service)
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Review Your Order</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Please review all information before submitting your parcel request.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div className="space-y-6">
                <h4 className="font-bold text-gray-800 text-lg border-b pb-2">Order Summary</h4>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Type:</span>
                    <span className="font-medium">{selectedService?.name || 'Standard'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{formData.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Cost:</span>
                    <span className="font-medium text-blue-600">
                      Tsh {selectedService ? (selectedService.price_per_kg * parseFloat(formData.weight)).toLocaleString() : '0'}
                    </span>
                  </div>
                  {formData.dimensions && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dimensions:</span>
                      <span className="font-medium">{formData.dimensions} cm</span>
                    </div>
                  )}
                  {formData.declared_value && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Declared Value:</span>
                      <span className="font-medium">Tsh {parseFloat(formData.declared_value).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {formData.special_instructions && (
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Special Instructions:</h5>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{formData.special_instructions}</p>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h4 className="font-bold text-gray-800 text-lg border-b pb-2">Contact Information</h4>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" /> Sender
                    </h5>
                    <div className="text-gray-600 space-y-1 ml-6">
                      <div>{formData.sender_name}</div>
                      <div>{formData.sender_email}</div>
                      <div>{formData.sender_phone}</div>
                      <div className="text-sm mt-2">{formData.pickup_location}</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" /> Receiver
                    </h5>
                    <div className="text-gray-600 space-y-1 ml-6">
                      <div>{formData.receiver_name}</div>
                      <div>{formData.receiver_email}</div>
                      <div>{formData.receiver_phone}</div>
                      <div className="text-sm mt-2">{formData.delivery_location}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Important Notes:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your parcel request will be reviewed by our team</li>
                    <li>You will receive a confirmation email once approved</li>
                    <li>You can track your parcel using the tracking number provided after approval</li>
                    <li>Please ensure all contact information is accurate</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4" style={{ paddingTop: '100px', paddingBottom: '48px' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Book a Parcel Delivery
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fill out the form below to schedule your parcel delivery. All fields marked with * are required.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  stepNum === step 
                    ? 'bg-blue-600 text-white' 
                    : stepNum < step 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNum < step ? <CheckCircle className="w-5 h-5" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-24 h-1 ${
                    stepNum < step ? 'bg-green-100' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-600 max-w-md mx-auto">
            <span className={step >= 1 ? 'font-medium text-blue-600' : ''}>Parcel Details</span>
            <span className={step >= 2 ? 'font-medium text-blue-600' : ''}>Contact Info</span>
            <span className={step >= 3 ? 'font-medium text-blue-600' : ''}>Review</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {loading && step === 1 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading services...</span>
            </div>
          ) : (
            <>
              {/* Step Content */}
              <div className="mb-8">
                {renderStep()}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    step === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Back
                </button>

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2 disabled:opacity-70"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Submit Parcel Request
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Approval Process</h3>
            </div>
            <p className="text-sm text-gray-600">
              Your parcel request will be reviewed and approved within 24 hours. You'll receive email confirmation.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3 mb-3">
              <Package className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Tracking</h3>
            </div>
            <p className="text-sm text-gray-600">
              Once approved, you'll receive a tracking number to monitor your parcel in real-time.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Need Help?</h3>
            </div>
            <p className="text-sm text-gray-600">
              Contact our support team at info@imcouriersupply.com
 or call +255 693 212 091.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Book