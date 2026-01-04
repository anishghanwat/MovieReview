const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Movie = require('../models/Movie');
const User = require('../models/User');
const Review = require('../models/Review');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/moviereview';

// Sample movies data
const sampleMovies = [
  {
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    genre: "Action",
    director: "Christopher Nolan",
    releaseDate: new Date("2008-07-18"),
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3ekE6Hhz9gvIbiFSUPxt-FyAh4zXTXX0bjQ&s"
  },
  {
    title: "Inception",
    description: "A skilled thief is given a chance at redemption if he can pull off an impossible task: Inception, the implantation of another person's idea into a target's subconscious.",
    genre: "Sci-Fi",
    director: "Christopher Nolan",
    releaseDate: new Date("2010-07-16"),
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg"
  },
  {
    title: "The Shawshank Redemption",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    genre: "Drama",
    director: "Frank Darabont",
    releaseDate: new Date("1994-09-23"),
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_.jpg"
  },
  {
    title: "Pulp Fiction",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    genre: "Crime",
    director: "Quentin Tarantino",
    releaseDate: new Date("1994-10-14"),
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Pulp_Fiction_%281994%29_poster.jpg/250px-Pulp_Fiction_%281994%29_poster.jpg"
  },
  {
    title: "The Matrix",
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    genre: "Sci-Fi",
    director: "The Wachowskis",
    releaseDate: new Date("1999-03-31"),
    imageUrl: "https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
  },
  {
    title: "Forrest Gump",
    description: "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other historical events unfold through the perspective of an Alabama man with an IQ of 75.",
    genre: "Drama",
    director: "Robert Zemeckis",
    releaseDate: new Date("1994-07-06"),
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_.jpg"
  },
  {
    title: "The Godfather",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    genre: "Crime",
    director: "Francis Ford Coppola",
    releaseDate: new Date("1972-03-24"),
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_.jpg"
  },
  {
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    genre: "Sci-Fi",
    director: "Christopher Nolan",
    releaseDate: new Date("2014-11-07"),
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0zt0lp-O3XdL8zzdrEvyzmcl6kOwfgbv4xQ&s"
  },
  {
    title: "The Avengers",
    description: "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
    genre: "Action",
    director: "Joss Whedon",
    releaseDate: new Date("2012-05-04"),
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNGE0YTVjNzUtNzJjOS00NGNlLTgxMzctZTY4YTE1Y2Y1ZTU4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
  },
  {
    title: "Parasite",
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    genre: "Thriller",
    director: "Bong Joon-ho",
    releaseDate: new Date("2019-05-30"),
    imageUrl: "https://m.media-amazon.com/images/M/MV5BYjk1Y2U4MjQtY2ZiNS00OWQyLWI3MmYtZWUwNmRjYWRiNWNhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
  },
  {
    title: "The Lion King",
    description: "Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.",
    genre: "Animation",
    director: "Roger Allers",
    releaseDate: new Date("1994-06-24"),
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDdZliCqYzFyAaO1UHNrO0-UT5wx67rCvkbQ&s"
  },
  {
    title: "Titanic",
    description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
    genre: "Romance",
    director: "James Cameron",
    releaseDate: new Date("1997-12-19"),
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/18/Titanic_%281997_film%29_poster.png"
  },
  {
    title: "Gladiator",
    description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    genre: "Action",
    director: "Ridley Scott",
    releaseDate: new Date("2000-05-05"),
    imageUrl: "https://m.media-amazon.com/images/M/MV5BYWQ4YmNjYjEtOWE1Zi00Y2U4LWI4NTAtMTU0MjkxNWQ1ZmJiXkEyXkFqcGc@._V1_.jpg"
  },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    description: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
    genre: "Fantasy",
    director: "Peter Jackson",
    releaseDate: new Date("2001-12-19"),
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNzIxMDQ2YTctNDY4MC00ZTRhLTk4ODQtMTVlOWY4NTdiYmMwXkEyXkFqcGc@._V1_.jpg"
  },
  {
    title: "Fight Club",
    description: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.",
    genre: "Drama",
    director: "David Fincher",
    releaseDate: new Date("1999-10-15"),
    imageUrl: "https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_.jpg"
  },
  {
    title: "Goodfellas",
    description: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners.",
    genre: "Crime",
    director: "Martin Scorsese",
    releaseDate: new Date("1990-09-21"),
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/7/7b/Goodfellas.jpg"
  },
  {
    title: "The Prestige",
    description: "After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.",
    genre: "Thriller",
    director: "Christopher Nolan",
    releaseDate: new Date("2006-10-20"),
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/d/d2/Prestige_poster.jpg"
  },
  {
    title: "Whiplash",
    description: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
    genre: "Drama",
    director: "Damien Chazelle",
    releaseDate: new Date("2014-10-15"),
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa8vP_EnwZjgqOPMScTd8zUcHE3qQ3_jP9Kw&s"
  },
  {
    title: "Mad Max: Fury Road",
    description: "In a post-apocalyptic wasteland, Max teams up with a mysterious woman, Furiosa, to escape from a tyrannical warlord.",
    genre: "Action",
    director: "George Miller",
    releaseDate: new Date("2015-05-15"),
    imageUrl: "https://m.media-amazon.com/images/M/MV5BZDRkODJhOTgtOTc1OC00NTgzLTk4NjItNDgxZDY4YjlmNDY2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
  },
  {
    title: "Get Out",
    description: "A young African-American visits his white girlfriend's parents for the weekend, where his uneasiness about their reception of him eventually reaches a boiling point.",
    genre: "Horror",
    director: "Jordan Peele",
    releaseDate: new Date("2017-02-24"),
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMjUxMDQwNjcyNl5BMl5BanBnXkFtZTgwNzcwMzc0MTI@._V1_FMjpg_UX1000_.jpg"
  }
];

// Sample users data
const sampleUsers = [
  { name: "John Doe", email: "john@example.com", password: "password123", role: "user" },
  { name: "Jane Smith", email: "jane@example.com", password: "password123", role: "user" },
  { name: "Mike Johnson", email: "mike@example.com", password: "password123", role: "user" },
  { name: "Sarah Williams", email: "sarah@example.com", password: "password123", role: "user" },
  { name: "David Brown", email: "david@example.com", password: "password123", role: "user" },
  { name: "Emily Davis", email: "emily@example.com", password: "password123", role: "user" },
  { name: "Chris Wilson", email: "chris@example.com", password: "password123", role: "user" },
  { name: "Lisa Anderson", email: "lisa@example.com", password: "password123", role: "user" }
];

// Sample review comments
const reviewComments = [
  "Absolutely fantastic! One of the best movies I've ever seen.",
  "Great storyline and amazing performances by the cast.",
  "A masterpiece of cinema. Highly recommended!",
  "Enjoyed every minute of it. The cinematography was stunning.",
  "Good movie but could have been better in some parts.",
  "Not my favorite, but still worth watching.",
  "Brilliant direction and acting. A must-watch!",
  "The plot was engaging and kept me on the edge of my seat.",
  "Overrated in my opinion, but still decent.",
  "Loved the character development and story arc.",
  "One of the classics that never gets old.",
  "Amazing visual effects and great storytelling.",
  "The ending was unexpected and brilliant!",
  "Good entertainment value, perfect for a movie night.",
  "The soundtrack was incredible and added so much to the experience."
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...');
    await Movie.deleteMany({});
    await Review.deleteMany({});
    // Don't delete users to avoid deleting admin accounts
    // await User.deleteMany({});

    // Create users
    console.log('Creating users...');
    const users = [];
    for (const userData of sampleUsers) {
      // Check if user already exists
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        // Create new user - password will be hashed by the pre-save hook
        user = new User(userData);
        await user.save();
        users.push(user);
      } else {
        users.push(user);
      }
    }
    console.log(`Created/found ${users.length} users`);

    // Create movies
    console.log('Creating movies...');
    const movies = [];
    for (const movieData of sampleMovies) {
      const movie = new Movie(movieData);
      await movie.save();
      movies.push(movie);
    }
    console.log(`Created ${movies.length} movies`);

    // Create reviews
    console.log('Creating reviews...');
    let reviewCount = 0;

    // Create multiple reviews for each movie
    for (const movie of movies) {
      // Each movie gets 3-8 reviews from random users
      const numReviews = Math.floor(Math.random() * 6) + 3;

      for (let i = 0; i < numReviews; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomRating = Math.floor(Math.random() * 5) + 1; // 1-5 stars
        const randomComment = reviewComments[Math.floor(Math.random() * reviewComments.length)];

        // Check if user already reviewed this movie
        const existingReview = await Review.findOne({
          movieId: movie._id,
          userId: randomUser._id
        });

        if (!existingReview) {
          const review = new Review({
            movieId: movie._id,
            userId: randomUser._id,
            rating: randomRating,
            comment: randomComment
          });
          await review.save();
          reviewCount++;
        }
      }
    }
    console.log(`Created ${reviewCount} reviews`);

    console.log('\n✅ Database seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Movies: ${movies.length}`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Reviews: ${reviewCount}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();

