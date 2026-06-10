const express = require('express');
const router = express.Router();

const db = require('../config/db')
// GET semua warga
router.get('/', (req, res) => {
    db.query(
        'SELECT * FROM warga',
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json({
                success: true,
                total: result.length,
                data: result
            });
        }
    );
});

// GET warga berdasarkan id
router.get('/:id', (req, res) => {

    const id = req.params.id;

    db.query(
        'SELECT * FROM warga WHERE id_warga = ?',
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    pesan: 'Warga tidak ditemukan'
                });
            }

            res.json({
                success: true,
                data: result[0]
            });

        }
    );

});

// POST tambah warga
router.post('/', (req, res) => {

    const { nama, alamat, no_hp } = req.body;

    db.query(
        'INSERT INTO warga(nama,alamat,no_hp) VALUES(?,?,?)',
        [nama, alamat, no_hp],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({
                success: true,
                pesan: 'Warga berhasil ditambahkan'
            });

        }
    );

});

// PUT update warga
router.put('/:id', (req, res) => {

    const id = req.params.id;

    const { nama, alamat, no_hp } = req.body;

    db.query(
        `UPDATE warga
         SET nama = ?, alamat = ?, no_hp = ?
         WHERE id_warga = ?`,
        [nama, alamat, no_hp, id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                success: true,
                pesan: 'Data warga berhasil diupdate'
            });

        }
    );

});

// DELETE warga
router.delete('/:id', (req, res) => {

    const id = req.params.id;

    db.query(
        'DELETE FROM warga WHERE id_warga = ?',
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                success: true,
                pesan: 'Data warga berhasil dihapus'
            });

        }
    );

});

module.exports = router;