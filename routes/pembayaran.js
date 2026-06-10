const express = require('express');
const router = express.Router();

const { pembayaran, getNextPembayaranId } = require('../data/dataPembayaran');

// semua pembayaran
router.get('/', (req, res) => {

    res.json({
        success: true,
        data: pembayaran
    });

});

// tambah pembayaran
router.post('/', (req, res) => {

    const {
        id_tagihan,
        tanggal_bayar,
        jumlah_bayar
    } = req.body;

    const pembayaranBaru = {
        id: getNextPembayaranId(),
        id_tagihan,
        tanggal_bayar,
        jumlah_bayar
    };

    pembayaran.push(pembayaranBaru);

    res.status(201).json({
        success: true,
        pesan: 'Pembayaran berhasil'
    });

});

module.exports = router;