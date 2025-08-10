const { v4: uuidv4 } = require('uuid');
const db = require('../db');

exports.addVenue = async (req, res) => {
    const { name, location, map_data, capacity } = req.body;
    const { user_id, role } = req.user;

    if (!name || !location || !map_data || !capacity) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    if (role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied: only admins can add venues' });
    }

    try {
        const venue_id = uuidv4();
        const mapDataString = JSON.stringify(map_data);

        const sql = `
            INSERT INTO venue (venue_id, admin_id, name, location, map_data, capacity)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await db.promise().query(sql, [
            venue_id,
            user_id,
            name,
            location,
            mapDataString,
            capacity
        ]);

        return res.status(201).json({ message: 'Venue added successfully', venue_id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.getVenue = async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM venue');

        const venues = rows.map(venue => ({
            ...venue,
            map_data: venue.map_data ? JSON.parse(venue.map_data) : null
        }));

        res.json(venues);
    } catch (error) {
        console.error('Fetch Error:', error);
        res.status(500).json({ error: 'Failed to fetch venues' });
    }
};

exports.updateVenue = async (req, res) => {
    const venueId = req.params.id;
    const { name, location, map_data, capacity } = req.body;
    const { user_id, role } = req.user;

    if (role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied, admin only' });
    }

    try {
        const mapDataString = JSON.stringify(map_data);
        const sql = `UPDATE venue SET name = ?, location = ?, map_data = ?, capacity = ? WHERE venue_id = ? AND admin_id = ?`;
        const [result] = await db.promise().query(sql, [name, location, mapDataString, capacity, venueId, user_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Venue not found or you are not the admin' });
        }

        res.json({ message: 'Venue updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteVenue = async (req, res) => {
    const venueId = req.params.id;
    const { user_id, role } = req.user;

    if (role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied, admin only' });
    }

    try {
        const sql = `DELETE FROM venue WHERE venue_id = ? AND admin_id = ?`;
        const [result] = await db.promise().query(sql, [venueId, user_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Venue not found or you are not the admin' });
        }

        res.json({ message: 'Venue deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}