import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { moviesAPI } from '../utils/api';
import MovieForm from '../components/MovieForm';

const AdminMovies = () => {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
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

  const handleMovieSubmit = async (movieData) => {
    try {
      if (editingMovie) {
        await moviesAPI.update(editingMovie._id, movieData);
      } else {
        await moviesAPI.create(movieData);
      }
      
      setShowForm(false);
      setEditingMovie(null);
      fetchMovies();
    } catch (err) {
      console.error('Failed to save movie:', err);
      alert(err.response?.data?.error || 'Failed to save movie');
    }
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setShowForm(true);
  };

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm('Are you sure you want to delete this movie? All associated reviews will also be deleted.')) return;
    
    try {
      await moviesAPI.delete(movieId);
      fetchMovies();
    } catch (err) {
      console.error('Failed to delete movie:', err);
      alert(err.response?.data?.error || 'Failed to delete movie');
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="container-custom py-20">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-xl text-gray-600">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container-custom py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Admin Panel - Movie Management
          </h1>
          <button onClick={() => setShowForm(true)} className="btn-primary whitespace-nowrap">
            ➕ Add New Movie
          </button>
        </div>

        {showForm && (
          <div className="mb-8">
            <MovieForm
              movie={editingMovie}
              onSubmit={handleMovieSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingMovie(null);
              }}
            />
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {movies.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-xl text-gray-600">No movies found. Add your first movie!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {movies.map((movie) => (
              <div key={movie._id} className="card flex flex-col sm:flex-row gap-6">
                {movie.imageUrl && (
                  <div className="flex-shrink-0 w-full sm:w-48 h-64">
                    <img 
                      src={movie.imageUrl} 
                      alt={movie.title} 
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }} 
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{movie.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                        {movie.genre}
                      </span>
                      <span className="text-gray-600">
                        <span className="font-semibold">Director:</span> {movie.director}
                      </span>
                      <span className="text-gray-600">
                        <span className="font-semibold">Released:</span> {new Date(movie.releaseDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 flex-1">{movie.description.substring(0, 150)}...</p>
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleEditMovie(movie)}
                      className="btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMovie(movie._id)}
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMovies;

