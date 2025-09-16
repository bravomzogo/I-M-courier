import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logoo.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const location = useLocation();
  const headerRef = useRef(null);
  const dropdownTimeout = useRef(null);

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

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation items without dropdowns for About Us and Services
  const navItems = [
    { 
      path: "/", 
      name: "Home",
      exact: true,
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    },
    { 
      path: "/about", 
      name: "About Us",
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    },
    { 
      path: "/services", 
      name: "Services",
      icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
    },
    { 
      path: "/book", 
      name: "Book Delivery",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    },
    { 
      path: "/track", 
      name: "Track Shipment",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    },
    { 
      path: "/pricing", 
      name: "Pricing",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    },
    { 
      path: "/contact", 
      name: "Contact",
      icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    }
  ];

  const handleDropdownEnter = (index) => {
    clearTimeout(dropdownTimeout.current);
    setActiveDropdown(index);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
  };

  const isActive = (path, exact = false) => {
    return exact ? location.pathname === path : location.pathname.startsWith(path);
  };

  // Animation variants
  const menuVariants = {
    open: { 
      opacity: 1,
      height: "auto",
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    closed: { 
      opacity: 0,
      height: 0,
      transition: { 
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren"
      }
    }
  };

  const itemVariants = {
    open: { 
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    closed: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  const dropdownVariants = {
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", bounce: 0, duration: 0.4 }
    },
    closed: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    },
    exit: { opacity: 0, scale: 0.8 }
  };

  const hoverEffect = {
    scale: 1.05,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  };

  const tapEffect = {
    scale: 0.95,
    transition: { duration: 0.1 }
  };

  return (
    <>
      <motion.header 
        ref={headerRef}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-lg py-2 border-b border-opacity-10'
            : 'bg-gradient-to-b from-gray-900 to-gray-800 py-4'
        }`}
        style={{
          backgroundColor: isScrolled ? colors.light : colors.secondary,
          borderColor: isScrolled ? colors.primary + '30' : 'transparent'
        }}
      >
        <div className="container mx-auto px-4 xl:px-0">
          <div className="flex justify-between items-center">
            {/* Logo and Company Name */}
            <div 
              className="flex items-center space-x-3 group cursor-pointer"
              onClick={() => setLogoModalOpen(true)}
              aria-label="View company logo"
            >
              <motion.div 
                className={`relative rounded-full p-1 transition-all duration-300 ${
                  isScrolled ? 'bg-white shadow-md' : 'bg-white bg-opacity-10'
                }`}
                whileHover={hoverEffect}
                whileTap={tapEffect}
              >
                <motion.img 
                  src={logo} 
                  alt="I&M Courier and General Supplier Limited Logo"
                  className="h-12 w-auto"
                />
                {!isScrolled && (
                  <motion.div 
                    className="absolute inset-0 rounded-full border-2 border-primary border-opacity-30"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.1, opacity: 0 }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                )}
              </motion.div>
              
              <div className="hidden md:block">
                <motion.h1 
                  className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
                    isScrolled ? 'text-gray-900' : 'text-white'
                  }`}
                  style={{ 
                    color: isScrolled ? colors.dark : colors.light,
                    textShadow: !isScrolled ? `0 2px 4px rgba(0,0,0,0.3)` : 'none'
                  }}
                >
                  I&M COURIER
                </motion.h1>
                <motion.p 
                  className={`text-xs font-medium transition-colors duration-300 ${
                    isScrolled ? 'text-gray-600' : 'text-gray-300'
                  }`}
                  style={{ 
                    color: isScrolled ? colors.gray : colors.lightGray,
                    textShadow: !isScrolled ? `0 1px 2px rgba(0,0,0,0.2)` : 'none'
                  }}
                >
                  AND GENERAL SUPPLIER LIMITED
                </motion.p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block">
              <ul className="flex space-x-1 items-center">
                {navItems.map((item, index) => (
                  <motion.li 
                    key={item.path}
                    className="relative"
                    whileHover={{ scale: 1.03 }}
                  >
                    <Link
                      to={item.path}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center ${
                        isActive(item.path, item.exact)
                          ? isScrolled
                            ? 'bg-primary bg-opacity-20 text-primary font-semibold'
                            : 'bg-primary text-white font-semibold'
                          : isScrolled
                            ? 'text-gray-700 hover:bg-primary hover:bg-opacity-10 hover:text-primary'
                            : 'text-gray-200 hover:bg-primary hover:bg-opacity-30 hover:text-white'
                      }`}
                      style={{
                        backgroundColor: isActive(item.path, item.exact) 
                          ? isScrolled 
                            ? `${colors.primary}20`
                            : colors.primary
                          : 'transparent',
                        color: isActive(item.path, item.exact)
                          ? isScrolled
                            ? colors.primaryDark
                            : colors.light
                          : isScrolled
                            ? colors.dark
                            : colors.lightGray
                      }}
                      whileHover={hoverEffect}
                      whileTap={tapEffect}
                    >
                      {/* Icon */}
                      <svg 
                        className={`w-5 h-5 mr-2 ${
                          isActive(item.path, item.exact) 
                            ? isScrolled 
                              ? 'text-primary' 
                              : 'text-white'
                            : isScrolled 
                              ? 'text-gray-600' 
                              : 'text-gray-300'
                        }`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden space-x-4">
              <motion.div
                whileHover={hoverEffect}
                whileTap={tapEffect}
              >
                <Link 
                  to="/track" 
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm flex items-center ${
                    isScrolled
                      ? 'bg-primary text-white hover:bg-primaryDark'
                      : 'bg-primary text-white hover:bg-primaryDark'
                  }`}
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.dark
                  }}
                >
                  <svg 
                    className="w-4 h-4 mr-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Track
                </Link>
              </motion.div>
              <motion.button 
                className="p-2 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                whileHover={hoverEffect}
                whileTap={tapEffect}
              >
                <div className="w-6 flex flex-col space-y-1.5">
                  <motion.span 
                    className={`h-0.5 w-full rounded-full ${
                      isScrolled || mobileMenuOpen ? 'bg-gray-800' : 'bg-white'
                    }`}
                    animate={{ 
                      rotate: mobileMenuOpen ? 45 : 0,
                      y: mobileMenuOpen ? 8 : 0,
                      backgroundColor: isScrolled || mobileMenuOpen ? colors.dark : colors.light
                    }}
                  />
                  <motion.span 
                    className={`h-0.5 w-full rounded-full ${
                      isScrolled || mobileMenuOpen ? 'bg-gray-800' : 'bg-white'
                    }`}
                    animate={{ 
                      opacity: mobileMenuOpen ? 0 : 1,
                      backgroundColor: isScrolled || mobileMenuOpen ? colors.dark : colors.light
                    }}
                  />
                  <motion.span 
                    className={`h-0.5 w-full rounded-full ${
                      isScrolled || mobileMenuOpen ? 'bg-gray-800' : 'bg-white'
                    }`}
                    animate={{ 
                      rotate: mobileMenuOpen ? -45 : 0,
                      y: mobileMenuOpen ? -8 : 0,
                      backgroundColor: isScrolled || mobileMenuOpen ? colors.dark : colors.light
                    }}
                  />
                </div>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                className="lg:hidden overflow-hidden"
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                style={{
                  backgroundColor: isScrolled ? colors.light : colors.secondary,
                  borderTop: isScrolled ? `1px solid ${colors.lightGray}` : `1px solid ${colors.secondaryLight}`
                }}
              >
                <motion.ul className="flex flex-col space-y-1 px-4 pb-4 pt-2">
                  {navItems.map((item) => (
                    <motion.li 
                      key={item.path}
                      variants={itemVariants}
                    >
                      <Link
                        to={item.path}
                        className={`block px-4 py-3 rounded-lg flex items-center ${
                          isActive(item.path)
                            ? isScrolled
                              ? 'bg-primary bg-opacity-20 text-primary font-semibold'
                              : 'bg-primary text-white font-semibold'
                            : isScrolled
                              ? 'text-gray-800 hover:bg-primary hover:bg-opacity-10'
                              : 'text-gray-200 hover:bg-primary hover:bg-opacity-20'
                        }`}
                        style={{
                          backgroundColor: isActive(item.path)
                            ? isScrolled
                              ? `${colors.primary}20`
                              : colors.primary
                            : 'transparent',
                          color: isActive(item.path)
                            ? isScrolled
                              ? colors.primaryDark
                              : colors.light
                            : isScrolled
                              ? colors.dark
                              : colors.lightGray
                        }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <svg 
                          className="w-5 h-5 mr-3" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                        {item.name}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Logo Modal */}
      <AnimatePresence>
        {logoModalOpen && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLogoModalOpen(false)}
          >
            <motion.div
              className="bg-white rounded-xl p-8 max-w-md w-full relative"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setLogoModalOpen(false)}
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex flex-col items-center">
                <img 
                  src={logo} 
                  alt="I&M Courier and General Supplier Limited Logo" 
                  className="w-64 h-auto mb-6"
                />
                <h3 className="text-2xl font-bold text-center mb-2" style={{ color: colors.primary }}>
                  I&M COURIER
                </h3>
                <p className="text-gray-600 text-center">
                  AND GENERAL SUPPLIER LIMITED
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;