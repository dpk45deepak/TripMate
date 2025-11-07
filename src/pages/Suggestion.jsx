import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import RingLoader from '../components/RingLoader';
import TopDestination from '../components/TopDestination';
import SuggestionHeader from '../components/Suggestion.header';
import {
  FaMapMarkerAlt,
  FaStar,
  FaCalendarAlt,
  FaRupeeSign,
  FaSearch,
  FaGlobeAmericas,
  FaHome,
  FaWallet,
  FaCompass,
  FaHeart,
  FaRegHeart
} from "react-icons/fa";

const TripSuggestions = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTripId, setSelectedTripId] = useState("");
  const [favorites, setFavorites] = useState(new Set());
  const [searchFocused, setSearchFocused] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
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
      scale: 1.05,
      y: -8,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  // Fetch data from the URL
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://trip-teal.vercel.app/api/destinations');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched data:", data);
        
        setRecommendations(Array.isArray(data) ? data : data.recommendations || data.trips || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load trip recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter recommendations based on search term
  const filteredRecommendations = useMemo(() => {
    if (!searchTerm) return recommendations;
    return recommendations.filter(trip =>
      trip?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip?.destinationType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip?.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, recommendations]);

  const toggleFavorite = (tripId, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(tripId)) {
        newFavorites.delete(tripId);
      } else {
        newFavorites.add(tripId);
      }
      return newFavorites;
    });
  };

  const features = [
    {
      icon: <FaCompass className="text-3xl mb-2" />,
      title: "Discover Breathtaking Locations",
      description: "Find hidden gems and popular spots",
      bg: "from-emerald-500 to-teal-600"
    },
    {
      icon: <FaWallet className="text-3xl mb-2" />,
      title: "Enjoy deals & delights",
      description: "Best prices guaranteed",
      bg: "from-blue-500 to-indigo-600"
    },
    {
      icon: <FaGlobeAmericas className="text-3xl mb-2" />,
      title: "Exploring made easy",
      description: "Seamless travel planning",
      bg: "from-purple-500 to-fuchsia-600"
    },
    {
      icon: <FaHome className="text-3xl mb-2" />,
      title: "Travel your way",
      description: "Customized experiences",
      bg: "from-rose-500 to-pink-600"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
        <RingLoader />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-teal-50"
      >
        <div className="text-center p-8 bg-white rounded-2xl shadow-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="text-6xl mb-4"
          >
            😢
          </motion.div>
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Data</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-6 py-3 rounded-full transition-all duration-300 shadow-lg"
          >
            Retry
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50"
    >
      {/* Header */}
      <SuggestionHeader />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://assets.website-files.com/5e832e12eb7ca02ee9064d42/5f3084f6e686cc40e9a53e4b_pattern.svg')] bg-repeat transform scale-150"></div>
        </div>
        
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Millions Of Experiences. <br /> 
            <span className="bg-gradient-to-r from-yellow-300 to-teal-300 bg-clip-text text-transparent">
              One Simple Search.
            </span>
          </h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-blue-100 max-w-2xl mx-auto mb-10"
          >
            Find and book your next happy adventure anywhere in the world.
          </motion.p>

          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto"
          >
            <div className={`relative flex-grow transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                placeholder="Search trips by name or location..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 text-gray-800 shadow-2xl border-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl"
            >
              Search
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section 
        variants={containerVariants}
        className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                y: -5
              }}
              className={`bg-gradient-to-r ${feature.bg} p-6 rounded-2xl text-white shadow-2xl transform transition-all duration-300 hover:shadow-3xl`}
            >
              <div className="text-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-blue-100 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Trip Suggestions Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 relative inline-block">
            Trip Suggestions
            <span className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full mt-2"></span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
            Based on your preferences, here are the trips we think you'll love!
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={searchTerm}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredRecommendations.length > 0 ? (
              filteredRecommendations.sort(() => 0.5 - Math.random()).slice(0, 20).map((trip, index) => (
                <motion.div
                  key={trip?.id || `trip-${Math.random().toString(36).substring(2, 9)}`}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                  custom={index}
                  className={`rounded-2xl overflow-hidden shadow-2xl cursor-pointer bg-white transform ${
                    selectedTripId === trip?.id ? "ring-4 ring-blue-500 ring-opacity-50" : ""
                  }`}
                  onClick={() => {
                    if (!trip?.id) {
                      console.warn("Attempted to navigate with missing trip ID:", trip);
                      return;
                    }
                    setSelectedTripId(trip.id);
                    const city = trip?.location?.split(",")[0]?.trim() || 'unknown';
                    navigate(`/trip-details/${trip.id}/${city}`);
                  }}
                >
                  <div className="relative h-60 overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      src={trip?.image || trip?.photo || trip?.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'}
                      alt={trip?.name || 'Trip image'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      {trip?.rating || trip?.stars || '4.5'}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-3 right-3 bg-white bg-opacity-90 p-2 rounded-full shadow-lg"
                      onClick={(e) => toggleFavorite(trip.id, e)}
                    >
                      {favorites.has(trip.id) ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="text-gray-600" />
                      )}
                    </motion.button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <h3 className="text-white font-bold text-lg">{trip?.name || trip?.title || 'Unnamed Trip'}</h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="text-red-500 mr-2" />
                      <span>{trip?.location || trip?.city || trip?.country || 'Unknown location'}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 pt-2 border-t border-gray-100">
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-blue-500" />
                        {trip?.days || trip?.duration || 'N/A'} Days
                      </span>
                      <span className="flex items-center font-semibold text-lg">
                        <FaRupeeSign className="mr-1 text-green-600" />
                        {trip?.price || trip?.cost || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 text-xs font-semibold">
                        {trip?.destinationType || trip?.type || trip?.category || 'Adventure'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full text-center py-16"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  😢
                </motion.div>
                <h3 className="text-2xl font-medium text-gray-600 mb-2">
                  No Trips Found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Try adjusting your search terms or check back later for new adventures!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchTerm('')}
                  className="mt-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-full"
                >
                  Clear Search
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Top Destinations */}
      <TopDestination />

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-900 via-purple-900 to-teal-800 py-12 mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="text-lg mb-2"
          >
            Made with ❤️ for your next adventure!
          </motion.p>
          <p className="text-blue-200">© {new Date().getFullYear()} Travel Explorer. All rights reserved.</p>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default TripSuggestions;