import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logoo.png';
import { 
  FaSun, FaMoon, FaGlobe, 
  FaUser, FaSignOutAlt, FaUserCircle,
  FaTachometerAlt, FaClipboardCheck, FaTruck
} from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { darkMode, language, t, toggleDarkMode, toggleLanguage } = useApp();
  const { user, logout, isAuthenticated, isDriver, isApprover } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const userMenuRef = useRef(null);

  // HIGH CONTRAST color schemes
  const lightColors = {
    primary: '#0D47A1',       // Deep dark blue
    primaryDark: '#0A3575',   // Darker blue
    secondary: '#D32F2F',     // Bright red
    success: '#2E7D32',       // Green for approved/active
    warning: '#F57C00',       // Orange for pending
    light: '#FFFFFF',
    dark: '#212121',          // Very dark text
    gray: '#616161',
    lightGray: '#F5F5F5',
    cardBg: '#FFFFFF',
    textPrimary: '#212121',
    textLight: '#FFFFFF'
  };

  const darkColors = {
    primary: '#2196F3',       // Bright blue
    primaryDark: '#1976D2',   // Darker blue
    secondary: '#F44336',     // Bright red
    success: '#4CAF50',       // Green for approved/active
    warning: '#FF9800',       // Orange for pending
    light: '#121212',         // Very dark background
    dark: '#FFFFFF',          // White text
    gray: '#B0B0B0',
    lightGray: '#1E1E1E',
    cardBg: '#1E1E1E',
    textPrimary: '#FFFFFF',
    textLight: '#FFFFFF'
  };

  const colors = darkMode ? darkColors : lightColors;

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  // Navigation items - base items for all users
  const baseNavItems = [
    { path: "/", nameKey: "home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { path: "/about", nameKey: "about", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { path: "/services", nameKey: "services", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" },
    { path: "/pricing", nameKey: "pricing", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { path: "/contact", nameKey: "contact", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" }
  ];

  // User-specific navigation items
  const userNavItems = [
    { path: "/book", nameKey: "book", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { path: "/track", nameKey: "track", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    ...(isApprover ? [{ 
      path: "/approvals", 
      nameKey: "approvals", 
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
    }] : []),
    ...(isDriver ? [{ 
      path: "/driver", 
      nameKey: "driver", 
      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
    }] : []),
    ...(isAuthenticated ? [{ 
      path: "/dashboard", 
      nameKey: "dashboard", 
      icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" 
    }] : [])
  ];

  // Combine navigation items
  const navItems = [...baseNavItems, ...userNavItems];

  const isActive = (path, exact = false) => {
    return exact ? location.pathname === path : location.pathname.startsWith(path);
  };

  // Animation variants
  const menuVariants = {
    open: { 
      opacity: 1,
      height: "auto",
      transition: { staggerChildren: 0.1 }
    },
    closed: { 
      opacity: 0,
      height: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  };

  const itemVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -20 }
  };

  // User menu items
  const userMenuItems = [
    ...(isAuthenticated ? [
      { 
        label: t.profile, 
        icon: <FaUserCircle className="w-4 h-4" />, 
        onClick: () => navigate('/dashboard'),
        type: 'link'
      },
      ...(isApprover ? [{ 
        label: t.approvals, 
        icon: <FaClipboardCheck className="w-4 h-4" />, 
        onClick: () => navigate('/approvals'),
        type: 'link'
      }] : []),
      ...(isDriver ? [{ 
        label: t.driverDashboard, 
        icon: <FaTruck className="w-4 h-4" />, 
        onClick: () => navigate('/driver'),
        type: 'link'
      }] : []),
      { 
        label: t.dashboard, 
        icon: <FaTachometerAlt className="w-4 h-4" />, 
        onClick: () => navigate('/dashboard'),
        type: 'link'
      },
      { type: 'divider' },
      { 
        label: t.logout, 
        icon: <FaSignOutAlt className="w-4 h-4" />, 
        onClick: handleLogout,
        type: 'button'
      }
    ] : [
      { 
        label: t.login, 
        icon: <FaUser className="w-4 h-4" />, 
        onClick: () => navigate('/login'),
        type: 'link'
      },
      { 
        label: t.register, 
        icon: <FaUser className="w-4 h-4" />, 
        onClick: () => navigate('/register'),
        type: 'link'
      }
    ])
  ];

  return (
    <>
      <motion.header 
        ref={headerRef}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'py-2 shadow-lg' : 'py-4'
        }`}
        style={{
          backgroundColor: colors.light,
          borderBottom: `2px solid ${colors.primary}`
        }}
      >
        <div className="container mx-auto px-4 xl:px-0">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="relative rounded-full p-1"
                style={{ 
                  backgroundColor: colors.light,
                  border: `3px solid ${colors.secondary}`
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img 
                  src={logo} 
                  alt="I&M Courier Logo"
                  className="h-10 sm:h-12 w-auto"
                />
              </motion.div>
              
              <div className="hidden md:block">
                <h1 
                  className="text-lg sm:text-xl font-bold tracking-tight"
                  style={{ color: colors.primary }}
                >
                  {t.company}
                </h1>
                <p 
                  className="text-xs font-semibold"
                  style={{ color: colors.secondary }}
                >
                  {t.tagline}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block">
              <ul className="flex items-center space-x-1">
                {navItems.map((item) => (
                  <motion.li key={item.path}>
                    <Link
                      to={item.path}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center text-sm font-semibold ${
                        isActive(item.path)
                          ? 'shadow-md'
                          : 'hover:opacity-90'
                      }`}
                      style={{
                        backgroundColor: isActive(item.path) 
                          ? colors.secondary
                          : 'transparent',
                        color: isActive(item.path)
                          ? colors.textLight
                          : colors.textPrimary,
                        border: isActive(item.path) 
                          ? `2px solid ${colors.secondary}`
                          : `1px solid ${colors.primary}20`
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg 
                        className="w-4 h-4 mr-2" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      {t[item.nameKey]}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Utility Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Language Toggle */}
              <motion.button
                onClick={toggleLanguage}
                className="p-2 rounded-lg transition-colors font-semibold"
                style={{ 
                  backgroundColor: colors.primary,
                  color: colors.textLight,
                  border: `2px solid ${colors.primary}`
                }}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: colors.secondary
                }}
                whileTap={{ scale: 0.95 }}
                aria-label={language === 'en' ? 'Switch to Swahili' : 'Switch to English'}
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <FaGlobe className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-bold hidden sm:inline">
                    {language === 'en' ? 'SW' : 'EN'}
                  </span>
                </div>
              </motion.button>

              {/* Dark Mode Toggle */}
              <motion.button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg transition-colors font-semibold"
                style={{ 
                  backgroundColor: colors.secondary,
                  color: colors.textLight,
                  border: `2px solid ${colors.secondary}`
                }}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: colors.primary
                }}
                whileTap={{ scale: 0.95 }}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <FaSun className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <FaMoon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </motion.button>

              {/* User Menu (Desktop) */}
              <div className="hidden lg:block relative" ref={userMenuRef}>
                <motion.button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="px-3 sm:px-4 py-2 rounded-md text-sm font-bold shadow-md flex items-center"
                  style={{
                    backgroundColor: isAuthenticated ? colors.success : colors.primary,
                    color: colors.textLight,
                    border: `2px solid ${isAuthenticated ? colors.success : colors.primary}`
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUser className="w-4 h-4 mr-2" />
                  {isAuthenticated ? (
                    <>
                      <span className="truncate max-w-[100px]">
                        {user?.first_name || user?.username}
                      </span>
                      {isDriver && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-yellow-600 rounded">
                          {t.driver}
                        </span>
                      )}
                      {isApprover && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-purple-600 rounded">
                          {t.approver}
                        </span>
                      )}
                    </>
                  ) : (
                    t.login
                  )}
                </motion.button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl overflow-hidden"
                      style={{
                        backgroundColor: colors.cardBg,
                        border: `2px solid ${colors.primary}`
                      }}
                    >
                      {userMenuItems.map((item, index) => (
                        item.type === 'divider' ? (
                          <div 
                            key={`divider-${index}`}
                            className="h-px my-1"
                            style={{ backgroundColor: colors.gray }}
                          />
                        ) : (
                          <motion.button
                            key={item.label}
                            onClick={() => {
                              item.onClick();
                              setUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 flex items-center space-x-3 hover:opacity-90 transition-colors"
                            style={{
                              color: colors.textPrimary,
                              borderBottom: index < userMenuItems.length - 1 ? `1px solid ${colors.gray}20` : 'none'
                            }}
                            whileHover={{ 
                              backgroundColor: colors.primary + '20',
                              paddingLeft: '1.5rem'
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                          </motion.button>
                        )
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Track Button */}
              <div className="lg:hidden">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/track" 
                    className="px-3 sm:px-4 py-2 rounded-md text-sm font-bold shadow-md flex items-center"
                    style={{
                      backgroundColor: colors.secondary,
                      color: colors.textLight,
                      border: `2px solid ${colors.secondary}`
                    }}
                  >
                    <svg 
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {t.trackBtn}
                  </Link>
                </motion.div>
              </div>

              {/* Mobile User Button */}
              <div className="lg:hidden">
                <motion.button
                  onClick={() => isAuthenticated ? setUserMenuOpen(!userMenuOpen) : navigate('/login')}
                  className="p-2 rounded-md"
                  style={{
                    backgroundColor: isAuthenticated ? colors.success : colors.primary,
                    color: colors.textLight,
                    border: `2px solid ${isAuthenticated ? colors.success : colors.primary}`
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUser className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Mobile Menu Button */}
              <motion.button 
                className="lg:hidden p-2 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-6 flex flex-col space-y-1.5">
                  <motion.span 
                    className="h-0.5 w-full rounded-full"
                    style={{ backgroundColor: colors.textPrimary }}
                    animate={{ 
                      rotate: mobileMenuOpen ? 45 : 0,
                      y: mobileMenuOpen ? 8 : 0
                    }}
                  />
                  <motion.span 
                    className="h-0.5 w-full rounded-full"
                    style={{ backgroundColor: colors.textPrimary }}
                    animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
                  />
                  <motion.span 
                    className="h-0.5 w-full rounded-full"
                    style={{ backgroundColor: colors.textPrimary }}
                    animate={{ 
                      rotate: mobileMenuOpen ? -45 : 0,
                      y: mobileMenuOpen ? -8 : 0
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
                  backgroundColor: colors.cardBg,
                  borderTop: `2px solid ${colors.primary}`
                }}
              >
                <motion.ul className="flex flex-col space-y-1 px-4 pb-4 pt-2">
                  {/* User Info at top */}
                  {isAuthenticated && (
                    <motion.div 
                      className="mb-4 p-4 rounded-lg"
                      style={{
                        backgroundColor: colors.primary + '20',
                        border: `1px solid ${colors.primary}`
                      }}
                      variants={itemVariants}
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: colors.primary }}
                        >
                          <FaUserCircle className="w-6 h-6" style={{ color: colors.textLight }} />
                        </div>
                        <div>
                          <p className="font-bold" style={{ color: colors.textPrimary }}>
                            {user?.first_name || user?.username}
                          </p>
                          <div className="flex space-x-2 mt-1">
                            {isDriver && (
                              <span 
                                className="px-2 py-0.5 text-xs font-bold rounded-full"
                                style={{ backgroundColor: colors.warning, color: colors.textLight }}
                              >
                                {t.driver}
                              </span>
                            )}
                            {isApprover && (
                              <span 
                                className="px-2 py-0.5 text-xs font-bold rounded-full"
                                style={{ backgroundColor: colors.secondary, color: colors.textLight }}
                              >
                                {t.approver}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation Items */}
                  {navItems.map((item) => (
                    <motion.li 
                      key={item.path}
                      variants={itemVariants}
                    >
                      <Link
                        to={item.path}
                        className={`block px-4 py-3 rounded-lg flex items-center font-semibold ${
                          isActive(item.path)
                            ? 'shadow-md'
                            : 'hover:opacity-90'
                        }`}
                        style={{
                          backgroundColor: isActive(item.path)
                            ? colors.secondary
                            : 'transparent',
                          color: isActive(item.path)
                            ? colors.textLight
                            : colors.textPrimary,
                          border: isActive(item.path) 
                            ? `2px solid ${colors.secondary}`
                            : `1px solid ${colors.primary}20`
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
                        {t[item.nameKey]}
                      </Link>
                    </motion.li>
                  ))}

                  {/* Authentication Links */}
                  <motion.div className="pt-4 border-t" style={{ borderColor: colors.gray }}>
                    {isAuthenticated ? (
                      <>
                        <motion.button
                          onClick={() => {
                            navigate('/dashboard');
                            setMobileMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 rounded-lg flex items-center font-semibold mb-2"
                          style={{
                            backgroundColor: colors.primary,
                            color: colors.textLight,
                            border: `2px solid ${colors.primary}`
                          }}
                          whileHover={{ backgroundColor: colors.primaryDark }}
                        >
                          <FaTachometerAlt className="w-5 h-5 mr-3" />
                          {t.dashboard}
                        </motion.button>
                        <motion.button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 rounded-lg flex items-center font-semibold"
                          style={{
                            backgroundColor: colors.secondary,
                            color: colors.textLight,
                            border: `2px solid ${colors.secondary}`
                          }}
                          whileHover={{ backgroundColor: '#C62828' }}
                        >
                          <FaSignOutAlt className="w-5 h-5 mr-3" />
                          {t.logout}
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-3 rounded-lg flex items-center font-semibold mb-2"
                          style={{
                            backgroundColor: colors.primary,
                            color: colors.textLight,
                            border: `2px solid ${colors.primary}`
                          }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <FaUser className="w-5 h-5 mr-3" />
                          {t.login}
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-3 rounded-lg flex items-center font-semibold"
                          style={{
                            backgroundColor: colors.success,
                            color: colors.textLight,
                            border: `2px solid ${colors.success}`
                          }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <FaUser className="w-5 h-5 mr-3" />
                          {t.register}
                        </Link>
                      </>
                    )}
                  </motion.div>
                </motion.ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Mobile User Menu Dropdown */}
      <AnimatePresence>
        {userMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ backgroundColor: colors.dark + '80' }}
            onClick={() => setUserMenuOpen(false)}
          >
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              className="absolute right-0 top-0 h-full w-64"
              style={{ backgroundColor: colors.cardBg }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                    {t.account}
                  </h2>
                  <button
                    onClick={() => setUserMenuOpen(false)}
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: colors.gray + '20' }}
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: colors.primary + '10' }}>
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <FaUserCircle className="w-8 h-8" style={{ color: colors.textLight }} />
                    </div>
                    <div>
                      <p className="font-bold text-lg" style={{ color: colors.textPrimary }}>
                        {user?.first_name || user?.username}
                      </p>
                      <p className="text-sm" style={{ color: colors.gray }}>
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {userMenuItems.map((item, index) => (
                    item.type === 'divider' ? (
                      <div 
                        key={`divider-${index}`}
                        className="h-px my-2"
                        style={{ backgroundColor: colors.gray }}
                      />
                    ) : (
                      <motion.button
                        key={item.label}
                        onClick={() => {
                          item.onClick();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3"
                        style={{
                          color: colors.textPrimary,
                          backgroundColor: colors.lightGray
                        }}
                        whileHover={{ backgroundColor: colors.primary + '20' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </motion.button>
                    )
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;