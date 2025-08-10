const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const passport = require('passport');

exports.googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

exports.googleCallback = async (req, res) => {
  try {
    const email = req.user.emails[0].value;
    const photo = req.user.photos && req.user.photos[0] ? req.user.photos[0].value : null;

    const [rows] = await db.promise().query('SELECT * FROM user WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      const user_id = uuidv4();
      const sql = `INSERT INTO user (user_id, email, phone_number, profile_photo, role, password) VALUES (?, ?, NULL, ?, 'Attendee', NULL)`;
      await db.promise().query(sql, [user_id, email,photo]);
      console.log("Nouvel utilisateur Google enregistré :", email);
    }

    return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (err) {
    console.error('Erreur Google callback :', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getProfile = (req, res) => {
  if (!req.user) return res.status(401).send('Unauthorized');
  res.send({
    message: 'Successfully logged in with Google',
    user: req.user,
  });
};
