const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware for parsing incoming request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create a Mongoose schema and model for the user data
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Handle POST request to /submit
app.post('/submit', (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    // Save the user data to MongoDB
    newUser.save((err) => {
        if (err) {
            console.error('Error saving user data:', err);
            res.status(500).send('Error saving user data');
        } else {
            console.log('User data saved successfully');
            res.status(200).send('User data saved successfully');
        }
    });
});

// Start the server
const PORT = 5500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
