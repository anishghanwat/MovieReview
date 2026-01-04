import React, { useState } from 'react';

const ReviewForm = ({ review, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(review?.rating || 0);
  const [comment, setComment] = useState(review?.comment || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      alert('Please write a comment');
      return;
    }
    onSubmit({ rating, comment });
  };

  return (
    <div className="card">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        {review ? 'Edit Review' : 'Write a Review'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Rating
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`text-3xl transition-all duration-200 cursor-pointer ${
                  star <= rating 
                    ? 'text-yellow-400 hover:text-yellow-500 transform hover:scale-110' 
                    : 'text-gray-300 hover:text-yellow-300'
                }`}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
            <span className="ml-4 text-lg font-semibold text-gray-700">
              {rating}/5
            </span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review here..."
            rows="5"
            className="input-field resize-none"
            required
          />
        </div>
        <div className="flex gap-4">
          <button type="submit" className="btn-primary">
            {review ? 'Update Review' : 'Submit Review'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;

