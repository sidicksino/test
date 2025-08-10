const express = require('express');
const router = express.Router();
const resetPasswordController = require('../controllers/resetPasswordController');

/**
 * @swagger
 * /api/resetPassword/requestReset:
 *   post:
 *     tags: [Reset Password]
 *     summary: Request password reset code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailOrPhone
 *             properties:
 *               emailOrPhone:
 *                 type: string
 *                 example: example@email.com
 *     responses:
 *       200:
 *         description: OTP code sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Code sent by email
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 */
router.post('/requestReset', resetPasswordController.requestReset);

/**
 * @swagger
 * /api/resetPassword/verifyCode:
 *   post:
 *     tags: [Reset Password]
 *     summary: Verify the OTP code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: '123456'
 *     responses:
 *       200:
 *         description: Code is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Code valid
 *                 user_id:
 *                   type: string
 *                   example: usr123
 *       400:
 *         description: Invalid or expired code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid or expired code
 */
router.post('/verifyCode', resetPasswordController.verifyCode);

/**
 * @swagger
 * /api/resetPassword/resetPassword:
 *   post:
 *     tags: [Reset Password]
 *     summary: Reset the user password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: usr123
 *               newPassword:
 *                 type: string
 *                 example: NewStrongPass123!
 *               confirmPassword:
 *                 type: string
 *                 example: NewStrongPass123!
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Error due to missing or mismatched passwords
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Passwords do not match
 */
router.post('/resetPassword', resetPasswordController.resetPassword);

module.exports = router;