const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const User = require('../models/User');

// GET overview statistics
router.get('/stats', async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalUsers = await User.countDocuments();
    
    // Calculate average rating across all movies
    const reviews = await Review.find();
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    res.json({
      totalMovies,
      totalReviews,
      totalUsers,
      averageRating: Math.round(averageRating * 10) / 10
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET rating distribution
router.get('/rating-distribution', async (req, res) => {
  try {
    const reviews = await Review.find();
    const distribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };

    reviews.forEach(review => {
      const rating = review.rating;
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++;
      }
    });

    // Convert to array format for Recharts
    const data = Object.keys(distribution).map(rating => ({
      name: `${rating} Star${rating > 1 ? 's' : ''}`,
      value: distribution[rating],
      rating: parseInt(rating)
    }));

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET genre analysis
router.get('/genre-analysis', async (req, res) => {
  try {
    const movies = await Movie.find();
    const genreCount = {};

    movies.forEach(movie => {
      const genre = movie.genre || 'Unknown';
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });

    // Convert to array format and sort by count
    const data = Object.keys(genreCount)
      .map(genre => ({
        name: genre,
        count: genreCount[genre]
      }))
      .sort((a, b) => b.count - a.count);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET top rated movies
router.get('/top-movies', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const movies = await Movie.find();

    // Calculate average rating for each movie
    const moviesWithRatings = await Promise.all(
      movies.map(async (movie) => {
        const reviews = await Review.find({ movieId: movie._id });
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
          : 0;

        return {
          ...movie.toObject(),
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews
        };
      })
    );

    // Filter movies with at least 1 review and sort by rating
    const topMovies = moviesWithRatings
      .filter(movie => movie.totalReviews > 0)
      .sort((a, b) => {
        // First sort by rating (descending)
        if (b.averageRating !== a.averageRating) {
          return b.averageRating - a.averageRating;
        }
        // Then by number of reviews (descending)
        return b.totalReviews - a.totalReviews;
      })
      .slice(0, limit);

    res.json(topMovies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

