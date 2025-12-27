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
import { useApp } from '../context/AppContext';

// Animation Variants
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
  const { darkMode, t } = useApp();
  
  // HIGH CONTRAST color schemes - Dark Blue and Red
  const lightColors = {
    // Primary - Dark Blue for trust and professionalism
    primary: '#0D47A1',       // Deep dark blue
    primaryLight: '#1565C0',  // Lighter blue
    primaryDark: '#0A3575',   // Darker blue
    
    // Secondary - Bright Red for contrast and urgency
    secondary: '#D32F2F',     // Bright red
    secondaryLight: '#EF5350',// Light red
    secondaryDark: '#B71C1C', // Dark red
    
    // Backgrounds
    light: '#FFFFFF',
    dark: '#212121',          // Very dark gray for high contrast text
    
    // Text colors
    textPrimary: '#212121',   // High contrast dark text
    textSecondary: '#424242', // Medium contrast text
    textLight: '#FFFFFF',     // White text for dark backgrounds
    
    // UI colors
    gray: '#757575',
    lightGray: '#F5F5F5',
    cardBg: '#FFFFFF',
    cardBorder: '#E0E0E0',
    
    // Gradients
    heroGradient: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #1976D2 100%)'
  };

  const darkColors = {
    // Primary - Brighter blue for dark mode
    primary: '#2196F3',       // Bright blue
    primaryLight: '#42A5F5',  // Lighter blue
    primaryDark: '#1976D2',   // Darker blue
    
    // Secondary - Brighter red for dark mode
    secondary: '#F44336',     // Bright red
    secondaryLight: '#EF9A9A',// Light red
    secondaryDark: '#D32F2F', // Dark red
    
    // Backgrounds
    light: '#121212',         // Very dark background
    dark: '#FFFFFF',          // White text for maximum contrast
    
    // Text colors
    textPrimary: '#FFFFFF',   // White text for dark mode
    textSecondary: '#E0E0E0', // Light gray text
    textLight: '#FFFFFF',     // White text
    
    // UI colors
    gray: '#B0B0B0',
    lightGray: '#1E1E1E',
    cardBg: '#1E1E1E',
    cardBorder: '#333333',
    
    // Gradients
    heroGradient: 'linear-gradient(135deg, #0A3575 0%, #0D47A1 50%, #1565C0 100%)'
  };

  const colors = darkMode ? darkColors : lightColors;

  const videoRef = useRef(null);
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

  // Services data
  const services = [
    { icon: <FaTruck />, titleKey: 'domesticCourier', descKey: 'domesticDesc' },
    { icon: <FaGlobe />, titleKey: 'intlShipping', descKey: 'intlDesc' },
    { icon: <FaPlane />, titleKey: 'airFreight', descKey: 'airDesc' },
    { icon: <FaWarehouse />, titleKey: 'warehousing', descKey: 'warehouseDesc' },
    { icon: <FaBoxOpen />, titleKey: 'packaging', descKey: 'packagingDesc' },
    { icon: <FaShieldAlt />, titleKey: 'clearing', descKey: 'clearingDesc' }
  ];

  // Stats data
  const stats = [
    { value: '50+', labelKey: 'yearsExp' },
    { value: '500+', labelKey: 'dailyShips' },
    { value: '24/7', labelKey: 'support' }
  ];

  return (
    <div className="w-full overflow-hidden transition-colors duration-300" style={{ backgroundColor: colors.light }}>
      {/* Hero Section */}
      <section 
        className="relative min-h-screen overflow-hidden transition-colors duration-300"
        style={{ 
          background: colors.heroGradient
        }}
      >
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, ${colors.textLight} 1px, transparent 1px),
                             linear-gradient(to bottom, ${colors.textLight} 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full py-16 lg:py-20">
            
            {/* Left Content */}
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              {/* Small Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{ 
                  backgroundColor: `${colors.textLight}20`, 
                  border: `1px solid ${colors.textLight}40`,
                  color: colors.textLight
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <FiPackage />
                <span className="text-sm font-semibold">
                  {t.trustedSince}
                </span>
              </motion.div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="overflow-hidden"
                >
                  <span className="block" style={{ color: colors.textLight }}>
                    I&M COURIER
                  </span>
                  <span className="block mt-2" style={{
                    color: colors.secondary,
                    textShadow: `0 0 20px ${colors.secondary}40`
                  }}>
                    GENERAL SUPPLIER
                  </span>
                </motion.div>
              </h1>

              {/* Subtitle */}
              <motion.p
                className="text-lg sm:text-xl md:text-2xl mb-8 leading-relaxed"
                style={{ color: `${colors.textLight}90` }}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
              >
                {t.revolutionizing}{' '}
                <span className="font-bold" style={{ color: colors.secondary }}>
                  {t.speedPrecision}
                </span>
                {' '}{t.and}{' '}
                <span className="font-bold" style={{ color: colors.secondary }}>
                  {t.reliability}
                </span>
              </motion.p>

              {/* Stats Mini Cards */}
              <motion.div
                className="grid grid-cols-3 gap-3 sm:gap-4 mb-8"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    className="p-3 sm:p-4 rounded-xl backdrop-blur-sm border"
                    style={{
                      backgroundColor: `${colors.textLight}15`,
                      borderColor: `${colors.textLight}30`,
                      color: colors.textLight
                    }}
                    variants={fadeInUp}
                    whileHover={{ 
                      scale: 1.05, 
                      borderColor: colors.secondary,
                      backgroundColor: `${colors.secondary}20`
                    }}
                  >
                    <div className="text-xl sm:text-2xl font-bold" style={{ color: colors.secondary }}>
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm opacity-90">
                      {t[stat.labelKey]}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.2 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/track"
                    className="group inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{
                      backgroundColor: colors.secondary,
                      color: colors.textLight
                    }}
                  >
                    {t.trackPackage}
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold border-2 hover:shadow-xl transition-all duration-300"
                    style={{
                      borderColor: colors.textLight,
                      color: colors.textLight,
                      backgroundColor: 'transparent'
                    }}
                  >
                    {t.contactUs}
                  </Link>
                </motion.div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                className="flex justify-center lg:justify-start gap-3 sm:gap-4 mt-8"
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
                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border transition-all duration-300"
                    style={{ 
                      borderColor: `${colors.textLight}40`, 
                      color: colors.textLight,
                      backgroundColor: 'transparent'
                    }}
                    whileHover={{
                      scale: 1.1,
                      borderColor: colors.secondary,
                      backgroundColor: colors.secondary
                    }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Side - Video/Image */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              style={{
                x: mousePosition.x,
                y: mousePosition.y,
              }}
              className="relative mt-8 lg:mt-0"
            >
              <div className="relative z-10 rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl" style={{ 
                border: `3px solid ${colors.secondary}`,
                backgroundColor: colors.cardBg
              }}>
                {/* Video/Image Container */}
                <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden">
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
                    {/* Fallback image */}
                    <img 
                      src="https://images.pexels.com/photos/4483775/pexels-photo-4483775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                      alt="Logistics and delivery"
                      className="w-full h-full object-cover"
                    />
                  </video>

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                {/* Location Badge */}
                <motion.div
                  variants={pulseLocation}
                  initial={{ opacity: 0, y: 20 }}
                  animate="visible"
                  className="absolute bottom-4 left-4 right-4 p-3 sm:p-4 rounded-xl backdrop-blur-sm border"
                  style={{
                    backgroundColor: `${colors.primary}95`,
                    borderColor: colors.secondary,
                    color: colors.textLight
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: colors.secondary,
                        color: colors.textLight 
                      }}
                    >
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <p className="font-bold text-sm sm:text-base">Ubungo Urafiki</p>
                      <p className="text-xs sm:text-sm opacity-90">Dar es Salaam, Tanzania</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-20 relative overflow-hidden transition-colors duration-300" style={{ backgroundColor: colors.light }}>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            className="text-center mb-12 lg:mb-16"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="inline-block px-4 py-2 rounded-full mb-4 transition-colors duration-300"
              style={{ 
                backgroundColor: `${colors.primary}10`, 
                color: colors.primary,
                border: `1px solid ${colors.primary}20`
              }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
            >
              <span className="font-semibold">{t.whatWeOffer}</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 transition-colors duration-300" style={{ color: colors.textPrimary }}>
              {t.comprehensive}{' '}<span style={{ color: colors.primary }}>{t.logisticsSolutions}</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto transition-colors duration-300" style={{ color: colors.textSecondary }}>
              {t.servicesDesc}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                className="group relative p-6 rounded-2xl transition-all duration-300 hover:shadow-2xl"
                style={{ 
                  backgroundColor: colors.cardBg,
                  border: `2px solid ${colors.cardBorder}`,
                  color: colors.textPrimary
                }}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  borderColor: colors.primary,
                  y: -8,
                  boxShadow: `0 20px 40px ${colors.primary}20`
                }}
              >
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-xl mb-4 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ 
                    backgroundColor: `${colors.primary}10`,
                    color: colors.primary
                  }}
                >
                  <div className="text-2xl">
                    {service.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3 transition-colors duration-300" style={{ color: colors.textPrimary }}>
                  {t[service.titleKey]}
                </h3>
                <p className="transition-colors duration-300" style={{ color: colors.textSecondary }}>{t[service.descKey]}</p>
                
                {/* Hover Indicator */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 rounded-full"
                  style={{ backgroundColor: colors.secondary }}
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-20 transition-colors duration-300" style={{ backgroundColor: colors.lightGray }}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl border-2" style={{ borderColor: colors.primary }}>
                <img
                  src="https://images.pexels.com/photos/4483775/pexels-photo-4483775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Professional logistics team"
                  className="w-full h-auto object-cover"
                />
                {/* Stats Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-sm" 
                  style={{ 
                    backgroundColor: `${colors.primary}95`,
                    color: colors.textLight
                  }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">50+</div>
                      <div className="text-sm opacity-90">Years Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">100%</div>
                      <div className="text-sm opacity-90">Client Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 transition-colors duration-300" style={{ color: colors.textPrimary }}>
                {t.whyChooseUs}{' '}<span style={{ color: colors.primary }}>{t.companyName}</span>?
              </h2>
              
              <motion.div 
                className="space-y-4" 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {t.features.map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl transition-colors duration-300"
                    style={{ 
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.cardBorder}`,
                      color: colors.textPrimary
                    }}
                    variants={fadeInUp}
                    whileHover={{ 
                      x: 5,
                      borderColor: colors.secondary,
                      boxShadow: `0 10px 25px ${colors.secondary}20`
                    }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1"
                      style={{ 
                        backgroundColor: colors.secondary,
                        color: colors.textLight
                      }}
                    >
                      <FaCheckCircle className="text-sm" />
                    </div>
                    <span className="transition-colors duration-300">{item}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div className="mt-8" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ 
                    backgroundColor: colors.secondary,
                    color: colors.textLight
                  }}
                >
                  {t.learnMore}
                  <FiArrowRight />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative py-16 lg:py-20 overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 transition-colors duration-300" style={{
          background: `linear-gradient(135deg, ${colors.primaryDark}, ${colors.secondary})`
        }}></div>
        
        {/* Subtle Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(${colors.textLight} 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 transition-colors duration-300"
              style={{ color: colors.textLight }}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {t.readyToShip}
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl mb-8 transition-colors duration-300"
              style={{ color: `${colors.textLight}95` }}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {t.joinCustomers}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.a
                href="tel:+255693212091"
                className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ 
                  backgroundColor: colors.textLight, 
                  color: colors.primary,
                  border: `2px solid ${colors.textLight}`
                }}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: colors.secondary,
                  color: colors.textLight
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPhoneAlt />
                <span className="font-semibold">+255 693 212 091</span>
              </motion.a>
              <motion.a
                href="mailto:issaimcourier@gmail.com"
                className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold border-2 hover:shadow-xl transition-all duration-300"
                style={{ 
                  borderColor: colors.textLight, 
                  color: colors.textLight,
                  backgroundColor: 'transparent'
                }}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: colors.textLight,
                  color: colors.secondary
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEnvelope />
                <span className="font-semibold">{t.emailUs}</span>
              </motion.a>
            </motion.div>

            <motion.p
              className="mt-8 text-base sm:text-lg transition-colors duration-300"
              style={{ color: `${colors.textLight}90` }}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {t.serving}
            </motion.p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;