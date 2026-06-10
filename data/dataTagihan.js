const tagihan = [
    {
        id: 1,
        id_warga: 1,
        bulan: 'Juni',
        tahun: 2026,
        jumlah: 20000,
        status: 'Lunas'
    },
    {
        id: 2,
        id_warga: 2,
        bulan: 'Juni',
        tahun: 2026,
        jumlah: 20000,
        status: 'Belum Lunas'
    }
];

const getNextTagihanId = () => {
    return tagihan.length > 0
        ? Math.max(...tagihan.map(t => t.id)) + 1
        : 1;
};

module.exports = {
    tagihan,
    getNextTagihanId
};