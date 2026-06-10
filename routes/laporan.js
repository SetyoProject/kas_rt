const express = require('express');
const router = express.Router();

const { warga } = require('../data/dataWarga');
const { tagihan } = require('../data/dataTagihan');
const { pembayaran } = require('../data/dataPembayaran');

router.get('/', (req, res) => {

    const totalWarga = warga.length;

    const totalPemasukan = pembayaran.reduce(
        (total, item) => total + item.jumlah_bayar,
        0
    );

    const totalPembayaran = pembayaran.length;

    const lunas = tagihan.filter(
        t => t.status === 'Lunas'
    ).length;

    const belumLunas = tagihan.filter(
        t => t.status === 'Belum Lunas'
    ).length;

    res.json({
        success: true,
        laporan: {
            total_warga: totalWarga,
            total_pembayaran: totalPembayaran,
            total_pemasukan: totalPemasukan,
            tagihan_lunas: lunas,
            tagihan_belum_lunas: belumLunas
        }
    });

});

router.get('/pembayaran', (req, res) => {

    res.json({
        success: true,
        total: pembayaran.length,
        data: pembayaran
    });

});

router.get('/belum-lunas', (req, res) => {

    const data = tagihan.filter(
        t => t.status === 'Belum Lunas'
    );

    res.json({
        success: true,
        total: data.length,
        data
    });

});

router.get('/pemasukan', (req, res) => {

    const total = pembayaran.reduce(
        (sum, item) => sum + item.jumlah_bayar,
        0
    );

    res.json({
        success: true,
        total_pemasukan: total
    });

});


module.exports = router;