import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage or system preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  // Text translations
  const translations = {
    en: {
      // Header
      home: "Home",
      about: "About Us",
      services: "Services",
      book: "Book Delivery",
      track: "Track Shipment",
      pricing: "Pricing",
      contact: "Contact",
      company: "I&M COURIER",
      tagline: "AND GENERAL SUPPLIER LIMITED",
      trackBtn: "Track",
      // Home Page
      trustedSince: "Trusted Since 2018",
      revolutionizing: "Revolutionizing logistics across Tanzania with",
      speedPrecision: "speed, precision",
      and: "and",
      reliability: "reliability",
      yearsExp: "Years Exp.",
      dailyShips: "Daily Ships",
      support: "Support",
      trackPackage: "Track Package",
      contactUs: "Contact Us",
      whatWeOffer: "What We Offer",
      comprehensive: "Comprehensive",
      logisticsSolutions: "Logistics Solutions",
      servicesDesc: "From local deliveries to international freight, we've got you covered",
      domesticCourier: "Domestic Courier",
      domesticDesc: "Same-day and next-day delivery across Tanzania",
      intlShipping: "International Shipping",
      intlDesc: "Worldwide courier with customs support",
      airFreight: "Express Air Freight",
      airDesc: "Urgent packages by air to major cities",
      warehousing: "Warehousing",
      warehouseDesc: "Secure storage and inventory management",
      packaging: "Packaging & Removal",
      packagingDesc: "Complete relocation services",
      clearing: "Clearing & Forwarding",
      clearingDesc: "Customs clearance for all freight types",
      whyChooseUs: "Why",
      companyName: "I&M Courier",
      features: [
        'Advanced tracking system with real-time updates',
        'Dedicated account manager for each client',
        'Receipt confirmation through HCS System',
        '50+ fleet vehicles across Tanzania',
        'Services available 7 days a week',
        'Over 50 years combined expertise'
      ],
      learnMore: "Learn More About Us",
      readyToShip: "Ready to Ship with Us?",
      joinCustomers: "Join hundreds of satisfied customers across Tanzania",
      emailUs: "Email Us",
      serving: "Tunahudumia ndani ya Dar es Salaam na mikoani"
    },
    sw: {
      // Header
      home: "Nyumbani",
      about: "Kuhusu Sisi",
      services: "Huduma",
      book: "Hifadhi Usafirishaji",
      track: "Fuatilia Mzigo",
      pricing: "Bei",
      contact: "Mawasiliano",
      company: "I&M COURIER",
      tagline: "NA MSAJILI WA BIDHAA KWA UJUMLA",
      trackBtn: "Fuatilia",
      // Home Page
      trustedSince: "Imeaminika Tangu 2018",
      revolutionizing: "Kubadilisha mifumo ya usafirishaji Tanzania kwa",
      speedPrecision: "kasi, usahihi",
      and: "na",
      reliability: "kuaminika",
      yearsExp: "Miaka ya Uzoefu",
      dailyShips: "Mizigo Kila Siku",
      support: "Usaidizi",
      trackPackage: "Fuatilia Mzigo",
      contactUs: "Wasiliana Nasi",
      whatWeOffer: "Tunatoa",
      comprehensive: "Kamili",
      logisticsSolutions: "Suluhisho za Usafirishaji",
      servicesDesc: "Kutoka usafirishaji wa ndani hadi kimataifa, tumekusudia",
      domesticCourier: "Usafirishaji Ndani",
      domesticDesc: "Uwasilishaji siku hiyo na siku inayofuata Tanzania nzima",
      intlShipping: "Usafirishaji Kimataifa",
      intlDesc: "Usafirishaji ulimwenguni kote na usaidizi wa forodha",
      airFreight: "Usafirishaji wa Haraka Kwa Ndege",
      airDesc: "Mizigo ya dharura kwa ndege hadi miji mikuu",
      warehousing: "Hifadhi",
      warehouseDesc: "Uhifadhi salama na usimamizi wa hesabu",
      packaging: "Ufungaji & Uhamisho",
      packagingDesc: "Huduma kamili za uhamisho",
      clearing: "Usafishaji & Upelelezi",
      clearingDesc: "Usafishaji wa forodha kwa aina zote za mizigo",
      whyChooseUs: "Kwa Nini",
      companyName: "I&M Courier",
      features: [
        'Mfumo wa juu wa kufuatilia na sasisho la wakati halisi',
        'Meneja wa akaa maalum kwa kila mteja',
        'Uthibitisho wa poketi kupitia Mfumo wa HCS',
        'Zaidi ya magari 50 ya usafirishaji Tanzania nzima',
        'Huduma zinapatikana siku 7 kwa wiki',
        'Zaidi ya miaka 50 ya uzoefu uliokusanyika'
      ],
      learnMore: "Jifunze Zaidi Kutuhusu",
      readyToShip: "Tayari Kusafirisha Nasi?",
      joinCustomers: "Jiunge na mamia ya wateja walioridhika Tanzania nzima",
      emailUs: "Tutumie Barua Pepe",
      serving: "We serve within Dar es Salaam and upcountry"
    }
  };

  // Toggle functions
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang = prev === 'en' ? 'sw' : 'en';
      localStorage.setItem('language', newLang);
      return newLang;
    });
  };

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#111827';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#ffffff';
    }
  }, [darkMode]);

  return (
    <AppContext.Provider value={{
      darkMode,
      language,
      t: translations[language],
      toggleDarkMode,
      toggleLanguage
    }}>
      {children}
    </AppContext.Provider>
  );
};