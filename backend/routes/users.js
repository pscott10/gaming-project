const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database/db');
const verify = require('../middleware/verifyToken');

const router = express.Router();

//update display name
router.patch('/name', verify, (req, res) => {
    const {name} = req.body;
    if (!name?.trim()) return res.status(400).json({error: 'Name required'});

    const sql = `
            UPDATE users 
            SET name = ?
            WHERE id = ?
    `;
    db.run(sql, [name.trim(), req.user.id], function(err){
        if(err) return res.status(500).json({error: 'DB error'});
        res.json({message: 'Name updated', name: name.trim() });
    });
});

//change password
//patch api/user/password
router.patch('/password', verify, async (req,res) => {
    const {current, next} = req.body;
    if(!current || !next) return res.status(400).json({ error: 'Bad input' });

    db.get(`SELECT password FROM users WHERE id = ?`, [req.user.id], async (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'DB error' });
        }
        if (!row) {          
            return res.status(404).json({ error: 'User not found' });
        }

        const match = await bcrypt.compare(current, row.password);
        if (!match) return res.status(401).json({ error:'Current password wrong' });

    const hash = await bcrypt.hash(next, 10);
    db.run(`UPDATE users SET password = ? WHERE id = ?`, [hash, req.user.id], (err2)=>{
      if (err2) return res.status(500).json({ error:'DB error' });
      res.json({ message:'Password updated' });
    });
  });
});

//delete account
router.delete('/', verify, (req,res)=>{
    // remove user
    db.run(`DELETE FROM users WHERE id = ?`, [req.user.id], (err) => {
      if (err) return res.status(500).json({ error:'DB error' });
  
      // clear reports
      db.run(`DELETE FROM comprehensive_reports WHERE user_id = ?`, [req.user.id]);
  
      res.json({ message:'Account deleted' });
    });
});
  
module.exports = router;