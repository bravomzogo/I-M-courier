import { motion } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  // Dark theme color scheme (Facebook-like)
  const colors = {
    darkBg: '#18191A',       // Dark background
    darkCard: '#242526',     // Card background
    darkText: '#E4E6EB',     // Primary text
    mutedText: '#B0B3B8',    // Secondary text
    primary: '#2374E1',      // Facebook blue
    primaryHover: '#3A86E9', // Lighter blue
    secondary: '#E41E3F',    // Accent red
    success: '#31A24C',      // Green for success
    divider: '#3E4042',      // Divider lines
    highlight: '#3A3B3C'     // Hover states
  };

  // Footer links data
  const footerLinks = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Services', path: '/services' },
        { name: 'Tracking', path: '/track' },
        { name: 'Pricing', path: '/pricing' }
      ]
    },
    {
      title: 'Services',
      links: [
        { name: 'Courier Services', path: '/services/courier' },
        { name: 'General Supply', path: '/services/supply' },
        { name: 'Logistics', path: '/services/logistics' },
        { name: 'Express Delivery', path: '/services/express' },
        { name: 'Warehousing', path: '/services/warehousing' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Contact Us', path: '/contact' },
        { name: 'FAQs', path: '/faqs' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Shipping Policy', path: '/shipping' }
      ]
    }
  ];

  // Social media links
  const socialLinks = [
    { icon: <FaFacebook className="text-xl" />, path: 'https://facebook.com', color: '#1877F2', label: 'Facebook' },
    { icon: <FaTwitter className="text-xl" />, path: 'https://twitter.com', color: '#1DA1F2', label: 'Twitter' },
    { icon: <FaInstagram className="text-xl" />, path: 'https://instagram.com', color: '#E4405F', label: 'Instagram' },
    { icon: <FaLinkedin className="text-xl" />, path: 'https://linkedin.com', color: '#0A66C2', label: 'LinkedIn' }
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    },
    hover: {
      scale: 1.05,
      color: colors.primary,
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  const socialVariants = {
    hover: {
      scale: 1.2,
      rotate: 10,
      transition: { type: 'spring', stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.9 }
  };

  return (
    <motion.footer
      className="w-full font-sans antialiased"
      style={{ backgroundColor: colors.darkBg }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={sectionVariants}
    >
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div variants={sectionVariants} className="flex flex-col items-center md:items-start">
            <motion.div
              className="mb-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <h2 className="text-3xl font-bold flex items-center">
                <span style={{ color: colors.darkText }}>I&M</span>
                <span style={{ color: colors.primary, marginLeft: '0.25rem' }}>COURIER</span>
              </h2>
              <p className="text-sm" style={{ color: colors.mutedText }}>
                AND GENERAL SUPPLIER LIMITED
              </p>
            </motion.div>
            <motion.p
              className="text-base text-center md:text-left max-w-xs"
              style={{ color: colors.mutedText }}
              variants={itemVariants}
            >
              Your trusted partner for fast and reliable courier services and general supply solutions.
            </motion.p>
            <motion.div className="flex space-x-4 mt-6" variants={sectionVariants}>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="p-3 rounded-full"
                  style={{ backgroundColor: social.color, color: colors.darkText }}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center md:items-start"
              variants={sectionVariants}
            >
              <h3
                className="text-xl font-semibold mb-4"
                style={{ color: colors.darkText, borderBottom: `2px solid ${colors.primary}` }}
              >
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={linkIndex}
                    variants={itemVariants}
                    whileHover="hover"
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Link
                      to={link.path}
                      className="text-base transition-colors duration-200"
                      style={{ color: colors.mutedText }}
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Info */}
          <motion.div className="flex flex-col items-center md:items-start" variants={sectionVariants}>
            <h3
              className="text-xl font-semibold mb-4"
              style={{ color: colors.darkText, borderBottom: `2px solid ${colors.primary}` }}
            >
              Contact Us
            </h3>
            <ul className="space-y-4">
              {[
                {
                  icon: <FaPhoneAlt className="text-lg" />,
                  text: '+255 123 456 789',
                  color: colors.primary
                },
                {
                  icon: <FaEnvelope className="text-lg" />,
                  text: 'info@imcourier.com',
                  color: colors.primary
                },
                {
                  icon: <FaMapMarkerAlt className="text-lg" />,
                  text: '123 Posta Street, Dar es Salaam, Tanzania',
                  color: colors.primary
                },
                {
                  icon: <FaClock className="text-lg" />,
                  text: 'Mon-Fri: 8AM - 6PM\nSat: 9AM - 2PM',
                  color: colors.primary
                }
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start space-x-3"
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                >
                  <div style={{ color: item.color }}>{item.icon}</div>
                  <span
                    className="text-base whitespace-pre-line"
                    style={{ color: colors.mutedText }}
                  >
                    {item.text}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="border-t pt-6 text-center"
          style={{ borderColor: colors.divider }}
          variants={sectionVariants}
        >
          <p style={{ color: colors.mutedText }}>
            &copy; {new Date().getFullYear()} I&M Courier and General Supplier Limited. All Rights Reserved.
          </p>
          <motion.p
            className="text-sm mt-2"
            style={{ color: colors.mutedText }}
            variants={itemVariants}
            whileHover={{ color: colors.primary }}
          >
            Designed for Tanzania's logistics needs
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;