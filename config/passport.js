const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const photo = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

    const [rows] = await db.promise().query('SELECT * FROM user WHERE email = ?', [email]);

    if (rows.length === 0) {
      const user_id = uuidv4();
      await db.promise().query(
        'INSERT INTO user (user_id, email, phone_number, profile_photo, role, password) VALUES (?, ?, NULL, ?, "Attendee", NULL)',
        [user_id, email, photo]
      );
      console.log('New user registered:', email);
    } else {
      console.log('User already exists:', email);
    }

    return done(null, profile);
  } catch (err) {
    console.error('Error in GoogleStrategy:', err);
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
