import React from 'react';

const RatingDisplay = ({ rating, totalReviews, showCount = true }) => {
  if (!rating || rating === 0) {
    return null;
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5 && rating < 5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-xl">★</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400 text-xl opacity-50">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={i} className="text-gray-300 text-xl">★</span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-gray-800">{rating.toFixed(1)}</span>
        {showCount && totalReviews !== undefined && (
          <span className="text-sm text-gray-500">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
        )}
      </div>
    </div>
  );
};

export default RatingDisplay;

