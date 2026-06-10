const express = require('express');
const router = express.Router();

const { warga, getNextId } = require('../data/dataWarga');

// GET semua warga
router.get('/', (req, res) => {
    res.json({
        success: true,
        total: warga.length,
        data: warga
    });
});

// GET warga berdasarkan id
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const dataWarga = warga.find(w => w.id === id);

    if (!dataWarga) {
        return res.status(404).json({
            success: false,
            pesan: 'Warga tidak ditemukan'
        });
    }

    res.json({
        success: true,
        data: dataWarga
    });
});

// POST tambah warga
router.post('/', (req, res) => {

    const { nama, alamat, no_hp } = req.body;

    if (!nama || !alamat || !no_hp) {
        return res.status(400).json({
            success: false,
            pesan: 'Nama, alamat dan nomor HP wajib diisi'
        });
    }

    const wargaBaru = {
        id: getNextId(),
        nama,
        alamat,
        no_hp
    };

    warga.push(wargaBaru);

    res.status(201).json({
        success: true,
        pesan: 'Warga berhasil ditambahkan',
        data: wargaBaru
    });
});

// PUT update warga
router.put('/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const idx = warga.findIndex(w => w.id === id);

    if (idx === -1) {
        return res.status(404).json({
            success: false,
            pesan: 'Warga tidak ditemukan'
        });
    }

    const { nama, alamat, no_hp } = req.body;

    if (nama) warga[idx].nama = nama;
    if (alamat) warga[idx].alamat = alamat;
    if (no_hp) warga[idx].no_hp = no_hp;

    res.json({
        success: true,
        pesan: 'Data warga berhasil diupdate',
        data: warga[idx]
    });
});

// DELETE warga
router.delete('/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const idx = warga.findIndex(w => w.id === id);

    if (idx === -1) {
        return res.status(404).json({
            success: false,
            pesan: 'Warga tidak ditemukan'
        });
    }

    const dihapus = warga.splice(idx, 1);

    res.json({
        success: true,
        pesan: 'Data warga berhasil dihapus',
        data: dihapus[0]
    });
});

module.exports = router;