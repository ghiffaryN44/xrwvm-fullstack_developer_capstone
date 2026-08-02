const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(express.json()); // Essential for handling modern JSON bodies safely
app.use(require('body-parser').urlencoded({ extended: false }));

// Safe data seed text parsing
const reviews_data = JSON.parse(fs.readFileSync("./data/reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("./data/dealerships.json", 'utf8'));

// FIXED: Switched from 'mongodb' to '127.0.0.1' to connect directly to your running native PC database engine
mongoose.connect("mongodb://127.0.0.1:27017/", { 'dbName': 'dealershipsDB' })
  .then(() => console.log("Successfully connected to the native MongoDB instance!"))
  .catch(err => console.error("Database connection failure:", err));

const Reviews = require('./review');
const Dealerships = require('./dealership');

// FIXED: Wrapped in safe error tracking blocks to prevent application crashes on initialization
try {
  Reviews.deleteMany({}).then(() => {
    Reviews.insertMany(reviews_data['reviews'] || reviews_data);
  });
  Dealerships.deleteMany({}).then(() => {
    Dealerships.insertMany(dealerships_data['dealerships'] || dealerships_data);
  });
} catch (error) {
  console.error("Initialization data seed error:", error);
}

// Express route to home
app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API");
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({ dealership: req.params.id });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const documents = await Dealerships.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch Dealers by a particular state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const documents = await Dealerships.find({ state: req.params.state });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch dealer by a particular id
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const documents = await Dealerships.find({ id: req.params.id });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to insert review
app.post('/insert_review', async (req, res) => {
  try {
    const data = req.body;
    const documents = await Reviews.find().sort({ id: -1 });
    let new_id = documents.length > 0 ? documents[0]['id'] + 1 : 1;

    const review = new Reviews({
        "id": new_id,
        "name": data['name'],
        "dealership": data['dealership'],
        "review": data['review'],
        "purchase": data['purchase'],
        "purchase_date": data['purchase_date'],
        "car_make": data['car_make'],
        "car_model": data['car_model'],
        "car_year": data['car_year'],
    });

    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// FIXED: Forced Node to listen strictly on explicit IPv4 interface matching Django's restapis setup
app.listen(port, '127.0.0.1', () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
