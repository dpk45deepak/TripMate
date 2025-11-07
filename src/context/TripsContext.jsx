import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useTripForm } from '../context/TripFormContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://trip-teal.vercel.app';

const TripsContext = createContext();

export const TripsProvider = ({ children }) => {
  const { tripFormData } = useTripForm();

  const [recommendations, setRecommendations] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    if (!tripFormData?.formInput) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/destinations/`);
      setRecommendations(response.data || []);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Failed to load recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTripById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/destinations/${id}`);
      setSelectedTrip(response.data);
    } catch (err) {
      console.error(`Error fetching trip with id ${id}:`, err);
      setError("Failed to load trip details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripFormData?.formInput) {
      fetchRecommendations();
    }
  }, [tripFormData]);

  return (
    <TripsContext.Provider value={{ recommendations, selectedTrip, error, loading, fetchTripById, fetchRecommendations }}>
      {children}
    </TripsContext.Provider>
  );
};

export const useTrips = () => useContext(TripsContext);
