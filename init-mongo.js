// MongoDB initialization script for movie booking application
// This script initializes sample data for movies, theatres, and showtimes

// Connect to the moviebooking database
db = db.getSiblingDB('moviebooking');

// Clear existing collections
print('Clearing existing collections...');
db.movies.deleteMany({});
db.theatres.deleteMany({});
db.showtimes.deleteMany({});

print('Initializing sample data...');

// Initialize Movies
print('Creating movies...');
const movies = [
    {
        _id: ObjectId(),
        title: "The Dark Knight",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        genre: "Action",
        rating: 9.0,
        duration: 152,
        language: "English",
        posterUrl: "https://images.pexels.com/photos/3137890/pexels-photo-3137890.jpeg",
        releaseDate: new Date("2024-03-15T00:00:00.000Z"),
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId(),
        title: "Inception",
        description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        genre: "Sci-Fi",
        rating: 8.8,
        duration: 148,
        language: "English",
        posterUrl: "https://images.unsplash.com/photo-1572188863110-46d457c9234d",
        releaseDate: new Date("2024-03-20T00:00:00.000Z"),
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId(),
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        genre: "Sci-Fi",
        rating: 8.6,
        duration: 169,
        language: "English",
        posterUrl: "https://images.pexels.com/photos/109669/pexels-photo-109669.jpeg",
        releaseDate: new Date("2024-03-25T00:00:00.000Z"),
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId(),
        title: "Avengers: Endgame",
        description: "After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
        genre: "Action",
        rating: 8.4,
        duration: 181,
        language: "English",
        posterUrl: "https://images.pexels.com/photos/33129/popcorn-movie-party-entertainment.jpg",
        releaseDate: new Date("2024-04-01T00:00:00.000Z"),
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId(),
        title: "Spider-Man: No Way Home",
        description: "Spider-Man's identity is revealed and he asks Doctor Strange for help, but when a spell goes wrong, dangerous foes from other worlds appear.",
        genre: "Action",
        rating: 8.2,
        duration: 148,
        language: "English",
        posterUrl: "https://images.pexels.com/photos/375885/pexels-photo-375885.jpeg",
        releaseDate: new Date("2024-04-05T00:00:00.000Z"),
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId(),
        title: "Dune",
        description: "Paul Atreides leads nomadic tribes in a revolt against the evil Harkonnen oppressors on the desert planet Arrakis.",
        genre: "Sci-Fi",
        rating: 8.0,
        duration: 155,
        language: "English",
        posterUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c",
        releaseDate: new Date("2024-04-10T00:00:00.000Z"),
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

const movieResult = db.movies.insertMany(movies);
print(`Inserted ${movieResult.insertedIds.length} movies`);

// Initialize Theatres
print('Creating theatres...');
const theatres = [
    {
        _id: ObjectId(),
        name: "PVR Cinemas",
        location: "Mumbai",
        totalSeats: 100,
        rows: 10,
        seatsPerRow: 10,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId(),
        name: "INOX",
        location: "Delhi",
        totalSeats: 80,
        rows: 8,
        seatsPerRow: 10,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId(),
        name: "Cinepolis",
        location: "Bangalore",
        totalSeats: 120,
        rows: 12,
        seatsPerRow: 10,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

const theatreResult = db.theatres.insertMany(theatres);
print(`Inserted ${theatreResult.insertedIds.length} theatres`);

// Initialize Showtimes
print('Creating showtimes...');
const showTimes = [
    new Date("2024-03-16T10:00:00.000Z"),  // 10:00 AM
    new Date("2024-03-16T13:30:00.000Z"),  // 1:30 PM
    new Date("2024-03-16T17:00:00.000Z"),  // 5:00 PM
    new Date("2024-03-16T20:30:00.000Z")   // 8:30 PM
];

let showtimes = [];
let showtimeCounter = 0;

// Create showtimes for each movie at each theatre for each show time
movies.forEach(movie => {
    theatres.forEach(theatre => {
        showTimes.forEach(showTime => {
            showtimes.push({
                _id: ObjectId(),
                movieId: movie._id,
                theatreId: theatre._id,
                showDate: showTime,
                price: 250.0,
                availableSeats: theatre.totalSeats,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            showtimeCounter++;
        });
    });
});

const showtimeResult = db.showtimes.insertMany(showtimes);
print(`Inserted ${showtimeResult.insertedIds.length} showtimes`);

// Create indexes for better performance
print('Creating indexes...');

// Movie indexes
db.movies.createIndex({ "title": 1 });
db.movies.createIndex({ "genre": 1 });
db.movies.createIndex({ "releaseDate": 1 });

// Theatre indexes
db.theatres.createIndex({ "name": 1 });
db.theatres.createIndex({ "location": 1 });

// Showtime indexes
db.showtimes.createIndex({ "movieId": 1 });
db.showtimes.createIndex({ "theatreId": 1 });
db.showtimes.createIndex({ "showDate": 1 });
db.showtimes.createIndex({ "movieId": 1, "theatreId": 1, "showDate": 1 });

print('Sample data initialization completed successfully!');
print(`Summary:`);
print(`- Movies: ${movies.length}`);
print(`- Theatres: ${theatres.length}`);
print(`- Showtimes: ${showtimes.length}`);

// Verify data
print('\nVerifying data...');
print(`Movies in database: ${db.movies.countDocuments()}`);
print(`Theatres in database: ${db.theatres.countDocuments()}`);
print(`Showtimes in database: ${db.showtimes.countDocuments()}`);

print('\nInitialization script completed!');