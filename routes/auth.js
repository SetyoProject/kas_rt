const express = require('express');
const router = express.Router();

const db = require('../config/db');

// login
router.post('/login', (req, res) => {

    const { username, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {
                return res.status(401).json({
                    success: false,
                    pesan: 'Username atau password salah'
                });
            }

            res.json({
                success: true,
                pesan: 'Login berhasil',
                data: result[0]
            });

        }
    );

});

// logout
router.post('/logout', (req, res) => {

    res.json({
        success: true,
        pesan: 'Logout berhasil'
    });

});

module.exports = router;