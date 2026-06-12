const express = require('express');
const router = express.Router();

const db = require('../config/db');
const { isLogin } = require('../middleware/authMiddleware');

// Semua pembayaran

router.get('/', isLogin, (req, res) => {

    const sql = `
        SELECT
            p.*,
            w.nama,
            t.bulan,
            t.tahun,
            u.username
        FROM pembayaran p
        JOIN tagihan t
            ON p.id_tagihan = t.id_tagihan
        JOIN warga w
            ON t.id_warga = w.id_warga
        JOIN users u
            ON p.id_user = u.id_user
        ORDER BY p.tanggal_bayar DESC
    `;

    db.query(sql, (err, result) => {

        if (err) return res.send(err);

        res.render('laporan/index', {
            laporan: result,
            user: req.session.user
        });

    });

});

router.get('/pembayaran', (req, res) => {

    res.json({
        success: true,
        total: pembayaran.length,
        data: pembayaran
    });

});

//belum lunas
router.get('/belum-lunas', isLogin, (req, res) => {

    const sql = `
        SELECT
            t.*,
            w.nama
        FROM tagihan t
        JOIN warga w
            ON t.id_warga = w.id_warga
        WHERE status='Belum Lunas'
        ORDER BY w.nama
    `;

    db.query(sql, (err, result) => {

        if (err) return res.send(err);

        res.render('laporan/belum_lunas', {
            data: result
        });

    });

});
  

//pemasukan
router.get('/pemasukan', isLogin, (req, res) => {

    const sql = `
        SELECT
            COALESCE(SUM(jumlah_bayar),0)
            AS total_pemasukan
        FROM pembayaran
    `;

    db.query(sql, (err, result) => {

        if (err) return res.send(err);

        res.render('laporan/pemasukan', {
            total: result[0]
        });

    });

});


module.exports = router;