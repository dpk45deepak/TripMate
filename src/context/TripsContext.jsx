import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useTripForm } from '../context/TripFormContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TripsContext = createContext();

export const TripsProvider = ({ children }) => {
  const { tripFormData } = useTripForm();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    if (!tripFormData?.formInput) return;

    const { destinationType, ...rest } = tripFormData.formInput;
    const tripType = destinationType === "Domestic" ? "domestic-trips" : "foreign-trips";

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

  // Whenever form data is set, trigger fetch
  useEffect(() => {
    fetchRecommendations();
  }, [tripFormData]);

  return (
    <TripsContext.Provider value={{ recommendations, error, loading }}>
      {children}
    </TripsContext.Provider>
  );
};

export const useTrips = () => useContext(TripsContext);
