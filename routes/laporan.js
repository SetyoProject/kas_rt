const express = require('express');
const router = express.Router();

const db = require('../config/db');
const { isLogin } = require('../middleware/authMiddleware');

// Semua pembayaran

router.get('/', isLogin, (req, res) => {

    const tanggal_awal = req.query.tanggal_awal || '2020-01-01';
    const tanggal_akhir = req.query.tanggal_akhir || '2030-12-31';

    // total kas masuk
    db.query(
        `
        SELECT
            COALESCE(SUM(jumlah_bayar),0) AS total_kas_masuk
        FROM pembayaran
        WHERE tanggal_bayar BETWEEN ? AND ?
        `,
        [tanggal_awal, tanggal_akhir],

        (err, resultMasuk) => {

            if (err) return res.send(err);

            // total kas keluar
            db.query(
                `
                SELECT
                    COALESCE(SUM(jumlah),0) AS total_kas_keluar
                FROM pengeluaran
                WHERE tanggal BETWEEN ? AND ?
                `,
                [tanggal_awal, tanggal_akhir],

                (err, resultKeluar) => {

                    if (err) return res.send(err);

                    const total_kas_masuk =
                        resultMasuk[0].total_kas_masuk || 0;

                    const total_kas_keluar =
                        resultKeluar[0].total_kas_keluar || 0;

                    const saldo_kas =
                        total_kas_masuk - total_kas_keluar;

                    // transaksi gabungan
                    const sql = `
                        SELECT
                            p.tanggal_bayar AS tanggal,
                            'Pemasukan' AS jenis,
                            CONCAT('Pembayaran ', w.nama) AS keterangan,
                            p.jumlah_bayar AS nominal
                        FROM pembayaran p
                        JOIN tagihan t
                            ON p.id_tagihan = t.id_tagihan
                        JOIN warga w
                            ON t.id_warga = w.id_warga
                        WHERE p.tanggal_bayar BETWEEN ? AND ?

                        UNION ALL

                        SELECT
                            tanggal,
                            'Pengeluaran',
                            keterangan,
                            jumlah
                        FROM pengeluaran
                        WHERE tanggal BETWEEN ? AND ?

                        ORDER BY tanggal ASC
                    `;

                    db.query(
                        sql,
                        [
                            tanggal_awal,
                            tanggal_akhir,
                            tanggal_awal,
                            tanggal_akhir
                        ],

                        (err, transaksi) => {

                            if (err) return res.send(err);

                            res.render('laporan/index', {
                                transaksi,
                                total_kas_masuk,
                                total_kas_keluar,
                                saldo_kas,
                                tanggal_awal,
                                tanggal_akhir,
                                user: req.session.user
                            });

                        }
                    );

                }
            );

        }
    );

});

module.exports = router;