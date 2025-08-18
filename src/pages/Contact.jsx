const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        {/* Page Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
          Contact Us
        </h2>

        {/* Contact Form */}
        <form className="space-y-5 mb-8">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Message</label>
            <textarea
              placeholder="Your message..."
              rows="5"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>
          <button
            type="button"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Send Message
          </button>
        </form>

        {/* Office Info */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">Our Office</h3>
          <div className="rounded-lg overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3961.2550710862115!2d39.26037682417496!3d-6.8600030671138175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1stemeke%20hospital!5e0!3m2!1sen!2stz!4v1755530127304!5m2!1sen!2stz"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
            
          </div>
          <p className="text-gray-700"><strong>Phone:</strong> +255 693 212 091</p>
          <p className="text-gray-700"><strong>Email:</strong> info@I&Mcourier.com</p>
        </div>
      </div>
    </div>
  )
}

export default Contact
