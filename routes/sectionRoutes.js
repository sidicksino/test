const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');

/**
 * @swagger
 * tags:
 *   name: Section
 *   description: API pour gérer les section
 */

/**
 * @swagger
 * /api/section/add:
 *   post:
 *     summary: Créer une nouvelle section
 *     tags: [Section]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - venue_id
 *               - name
 *             properties:
 *               venue_id:
 *                 type: string
 *                 format: uuid
 *               parent_section_id:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *                 nullable: true
 *               seat_map:
 *                 type: object
 *                 nullable: true
 *             example:
 *               venue_id: "123e4567-e89b-12d3-a456-426614174000"
 *               parent_section_id: null
 *               name: "Section A"
 *               description: "Description de la section"
 *               seat_map: {"rows": 5, "cols": 10}
 *     responses:
 *       201:
 *         description: Section créée avec succès
 *       400:
 *         description: Champs manquants ou invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/add', sectionController.createSection);

/**
 * @swagger
 * /api/section/getSection:
 *   get:
 *     summary: Récupérer toutes les sections
 *     tags: [Section]
 *     responses:
 *       200:
 *         description: Liste des sections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/getSection', sectionController.getAllSections);

/**
 * @swagger
 * /api/section/updateSection/{id}:
 *   get:
 *     summary: Récupérer une section par ID
 *     tags: [Section]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la section
 *     responses:
 *       200:
 *         description: Détails de la section
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Section non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/updateSection/:id', sectionController.getSectionById);

/**
 * @swagger
 * /api/section/deleteSection/{id}:
 *   delete:
 *     summary: Supprimer une section par ID
 *     tags: [Section]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la section
 *     responses:
 *       200:
 *         description: Section supprimée avec succès
 *       404:
 *         description: Section non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/deleteSection/:id', sectionController.deleteSection);

module.exports = router;
