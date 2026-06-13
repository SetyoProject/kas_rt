const express = require('express');
const router = express.Router();

const db = require('../config/db');

router.get('/', (req, res) => {

    // total kas masuk
    db.query(
        'SELECT COALESCE(SUM(jumlah_bayar),0) AS total_kas_masuk FROM pembayaran',
        (err, resultMasuk) => {

            if (err) return res.send(err);

            // total kas keluar
            db.query(
                'SELECT COALESCE(SUM(jumlah),0) AS total_kas_keluar FROM pengeluaran',
                (err, resultKeluar) => {

                    if (err) return res.send(err);

                    const total_kas_masuk =
                        resultMasuk[0].total_kas_masuk || 0;

                    const total_kas_keluar =
                        resultKeluar[0].total_kas_keluar || 0;

                    const saldo_kas =
                        total_kas_masuk - total_kas_keluar;

                    // transaksi
                    const sql = `
                        SELECT
    tanggal_bayar AS tanggal,
    'Pemasukan' AS jenis,
    'Pembayaran Kas RT' AS keterangan,
    jumlah_bayar AS nominal
FROM pembayaran

                        UNION ALL

                        SELECT
                            tanggal,
                            'Pengeluaran',
                            keterangan,
                            jumlah
                        FROM pengeluaran

                        ORDER BY tanggal DESC
                    `;

                    db.query(sql, (err, transaksi) => {

                        if (err) return res.send(err);

                        res.render('monitoring/index', {
                            total_kas_masuk,
                            total_kas_keluar,
                            saldo_kas,
                            transaksi
                        });

                    });

                }
            );

        }
    );

});

module.exports = router;