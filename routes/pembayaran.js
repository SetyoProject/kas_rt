const express = require('express');
const router = express.Router();

const db = require('../config/db');
const { isLogin } = require('../middleware/authMiddleware');

// daftar pembayaran
router.get('/', isLogin, (req, res) => {

    const sql = `
        SELECT
            p.*,
            w.nama,
            t.bulan,
            t.tahun
        FROM pembayaran p
        JOIN tagihan t
            ON p.id_tagihan = t.id_tagihan
        JOIN warga w
            ON t.id_warga = w.id_warga
        ORDER BY p.id_pembayaran DESC
    `;

    db.query(sql, (err, result) => {

        if (err) return res.send(err);

        res.render('pembayaran/index', {
            pembayaran: result,
            user: req.session.user
        });

    });

});

// form pembayaran
router.get('/tambah', isLogin, (req, res) => {

    const sql = `
        SELECT
            t.*,
            w.nama
        FROM tagihan t
        JOIN warga w
            ON t.id_warga = w.id_warga
        WHERE t.status = 'Belum Lunas'
    `;

    db.query(sql, (err, result) => {

        if (err) return res.send(err);

        res.render('pembayaran/tambah', {
            tagihan: result
        });

    });

});

// simpan pembayaran
router.post('/simpan', isLogin, (req, res) => {

    const {
        id_tagihan,
        tanggal_bayar,
        jumlah_bayar
    } = req.body;

    db.query(
        `
        INSERT INTO pembayaran
        (
            id_tagihan,
            tanggal_bayar,
            jumlah_bayar
        )
        VALUES
        (?,?,?)
        `,
        [
            id_tagihan,
            tanggal_bayar,
            jumlah_bayar
        ],
        (err) => {

            if (err) return res.send(err);

            db.query(
                `
                UPDATE tagihan
                SET status='Lunas'
                WHERE id_tagihan=?
                `,
                [id_tagihan],
                (err2) => {

                    if (err2) return res.send(err2);

                    res.redirect('/pembayaran');

                }
            );

        }
    );

});

module.exports = router;