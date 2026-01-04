import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reviewsAPI } from '../utils/api';

const MyReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchReviews();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getByUser();
      setReviews(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load reviews');
      console.error(err);
    } finally {
      setLoading(false);
    }
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
            <span className="ml-4 text-xl text-gray-600">Loading your reviews...</span>
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
          My Reviews
        </h1>
        {reviews.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-xl text-gray-600 mb-6">You haven't written any reviews yet.</p>
            <Link to="/movies" className="btn-primary">Browse Movies</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="card">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                  <Link 
                    to={`/movies/${review.movieId._id || review.movieId}`} 
                    className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
                  >
                    {review.movieId.title || review.movieId}
                  </Link>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-xl ${
                          star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200 gap-4">
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                    {review.updatedAt !== review.createdAt && (
                      <span className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">(edited)</span>
                    )}
                  </span>
                  <div className="flex gap-3">
                    <Link
                      to={`/movies/${review.movieId._id || review.movieId}`}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors text-sm"
                    >
                      View Movie
                    </Link>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors text-sm"
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

export default MyReviews;
