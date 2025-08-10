const { v4: uuidv4 } = require('uuid');
const db = require('../db');

// Créer une nouvelle section
exports.createSection = async (req, res) => {
  const { venue_id, parent_section_id, name, description, seat_map } = req.body;

  if (!venue_id || !name) {
    return res.status(400).json({ error: 'venue_id and name are required' });
  }

  try {
    const section_id = uuidv4();
    const sql = `
      INSERT INTO Section (section_id, venue_id, parent_section_id, name, description, seat_map)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.promise().query(sql, [
      section_id,
      venue_id,
      parent_section_id || null,
      name,
      description || null,
      seat_map ? JSON.stringify(seat_map) : null,
    ]);

    res.status(201).json({ message: 'Section created', section_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Récupérer toutes les sections
exports.getAllSections = async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM Section');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Récupérer une section par son id
exports.getSectionById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.promise().query('SELECT * FROM Section WHERE section_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Section not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Supprimer une section par son id
exports.deleteSection = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.promise().query('DELETE FROM Section WHERE section_id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Section not found' });
    }
    res.json({ message: 'Section deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
