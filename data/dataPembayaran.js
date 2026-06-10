const pembayaran = [
    {
        id: 1,
        id_tagihan: 1,
        tanggal_bayar: '2026-06-05',
        jumlah_bayar: 20000
    }
];

const getNextPembayaranId = () => {
    return pembayaran.length > 0
        ? Math.max(...pembayaran.map(p => p.id)) + 1
        : 1;
};

module.exports = {
    pembayaran,
    getNextPembayaranId
};