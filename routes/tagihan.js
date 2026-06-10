const express = require('express');
const router = express.Router();

const { tagihan, getNextTagihanId } = require('../data/dataTagihan');

// semua tagihan
router.get('/', (req, res) => {

    res.json({
        success: true,
        data: tagihan
    });

});

// tambah tagihan
router.post('/', (req, res) => {

    const {
        id_warga,
        bulan,
        tahun,
        jumlah
    } = req.body;

    const dataBaru = {
        id: getNextTagihanId(),
        id_warga,
        bulan,
        tahun,
        jumlah,
        status: 'Belum Lunas'
    };

    tagihan.push(dataBaru);

    res.status(201).json({
        success: true,
        data: dataBaru
    });

});

module.exports = router;