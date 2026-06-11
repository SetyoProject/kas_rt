const express = require('express');
const router = express.Router();

const db = require('../config/db');
const { isLogin } = require('../middleware/authMiddleware');

router.get('/', isLogin, (req, res) => {

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
                                        'SELECT SUM(jumlah_bayar) AS total_kas FROM pembayaran',
                                        (err, result5) => {

                                            dashboardData.total_kas =
                                                result5[0].total_kas || 0;

                                            res.render(
                                                'dashboard',
                                                {
                                                    user: req.session.user,
                                                    dashboard: dashboardData
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

        }
    );

});

module.exports = router;