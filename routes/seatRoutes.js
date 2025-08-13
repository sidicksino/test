// routes/seatRoutes.js
const express = require("express");
const router = express.Router();
const seatController = require("../controllers/seatController");

/**
 * @swagger
 * tags:
 *   name: Seats
 *   description: Seat management
 */

/**
 * @swagger
 * /api/seats:
 *   get:
 *     summary: Get all seats
 *     tags: [Seats]
 *     responses:
 *       200:
 *         description: List of all seats
 */
router.get("/", seatController.getAllSeats);

/**
 * @swagger
 * /api/seats/{id}:
 *   get:
 *     summary: Get a seat by ID
 *     tags: [Seats]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Seat ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seat details
 *       404:
 *         description: Seat not found
 */
router.get("/:id", seatController.getSeatById);

/**
 * @swagger
 * /api/seats:
 *   post:
 *     summary: Create a new seat
 *     tags: [Seats]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - section_id
 *               - category_id
 *               - number
 *             properties:
 *               section_id:
 *                 type: string
 *               category_id:
 *                 type: string
 *               number:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Available, Unavailable, Sold Out, Selected]
 *     responses:
 *       201:
 *         description: Seat created successfully
 */
router.post("/", seatController.createSeat);

/**
 * @swagger
 * /api/seats/{id}:
 *   put:
 *     summary: Update a seat
 *     tags: [Seats]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Seat ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               section_id:
 *                 type: string
 *               category_id:
 *                 type: string
 *               number:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Available, Unavailable, Sold Out, Selected]
 *     responses:
 *       200:
 *         description: Seat updated successfully
 *       404:
 *         description: Seat not found
 */
router.put("/:id", seatController.updateSeat);

/**
 * @swagger
 * /api/seats/{id}:
 *   delete:
 *     summary: Delete a seat
 *     tags: [Seats]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Seat ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seat deleted successfully
 *       404:
 *         description: Seat not found
 */
router.delete("/:id", seatController.deleteSeat);

module.exports = router;
