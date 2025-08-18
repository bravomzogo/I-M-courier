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

  // Navigation items with potential dropdowns
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
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      dropdown: [
        { path: "/about/company", name: "Our Company", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
        { path: "/about/team", name: "Our Team", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
        { path: "/about/values", name: "Our Values", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }
      ]
    },
    { 
      path: "/services", 
      name: "Services",
      icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
      dropdown: [
        { path: "/services/courier", name: "Courier Services", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
        { path: "/services/supply", name: "General Supply", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
        { path: "/services/logistics", name: "Logistics Solutions", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
        { path: "/areas", name: "Service Areas", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" }
      ]
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
                    onMouseEnter={() => item.dropdown && handleDropdownEnter(index)}
                    onMouseLeave={handleDropdownLeave}
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
                      
                      {item.dropdown && (
                        <motion.svg 
                          className={`ml-1 w-4 h-4 ${
                            isScrolled 
                              ? isActive(item.path, item.exact)
                                ? 'text-primary'
                                : 'text-gray-500'
                              : isActive(item.path, item.exact)
                                ? 'text-white'
                                : 'text-gray-300'
                          }`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          animate={{ rotate: activeDropdown === index ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      )}
                    </Link>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {item.dropdown && activeDropdown === index && (
                        <motion.div 
                          className={`absolute left-0 mt-2 w-56 rounded-lg shadow-xl z-50 overflow-hidden ${
                            isScrolled 
                              ? 'bg-white border border-gray-200' 
                              : 'bg-gray-800 border border-gray-700'
                          }`}
                          style={{
                            backgroundColor: isScrolled ? colors.light : colors.secondary,
                            borderColor: isScrolled ? colors.lightGray : colors.secondaryLight
                          }}
                          variants={dropdownVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                        >
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className={`block px-4 py-3 transition-colors duration-200 border-b ${
                                isActive(subItem.path)
                                  ? isScrolled
                                    ? 'bg-primary bg-opacity-20 text-primary font-medium border-primary border-opacity-20'
                                    : 'bg-primary text-white font-medium border-primary border-opacity-30'
                                  : isScrolled
                                    ? 'text-gray-700 hover:bg-primary hover:bg-opacity-10 border-gray-100'
                                    : 'text-gray-200 hover:bg-primary hover:bg-opacity-20 border-gray-700'
                              }`}
                              style={{
                                backgroundColor: isActive(subItem.path)
                                  ? isScrolled
                                    ? `${colors.primary}20`
                                    : colors.primary
                                  : 'transparent',
                                color: isActive(subItem.path)
                                  ? isScrolled
                                    ? colors.primaryDark
                                    : colors.light
                                  : isScrolled
                                    ? colors.dark
                                    : colors.lightGray,
                                borderColor: isScrolled ? colors.lightGray : colors.secondaryLight
                              }}
                            >
                              <div className="flex items-center">
                                <svg 
                                  className="w-4 h-4 mr-3" 
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={subItem.icon} />
                                </svg>
                                {subItem.name}
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                      {item.dropdown ? (
                        <div className="relative">
                          <motion.button
                            onClick={() => setActiveDropdown(activeDropdown === item.path ? null : item.path)}
                            className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between ${
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
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-center">
                              <svg 
                                className="w-5 h-5 mr-3" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                              </svg>
                              {item.name}
                            </div>
                            <motion.svg 
                              className="ml-2 w-4 h-4" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                              animate={{ rotate: activeDropdown === item.path ? 180 : 0 }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </motion.svg>
                          </motion.button>
                          <AnimatePresence>
                            {activeDropdown === item.path && (
                              <motion.div 
                                className="mt-1 ml-8 space-y-1"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                {item.dropdown.map((subItem) => (
                                  <Link
                                    key={subItem.path}
                                    to={subItem.path}
                                    className={`block px-4 py-2.5 rounded-lg text-sm flex items-center ${
                                      isActive(subItem.path)
                                        ? isScrolled
                                          ? 'bg-primary bg-opacity-20 text-primary font-medium'
                                          : 'bg-primary text-white font-medium'
                                        : isScrolled
                                          ? 'text-gray-700 hover:bg-primary hover:bg-opacity-10'
                                          : 'text-gray-200 hover:bg-primary hover:bg-opacity-20'
                                    }`}
                                    style={{
                                      backgroundColor: isActive(subItem.path)
                                        ? isScrolled
                                          ? `${colors.primary}20`
                                          : colors.primary
                                        : 'transparent',
                                      color: isActive(subItem.path)
                                        ? isScrolled
                                          ? colors.primaryDark
                                          : colors.light
                                        : isScrolled
                                          ? colors.dark
                                          : colors.lightGray
                                    }}
                                    onClick={() => {
                                      setMobileMenuOpen(false);
                                      setActiveDropdown(null);
                                    }}
                                  >
                                    <svg 
                                      className="w-4 h-4 mr-3" 
                                      fill="none" 
                                      viewBox="0 0 24 24" 
                                      stroke="currentColor"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={subItem.icon} />
                                    </svg>
                                    {subItem.name}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
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
                      )}
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