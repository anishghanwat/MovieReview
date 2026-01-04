import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI } from '../utils/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import RatingDisplay from '../components/RatingDisplay';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState(null);
  const [ratingDistribution, setRatingDistribution] = useState([]);
  const [genreAnalysis, setGenreAnalysis] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [statsRes, ratingRes, genreRes, topMoviesRes] = await Promise.all([
        analyticsAPI.getStats(),
        analyticsAPI.getRatingDistribution(),
        analyticsAPI.getGenreAnalysis(),
        analyticsAPI.getTopMovies(10)
      ]);

      setStats(statsRes.data);
      setRatingDistribution(ratingRes.data);
      setGenreAnalysis(genreRes.data);
      setTopMovies(topMoviesRes.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Colors for pie chart
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  // Colors for bar chart
  const barColors = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
    '#ef4444', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];

  if (loading) {
    return (
      <div className="main-content">
        <div className="container-custom py-20">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-xl text-gray-600">Loading analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="relative overflow-hidden">
        {/* Hero Section */}
        <div className="container-custom py-12 lg:py-16">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome to MovieHub
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 font-light">
              Discover, rate, and review your favorite movies. Join our community of movie enthusiasts!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/movies" 
                className="btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                🎬 Browse Movies
              </Link>
              {!isAuthenticated && (
                <Link 
                  to="/login" 
                  className="btn-outline text-lg px-8 py-4 hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300"
                >
                  Sign In to Review
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Overview Statistics Cards */}
        {stats && (
          <div className="container-custom py-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Platform Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="card text-center bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:scale-105 transition-transform duration-300">
                <div className="text-5xl mb-4">🎬</div>
                <div className="text-4xl font-bold mb-2">{stats.totalMovies}</div>
                <div className="text-lg opacity-90">Total Movies</div>
              </div>
              <div className="card text-center bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:scale-105 transition-transform duration-300">
                <div className="text-5xl mb-4">⭐</div>
                <div className="text-4xl font-bold mb-2">{stats.totalReviews}</div>
                <div className="text-lg opacity-90">Total Reviews</div>
              </div>
              <div className="card text-center bg-gradient-to-br from-pink-500 to-pink-600 text-white hover:scale-105 transition-transform duration-300">
                <div className="text-5xl mb-4">👥</div>
                <div className="text-4xl font-bold mb-2">{stats.totalUsers}</div>
                <div className="text-lg opacity-90">Total Users</div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Rating Distribution Pie Chart */}
            <div className="card">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Rating Distribution</h3>
              {ratingDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ratingDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ratingDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-500">No rating data available</div>
              )}
            </div>

            {/* Genre Analysis Bar Chart */}
            <div className="card">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Movies by Genre</h3>
              {genreAnalysis.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={genreAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                      {genreAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-500">No genre data available</div>
              )}
            </div>
          </div>
        </div>

        {/* Top Movies Section */}
        {topMovies.length > 0 && (
          <div className="container-custom py-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Top Rated Movies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {topMovies.map((movie, index) => (
                <Link
                  key={movie._id}
                  to={`/movies/${movie._id}`}
                  className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {movie.imageUrl ? (
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
                      <img 
                        src={movie.imageUrl} 
                        alt={movie.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }} 
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-5xl" style={{ display: 'none' }}>
                        🎬
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-5xl">
                      🎬
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-blue-600">#{index + 1}</span>
                      <h3 className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors flex-1">
                        {movie.title}
                      </h3>
                    </div>
                    <div className="mb-2">
                      <RatingDisplay 
                        rating={movie.averageRating} 
                        totalReviews={movie.totalReviews}
                        showCount={true}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                        {movie.genre}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="container-custom py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center hover:scale-105 transition-transform duration-300">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Rate Movies</h3>
              <p className="text-gray-600">Share your thoughts and rate movies from 1 to 5 stars</p>
            </div>
            <div className="card text-center hover:scale-105 transition-transform duration-300">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Write Reviews</h3>
              <p className="text-gray-600">Express your opinions and help others discover great films</p>
            </div>
            <div className="card text-center hover:scale-105 transition-transform duration-300">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Save to Watchlist</h3>
              <p className="text-gray-600">Keep track of movies you want to watch later</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

