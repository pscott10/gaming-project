const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const passport = require('passport');

// Sign-up endpoint
router.post('/signup', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  // Hash password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: 'Error hashing password' });
    const sql = 'INSERT INTO users (email, password, name) VALUES (?, ?, ?)';
    db.run(sql, [email, hash, name || ''], function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error creating user' });
      }
      return res.status(201).json({ message: 'User created successfully' });
    });
  });
});

// Login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.get(sql, [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(401).json({ error: 'Invalid email' });

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: 'Error comparing passwords' });
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

      if (isMatch) {
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET || 'defaultSecret',
          { expiresIn: '1d' }
        );
        return res.json({ message: 'Login successful', token });
      } else {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    });
  });
});

// Google OAuth endpoints
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('http://localhost:5173/#/profile');
  }
);

module.exports = router;
