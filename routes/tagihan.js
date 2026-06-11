const express = require('express');
const router = express.Router();

const db = require('../config/db');
const { isLogin } = require('../middleware/authMiddleware');

// daftar tagihan
router.get('/', isLogin, (req, res) => {

    const sql = `
        SELECT
            t.*,
            w.nama
        FROM tagihan t
        JOIN warga w
            ON t.id_warga = w.id_warga
        ORDER BY t.id_tagihan DESC
    `;

    db.query(sql, (err, result) => {

        if (err) return res.send(err);

        res.render('tagihan/index', {
            user: req.session.user,
            tagihan: result
        });

    });

});

// form tambah
router.get('/tambah', isLogin, (req, res) => {

    db.query(
        'SELECT * FROM warga',
        (err, warga) => {

            if (err) return res.send(err);

            res.render('tagihan/tambah', {
                warga
            });

        }
    );

});

// simpan
router.post('/simpan', isLogin, (req, res) => {

    const {
        id_warga,
        bulan,
        tahun,
        jumlah_tagihan
    } = req.body;

    db.query(
        `
        INSERT INTO tagihan
        (
            id_warga,
            bulan,
            tahun,
            jumlah_tagihan
        )
        VALUES
        (?,?,?,?)
        `,
        [
            id_warga,
            bulan,
            tahun,
            jumlah_tagihan
        ],
        (err) => {

            if (err) return res.send(err);

            res.redirect('/tagihan');

        }
    );

});

// hapus
router.get('/hapus/:id', isLogin, (req, res) => {

    db.query(
        'DELETE FROM tagihan WHERE id_tagihan=?',
        [req.params.id],
        (err) => {

            if (err) return res.send(err);

            res.redirect('/tagihan');

        }
    );

});

module.exports = router;