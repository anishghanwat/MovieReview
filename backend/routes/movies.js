const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const { authenticate, requireAdmin } = require('../middleware/auth');

// GET all movies with ratings (public route)
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        
        // Calculate average rating and review count for each movie
        const moviesWithRatings = await Promise.all(
            movies.map(async (movie) => {
                const reviews = await Review.find({ movieId: movie._id });
                const totalReviews = reviews.length;
                const averageRating = totalReviews > 0
                    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
                    : 0;
                
                return {
                    ...movie.toObject(),
                    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
                    totalReviews
                };
            })
        );
        
        res.json(moviesWithRatings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single movie by ID with ratings (public route)
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        
        // Calculate average rating and review count
        const reviews = await Review.find({ movieId: movie._id });
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
            : 0;
        
        const movieWithRating = {
            ...movie.toObject(),
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews
        };
        
        res.json(movieWithRating);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create movie (admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
    try {
        const movie = new Movie(req.body);
        await movie.save();
        res.status(201).json(movie);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT update movie (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(movie);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE movie (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

