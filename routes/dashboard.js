const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

    const dashboard = {
        total_warga: 50,
        total_pemasukan: 1000000,
        tagihan_belum_lunas: 10
    };

    res.json({
        success: true,
        data: dashboard
    });

});

module.exports = router;