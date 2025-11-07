import React, { useState, useMemo, useEffect } from "react";
import RingLoader from '../components/RingLoader';
import { useNavigate } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaStar,
  FaCalendarAlt,
  FaRupeeSign,
  FaSearch,
  FaGlobeAmericas,
  FaHome,
  FaWallet,
  FaCompass
} from "react-icons/fa";
import TopDestination from '../components/TopDestination';
import SuggestionHeader from '../components/Suggestion.header';

const TripSuggestions = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        
        // Assuming the API returns an array of trips
        // If the structure is different, you might need to adjust this
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

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTripId, setSelectedTripId] = useState("");

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

  const features = [
    {
      icon: <FaCompass className="text-3xl mb-2" />,
      title: "Discover Breathtaking Locations",
      bg: "from-emerald-500 to-teal-600"
    },
    {
      icon: <FaWallet className="text-3xl mb-2" />,
      title: "Enjoy deals & delights",
      bg: "from-blue-500 to-indigo-600"
    },
    {
      icon: <FaGlobeAmericas className="text-3xl mb-2" />,
      title: "Exploring made easy",
      bg: "from-purple-500 to-fuchsia-600"
    },
    {
      icon: <FaHome className="text-3xl mb-2" />,
      title: "Travel your way",
      bg: "from-rose-500 to-pink-600"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RingLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Data</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-colors duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <SuggestionHeader />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-500 to-teal-500 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://assets.website-files.com/5e832e12eb7ca02ee9064d42/5f3084f6e686cc40e9a53e4b_pattern.svg')] bg-repeat"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Millions Of Experiences. <br /> One Simple Search.
          </h1>

          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Find and book your next happy adventure anywhere in the world.
          </p>

          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-grow">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search trips by name or location..."
                className="w-full pl-12 pr-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${feature.bg} p-6 rounded-xl text-white shadow-lg transform transition-transform duration-300 hover:scale-105`}
            >
              <div className="text-center">
                {feature.icon}
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trip Suggestions Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 relative inline-block">
            Trip Suggestions
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full mt-2"></span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Based on your preferences, here are the trips we think you'll love!
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecommendations.length > 0 ? (
            filteredRecommendations.slice(0, 6).map((trip) => (
              <div
                key={trip?.id || `trip-${Math.random().toString(36).substring(2, 9)}`}
                className={`rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 bg-white transform hover:-translate-y-1 hover:shadow-xl ${
                  selectedTripId === trip?.id ? "ring-4 ring-blue-500" : ""
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
                  <img
                    src={trip?.image || trip?.photo || trip?.imageUrl || 'https://via.placeholder.com/400x300'}
                    alt={trip?.name || 'Trip image'}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    {trip?.rating || trip?.stars || 'N/A'}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-gray-800">{trip?.name || trip?.title || 'Unnamed Trip'}</h3>
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="text-red-500 mr-2" />
                    <span>{trip?.location || trip?.city || trip?.country || 'Unknown location'}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 pt-2 border-t border-gray-100">
                    <span className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-blue-500" />
                      {trip?.days || trip?.duration || 'N/A'} Days
                    </span>
                    <span className="flex items-center font-semibold">
                      <FaRupeeSign className="mr-1 text-green-600" />
                      {trip?.price || trip?.cost || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                      {trip?.destinationType || trip?.type || trip?.category || 'Unknown Type'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">😢</div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No Trips found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or check back later for new adventures!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Top Destinations */}
      <TopDestination />

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-teal-800 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <p className="text-lg mb-2">Made with ❤️ for your next adventure!</p>
          <p className="text-blue-200">© {new Date().getFullYear()} Travel Explorer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TripSuggestions;