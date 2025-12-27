import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock,
  FaTiktok,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaTruck,
  FaShippingFast,
  FaGlobe,
  FaShieldAlt
} from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const Footer = () => {
  const { darkMode, language, t } = useApp();

  // HIGH CONTRAST color schemes (matching Header/Home)
  const lightColors = {
    primary: '#0D47A1',       // Deep dark blue
    primaryDark: '#0A3575',   // Darker blue
    secondary: '#D32F2F',     // Bright red
    light: '#FFFFFF',
    dark: '#212121',          // Very dark text
    gray: '#424242',          // Medium gray
    lightGray: '#F5F5F5',
    cardBg: '#FFFFFF',
    textPrimary: '#212121',
    textSecondary: '#424242',
    textLight: '#FFFFFF'
  };

  const darkColors = {
    primary: '#2196F3',       // Bright blue
    primaryDark: '#1976D2',   // Darker blue
    secondary: '#F44336',     // Bright red
    light: '#121212',         // Very dark background
    dark: '#FFFFFF',          // White text
    gray: '#B0B0B0',          // Light gray
    lightGray: '#1E1E1E',
    cardBg: '#1E1E1E',
    textPrimary: '#FFFFFF',
    textSecondary: '#E0E0E0',
    textLight: '#FFFFFF'
  };

  const colors = darkMode ? darkColors : lightColors;

  // Footer translations - integrate with main translations
  const footerTranslations = {
    en: {
      // Main translations from context
      home: "Home",
      about: "About Us",
      services: "Services",
      book: "Book Delivery",
      track: "Track Shipment",
      pricing: "Pricing",
      contact: "Contact",
      domesticCourier: "Domestic Courier",
      intlShipping: "International Shipping",
      airFreight: "Express Air Freight",
      warehousing: "Warehousing",
      packaging: "Packaging & Removal",
      clearing: "Clearing & Forwarding",
      
      // Footer specific translations
      quickLinks: "Quick Links",
      ourServices: "Our Services",
      contactInfo: "Contact Info",
      workingHours: "Working Hours",
      companyDesc: "I&M Courier and General Supplier Limited - Your trusted logistics partner across Tanzania and beyond.",
      rights: "All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      followUs: "Follow Us",
      subscribe: "Subscribe to our newsletter",
      subscribePlaceholder: "Enter your email",
      subscribeButton: "Subscribe",
      address: "Ubungo Urafiki, Dar es Salaam, Tanzania",
      phone: "+255 693 212 091",
      email: "issaimcourier@gmail.com",
      hoursWeekdays: "Mon - Fri: 8:00 AM - 6:00 PM",
      hoursSaturday: "Sat: 9:00 AM - 4:00 PM",
      hoursSunday: "Sun: Emergency Services Only",
      madeWithLove: "Developed by:",
      inTanzania: "Shaibu Mzogo"
    },
    sw: {
      // Main translations from context
      home: "Nyumbani",
      about: "Kuhusu Sisi",
      services: "Huduma",
      book: "Hifadhi Usafirishaji",
      track: "Fuatilia Mzigo",
      pricing: "Bei",
      contact: "Mawasiliano",
      domesticCourier: "Usafirishaji Ndani",
      intlShipping: "Usafirishaji Kimataifa",
      airFreight: "Usafirishaji wa Haraka Kwa Ndege",
      warehousing: "Hifadhi",
      packaging: "Ufungaji & Uhamisho",
      clearing: "Usafishaji & Upelelezi",
      
      // Footer specific translations
      quickLinks: "Viungo Vya Haraka",
      ourServices: "Huduma Zetu",
      contactInfo: "Maelezo Ya Mawasiliano",
      workingHours: "Masaa Ya Kazi",
      companyDesc: "I&M Courier na Msajili wa Bidhaa Kwa Ujumla - Mshirika wako wa kusadikika katika usafirishaji Tanzania na zaidi.",
      rights: "Haki zimehifadhiwa.",
      privacy: "Sera ya Faragha",
      terms: "Masharti ya Huduma",
      followUs: "Tufuate",
      subscribe: "Jiandikishe kwa jarida letu",
      subscribePlaceholder: "Weka barua pepe yako",
      subscribeButton: "Jiandikishe",
      address: "Ubungo Urafiki, Dar es Salaam, Tanzania",
      phone: "+255 693 212 091",
      email: "issaimcourier@gmail.com",
      hoursWeekdays: "Jumatatu - Ijumaa: 8:00 Asubuhi - 6:00 Usiku",
      hoursSaturday: "Jumamosi: 9:00 Asubuhi - 4:00 Usiku",
      hoursSunday: "Jumapili: Huduma za Dharura Pekee",
      madeWithLove: "Imetengenezwa na:",
      inTanzania: "Shaibu Mzogo"
    }
  };

  // Get footer translations based on current language
  const ft = footerTranslations[language];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <footer 
      className="transition-colors duration-300"
      style={{ 
        backgroundColor: colors.light,
        color: colors.textPrimary,
        borderTop: `3px solid ${colors.secondary}`
      }}
    >
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company Info */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3"
                style={{ 
                  backgroundColor: colors.secondary,
                  color: colors.textLight
                }}
              >
                <FaTruck className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: colors.primary }}>
                  {t.company || "I&M COURIER"}
                </h3>
                <p className="text-sm font-semibold" style={{ color: colors.secondary }}>
                  {t.tagline || "AND GENERAL SUPPLIER"}
                </p>
              </div>
            </div>
            
            <p className="mb-6" style={{ color: colors.textSecondary }}>
              {ft.companyDesc}
            </p>
            
            {/* Social Links */}
            <div>
              <h4 className="font-bold mb-4" style={{ color: colors.textPrimary }}>{ft.followUs}</h4>
              <div className="flex space-x-3">
                {[
                  { icon: <FaTiktok />, href: 'https://www.tiktok.com/@landmcourierlogistics', label: 'TikTok' },
                  { icon: <FaInstagram />, href: 'https://instagram.com/landmcourierservice', label: 'Instagram' },
                  { icon: <FaFacebook />, href: '#', label: 'Facebook' },
                  { icon: <FaTwitter />, href: '#', label: 'Twitter' },
                  { icon: <FaLinkedin />, href: '#', label: 'LinkedIn' }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{ 
                      backgroundColor: colors.lightGray,
                      color: colors.primary,
                      border: `1px solid ${colors.primary}30`
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      backgroundColor: colors.secondary,
                      color: colors.textLight
                    }}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-lg font-bold mb-6 pb-2 border-b" 
              style={{ 
                color: colors.primary,
                borderColor: `${colors.primary}30`
              }}
            >
              {ft.quickLinks}
            </h4>
            
            <ul className="space-y-3">
              {[
                { path: "/", labelKey: "home" },
                { path: "/about", labelKey: "about" },
                { path: "/services", labelKey: "services" },
                { path: "/book", labelKey: "book" },
                { path: "/track", labelKey: "track" },
                { path: "/contact", labelKey: "contact" }
              ].map((link, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Link
                    to={link.path}
                    className="flex items-center group transition-colors duration-300"
                    style={{ color: colors.textSecondary }}
                  >
                    <div className="w-2 h-2 rounded-full mr-3 transition-all duration-300 group-hover:scale-125"
                      style={{ backgroundColor: colors.secondary }}
                    />
                    <span className="group-hover:font-semibold transition-all duration-300">
                      {ft[link.labelKey]}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-bold mb-6 pb-2 border-b" 
              style={{ 
                color: colors.primary,
                borderColor: `${colors.primary}30`
              }}
            >
              {ft.ourServices}
            </h4>
            
            <ul className="space-y-3">
              {[
                { icon: <FaTruck />, labelKey: "domesticCourier" },
                { icon: <FaGlobe />, labelKey: "intlShipping" },
                { icon: <FaShippingFast />, labelKey: "airFreight" },
                { icon: <FaShieldAlt />, labelKey: "warehousing" },
                { icon: <FaTruck />, labelKey: "packaging" },
                { icon: <FaShieldAlt />, labelKey: "clearing" }
              ].map((service, index) => (
                <motion.li 
                  key={index}
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-colors duration-300"
                    style={{ 
                      backgroundColor: `${colors.primary}10`,
                      color: colors.primary
                    }}
                  >
                    {service.icon}
                  </div>
                  <span style={{ color: colors.textSecondary }}>
                    {ft[service.labelKey]}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-bold mb-6 pb-2 border-b" 
              style={{ 
                color: colors.primary,
                borderColor: `${colors.primary}30`
              }}
            >
              {ft.contactInfo}
            </h4>
            
            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                  style={{ 
                    backgroundColor: `${colors.secondary}20`,
                    color: colors.secondary
                  }}
                >
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    {ft.address}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                  style={{ 
                    backgroundColor: `${colors.secondary}20`,
                    color: colors.secondary
                  }}
                >
                  <FaPhoneAlt />
                </div>
                <div>
                  <a 
                    href="tel:+255693212091"
                    className="font-semibold hover:underline transition-colors duration-300"
                    style={{ color: colors.textPrimary }}
                  >
                    {ft.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                  style={{ 
                    backgroundColor: `${colors.secondary}20`,
                    color: colors.secondary
                  }}
                >
                  <FaEnvelope />
                </div>
                <div>
                  <a 
                    href="mailto:issaimcourier@gmail.com"
                    className="font-semibold hover:underline transition-colors duration-300"
                    style={{ color: colors.textPrimary }}
                  >
                    {ft.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <h4 className="text-lg font-bold mb-4 mt-8 pb-2 border-b" 
              style={{ 
                color: colors.primary,
                borderColor: `${colors.primary}30`
              }}
            >
              {ft.workingHours}
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                  style={{ 
                    backgroundColor: `${colors.primary}10`,
                    color: colors.primary
                  }}
                >
                  <FaClock />
                </div>
                <span style={{ color: colors.textSecondary }}>{ft.hoursWeekdays}</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                  style={{ 
                    backgroundColor: `${colors.primary}10`,
                    color: colors.primary
                  }}
                >
                  <FaClock />
                </div>
                <span style={{ color: colors.textSecondary }}>{ft.hoursSaturday}</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                  style={{ 
                    backgroundColor: `${colors.primary}10`,
                    color: colors.primary
                  }}
                >
                  <FaClock />
                </div>
                <span style={{ color: colors.textSecondary }}>{ft.hoursSunday}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Newsletter Subscription */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t"
          style={{ borderColor: `${colors.primary}20` }}
        >
          <div className="max-w-lg mx-auto">
            <h4 className="text-xl font-bold text-center mb-4" style={{ color: colors.textPrimary }}>
              {ft.subscribe}
            </h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder={ft.subscribePlaceholder}
                className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
                style={{
                  backgroundColor: colors.lightGray,
                  color: colors.textPrimary,
                  border: `1px solid ${colors.primary}30`,
                  boxShadow: `0 2px 4px ${colors.primary}10`
                }}
              />
              <motion.button
                className="px-6 py-3 rounded-lg font-bold transition-all duration-300"
                style={{
                  backgroundColor: colors.secondary,
                  color: colors.textLight
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {ft.subscribeButton}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div 
        className="py-6 border-t"
        style={{ 
          backgroundColor: colors.primaryDark,
          borderColor: `${colors.primary}30`,
          color: colors.textLight
        }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm">
                © {new Date().getFullYear()} I&M Courier and General Supplier Limited. {ft.rights}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/privacy"
                className="text-sm hover:underline transition-colors duration-300"
                style={{ color: colors.textLight }}
              >
                {ft.privacy}
              </Link>
              <Link 
                to="/terms"
                className="text-sm hover:underline transition-colors duration-300"
                style={{ color: colors.textLight }}
              >
                {ft.terms}
              </Link>
              <div className="flex items-center">
                <span className="text-sm mr-2">{ft.madeWithLove}</span>
                <span className="text-sm ml-2">{ft.inTanzania}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;