const express = require('express');
const router = express.Router();
const venueControllers = require('../controllers/venueController');
const authenticateToken = require('../middleware/auth');

/**
 * @swagger
 * /api/venue/add:
 *   post:
 *     summary: Add a new venue
 *     tags:
 *       - Venues
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - map_data
 *               - capacity
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               map_data:
 *                 type: object
 *                 example: { "lat": -1.9441, "lng": 30.0619 }
 *               capacity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Venue added successfully
 *       400:
 *         description: Missing fields
 *       500:
 *         description: Server error
 */
router.post('/add', authenticateToken, venueControllers.addVenue);

/**
 * @swagger
 * /api/venue/getVenue:
 *   get:
 *     tags:
 *       - Venues
 *     summary: Get all venues
 *     description: Returns a list of all venues
 *     responses:
 *       200:
 *         description: A list of venues
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   venue_id:
 *                     type: string
 *                   admin_id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   location:
 *                     type: string
 *                   map_data:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                       lng:
 *                         type: number
 *                   capacity:
 *                     type: integer
 *       500:
 *         description: Failed to fetch venues
 */
router.get('/getVenue', venueControllers.getVenue);

/**
 * @swagger
 * /api/venue/updateVenue/{id}:
 *   put:
 *     summary: Update a venue by ID
 *     tags:
 *       - Venues
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID of the venue to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Kigali Arena
 *               location:
 *                 type: string
 *                 example: KN 5 Rd, Kigali
 *               map_data:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     example: -1.9441
 *                   lng:
 *                     type: number
 *                     example: 30.0619
 *               capacity:
 *                 type: integer
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Venue updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Venue updated successfully
 *       404:
 *         description: Venue not found or unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Venue not found or you are not the admin
 *       403:
 *         description: Access denied, admin only
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied, admin only
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.put('/updateVenue/:id', authenticateToken, venueControllers.updateVenue);

/**
 * @swagger
 * /api/venue/deleteVenue/{id}:
 *   delete:
 *     summary: Delete a venue by ID
 *     tags:
 *       - Venues
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID of the venue to delete
 *     responses:
 *       200:
 *         description: Venue deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Venue deleted successfully
 *       404:
 *         description: Venue not found or unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Venue not found or you are not the admin
 */
router.delete('/deleteVenue/:id', authenticateToken, venueControllers.deleteVenue);

module.exports = router;