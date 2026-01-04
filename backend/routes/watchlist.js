const express = require('express');
const router = express.Router();
const Watchlist = require('../models/Watchlist');
const Movie = require('../models/Movie');
const { authenticate } = require('../middleware/auth');

// GET user's watchlist
router.get('/', authenticate, async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ userId: req.userId })
      .populate('movieId')
      .sort({ addedAt: -1 });
    
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add movie to watchlist
router.post('/:movieId', authenticate, async (req, res) => {
  try {
    // Check if movie exists
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Check if already in watchlist
    const existing = await Watchlist.findOne({
      userId: req.userId,
      movieId: req.params.movieId
    });

    if (existing) {
      return res.status(400).json({ error: 'Movie already in watchlist' });
    }

    const watchlistItem = new Watchlist({
      userId: req.userId,
      movieId: req.params.movieId
    });

    await watchlistItem.save();
    await watchlistItem.populate('movieId');
    
    res.status(201).json(watchlistItem);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Movie already in watchlist' });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE remove movie from watchlist
router.delete('/:movieId', authenticate, async (req, res) => {
  try {
    const watchlistItem = await Watchlist.findOneAndDelete({
      userId: req.userId,
      movieId: req.params.movieId
    });

    if (!watchlistItem) {
      return res.status(404).json({ error: 'Movie not in watchlist' });
    }

    res.json({ message: 'Movie removed from watchlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET check if movie is in user's watchlist
router.get('/check/:movieId', authenticate, async (req, res) => {
  try {
    const watchlistItem = await Watchlist.findOne({
      userId: req.userId,
      movieId: req.params.movieId
    });

    res.json({ inWatchlist: !!watchlistItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

