const express = require('express');
const router = express.Router();

const db = require('../config/db');
const { isLogin } = require('../middleware/authMiddleware');

// tampil semua warga
router.get('/', isLogin, (req, res) => {

    db.query(
        'SELECT * FROM warga ORDER BY id_warga DESC',
        (err, result) => {

            if (err) {
                return res.send(err);
            }

            res.render('warga/index', {
                user: req.session.user,
                warga: result
            });

        }
    );

});

// form tambah
router.get('/tambah', isLogin, (req, res) => {

    res.render('warga/tambah');

});

// simpan
router.post('/simpan', isLogin, (req, res) => {

    const { nama, alamat, no_hp } = req.body;

    db.query(
        'INSERT INTO warga(nama,alamat,no_hp) VALUES(?,?,?)',
        [nama, alamat, no_hp],
        (err) => {

            if (err) {
                return res.send(err);
            }

            res.redirect('/warga');

        }
    );

});

// form edit
router.get('/edit/:id', isLogin, (req, res) => {

    const id = req.params.id;

    db.query(
        'SELECT * FROM warga WHERE id_warga=?',
        [id],
        (err, result) => {

            if (err) {
                return res.send(err);
            }

            res.render('warga/edit', {
                warga: result[0]
            });

        }
    );

});

// update
router.post('/update/:id', isLogin, (req, res) => {

    const id = req.params.id;

    const { nama, alamat, no_hp } = req.body;

    db.query(
        'UPDATE warga SET nama=?, alamat=?, no_hp=? WHERE id_warga=?',
        [nama, alamat, no_hp, id],
        (err) => {

            if (err) {
                return res.send(err);
            }

            res.redirect('/warga');

        }
    );

});

// hapus
router.get('/hapus/:id', isLogin, (req, res) => {

    const id = req.params.id;

    db.query(
        'DELETE FROM warga WHERE id_warga=?',
        [id],
        (err) => {

            if (err) {
                return res.send(err);
            }

            res.redirect('/warga');

        }
    );

});

module.exports = router;