const express = require('express');
const router = express.Router();

const db = require('../config/db');
const { isLogin } = require('../middleware/authMiddleware');

// =========================
// DAFTAR PEMBAYARAN
// =========================
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
        ORDER BY p.id_pembayaran DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.send(err);
        }

        res.render('pembayaran/index', {
            pembayaran: result,
            user: req.session.user
        });

    });

});

// =========================
// FORM TAMBAH PEMBAYARAN
// =========================
router.get('/tambah', isLogin, (req, res) => {

    const sql = `
        SELECT
            t.*,
            w.nama
        FROM tagihan t
        JOIN warga w
            ON t.id_warga = w.id_warga
        WHERE t.status = 'Belum Lunas'
        ORDER BY t.id_tagihan DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.send(err);
        }

        res.render('pembayaran/tambah', {
            tagihan: result,
            user: req.session.user
        });

    });

});

// =========================
// SIMPAN PEMBAYARAN
// =========================
router.post('/simpan', isLogin, (req, res) => {

    const {
        id_tagihan,
        tanggal_bayar,
        jumlah_bayar
    } = req.body;

    const id_user = req.session.user.id;

    // simpan pembayaran
    db.query(
        `
        INSERT INTO pembayaran
        (
            id_tagihan,
            id_user,
            tanggal_bayar,
            jumlah_bayar
        )
        VALUES
        (?,?,?,?)
        `,
        [
            id_tagihan,
            id_user,
            tanggal_bayar,
            jumlah_bayar
        ],
        (err) => {

            if (err) {
                return res.send(err);
            }

            // update total bayar pada tagihan
            db.query(
                `
                UPDATE tagihan
                SET total_bayar =
                (
                    SELECT COALESCE(
                        SUM(jumlah_bayar),
                        0
                    )
                    FROM pembayaran
                    WHERE id_tagihan = ?
                )
                WHERE id_tagihan = ?
                `,
                [
                    id_tagihan,
                    id_tagihan
                ],
                (err2) => {

                    if (err2) {
                        return res.send(err2);
                    }

                    // update status lunas
                    db.query(
                        `
                        UPDATE tagihan
                        SET status =
                        CASE
                            WHEN total_bayar >= jumlah_tagihan
                            THEN 'Lunas'
                            ELSE 'Belum Lunas'
                        END
                        WHERE id_tagihan = ?
                        `,
                        [id_tagihan],
                        (err3) => {

                            if (err3) {
                                return res.send(err3);
                            }

                            res.redirect('/pembayaran');

                        }
                    );

                }
            );

        }
    );

});

// =========================
// HAPUS PEMBAYARAN
// =========================
router.get('/hapus/:id', isLogin, (req, res) => {

    const idPembayaran = req.params.id;

    // cari id_tagihan dulu
    db.query(
        `
        SELECT id_tagihan
        FROM pembayaran
        WHERE id_pembayaran = ?
        `,
        [idPembayaran],
        (err, result) => {

            if (err) {
                return res.send(err);
            }

            if (result.length === 0) {
                return res.redirect('/pembayaran');
            }

            const id_tagihan = result[0].id_tagihan;

            // hapus pembayaran
            db.query(
                `
                DELETE FROM pembayaran
                WHERE id_pembayaran = ?
                `,
                [idPembayaran],
                (err2) => {

                    if (err2) {
                        return res.send(err2);
                    }

                    // hitung ulang total_bayar
                    db.query(
                        `
                        UPDATE tagihan
                        SET total_bayar =
                        (
                            SELECT COALESCE(
                                SUM(jumlah_bayar),
                                0
                            )
                            FROM pembayaran
                            WHERE id_tagihan = ?
                        )
                        WHERE id_tagihan = ?
                        `,
                        [
                            id_tagihan,
                            id_tagihan
                        ],
                        (err3) => {

                            if (err3) {
                                return res.send(err3);
                            }

                            // update status lagi
                            db.query(
                                `
                                UPDATE tagihan
                                SET status =
                                CASE
                                    WHEN total_bayar >= jumlah_tagihan
                                    THEN 'Lunas'
                                    ELSE 'Belum Lunas'
                                END
                                WHERE id_tagihan = ?
                                `,
                                [id_tagihan],
                                (err4) => {

                                    if (err4) {
                                        return res.send(err4);
                                    }

                                    res.redirect('/pembayaran');

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