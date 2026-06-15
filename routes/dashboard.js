const express = require('express');
const router = express.Router();

const db = require('../config/db');
const { isLogin } = require('../middleware/authMiddleware');

router.get('/', isLogin, (req, res) => {
    title = 'Dashboard';

    const dashboardData = {};

    db.query(
        'SELECT COUNT(*) AS total_warga FROM warga',
        (err, result) => {

            dashboardData.total_warga = result[0].total_warga;

            db.query(
                'SELECT COUNT(*) AS total_tagihan FROM tagihan',
                (err, result2) => {

                    dashboardData.total_tagihan = result2[0].total_tagihan;

                    db.query(
                        "SELECT COUNT(*) AS lunas FROM tagihan WHERE status='Lunas'",
                        (err, result3) => {

                            dashboardData.lunas = result3[0].lunas;

                            db.query(
                                "SELECT COUNT(*) AS belum_lunas FROM tagihan WHERE status='Belum Lunas'",
                                (err, result4) => {

                                    dashboardData.belum_lunas = result4[0].belum_lunas;

                                    db.query(
    `
    SELECT
        (SELECT COALESCE(SUM(jumlah_bayar),0)
        FROM pembayaran) AS total_kas_masuk,

        (SELECT COALESCE(SUM(jumlah),0)
        FROM pengeluaran) AS total_kas_keluar
    `,
    (err, result5) => {

        if (err) return res.send(err);

        dashboardData.total_kas_masuk = result5[0].total_kas_masuk || 0;

        dashboardData.total_kas_keluar = result5[0].total_kas_keluar || 0;

        dashboardData.total_kas =
            dashboardData.total_kas_masuk -
            dashboardData.total_kas_keluar;

        res.render('dashboard', {
            dashboard: dashboardData,
            user: req.session.user
        });

    }
);

                                }
                            );

                        }
                    );

                }
            );

        }
    );

});

module.exports = router;