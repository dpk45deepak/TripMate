import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
// Assuming these component imports point to correct files in your project structure
import SuggestionHeader from "../components/Suggestion.header";
import SelectedCard from "../components/SelectedCard";
import TopDestination from "../components/TopDestination";
import WeatherForecast from "../components/WeatherForecast";
import TripMapSection from "../components/TripMapSection";
import HealthFacilities from "../components/HealthFacilities";
import RingLoader from '../components/RingLoader';

import {
  FaCompass,
  FaWallet,
  FaMapMarkerAlt,
  FaStar,
  FaHeart,
  FaShare,
  FaPhone,
  FaShieldAlt,
  FaAmbulance
} from "react-icons/fa";

const TravelDestinationPage = () => {
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(1);
  const [currencyData, setCurrencyData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { id, location: city } = useParams();
  const tripId = id;
  const selectedCity = city?.split(",")[0]?.trim() || 'Unknown City';

  // Enhanced animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  // --- Data Fetching Functions (Wrapped in useCallback for best practice) ---

  const getCoordinatesByCity = useCallback(async (cityName) => {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch coordinates: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();

      if (data?.results?.length > 0) {
        const { latitude, longitude, timezone, country } = data.results[0];
        // Setting location for SelectedCard/TripData mock for better consistency
        setTripData(prev => ({
          ...prev,
          location: `${selectedCity}, ${country}`
        }));
        return { latitude, longitude, timezone, country };
      } else {
        throw new Error("City not found or no results returned.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error.message);
      setError(`Location error: ${error.message}`);
      return null;
    }
  }, [selectedCity]); // Depend on selectedCity

  const fetchCurrencyRates = useCallback(async () => {
    // Using a static URL and API Key is highly insecure in a production environment. 
    // This should be proxied through a backend. 
    // Assuming VITE_CURRENCY_API_URL is the base URL for 'latest' rates with USD base.

    if (!import.meta.env.VITE_CURRENCY_API_URL) {
      console.warn("VITE_CURRENCY_API_URL is not defined. Using fallback currency rates.");
      setCurrencyData({
        INR: 83.25, // Fallback rates for demonstration (USD to currency)
        EUR: 0.92,
        GBP: 0.79,
        JPY: 151.47
      });
      return;
    }

    try {
      const response = await fetch(import.meta.env.VITE_CURRENCY_API_URL);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Currency data unavailable: ${response.status}`);
      }
      const data = await response.json();
      // Assuming data.rates is { [currency_code]: rate_to_base_currency }
      setCurrencyData(data.rates);
    } catch (err) {
      console.error("Error fetching currency:", err);
      // Fail-safe: Use mock data on API failure
      setCurrencyData({
        INR: 83.25,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 151.47
      });
    }
  }, []); // No dependencies

  // --- Main Data Loading Effect ---

  useEffect(() => {
    const loadPageData = async () => {
      setLoading(true); // Reset loading state
      setError(null); // Clear previous errors

      try {
        // 1. Set Initial Mock Trip Data
        // This mock data is crucial for the UI to render content before location/currency APIs return
        const mockTripData = {
          id: tripId,
          name: selectedCity,
          location: `${selectedCity}, Finding Country...`, // Will be updated by getCoordinatesByCity
          description: `Experience the beauty of ${selectedCity} with our carefully crafted tour package. Discover hidden gems, indulge in local cuisine, and create unforgettable memories in one of the most breathtaking destinations.`,
          price: 25000,
          days: 7,
          rating: 4.7,
          reviews: 1284,
          destinationType: tripId?.length > 10 ? "foreign" : "domestic",
          highlights: [
            "Guided city tour with local experts",
            "Authentic local cuisine tasting",
            "Cultural performances and workshops",
            // "Scenic viewpoints and photography spots",
            // "Shopping in traditional markets",
            // "Adventure activities and outdoor experiences"
          ],
          included: [
            "Accommodation in selected hotels",
            "Daily breakfast and special dinners",
            "All transportation during the tour",
            "Professional tour guide services",
            "Entrance fees to attractions",
            "24/7 customer support"
          ],
          itinerary: [
            {
              day: 1,
              title: `Arrival in ${selectedCity}`,
              description: `Arrive at the airport, transfer to your hotel, and settle in. Evening orientation walk.`,
              activities: ["Airport pickup", "Hotel check-in", "Welcome dinner"]
            },
            {
              day: 2,
              title: "City Exploration",
              description: "Full-day guided tour of major landmarks and historical sites.",
              activities: ["Historical sites", "Local markets", "Cultural show"]
            },
            {
              day: 3,
              title: "Nature & Outdoors",
              description: "A day trip to a nearby natural wonder, involving hiking or scenic views.",
              activities: ["Hiking/Trekking", "Picnic lunch", "Sunset view point"]
            },
            {
              day: 4,
              title: "Culinary Deep Dive",
              description: "Morning cooking class followed by an afternoon of free time for shopping.",
              activities: ["Cooking class", "Local market visit", "Souvenir shopping"]
            },
          ]
        };
        setTripData(mockTripData); // Set initial data

        // 2. Fetch independent data concurrently
        await fetchCurrencyRates(); // Independent call

        // 3. Fetch coordinates (needed for Weather/Map components)
        const coords = await getCoordinatesByCity(selectedCity);
        if (coords) {
          setCoordinates(coords);
        }

      } catch (err) {
        console.error("Error loading page data:", err);
        // Use the default error message if none was set during coordinate fetch
        if (!error) {
          setError(`An error occurred: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
    // Added fetchCurrencyRates and getCoordinatesByCity to dependency array 
    // because they are wrapped in useCallback (best practice, though they don't change)
  }, [tripId, selectedCity, fetchCurrencyRates, getCoordinatesByCity, error]);

  const handlePlanSelect = (planIndex) => {
    setSelectedPlan(planIndex);
  };

  const plans = [
    {
      name: "Budget",
      price: 120,
      features: ["Hostel accommodation", "Public transport pass", "Free walking tours", "Basic meals"],
      color: "from-green-500 to-emerald-600"
    },
  ];

  // Tailwind safe classes for Emergency Contacts (to prevent purge issues)
  const getContactClasses = (color) => {
    switch (color) {
      case 'red': return "bg-red-50 border-red-100";
      case 'blue': return "bg-blue-50 border-blue-100";
      case 'orange': return "bg-orange-50 border-orange-100";
      case 'green': return "bg-green-50 border-green-100";
      case 'pink': return "bg-pink-50 border-pink-100";
      case 'purple': return "bg-purple-50 border-purple-100";
      default: return "bg-gray-50 border-gray-100";
    }
  };


  // --- LOADING STATE RENDER ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
        <RingLoader />
      </div>
    );
  }

  // --- ERROR STATE RENDER ---
  if (error) {
    return (
      <motion.div
        initial="initial"
        animate="in"
        variants={pageVariants}
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-teal-50"
      >
        <div className="text-center p-8 max-w-md bg-white rounded-2xl shadow-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-4 text-red-500"
          >
            ⚠️
          </motion.div>
          <h2 className="text-2xl font-bold mb-4">Error Loading Page</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-lg"
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // --- MAIN COMPONENT RENDER ---
  return (
    <motion.div
      initial="initial"
      animate="in"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50"
    >
      <Helmet>
        <title>{selectedCity} Travel Guide | Travel Assistant</title>
        <meta name="description" content={`Complete travel guide for ${selectedCity} including weather, attractions, and trip planning`} />
      </Helmet>

      {/* Enhanced Header Section */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-teal-900 via-blue-800 to-purple-900 shadow-2xl"
      >
        <SuggestionHeader />
      </motion.div>

      {/* Enhanced Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative bg-gradient-to-r from-teal-600 to-blue-700  pt-20 pb-32 px-4 shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          {/* Note: The pattern image URL is a mock/placeholder */}
          <div className="absolute inset-0 bg-[url('https://assets.website-files.com/5e832e12eb7ca02ee9064d42/5f3084f6e686cc40e9a53e4b_pattern.svg')] bg-repeat transform scale-150"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            >
              Welcome to{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-teal-300 bg-clip-text text-transparent">
                {selectedCity}
              </span>
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-teal-100 max-w-3xl mx-auto"
            >
              Your complete guide to exploring {selectedCity} - from hidden gems to must-see attractions
            </motion.p>
          </div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className="flex justify-center w-full"
          >
            <SelectedCard selectedId={tripId} city={selectedCity} />
          { console.info("TRIP ID: ", tripId)}
          { console.info("City : ", selectedCity)}
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16"
        >

          {/* Left Column - Trip Planning */}
          <div className="lg:col-span-4 space-y-8 order-2 lg:order-1">
            {/* Trip Packages Card */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-2xl shadow-2xl p-8 sticky top-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <FaCompass className="w-6 h-6 text-teal-500 mr-3" />
                  Plan Your Trip
                </h2>
                <div className="flex space-x-2">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <FaHeart />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <FaShare />
                  </motion.button>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {plans.map((plan, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className={`border-2 rounded-xl p-5 transition-all cursor-pointer bg-gradient-to-r ${plan.color} ${selectedPlan === index
                        ? "border-white shadow-lg scale-105 ring-4 ring-white ring-opacity-50"
                        : "border-gray-200 hover:border-white"
                      }`}
                    onClick={() => handlePlanSelect(index)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-white">{plan.name}</h3>
                      <span className="font-bold text-white text-xl">${plan.price}</span>
                    </div>
                    <ul className="text-white text-sm space-y-2">
                      {plan.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start"
                        >
                          <svg className="w-4 h-4 text-white mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full mt-4 py-3 rounded-lg font-semibold transition ${selectedPlan === index
                          ? "bg-white text-gray-800 shadow-lg"
                          : "bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                        }`}
                    >
                      {selectedPlan === index ? "Selected Plan" : "Select Plan"}
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg mb-4"
              >
                Customize Your Package
              </motion.button>

              {tripData?.highlights && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <h3 className="font-bold text-lg mb-4 flex items-center">
                    <FaStar className="w-5 h-5 text-yellow-500 mr-2" />
                    Trip Highlights
                  </h3>
                  <div className="grid gap-3">
                    {tripData.highlights.map((highlight, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ x: 5 }}
                        className="flex items-start text-sm p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg hover:shadow-md transition-all"
                      >
                        <svg className="w-4 h-4 text-teal-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {highlight}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Local Tips Card */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FaMapMarkerAlt className="w-6 h-6 text-teal-500 mr-3" />
                Local Insights
              </h2>
              <div className="space-y-4">
                {[
                  {
                    icon: "⏰",
                    title: "Best Time to Visit",
                    content: "November to March for pleasant weather and festivals",
                    color: "blue"
                  },
                  {
                    icon: "🍽️",
                    title: "Must-Try Food",
                    content: "Local street food, traditional cuisine, and regional specialties",
                    color: "yellow"
                  },
                  {
                    icon: "🏛️",
                    title: "Top Attractions",
                    content: "Historical sites, natural wonders, and cultural hotspots",
                    color: "green"
                  }
                ].map((tip, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 ${tip.color === 'blue' ? 'bg-blue-50 border-blue-100' : tip.color === 'yellow' ? 'bg-yellow-50 border-yellow-100' : 'bg-green-50 border-green-100'} rounded-xl border transition-all`}
                  >
                    <h3 className="font-bold text-gray-800 flex items-center mb-2">
                      <span className="text-2xl mr-3">{tip.icon}</span>
                      {tip.title}
                    </h3>
                    <p className="text-sm text-gray-700">{tip.content}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Primary Travel Info */}
          <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
            {/* Navigation Tabs */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-2xl p-2 border border-gray-100"
            >
              <div className="flex space-x-2">
                {['overview', 'itinerary', 'weather', 'map', 'health'].map((tab) => (
                  <motion.button
                    key={tab}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${activeTab === tab
                        ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-teal-600'
                      }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {(activeTab === 'overview' || activeTab === 'weather' || activeTab === 'health') && (
                <motion.div
                  key="info-grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {activeTab === 'overview' && (
                    <React.Fragment>
                      {/* Weather Card (Only render in overview tab for compact view) */}
                      <motion.div
                        variants={cardVariants}
                        whileHover="hover"
                        className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
                      >
                        <h2 className="text-2xl font-bold mb-6 flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white text-lg">🌤️</span>
                          </div>
                          Weather Forecast (Compact)
                        </h2>
                        {coordinates ? (
                          <WeatherForecast coor={coordinates} cityName={selectedCity} compact={true} />
                        ) : (
                          <div className="text-gray-500 italic">Loading weather data...</div>
                        )}
                      </motion.div>

                      {/* Health Facilities (Only render in overview tab for compact view) */}
                      <motion.div
                        variants={cardVariants}
                        whileHover="hover"
                        className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 h-[32rem] overflow-hidden"
                      >
                        <h2 className="text-2xl font-bold mb-6 flex items-center">
                          <FaShieldAlt className="w-6 h-6 text-red-500 mr-3" />
                          Health & Safety (Compact)
                        </h2>
                        <HealthFacilities city={selectedCity} compact={true} />
                      </motion.div>

                      {/* Currency Converter (Always render in overview) */}
                      <motion.div
                        variants={cardVariants}
                        whileHover="hover"
                        className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
                      >
                        <h2 className="text-2xl font-bold mb-6 flex items-center">
                          <FaWallet className="w-6 h-6 text-teal-500 mr-3" />
                          Exchange Rates
                        </h2>
                        {currencyData ? (
                          <div className="space-y-4">
                            {Object.entries({
                              USD: "US Dollar",
                              EUR: "Euro",
                              GBP: "British Pound",
                              JPY: "Japanese Yen"
                            }).map(([code, name]) => (
                              <motion.div
                                key={code}
                                whileHover={{ x: 5 }}
                                className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:shadow-md transition-all"
                              >
                                <span className="font-medium">{name}</span>
                                <span className="font-bold text-teal-600 text-lg">
                                  {currencyData.INR && currencyData[code]
                                    ? `₹${(currencyData.INR / currencyData[code]).toFixed(2)}`
                                    : 'N/A'
                                  }
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500 italic">Loading currency data...</div>
                        )}
                      </motion.div>

                      {/* Emergency Contacts (Always render in overview) */}
                      <motion.div
                        variants={cardVariants}
                        whileHover="hover"
                        className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
                      >
                        <h2 className="text-2xl font-bold mb-6 flex items-center">
                          <FaPhone className="w-6 h-6 text-red-500 mr-3" />
                          Emergency Contacts
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { name: "Police", number: "100", icon: "👮", color: "red" },
                            { name: "Ambulance", number: "102", icon: "🚑", color: "blue" },
                            { name: "Fire", number: "101", icon: "🚒", color: "orange" },
                            { name: "Tourist Help", number: "1363", icon: "🏛️", color: "green" },
                            { name: "Women's Helpline", number: "1091", icon: "👩", color: "pink" },
                            { name: "Child Help", number: "1098", icon: "🧒", color: "purple" }
                          ].map((contact, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ y: -5, scale: 1.02 }}
                              className={`p-4 ${getContactClasses(contact.color)} hover:shadow-lg transition-all cursor-pointer rounded-xl`}
                            >
                              <div className="flex items-center mb-2">
                                <span className="text-2xl mr-3">{contact.icon}</span>
                                <div>
                                  <div className="font-bold text-gray-800">{contact.name}</div>
                                  <a href={`tel:${contact.number}`} className="text-blue-600 hover:underline font-semibold">
                                    {contact.number}
                                  </a>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </React.Fragment>
                  )}
                  {/* Full Weather Tab */}
                  {activeTab === 'weather' && (
                    <motion.div
                      key="full-weather"
                      className="md:col-span-2 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
                    >
                      <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <span className="text-3xl mr-3">☀️</span>
                        Detailed Weather Forecast
                      </h2>
                      {coordinates ? (
                        <WeatherForecast coor={coordinates} cityName={selectedCity} compact={false} />
                      ) : (
                        <div className="text-gray-500 italic">Could not load location for weather data.</div>
                      )}
                    </motion.div>
                  )}
                  {/* Full Health Tab */}
                  {activeTab === 'health' && (
                    <motion.div
                      key="full-health"
                      className="md:col-span-2 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
                    >
                      <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <FaAmbulance className="w-6 h-6 text-red-500 mr-3" />
                        Full Health & Medical Services
                      </h2>
                      <HealthFacilities city={selectedCity} compact={false} />
                    </motion.div>
                  )}
                </motion.div>
              )}

              {activeTab === 'map' && (
                <motion.div
                  key="map"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
                >
                  <div className="p-8 border-b border-gray-100">
                    <h2 className="text-2xl font-bold flex items-center">
                      <FaMapMarkerAlt className="w-6 h-6 text-teal-500 mr-3" />
                      {selectedCity} Map & Attractions
                    </h2>
                  </div>
                  {/* Map component requires a height, setting it in TripMapSection or here */}
                  {coordinates ? (
                    <TripMapSection coor={coordinates} cityName={selectedCity} />
                  ) : (
                    <div className="h-96 flex items-center justify-center text-gray-500">
                      Loading map data...
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'itinerary' && tripData?.itinerary && (
                <motion.div
                  key="itinerary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
                >
                  <h2 className="text-2xl font-bold mb-8 flex items-center">
                    <FaCompass className="w-6 h-6 text-teal-500 mr-3" />
                    Suggested Itinerary
                  </h2>
                  <div className="space-y-6">
                    {tripData.itinerary.map((day, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex"
                      >
                        <div className="flex flex-col items-center mr-6">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                            {day.day}
                          </div>
                          {index < tripData.itinerary.length - 1 && (
                            <div className="w-1 h-full bg-gradient-to-b from-teal-200 to-blue-200 mt-2"></div>
                          )}
                        </div>
                        <div className="pb-8 flex-1">
                          <h3 className="font-bold text-xl mb-2 text-gray-800">{day.title}</h3>
                          <p className="text-gray-600 mb-3">{day.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {day.activities.map((activity, i) => (
                              <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                {activity}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Top Destinations Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
            Recommended Nearby Destinations
          </h2>
          <TopDestination currentCity={selectedCity} />
        </motion.section>
      </main>

      {/* Enhanced Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white py-16 px-4"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-teal-400 mb-6">Travel Assistant</h3>
            <p className="text-gray-400 leading-relaxed">
              Making travel planning effortless and memorable since 2023. Your journey begins here.
            </p>
          </motion.div>

          {[
            {
              title: "Explore",
              items: ['Destinations', 'Deals', 'Travel Guides', 'Blog', 'Reviews']
            },
            {
              title: "Support",
              items: ['Help Center', 'Safety', 'Contact Us', 'FAQ', 'Community']
            },
            {
              title: "Legal",
              items: ['Terms', 'Privacy', 'Cookie Policy', 'Accessibility', 'Sitemap']
            }
          ].map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
            >
              <h4 className="font-bold text-lg mb-6 text-teal-300">{section.title}</h4>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:pl-2 transform block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-500"
        >
          &copy; {new Date().getFullYear()} Travel Assistant. All rights reserved.
        </motion.div>
      </motion.footer>
    </motion.div>
  );
};

export default TravelDestinationPage;