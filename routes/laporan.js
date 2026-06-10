const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

    const laporan = {
        total_warga: 50,
        total_tagihan: 1000000,
        total_pembayaran: 800000
    };

    res.json({
        success: true,
        data: laporan
    });

});

module.exports = router;