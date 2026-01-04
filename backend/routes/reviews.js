const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Movie = require('../models/Movie');
const { authenticate } = require('../middleware/auth');

// GET all reviews for a specific movie
router.get('/movie/:movieId', async (req, res) => {
    try {
        const reviews = await Review.find({ movieId: req.params.movieId })
            .populate('movieId', 'title')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET all reviews by the authenticated user
router.get('/user', authenticate, async (req, res) => {
    try {
        const reviews = await Review.find({ userId: req.userId })
            .populate('movieId', 'title')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single review by ID
router.get('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate('movieId', 'title')
            .populate('userId', 'name email');
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create review (authenticated users only)
router.post('/', authenticate, async (req, res) => {
    try {
        // Verify movie exists
        const movie = await Movie.findById(req.body.movieId);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        // Check if user already reviewed this movie
        const existingReview = await Review.findOne({
            movieId: req.body.movieId,
            userId: req.userId
        });

        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this movie. Update your existing review instead.' });
        }

        const review = new Review({
            ...req.body,
            userId: req.userId
        });
        await review.save();
        await review.populate('movieId', 'title');
        await review.populate('userId', 'name email');
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT update review (only the author can update)
router.put('/:id', authenticate, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Only allow the author to update
        if (review.userId.toString() !== req.userId) {
            return res.status(403).json({ error: 'You can only update your own reviews' });
        }

        // Don't allow changing movieId or userId
        const { movieId, userId, ...updateData } = req.body;
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        )
            .populate('movieId', 'title')
            .populate('userId', 'name email');

        res.json(updatedReview);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE review (only the author can delete)
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Only allow the author to delete
        if (review.userId.toString() !== req.userId) {
            return res.status(403).json({ error: 'You can only delete your own reviews' });
        }

        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

