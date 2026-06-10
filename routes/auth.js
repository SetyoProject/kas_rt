const express = require('express');
const router = express.Router();

// login
router.post('/login', (req, res) => {

    const { username, password } = req.body;

    res.json({
        success: true,
        pesan: 'Login berhasil'
    });

});

// logout
router.post('/logout', (req, res) => {

    res.json({
        success: true,
        pesan: 'Logout berhasil'
    });

});

module.exports = router;