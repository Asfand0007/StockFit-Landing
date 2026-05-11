import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function useRecommendations(riskTier) {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!riskTier) {
      setRecommendations(null);
      setError(null);
      setLoading(false);
      return;
    }

    let ignore = false;

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.post('/recommendations/stocks', {
          risk_tier: String(riskTier).toLowerCase(),
        });

        if (!ignore) {
          setRecommendations(response.data || null);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Failed to fetch recommendations:', err);
          setRecommendations(null);
          setError('Failed to load recommendations. Please try again.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchRecommendations();

    return () => {
      ignore = true;
    };
  }, [riskTier]);

  return {
    recommendations,
    loading,
    error,
  };
}