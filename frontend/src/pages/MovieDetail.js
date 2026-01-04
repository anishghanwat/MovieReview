import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { moviesAPI, reviewsAPI } from '../utils/api';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import RatingDisplay from '../components/RatingDisplay';
import WatchlistButton from '../components/WatchlistButton';

const MovieDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetchMovie();
    fetchReviews();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const response = await moviesAPI.getById(id);
      setMovie(response.data);
    } catch (err) {
      setError('Failed to load movie');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getByMovieId(id);
      setReviews(response.data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      if (editingReview) {
        await reviewsAPI.update(editingReview._id, reviewData);
      } else {
        await reviewsAPI.create({ ...reviewData, movieId: id });
      }
      
      setShowReviewForm(false);
      setEditingReview(null);
      fetchReviews();
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert(err.response?.data?.error || 'Failed to submit review');
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await reviewsAPI.delete(reviewId);
      fetchReviews();
    } catch (err) {
      console.error('Failed to delete review:', err);
      alert(err.response?.data?.error || 'Failed to delete review');
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

  if (error || !movie) {
    return (
      <div className="main-content">
        <div className="container-custom py-20">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error || 'Movie not found'}
          </div>
        </div>
      </div>
    );
  }

  const userReview = reviews.find(r => r.userId?._id === user?.id || r.userId === user?.id);

  return (
    <div className="main-content">
      <div className="container-custom py-8">
        <Link to="/movies" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Movies
        </Link>
        
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row gap-8 mb-6">
            {movie.imageUrl && (
              <div className="flex-shrink-0 w-full lg:w-80">
                <img 
                  src={movie.imageUrl} 
                  alt={movie.title} 
                  className="w-full h-auto rounded-xl shadow-lg object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }} 
                />
                <div className="hidden w-full h-96 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl items-center justify-center text-6xl">
                  🎬
                </div>
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {movie.title}
              </h1>
              {movie.averageRating > 0 && (
                <div className="mb-4">
                  <RatingDisplay 
                    rating={movie.averageRating} 
                    totalReviews={movie.totalReviews}
                    showCount={true}
                  />
                </div>
              )}
              {movie.averageRating === 0 && (
                <div className="text-gray-400 italic mb-4">No ratings yet</div>
              )}
              <div className="mb-4">
                <WatchlistButton movieId={movie._id} />
              </div>
              <div className="flex flex-wrap gap-4 mb-4">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
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
          </div>
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Description</h3>
            <p className="text-gray-700 leading-relaxed">{movie.description}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Reviews <span className="text-blue-600">({reviews.length})</span>
          </h2>
          
          {isAuthenticated && (
            <div className="mb-6">
              {!userReview ? (
                <button 
                  onClick={() => setShowReviewForm(true)} 
                  className="btn-primary"
                >
                  ✍️ Write a Review
                </button>
              ) : (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                  You have already reviewed this movie. You can edit or delete your review below.
                </div>
              )}
              
              {showReviewForm && (
                <div className="mt-4">
                  <ReviewForm
                    movieId={id}
                    review={editingReview || userReview}
                    onSubmit={handleReviewSubmit}
                    onCancel={() => {
                      setShowReviewForm(false);
                      setEditingReview(null);
                    }}
                  />
                </div>
              )}
            </div>
          )}

          <ReviewList
            reviews={reviews}
            currentUserId={user?.id}
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
          />
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;


