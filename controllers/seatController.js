const { v4: uuidv4 } = require('uuid');
const db = require('../db');

// Créer un nouveau siège
exports.createSeat = async (req, res) => {
    const { section_id, category_id, number, status } = req.body;

    if (!section_id || !category_id || !number) {
        return res.status(400).json({ error: 'section_id, category_id et number sont requis' });
    }

    try {
        const seat_id = uuidv4();
        const sql = `
            INSERT INTO Seat (seat_id, section_id, category_id, number, status)
            VALUES (?, ?, ?, ?, ?)
        `;
        await db.promise().query(sql, [
            seat_id,
            section_id,
            category_id,
            number,
            status || 'Available'
        ]);

        res.status(201).json({ message: 'Seat created successfully', seat_id });
    } catch (error) {
        console.error('Error creating seat:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Récupérer tous les sièges
exports.getAllSeats = async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM Seat');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching seats:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Récupérer un siège par ID
exports.getSeatById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.promise().query('SELECT * FROM Seat WHERE seat_id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Seat not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching seat:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Mettre à jour un siège
exports.updateSeat = async (req, res) => {
    const { id } = req.params;
    const { section_id, category_id, number, status } = req.body;

    try {
        const sql = `
            UPDATE Seat
            SET section_id = ?, category_id = ?, number = ?, status = ?
            WHERE seat_id = ?
        `;
        const [result] = await db.promise().query(sql, [
            section_id,
            category_id,
            number,
            status,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Seat not found' });
        }

        res.json({ message: 'Seat updated successfully' });
    } catch (error) {
        console.error('Error updating seat:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// 5️ Supprimer un siège
exports.deleteSeat = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.promise().query('DELETE FROM Seat WHERE seat_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Seat not found' });
        }
        res.json({ message: 'Seat deleted successfully' });
    } catch (error) {
        console.error('Error deleting seat:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
