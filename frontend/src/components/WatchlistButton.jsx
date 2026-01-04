import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { watchlistAPI } from '../utils/api';

const WatchlistButton = ({ movieId, onToggle }) => {
  const { isAuthenticated } = useAuth();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isAuthenticated && movieId) {
      checkWatchlistStatus();
    } else {
      setChecking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, movieId]);

  const checkWatchlistStatus = async () => {
    try {
      const response = await watchlistAPI.check(movieId);
      setInWatchlist(response.data.inWatchlist);
    } catch (error) {
      console.error('Failed to check watchlist status:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleToggleWatchlist = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to add movies to your watchlist');
      return;
    }

    setLoading(true);
    try {
      if (inWatchlist) {
        await watchlistAPI.remove(movieId);
        setInWatchlist(false);
      } else {
        await watchlistAPI.add(movieId);
        setInWatchlist(true);
      }
      
      // Notify parent component if callback provided
      if (onToggle) {
        onToggle();
      }
    } catch (error) {
      console.error('Failed to update watchlist:', error);
      alert(error.response?.data?.error || 'Failed to update watchlist');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || checking) {
    return null;
  }

  return (
    <button
      onClick={handleToggleWatchlist}
      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${
        inWatchlist
          ? 'bg-green-600 hover:bg-green-700 text-white border-2 border-green-600'
          : 'bg-white hover:bg-blue-600 text-blue-600 hover:text-white border-2 border-blue-600'
      }`}
      disabled={loading}
      title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {loading ? (
        <span className="flex items-center">
          <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      ) : inWatchlist ? (
        <>✓ Saved</>
      ) : (
        <>+ Watchlist</>
      )}
    </button>
  );
};

export default WatchlistButton;

