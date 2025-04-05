const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

//sign-up endpoint
router.post('/signup', (req, res) => {
    const {email, password, name } = req.body;
    if (!email || !password){
        return res.status(400).json({ error: 'Email and password are required' });
    }
    //hash password
    bcrypt.hash(password, 10, (err, hash) => {
        if(err) return res.status(500).json({error: 'Error hashing password'});
        const sql = 'INSERT INTO users (email, password, name) VALUES (?, ?, ?)';
        db.run(sql, [email, hash, name || ''], function(err){
            if(err){
                console.error(err);
                return res.status(500).json({error: 'Error creating user'});
            }
            return res.status(201).json({message: 'User created successfully'});
        });
    });
});

//login endpoint
router.post('/login', (req, res) => {
    const {email, password} = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], (err, user) => {
        if(err) return res.status(500).json({error: 'Database error'});
        if(!user) return res.status(401).json({error: 'Invalid email'});

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) return res.status(500).json({error: 'Error comparing passwords'});
            if(!isMatch) return res.status(401).json({error: 'Invalid credentials'});

            //generate JWT
            const token = jwt.sign(
                {userId: user.id, email: user.email},
                process.env.JWT_SECRET || 'supersecretkey',
                {expiresIn: '1d'}
            );
            return res.json({message: 'Login successful', token});
        });
    });
});

module.exports = router;