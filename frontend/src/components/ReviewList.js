import React from 'react';

const ReviewList = ({ reviews, currentUserId, onEdit, onDelete }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
        <div className="text-5xl mb-4">💬</div>
        <p className="text-xl text-gray-600">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review._id} className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
              {review.updatedAt !== review.createdAt && (
                <span className="px-2 py-1 bg-gray-100 rounded text-xs">(edited)</span>
              )}
            </div>
          </div>
          {review.userId && (
            <div className="mb-3">
              <span className="text-sm text-gray-500">By: </span>
              <strong className="text-gray-800">{review.userId.name || review.userId.email}</strong>
            </div>
          )}
          <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
          {currentUserId && (review.userId?._id === currentUserId || review.userId === currentUserId) && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => onEdit(review)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(review._id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;

