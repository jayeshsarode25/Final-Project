const express = require("express");
const cookieParser = require("cookie-parser");
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20')
const cors = require("cors");


const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))



app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());


// Configure Passport to use Google OAuth 2.0 strategy
passport.use(new Strategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  // Here, you would typically find or create a user in your database
  // For this example, we'll just return the profile
  return done(null, profile);
}));


app.get('/', (req, res) => {
    res.status(200).json({
        message: "Auth service is running"
    });
})


// Mount auth routes
const authRoute = require("./routes/auth.route");
app.use('/api/auth', authRoute);

module.exports = app;