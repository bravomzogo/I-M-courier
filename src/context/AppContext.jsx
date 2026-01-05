// context/AppContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// Translations - FIXED: Removed duplicate keys
const translations = {
  en: {
    company: "I&M COURIER",
    tagline: "Fast & Reliable Delivery",
    home: "Home",
    about: "About Us",
    services: "Services",
    book: "Book Delivery",
    track: "Track Parcel",
    pricing: "Pricing",
    contact: "Contact Us",
    trackBtn: "Track Now",
    login: "Login",
    logout: "Logout",           // ✅ Only ONE logout
    register: "Register",        // ✅ Only ONE register
    profile: "Profile",
    dashboard: "Dashboard",
    approvals: "Approvals",
    driverDashboard: "Driver Dashboard",
    driver: "Driver",
    approver: "Approver",
    account: "Account",
    bookDelivery: "Book Delivery",
    trackParcel: "Track Parcel",
    ourServices: "Our Services",
    contactUs: "Contact Us",
    getQuote: "Get Quote",
    learnMore: "Learn More",
    // Add any missing translations from Home.jsx
    trustedSince: "Trusted Since 2025",
    revolutionizing: "Revolutionizing logistics with",
    speedPrecision: "speed, precision",
    and: "and",
    reliability: "reliability",
    trackPackage: "Track Package",
    yearsExp: "Years Experience",
    dailyShips: "Daily Shipments",
    support: "24/7 Support",
    whatWeOffer: "What We Offer",
    comprehensive: "Comprehensive",
    logisticsSolutions: "Logistics Solutions",
    servicesDesc: "End-to-end supply chain solutions tailored to your needs",
    domesticCourier: "Domestic Courier",
    domesticDesc: "Fast and reliable delivery across Tanzania",
    intlShipping: "International Shipping",
    intlDesc: "Global shipping to over 200 countries",
    airFreight: "Air Freight",
    airDesc: "Express air cargo services",
    warehousing: "Warehousing",
    warehouseDesc: "Secure storage solutions",
    packaging: "Packaging",
    packagingDesc: "Professional packaging services",
    clearing: "Customs Clearing",
    clearingDesc: "Hassle-free customs processing",
    whyChooseUs: "Why Choose",
    companyName: "I&M Courier",
    features: [
      "Over 50 years of logistics excellence",
      "24/7 customer support and real-time tracking",
      "Competitive pricing with no hidden fees",
      "Professional and experienced team",
      "Secure handling of all shipments"
    ],
    readyToShip: "Ready to Ship?",
    joinCustomers: "Join thousands of satisfied customers",
    emailUs: "Email Us",
    serving: "Serving Dar es Salaam and beyond"
  },
  sw: {
    company: "I&M USAFIRISHAJI",
    tagline: "Usafirishaji wa Haraka na Waaminifu",
    home: "Nyumbani",
    about: "Kuhusu Sisi",
    services: "Huduma",
    book: "Panga Usafirishaji",
    track: "Fuatilia Mzigo",
    pricing: "Bei",
    contact: "Wasiliana Nasi",
    trackBtn: "Fuatilia Sasa",
    login: "Ingia",
    logout: "Toka",              // ✅ Only ONE logout
    register: "Jisajili",        // ✅ Only ONE register
    profile: "Wasifu",
    dashboard: "Dashibodi",
    approvals: "Idhini",
    driverDashboard: "Dashibodi ya Dereva",
    driver: "Dereva",
    approver: "Mkubali",
    account: "Akaunti",
    bookDelivery: "Panga Usafirishaji",
    trackParcel: "Fuatilia Mzigo",
    ourServices: "Huduma Zetu",
    contactUs: "Wasiliana Nasi",
    getQuote: "Pata Bei",
    learnMore: "Jifunze Zaidi",
    // Add Swahili translations
    trustedSince: "Tunaaminika Tangu 2025",
    revolutionizing: "Kuboresha usafirishaji kwa",
    speedPrecision: "kasi, usahihi",
    and: "na",
    reliability: "kuaminika",
    trackPackage: "Fuatilia Mzigo",
    yearsExp: "Miaka ya Uzoefu",
    dailyShips: "Usafirishaji wa Kila Siku",
    support: "Msaada 24/7",
    whatWeOffer: "Tunachotoa",
    comprehensive: "Suluhisho Kamili za",
    logisticsSolutions: "Usafirishaji",
    servicesDesc: "Suluhisho kamili za usambazaji zinazolingana na mahitaji yako",
    domesticCourier: "Usafirishaji wa Ndani",
    domesticDesc: "Usafirishaji wa haraka na wa kuaminika nchini Tanzania",
    intlShipping: "Usafirishaji wa Kimataifa",
    intlDesc: "Usafirishaji duniani kote kwa nchi zaidi ya 200",
    airFreight: "Usafirishaji wa Anga",
    airDesc: "Huduma za haraka za mizigo ya anga",
    warehousing: "Uhifadhi",
    warehouseDesc: "Suluhisho salama za kuhifadhi",
    packaging: "Ufungaji",
    packagingDesc: "Huduma za kitaalamu za ufungaji",
    clearing: "Forodha",
    clearingDesc: "Usindikaji rahisi wa forodha",
    whyChooseUs: "Kwa Nini Uchague",
    companyName: "I&M Courier",
    features: [
      "Zaidi ya miaka 50 ya ubora wa usafirishaji",
      "Msaada wa wateja 24/7 na ufuatiliaji wa wakati halisi",
      "Bei za ushindani bila malipo ya siri",
      "Timu ya kitaalamu na yenye uzoefu",
      "Usalama wa mizigo yote"
    ],
    readyToShip: "Uko Tayari Kusafirisha?",
    joinCustomers: "Jiunge na maelfu ya wateja wenye kuridhika",
    emailUs: "Tutumie Barua Pepe",
    serving: "Tunahudumia Dar es Salaam na zaidi"
  }
};

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'en';
  });

  const t = translations[language];

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sw' : 'en');
  };

  const value = {
    darkMode,
    language,
    t,
    toggleDarkMode,
    toggleLanguage
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// ❌ REMOVE THIS LINE - it shouldn't be here!
// export default Login;