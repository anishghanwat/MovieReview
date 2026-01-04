import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { moviesAPI } from '../utils/api';
import RatingDisplay from '../components/RatingDisplay';
import WatchlistButton from '../components/WatchlistButton';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await moviesAPI.getAll();
      setMovies(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load movies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique genres from movies
  const genres = useMemo(() => {
    const uniqueGenres = [...new Set(movies.map(movie => movie.genre))];
    return uniqueGenres.sort();
  }, [movies]);

  // Filter and sort movies
  const filteredAndSortedMovies = useMemo(() => {
    // First filter movies
    let filtered = movies.filter(movie => {
      // Search by name
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           movie.director.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by genre
      const matchesGenre = selectedGenre === 'all' || movie.genre === selectedGenre;

      // Filter by rating
      let matchesRating = true;
      if (ratingFilter !== 'all') {
        const rating = movie.averageRating || 0;
        switch (ratingFilter) {
          case '4+':
            matchesRating = rating >= 4;
            break;
          case '3+':
            matchesRating = rating >= 3;
            break;
          case '2+':
            matchesRating = rating >= 2;
            break;
          case '1+':
            matchesRating = rating >= 1;
            break;
          case 'no-rating':
            matchesRating = rating === 0;
            break;
          default:
            matchesRating = true;
        }
      }

      return matchesSearch && matchesGenre && matchesRating;
    });

    // Then sort movies
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating-high':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'rating-low':
          return (a.averageRating || 0) - (b.averageRating || 0);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'date-newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date-oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'release-newest':
          return new Date(b.releaseDate) - new Date(a.releaseDate);
        case 'release-oldest':
          return new Date(a.releaseDate) - new Date(b.releaseDate);
        case 'reviews-most':
          return (b.totalReviews || 0) - (a.totalReviews || 0);
        case 'reviews-least':
          return (a.totalReviews || 0) - (b.totalReviews || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [movies, searchQuery, selectedGenre, ratingFilter, sortBy]);

  if (loading) {
    return (
      <div className="main-content">
        <div className="container-custom py-20">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-xl text-gray-600">Loading movies...</span>
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
          All Movies
        </h1>
        
        {/* Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by movie name or director..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div>
              <label htmlFor="genre-filter" className="block text-sm font-semibold text-gray-700 mb-2">
                Genre
              </label>
              <select
                id="genre-filter"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="input-field"
              >
                <option value="all">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="rating-filter" className="block text-sm font-semibold text-gray-700 mb-2">
                Rating
              </label>
              <select
                id="rating-filter"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Ratings</option>
                <option value="4+">4+ Stars</option>
                <option value="3+">3+ Stars</option>
                <option value="2+">2+ Stars</option>
                <option value="1+">1+ Stars</option>
                <option value="no-rating">No Ratings</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sort-filter" className="block text-sm font-semibold text-gray-700 mb-2">
                Sort By
              </label>
              <select
                id="sort-filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                <option value="newest">Newest First</option>
                <option value="date-oldest">Oldest First</option>
                <option value="rating-high">Highest Rated</option>
                <option value="rating-low">Lowest Rated</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="release-newest">Release Date (Newest)</option>
                <option value="release-oldest">Release Date (Oldest)</option>
                <option value="reviews-most">Most Reviewed</option>
                <option value="reviews-least">Least Reviewed</option>
              </select>
            </div>

            {(searchQuery || selectedGenre !== 'all' || ratingFilter !== 'all') && (
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedGenre('all');
                    setRatingFilter('all');
                    setSortBy('newest');
                  }}
                  className="btn-secondary w-full md:w-auto"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 font-medium">
            Showing <span className="text-blue-600 font-bold">{filteredAndSortedMovies.length}</span> of{' '}
            <span className="text-gray-800 font-bold">{movies.length}</span> movies
          </p>
        </div>

        {filteredAndSortedMovies.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-600">
              {searchQuery || selectedGenre !== 'all' || ratingFilter !== 'all' 
                ? 'No movies match your filters. Try adjusting your search criteria.'
                : 'No movies available. Check back later!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedMovies.map((movie) => (
              <div key={movie._id} className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <Link to={`/movies/${movie._id}`} className="block">
                  {movie.imageUrl ? (
                    <div className="relative h-80 overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
                      <img 
                        src={movie.imageUrl} 
                        alt={movie.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }} 
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-6xl" style={{ display: 'none' }}>
                        🎬
                      </div>
                    </div>
                  ) : (
                    <div className="h-80 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-6xl">
                      🎬
                    </div>
                  )}
                  <div className="p-5">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {movie.title}
                      </h3>
                      {movie.averageRating > 0 && (
                        <RatingDisplay 
                          rating={movie.averageRating} 
                          totalReviews={movie.totalReviews}
                          showCount={true}
                        />
                      )}
                      {movie.averageRating === 0 && (
                        <div className="text-sm text-gray-400 italic">No ratings yet</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {movie.genre}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(movie.releaseDate).getFullYear()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 font-medium">
                      Director: <span className="text-gray-800">{movie.director}</span>
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {movie.description.substring(0, 120)}...
                    </p>
                  </div>
                </Link>
                <div className="absolute top-3 right-3 z-10">
                  <WatchlistButton movieId={movie._id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;

