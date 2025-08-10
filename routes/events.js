const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM events');
    res.json(rows);
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.promise().query('SELECT * FROM events WHERE event_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Event not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    date_time,
    venue_id,
    admin_id,
    category,
    artist_lineup,
    promo_video_url
  } = req.body;

  const artist_lineup_json = JSON.stringify(artist_lineup);

  const sql = `
    UPDATE events SET
      title = ?, description = ?, date_time = ?, venue_id = ?, admin_id = ?, 
      category = ?, artist_lineup = ?, promo_video_url = ?
    WHERE event_id = ?`;

  try {
    const [result] = await db.promise().query(sql, [
      title,
      description,
      date_time,
      venue_id,
      admin_id,
      category,
      artist_lineup_json,
      promo_video_url,
      id
    ]);

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.promise().query('DELETE FROM events WHERE event_id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Insert Error:', error);
    res.status(500).json({ error: error.message || 'Failed to create event' });
  }
});

router.post('/register', async (req, res) => {
  const id = uuidv4();
  const {
    title,
    description,
    date_time,
    venue_id,
    admin_id,
    category,
    artist_lineup,
    promo_video_url
  } = req.body;

  const artist_lineup_json = JSON.stringify(artist_lineup);

  const sql = `
    INSERT INTO events (
      event_id, title, description, date_time,
      venue_id, admin_id, category, artist_lineup, promo_video_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    const [result] = await db.promise().query(sql, [
      id,
      title,
      description,
      date_time,
      venue_id,
      admin_id,
      category,
      artist_lineup_json,
      promo_video_url
    ]);
    res.status(201).json({ message: 'Event created', event_id: id });
  } catch (error) {
    console.error('Insert Error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

module.exports = router;