const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const db = require('../db');


exports.register = async (req, res) => {
    const { email, phone_number, password } = req.body;

    if ((!email && !phone_number) || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    if (email && phone_number) {
        return res.status(400).json({ message: 'Please enter either email or phone number, not both' });
    }

    try {
        // Check unique email
        if (email) {
            const [rows] = await db.promise().query('SELECT * FROM user WHERE email = ?', [email]);
            if (rows.length > 0) {
                return res.status(409).json({ message: 'Email already exists' });
            }
        }

        // Check unique phone number
        if (phone_number) {
            const [rows] = await db.promise().query('SELECT * FROM user WHERE phone_number = ?', [phone_number]);
            if (rows.length > 0) {
                return res.status(409).json({ message: 'Phone number already exists' });
            }
        }

        const hashedpassword = await bcrypt.hash(password, 10);
        const user_id = uuidv4();

        const sql = `INSERT INTO user (user_id, email, phone_number, role, password) VALUES (?, ?, ?, 'Attendee', ?)`;
        await db.promise().query(sql, [user_id, email || null, phone_number || null, hashedpassword]);

        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


exports.login = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) {
    return res.status(400).json({ error: 'Email or phone number and password are required' });
  }

  try {
    const sql = `SELECT * FROM user WHERE email = ? OR phone_number = ?`;
    const [results] = await db.promise().query(sql, [emailOrPhone, emailOrPhone]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = results[0];

    if (!user.password) {
      return res.status(400).json({ error: 'User registered via Google. Please login with Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.adminRegister = async (req, res) => {
  const { email, phone_number, password } = req.body;

  if ((!email && !phone_number) || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
  }

  if (email && phone_number) {
      return res.status(400).json({ message: 'Please enter either email or phone number, not both' });
  }

  try {
      // Check unique email
      if (email) {
          const [rows] = await db.promise().query('SELECT * FROM user WHERE email = ?', [email]);
          if (rows.length > 0) {
              return res.status(409).json({ message: 'Email already exists' });
          }
      }

      // Check unique phone number
      if (phone_number) {
          const [rows] = await db.promise().query('SELECT * FROM user WHERE phone_number = ?', [phone_number]);
          if (rows.length > 0) {
              return res.status(409).json({ message: 'Phone number already exists' });
          }
      }

      const hashedpassword = await bcrypt.hash(password, 10);
      const user_id = uuidv4();

      const sql = `INSERT INTO user (user_id, email, phone_number, role, password) VALUES (?, ?, ?, 'Admin', ?)`;
      await db.promise().query(sql, [user_id, email || null, phone_number || null, hashedpassword]);

      return res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
  }
};