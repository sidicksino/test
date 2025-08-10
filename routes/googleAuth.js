const express = require('express');
const router = express.Router();
const passport = require('passport');
const { googleLogin, googleCallback, getProfile } = require('../controllers/googleAuthController');

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Redirects the user to Google for authentication
 *     description: Initiates the Google OAuth 2.0 login flow.
 *     tags:
 *       - Google Authentication
 *     responses:
 *       302:
 *         description: Redirect to Google login
 */
router.get('/google', googleLogin);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handles the callback after Google authenticates the user.
 *     tags:
 *       - Google Authentication
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *       401:
 *         description: Authentication failed
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: true }),
  googleCallback
);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get logged-in user's profile
 *     description: Returns the profile of the currently authenticated user.
 *     tags:
 *       - Google Authentication
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Unauthorized access
 */
router.get('/profile', getProfile);

module.exports = router;
