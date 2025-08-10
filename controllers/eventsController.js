const { randomUUID } = require('crypto');
const { pool } = require('../db');

export async function createEvent(req, res) {
  try {
    const id = randomUUID();
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

    const q =
      'insert into events (event_id,title,description,date_time,venue_id,admin_id,category,artist_lineup,promo_video_url) values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning *';

    const { rows } = await pool.query(q, [
      id,
      title,
      description,
      date_time,
      venue_id,
      admin_id,
      category,
      artist_lineup,
      promo_video_url
    ]);

    res.status(201).json(rows[0]);
  } catch {
    res.status(500).end();
  }
}
