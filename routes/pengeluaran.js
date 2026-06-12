const express = require('express');
const router = express.Router();

const db = require('../config/db');
const { isLogin } = require('../middleware/authMiddleware');


// daftar pengeluaran
router.get('/', isLogin, (req, res) => {

    db.query(
        'SELECT * FROM pengeluaran ORDER BY tanggal DESC',
        (err, result) => {

            if (err) return res.send(err);

            res.render('pengeluaran/index', {
                pengeluaran: result,
                user: req.session.user
            });

        }
    );

});


// form tambah
router.get('/tambah', isLogin, (req, res) => {

    res.render('pengeluaran/tambah');

});


// simpan
router.post('/simpan', isLogin, (req, res) => {

    const {
        tanggal,
        keterangan,
        jumlah
    } = req.body;

    db.query(
        `
        INSERT INTO pengeluaran
        (
            tanggal,
            keterangan,
            jumlah
        )
        VALUES
        (?,?,?)
        `,
        [
            tanggal,
            keterangan,
            jumlah
        ],
        (err) => {

            if (err) return res.send(err);

            res.redirect('/pengeluaran');

        }
    );

});


// hapus
router.get('/hapus/:id', isLogin, (req, res) => {

    db.query(
        'DELETE FROM pengeluaran WHERE id_pengeluaran=?',
        [req.params.id],
        (err) => {

            if (err) return res.send(err);

            res.redirect('/pengeluaran');

        }
    );

});

module.exports = router;