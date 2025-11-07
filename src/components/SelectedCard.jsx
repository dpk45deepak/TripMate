import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaStar,
  FaCalendarAlt,
  FaRupeeSign,
  FaPlaneDeparture,
  FaHeartbeat,
  FaRunning,
  FaShieldAlt,
} from "react-icons/fa";
import { useTrips } from "../context/TripsContext";

const SelectedCard = ({ selectedId, city }) => {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const { recommendations = [] } = useTrips();

  const fetchTripDetails = async () => {
    try {
      const response = await fetch("https://trip-teal.vercel.app/api/destinations");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      const trip = data.find((t) => t.id === selectedId || t._id === selectedId);
      setSelectedTrip(trip || null);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };

  useEffect(() => {
    if (selectedId) fetchTripDetails();
  }, [selectedId, city]);

  if (!selectedTrip) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-white bg-gradient-to-r from-teal-500 to-blue-500 px-8 py-6 rounded-3xl shadow-2xl animate-pulse">
          <p>Loading trip details...</p>
        </div>
      </div>
    );
  }

  const displayCity =
    city ||
    (selectedTrip.location && selectedTrip.location.split(",")[0].trim()) ||
    "Unknown Location";

  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-[80%] mx-auto h-screen p-8 md:p-12 gap-8">
      {/* Left Content Card */}
      <div className="flex-1 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-gray-800 animate-fadeIn">
        <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-teal-500 to-sky-400 bg-clip-text text-transparent animate-gradient">
          {selectedTrip.name}
        </h2>

        <div className="flex items-center gap-3 mb-6">
          <FaMapMarkerAlt className="text-red-400 text-xl" />
          <span className="text-lg font-medium">{displayCity}</span>
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-6 mb-6 text-gray-700">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-blue-400" />{" "}
            <span>{selectedTrip.days} Days</span>
          </div>
          <div className="flex items-center gap-2">
            <FaRupeeSign className="text-yellow-500" />{" "}
            <span>₹{selectedTrip.budget.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaPlaneDeparture className="text-purple-500" />{" "}
            <span>{selectedTrip.transport}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaRunning className="text-green-500" />{" "}
            <span>Activity: {selectedTrip.activityLevel}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaHeartbeat className="text-pink-500" />{" "}
            <span>Health: {selectedTrip.health}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaShieldAlt className="text-blue-500" />{" "}
            <span>Safety: {selectedTrip.safetyRating}/5</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-sky-400/10 to-teal-400/10 p-4 rounded-xl mb-6">
          <p className="text-gray-700 italic">
            🏖️ Best Season:{" "}
            <span className="font-semibold text-sky-600">
              {selectedTrip.bestSeason}
            </span>
          </p>
        </div>

        <div className="border-t border-gray-300 pt-4">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">
            Description
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {selectedTrip.description ||
              `Experience the beauty of ${displayCity} with our carefully crafted ${selectedTrip.days}-day travel package, perfect for travelers of all ages.`}
          </p>
        </div>
      </div>

      {/* Right Image */}
      <div className="flex-1 relative rounded-3xl overflow-hidden shadow-2xl animate-slideIn">
        <img
          src={
            selectedTrip.image ||
            `https://source.unsplash.com/random/1000x1000/?${displayCity},travel`
          }
          alt={selectedTrip.name}
          className="w-full h-[80vh] object-cover rounded-3xl"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://source.unsplash.com/random/1000x1000/?travel";
          }}
        />
        <div className="absolute top-4 left-4 bg-black/60 text-white px-4 py-2 rounded-xl flex items-center gap-1 backdrop-blur-md">
          {selectedTrip.rating} <FaStar className="text-yellow-400" />
        </div>
      </div>
    </div>
  );
};

export default SelectedCard;
