import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const steps = ["Sender Info", "Receiver Info", "Package Info", "Review"];

const Book = () => {
  const [formData, setFormData] = useState({
    sender_name: "",
    receiver_name: "",
    pickup_location: "",
    delivery_location: "",
    weight: "",
  });

  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/book/",
        formData
      );
      setMessage(
        `✅ Order placed successfully! Tracking Number: ${response.data.tracking_number}`
      );
      setIsError(false);

      // Reset form
      setFormData({
        sender_name: "",
        receiver_name: "",
        pickup_location: "",
        delivery_location: "",
        weight: "",
      });
      setStep(0);
    } catch {
      setMessage("❌ Error: Failed to place the order.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 px-6 pt-28 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8"
      >
        {/* Stepper */}
        <div className="flex justify-between mb-8">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`flex-1 text-center font-semibold text-sm ${
                i === step
                  ? "text-blue-600"
                  : i < step
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 mx-auto mb-2 flex items-center justify-center rounded-full border-2 ${
                  i === step
                    ? "border-blue-600 bg-blue-100"
                    : i < step
                    ? "border-green-600 bg-green-100"
                    : "border-gray-300"
                }`}
              >
                {i + 1}
              </div>
              {s}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 mb-1">Sender Name</label>
                  <input
                    type="text"
                    name="sender_name"
                    value={formData.sender_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    placeholder="Enter sender's full name"
                    required
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 mb-1">
                    Receiver Name
                  </label>
                  <input
                    type="text"
                    name="receiver_name"
                    value={formData.receiver_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    placeholder="Enter receiver's full name"
                    required
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 mb-1">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    name="pickup_location"
                    value={formData.pickup_location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    placeholder="Enter pickup location"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">
                    Delivery Location
                  </label>
                  <input
                    type="text"
                    name="delivery_location"
                    value={formData.delivery_location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    placeholder="Enter delivery location"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    placeholder="Enter package weight"
                    required
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Review Your Order
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Sender:</strong> {formData.sender_name}
                  </li>
                  <li>
                    <strong>Receiver:</strong> {formData.receiver_name}
                  </li>
                  <li>
                    <strong>Pickup:</strong> {formData.pickup_location}
                  </li>
                  <li>
                    <strong>Delivery:</strong> {formData.delivery_location}
                  </li>
                  <li>
                    <strong>Weight:</strong> {formData.weight} kg
                  </li>
                </ul>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 0 && (
            <button
              onClick={prevStep}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="ml-auto px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="ml-auto px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center"
            >
              {loading ? "Placing..." : "Confirm & Place Order"}
            </button>
          )}
        </div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 text-center font-medium p-3 rounded-lg ${
              isError
                ? "bg-red-100 text-red-700 border border-red-300"
                : "bg-green-100 text-green-700 border border-green-300"
            }`}
          >
            {message}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Book;
