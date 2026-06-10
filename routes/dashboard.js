const express = require('express');
const router = express.Router();

const { warga } = require('../data/dataWarga');
const { tagihan } = require('../data/dataTagihan');
const { pembayaran } = require('../data/dataPembayaran');

router.get('/', (req, res) => {

    const totalWarga = warga.length;

    const totalTagihan = tagihan.length;

    const tagihanLunas = tagihan.filter(
        t => t.status === 'Lunas'
    ).length;

    const tagihanBelumLunas = tagihan.filter(
        t => t.status === 'Belum Lunas'
    ).length;

    const totalPemasukan = pembayaran.reduce(
        (total, item) => total + item.jumlah_bayar,
        0
    );

    const totalPembayaran = pembayaran.length;

    res.json({
        success: true,
        data: {
            total_warga: totalWarga,
            total_tagihan: totalTagihan,
            tagihan_lunas: tagihanLunas,
            tagihan_belum_lunas: tagihanBelumLunas,
            total_pembayaran: totalPembayaran,
            total_pemasukan: totalPemasukan
        }
    });

});

module.exports = router;