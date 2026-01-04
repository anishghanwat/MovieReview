import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { watchlistAPI } from '../utils/api';
import RatingDisplay from '../components/RatingDisplay';
import WatchlistButton from '../components/WatchlistButton';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = await watchlistAPI.getAll();
      setWatchlist(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load watchlist');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  if (loading) {
    return (
      <div className="main-content">
        <div className="container-custom py-20">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-xl text-gray-600">Loading watchlist...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="container-custom py-20">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container-custom py-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          My Watchlist
        </h1>
        
        {watchlist.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-xl text-gray-600 mb-6">Your watchlist is empty.</p>
            <Link to="/movies" className="btn-primary">Browse Movies</Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600 font-medium">
                You have <span className="text-blue-600 font-bold">{watchlist.length}</span> {watchlist.length === 1 ? 'movie' : 'movies'} in your watchlist
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {watchlist.map((item) => {
                const movie = item.movieId;
                if (!movie) return null;
                
                return (
                  <div key={item._id} className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col">
                    <Link to={`/movies/${movie._id}`} className="flex-1 flex flex-col">
                      <div className="relative h-80 overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
                        {movie.imageUrl ? (
                          <img 
                            src={movie.imageUrl} 
                            alt={movie.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="absolute inset-0 flex items-center justify-center text-6xl" style={{ display: movie.imageUrl ? 'none' : 'flex' }}>
                          🎬
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {movie.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {movie.genre}
                          </span>
                          <span className="text-sm text-gray-500">{movie.director}</span>
                        </div>
                        {movie.averageRating > 0 && (
                          <div className="mb-3">
                            <RatingDisplay
                              rating={movie.averageRating}
                              totalReviews={movie.totalReviews}
                              showCount={true}
                            />
                          </div>
                        )}
                        {movie.averageRating === 0 && (
                          <div className="text-sm text-gray-400 italic mb-3">No ratings yet</div>
                        )}
                        <p className="text-xs text-gray-500 mt-auto pt-3 border-t border-gray-100">
                          Added {new Date(item.addedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                    <div className="p-5 pt-0">
                      <WatchlistButton movieId={movie._id} onToggle={fetchWatchlist} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Watchlist;

