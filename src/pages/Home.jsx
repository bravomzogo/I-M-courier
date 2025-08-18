import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { 
  FaShippingFast, 
  FaGlobe, 
  FaClock, 
  FaHeadset, 
  FaShieldAlt, 
  FaBoxOpen,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram
} from 'react-icons/fa';
import { FiCheckCircle } from 'react-icons/fi';

// High-quality Pexels images
const heroImage = 'https://images.pexels.com/photos/4393429/pexels-photo-4393429.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
const testimonialBg = 'https://images.pexels.com/photos/6147118/pexels-photo-6147118.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
const deliveryImage = 'https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
const warehouseImage = 'https://images.pexels.com/photos/7097676/pexels-photo-7097676.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

const Home = () => {
  // Golden color scheme with complementary colors
  const colors = {
    primary: '#D4AF37',       // Classic gold
    primaryLight: '#E8C766',  // Light gold
    primaryDark: '#B38B2D',   // Dark gold
    secondary: '#1A3E72',     // Navy blue (complementary)
    secondaryLight: '#2C5AA0',// Light blue
    light: '#F9F7F0',         // Cream/off-white
    dark: '#2C2C2C',          // Dark text
    gray: '#7D7D7D',          // Medium gray
    lightGray: '#E5E5E5',     // Light gray
    accent: '#A52A2A',        // Rich burgundy for accents
    success: '#4CAF50'        // Green for success states
  };

  // Parallax effects
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 50]);

  // Services data
  const services = [
    {
      icon: <FaShippingFast className="text-4xl" />,
      title: "Local Delivery",
      description: "Same-day delivery within major cities with real-time tracking.",
      bgColor: 'bg-opacity-10',
      iconColor: colors.primary
    },
    {
      icon: <FaGlobe className="text-4xl" />,
      title: "Global Shipping",
      description: "International shipping with customs clearance support.",
      bgColor: 'bg-opacity-10',
      iconColor: colors.secondary
    },
    {
      icon: <FaClock className="text-4xl" />,
      title: "Express Service",
      description: "Priority handling for time-sensitive shipments.",
      bgColor: 'bg-opacity-10',
      iconColor: colors.primary
    },
    {
      icon: <FaHeadset className="text-4xl" />,
      title: "24/7 Support",
      description: "Dedicated customer service available anytime.",
      bgColor: 'bg-opacity-10',
      iconColor: colors.secondary
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: "Secure Handling",
      description: "Fully insured packages with tamper-proof packaging.",
      bgColor: 'bg-opacity-10',
      iconColor: colors.primary
    },
    {
      icon: <FaBoxOpen className="text-4xl" />,
      title: "Warehousing",
      description: "Secure storage with inventory management.",
      bgColor: 'bg-opacity-10',
      iconColor: colors.secondary
    }
  ];

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.1, 0.25, 0.3, 1],
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.03, 
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeIn"
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full overflow-hidden font-sans antialiased" style={{ backgroundColor: colors.light }}>
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: colors.secondary }}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        {/* Parallax Background with overlay */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y }}
        >
          <img
            src={heroImage}
            alt="Professional courier service delivering packages"
            className="w-full h-full object-cover"
            onError={(e) => console.error('Hero image failed to load:', e)}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-800/60"></div>
        </motion.div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 h-full flex items-center justify-center relative z-10">
          <motion.div
            className="max-w-4xl text-white text-center"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: 0.8,
                  ease: [0.1, 0.25, 0.3, 1]
                }
              }
            }}
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight"
              style={{ color: colors.light, textShadow: '0 4px 8px rgba(0,0,0,0.4)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Your Trusted Partner for <span style={{ color: colors.primary }}>Seamless Logistics</span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl lg:text-2xl mb-10 font-light max-w-3xl mx-auto"
              style={{ color: colors.lightGray, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Experience fast, secure, and reliable delivery services across Tanzania with real-time tracking and exceptional support.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.1, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  to="/track"
                  className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 font-bold py-4 px-10 rounded-full shadow-2xl transition-all duration-300 text-center text-lg tracking-wide"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: colors.dark
                  }}
                  aria-label="Track your package"
                >
                  Track Your Package
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  to="/contact"
                  className="inline-block bg-transparent border-2 hover:bg-white hover:text-gray-900 font-bold py-4 px-10 rounded-full shadow-2xl transition-all duration-300 text-center text-lg tracking-wide"
                  style={{ 
                    borderColor: colors.light,
                    color: colors.light
                  }}
                  aria-label="Request a quote"
                >
                  Get a Quote
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              className="mt-8 flex justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { icon: <FaFacebook className="text-2xl" />, href: "https://facebook.com", label: "Facebook" },
                { icon: <FaTwitter className="text-2xl" />, href: "https://twitter.com", label: "Twitter" },
                { icon: <FaLinkedin className="text-2xl" />, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: <FaInstagram className="text-2xl" />, href: "https://instagram.com", label: "Instagram" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity duration-300"
                  style={{ color: colors.light }}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Follow us on ${social.label}`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Prompt */}
        {/* <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{
            opacity: [0.5, 1, 0.5],
            y: [0, -10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <button
            className="px-6 py-3 rounded-full font-semibold text-sm shadow-md transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: colors.primary,
              color: colors.dark
            }}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            aria-label="Explore our services"
          >
            Discover Our Services
          </button>
        </motion.div> */}
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-16 relative z-10"
        style={{ backgroundColor: colors.light }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-6">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white rounded-2xl shadow-2xl p-8 max-w-6xl mx-auto border border-gray-200"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3
                }
              }
            }}
          >
            {[
              { value: '6+', label: 'Years Experience', icon: <FiCheckCircle className="text-2xl" /> },
              { value: '500+', label: 'Daily Deliveries', icon: <FaShippingFast className="text-2xl" /> },
              { value: '100%', label: 'Secure Handling', icon: <FaShieldAlt className="text-2xl" /> },
              { value: '24/7', label: 'Customer Support', icon: <FaHeadset className="text-2xl" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-4"
                variants={cardVariants}
                whileHover="hover"
              >
                <div
                  className="flex justify-center mb-3"
                  style={{ color: index % 2 === 0 ? colors.primary : colors.secondary }}
                >
                  {stat.icon}
                </div>
                <div
                  className="text-3xl font-bold mb-2"
                  style={{ color: colors.dark }}
                >
                  {stat.value}
                </div>
                <div 
                  className="text-gray-600 font-medium"
                  style={{ color: colors.gray }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section
        className="py-20"
        style={{ backgroundColor: colors.light }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            variants={fadeIn}
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: colors.dark }}
            >
              Our Comprehensive Services
            </h2>
            <div
              className="w-20 h-1.5 mx-auto mb-6 rounded-full"
              style={{ backgroundColor: colors.primary }}
            ></div>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: colors.gray }}
            >
              Tailored logistics solutions designed to meet your business and personal delivery needs with precision and care.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3
                }
              }
            }}
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-xl shadow-md border border-gray-200"
                style={{ 
                  backgroundColor: colors.light,
                }}
                variants={cardVariants}
                whileHover="hover"
              >
                <div
                  className="mb-6"
                  style={{ color: service.iconColor }}
                >
                  {service.icon}
                </div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: colors.dark }}
                >
                  {service.title}
                </h3>
                <p 
                  className="text-gray-600"
                  style={{ color: colors.gray }}
                >
                  {service.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20"
        style={{ backgroundColor: colors.lightGray }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2"
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  transition: { 
                    duration: 0.8,
                    ease: [0.1, 0.25, 0.3, 1]
                  }
                }
              }}
            >
              <img 
                src={deliveryImage} 
                alt="Fast delivery service" 
                className="rounded-xl shadow-xl w-full h-auto object-cover"
                onError={(e) => console.error('Delivery image failed to load:', e)}
              />
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              variants={{
                hidden: { opacity: 0, x: 30 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  transition: { 
                    duration: 0.8,
                    ease: [0.1, 0.25, 0.3, 1]
                  }
                }
              }}
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-6"
                style={{ color: colors.dark }}
              >
                Why Choose Our Courier Service?
              </h2>
              
              <ul className="space-y-4">
                {[
                  "Real-time package tracking system",
                  "Dedicated account managers for business clients",
                  "Competitive pricing with no hidden fees",
                  "Environmentally friendly delivery options",
                  "Customized logistics solutions",
                  "Secure handling with insurance coverage"
                ].map((feature, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start"
                    variants={cardVariants}
                  >
                    <div className="flex-shrink-0 mt-1 mr-3" style={{ color: colors.primary }}>
                      <FiCheckCircle className="text-xl" />
                    </div>
                    <span 
                      className="text-gray-700"
                      style={{ color: colors.dark }}
                    >
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>
              
              <motion.div
                className="mt-8"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  to="/about"
                  className="inline-block hover:bg-opacity-90 font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-300"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: colors.dark
                  }}
                >
                  Learn More About Us
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        className="py-20"
        style={{ backgroundColor: colors.light }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            variants={fadeIn}
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: colors.dark }}
            >
              Our Simple Process
            </h2>
            <div
              className="w-20 h-1.5 mx-auto mb-6 rounded-full"
              style={{ backgroundColor: colors.primary }}
            ></div>
            <p 
              className="text-lg max-w-2xl mx-auto"
              style={{ color: colors.gray }}
            >
              Getting your items delivered has never been easier with our streamlined process.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                title: 'Schedule Pickup',
                description: 'Book online or call us to schedule a pickup at your location.',
                icon: <FaPhoneAlt className="text-2xl" />
              },
              {
                step: '2',
                title: 'We Deliver',
                description: 'Our professional team handles your package with care.',
                icon: <FaShippingFast className="text-2xl" />
              },
              {
                step: '3',
                title: 'Receive Confirmation',
                description: 'Get real-time updates and delivery confirmation.',
                icon: <FiCheckCircle className="text-2xl" />
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center bg-white p-8 rounded-xl shadow-md border border-gray-200"
                variants={cardVariants}
                whileHover="hover"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ 
                    backgroundColor: index % 2 === 0 ? colors.primary + '10' : colors.secondary + '10',
                    color: index % 2 === 0 ? colors.primary : colors.secondary
                  }}
                >
                  {step.icon}
                </div>
                <div 
                  className="text-sm font-semibold mb-2" 
                  style={{ color: colors.primary }}
                >
                  STEP {step.step}
                </div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: colors.dark }}
                >
                  {step.title}
                </h3>
                <p 
                  className="text-gray-600"
                  style={{ color: colors.gray }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="py-20 relative overflow-hidden"
        style={{ backgroundColor: colors.secondary }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="absolute inset-0 z-0">
          <img
            src={testimonialBg}
            alt="Testimonial background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-16"
            variants={fadeIn}
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: colors.light }}
            >
              Trusted by Businesses & Individuals
            </h2>
            <div
              className="w-20 h-1.5 mx-auto mb-6 rounded-full"
              style={{ backgroundColor: colors.primary }}
            ></div>
            <p 
              className="text-lg max-w-2xl mx-auto"
              style={{ color: colors.lightGray }}
            >
              Don't just take our word for it - hear what our clients say about our services.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.3
                }
              }
            }}
          >
            {[
              {
                quote: "I&M Courier has transformed our supply chain operations. Their reliability and professionalism are unmatched in the industry.",
                author: "James Mwangi",
                role: "CEO, Tech Solutions Ltd",
                rating: "★★★★★"
              },
              {
                quote: "As an e-commerce business, delivery is everything. With I&M Courier, we've seen our customer satisfaction scores improve dramatically.",
                author: "Sarah Kamau",
                role: "Founder, ShopEazy",
                rating: "★★★★★"
              },
              {
                quote: "Their customer service team is exceptional. Any issues are resolved quickly and professionally. Highly recommended!",
                author: "David Omondi",
                role: "Logistics Manager, PharmaCare",
                rating: "★★★★☆"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-xl shadow-lg"
                style={{ backgroundColor: colors.secondaryLight }}
                variants={cardVariants}
                whileHover="hover"
              >
                <div
                  className="mb-4 text-xl"
                  style={{ color: colors.primary }}
                >
                  {testimonial.rating}
                </div>
                <p 
                  className="italic mb-6 text-lg"
                  style={{ color: colors.light }}
                >
                  "{testimonial.quote}"
                </p>
                <div 
                  className="border-t pt-4"
                  style={{ borderColor: colors.primary + '30' }}
                >
                  <p
                    className="font-semibold"
                    style={{ color: colors.light }}
                  >
                    {testimonial.author}
                  </p>
                  <p 
                    className="text-sm"
                    style={{ color: colors.lightGray }}
                  >
                    {testimonial.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20"
        style={{ backgroundColor: colors.primary }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            style={{ color: colors.dark }}
            variants={fadeIn}
          >
            Ready to Experience Premium Delivery?
          </motion.h2>
          <motion.p
            className="text-xl mb-8 max-w-2xl mx-auto font-light"
            style={{ color: colors.dark }}
            variants={fadeIn}
          >
            Join thousands of satisfied customers who trust us with their valuable shipments.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                to="/contact"
                className="inline-block hover:bg-opacity-90 font-bold py-4 px-12 rounded-lg shadow-xl transition-all duration-300 text-lg"
                style={{ 
                  backgroundColor: colors.secondary,
                  color: colors.light
                }}
              >
                Get Started Now
              </Link>
            </motion.div>
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                to="/contact"
                className="inline-block bg-transparent border-2 hover:bg-white hover:text-gray-900 font-bold py-4 px-12 rounded-lg shadow-xl transition-all duration-300 text-lg"
                style={{ 
                  borderColor: colors.dark,
                  color: colors.dark
                }}
              >
                Contact Sales
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;