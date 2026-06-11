const express = require('express');
const router = express.Router();

const db = require('../config/db');

// tampil halaman login
router.get('/login', (req, res) => {

    res.render('login', {
        error: null
    });

});

// proses login
router.post('/login', (req, res) => {

    const { username, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, result) => {

            if (err) {
                return res.send(err);
            }

            if (result.length === 0) {
                return res.render('login', {
                    error: 'Username atau Password Salah'
                });
            }

            req.session.user = {
                id: result[0].id_user,
                username: result[0].username,
                role: result[0].role
            };

            res.redirect('/dashboard');
        }
    );
});

// logout
router.get('/logout', (req, res) => {

    req.session.destroy(() => {
        res.redirect('/auth/login');
    });

});

module.exports = router;