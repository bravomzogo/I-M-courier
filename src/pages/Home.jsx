import { motion, useScroll, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { 
  FaGlobe, 
  FaTruck,
  FaWarehouse,
  FaPlane,
  FaBoxOpen,
  FaShieldAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaTiktok,
  FaInstagram,
  FaMapMarkerAlt,
  FaCheckCircle
} from 'react-icons/fa';
import { FiArrowRight, FiPackage } from 'react-icons/fi';

// Animation Variants (Pure JavaScript)
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, delay: 0.5 } }
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const pulseLocation = {
  visible: {
    opacity: [0, 1, 1, 0],
    y: [20, 0, 0, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      repeatType: "loop",
      times: [0, 0.15, 0.85, 1],
      ease: "easeInOut"
    }
  }
};

const Home = () => {
  const colors = {
    primary: '#E31E24',
    primaryDark: '#B71C1C',
    secondary: '#1E3A8A',
    secondaryLight: '#2563EB',
    light: '#FFFFFF',
    dark: '#1F2937',
    gray: '#6B7280',
    lightGray: '#F3F4F6',
  };

  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="w-full overflow-hidden bg-white">
      {/* Artistic Hero Section */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        {/* Floating Geometric Shapes */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 border-4 rounded-full"
          style={{ borderColor: colors.primary, opacity: 0.2 }}
          animate={{
            y: [0, 30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 border-4"
          style={{ borderColor: colors.secondary, opacity: 0.3 }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, -90, -180],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Main Content Container */}
        <div className="container mx-auto px-6 relative z-10 min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full py-20">
            
            {/* Left Content */}
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              animate="visible"
            >
              {/* Small Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 backdrop-blur-sm"
                style={{ backgroundColor: colors.primary + '20', border: `1px solid ${colors.primary}` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <FiPackage style={{ color: colors.primary }} />
                <span className="text-sm font-semibold" style={{ color: colors.light }}>
                  Trusted Since 2018
                </span>
              </motion.div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="overflow-hidden"
                >
                  <span className="inline-block" style={{ color: colors.light }}>
                    I&M
                  </span>
                  <span className="inline-block ml-4" style={{
                    color: colors.primary,
                    textShadow: `0 0 40px ${colors.primary}80`
                  }}>
                    COURIER
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-2xl md:text-3xl font-light mt-2 tracking-widest"
                  style={{ color: colors.secondaryLight }}
                >
                  GENERAL SUPPLIER
                </motion.div>
              </h1>

              {/* Subtitle */}
              <motion.p
                className="text-xl md:text-2xl mb-8 leading-relaxed"
                style={{ color: colors.lightGray }}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
              >
                Revolutionizing logistics across Tanzania with{' '}
                <span className="font-bold" style={{ color: colors.primary }}>
                  speed, precision
                </span>
                {' '}and{' '}
                <span className="font-bold" style={{ color: colors.primary }}>
                  reliability
                </span>
              </motion.p>

              {/* Stats Mini Cards */}
              <motion.div
                className="grid grid-cols-3 gap-4 mb-8"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {[
                  { value: '50+', label: 'Years Exp.' },
                  { value: '500+', label: 'Daily Ships' },
                  { value: '24/7', label: 'Support' }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    className="p-4 rounded-lg backdrop-blur-md border"
                    style={{
                      backgroundColor: colors.light + '10',
                      borderColor: colors.primary + '30'
                    }}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05, borderColor: colors.primary }}
                  >
                    <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                      {stat.value}
                    </div>
                    <div className="text-xs" style={{ color: colors.lightGray }}>
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-wrap gap-4"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.2 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/track"
                    className="group flex items-center gap-3 px-8 py-4 rounded-full font-bold shadow-2xl transition-all duration-300"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.light
                    }}
                  >
                    Track Package
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/contact"
                    className="flex items-center gap-3 px-8 py-4 rounded-full font-bold border-2 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-gray-900"
                    style={{
                      borderColor: colors.light,
                      color: colors.light
                    }}
                  >
                    Contact Us
                  </Link>
                </motion.div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                className="flex gap-4 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                {[
                  { icon: <FaTiktok />, href: 'https://www.tiktok.com/@landmcourierlogistics' },
                  { icon: <FaInstagram />, href: 'https://instagram.com/landmcourierservice' }
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-full border-2 backdrop-blur-sm transition-all duration-300"
                    style={{ borderColor: colors.light + '40', color: colors.light }}
                    whileHover={{
                      scale: 1.1,
                      borderColor: colors.primary,
                      backgroundColor: colors.primary
                    }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Side - Video with Artistic Frame */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              style={{
                x: mousePosition.x,
                y: mousePosition.y,
              }}
              className="relative"
            >
              {/* Decorative Blur Background */}
              <div className="absolute -inset-4 rounded-3xl" style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                opacity: 0.3,
                filter: 'blur(20px)'
              }}></div>

              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4" style={{ borderColor: colors.primary }}>
                {/* Video */}
                <div className="relative w-full h-[500px] overflow-hidden">
                  <video
                    ref={videoRef}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls={false}
                  >
                    <source src="/hero-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Video Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/20"></div>
                </div>

                {/* Pulsing Location Banner */}
                <motion.div
                  variants={pulseLocation}
                  initial={{ opacity: 0, y: 20 }}
                  animate="visible"
                  className="absolute bottom-6 left-6 right-6 p-4 rounded-xl backdrop-blur-md border"
                  style={{
                    backgroundColor: colors.light + '20',
                    borderColor: colors.primary + '50'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                      <FaMapMarkerAlt style={{ color: colors.light }} />
                    </div>
                    <div>
                      <p className="font-bold" style={{ color: colors.light }}>Ubungo Urafiki</p>
                      <p className="text-sm" style={{ color: colors.lightGray }}>Dar es Salaam, Tanzania</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Corner Accents */}
              <div className="absolute -top-6 -right-6 w-24 h-24 border-t-4 border-r-4 rounded-tr-3xl" style={{ borderColor: colors.primary }}></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 border-b-4 border-l-4 rounded-bl-3xl" style={{ borderColor: colors.secondary }}></div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 rounded-full flex items-start justify-center p-2" style={{ borderColor: colors.light }}>
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: colors.primary }}
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5" style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
        }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-block px-4 py-2 rounded-full mb-4"
              style={{ backgroundColor: colors.primary + '20', color: colors.primary }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
            >
              <span className="font-semibold">What We Offer</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.dark }}>
              Comprehensive <span style={{ color: colors.primary }}>Logistics Solutions</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.gray }}>
              From local deliveries to international freight, we've got you covered
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <FaTruck />, title: 'Domestic Courier', desc: 'Same-day and next-day delivery across Tanzania' },
              { icon: <FaGlobe />, title: 'International Shipping', desc: 'Worldwide courier with customs support' },
              { icon: <FaPlane />, title: 'Express Air Freight', desc: 'Urgent packages by air to major cities' },
              { icon: <FaWarehouse />, title: 'Warehousing', desc: 'Secure storage and inventory management' },
              { icon: <FaBoxOpen />, title: 'Packaging & Removal', desc: 'Complete relocation services' },
              { icon: <FaShieldAlt />, title: 'Clearing & Forwarding', desc: 'Customs clearance for all freight types' }
            ].map((service, i) => (
              <motion.div
                key={i}
                className="group relative p-8 rounded-2xl bg-white border-2 transition-all duration-300 hover:shadow-2xl"
                style={{ borderColor: colors.lightGray }}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  borderColor: colors.primary,
                  y: -5
                }}
              >
                <div className="text-4xl mb-4 transition-transform group-hover:scale-110" style={{ color: i % 2 === 0 ? colors.primary : colors.secondary }}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.dark }}>
                  {service.title}
                </h3>
                <p style={{ color: colors.gray }}>{service.desc}</p>
                
                <motion.div
                  className="absolute bottom-0 left-0 h-1 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20" style={{ backgroundColor: colors.lightGray }}>
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl opacity-20" style={{ backgroundColor: colors.primary }}></div>
                <img
                  src="https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Delivery service"
                  className="relative rounded-3xl shadow-2xl w-full h-auto"
                />
              </div>
            </motion.div>

            <motion.div
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6" style={{ color: colors.dark }}>
                Why <span style={{ color: colors.primary }}>I&M Courier</span>?
              </h2>
              
              <motion.div 
                className="space-y-4" 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  'Advanced tracking system with real-time updates',
                  'Dedicated account manager for each client',
                  'Receipt confirmation through HCS System',
                  '50+ fleet vehicles across Tanzania',
                  'Services available 7 days a week',
                  'Over 50 years combined expertise'
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 p-4 rounded-lg bg-white shadow-sm"
                    variants={fadeInUp}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                      <FaCheckCircle className="text-white text-sm" />
                    </div>
                    <span style={{ color: colors.dark }}>{item}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div className="mt-8" whileHover={{ scale: 1.02 }}>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold shadow-lg transition-all duration-300"
                  style={{ backgroundColor: colors.secondary, color: colors.light }}
                >
                  Learn More About Us
                  <FiArrowRight />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`
        }}></div>
        
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 20px)'
        }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ color: colors.light }}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Ready to Ship with Us?
            </motion.h2>
            <motion.p
              className="text-xl mb-8"
              style={{ color: colors.lightGray }}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Join hundreds of satisfied customers across Tanzania
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-4"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.a
                href="tel:+255693212091"
                className="flex items-center gap-3 px-8 py-4 rounded-full font-bold shadow-2xl"
                style={{ backgroundColor: colors.light, color: colors.primary }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPhoneAlt />
                +255 693 212 091
              </motion.a>
              <motion.a
                href="mailto:issaimcourier@gmail.com"
                className="flex items-center gap-3 px-8 py-4 rounded-full font-bold border-2 backdrop-blur-sm hover:bg-white hover:text-gray-900"
                style={{ borderColor: colors.light, color: colors.light }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEnvelope />
                Email Us
              </motion.a>
            </motion.div>

            <motion.p
              className="mt-8 text-lg"
              style={{ color: colors.lightGray }}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Tunahudumia ndani ya Dar es Salaam na mikoani
            </motion.p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;