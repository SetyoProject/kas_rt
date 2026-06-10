const warga = [
    {
        id: 1,
        nama: 'Budi',
        alamat: 'RT 01',
        no_hp: '08123456789'
    },
    {
        id: 2,
        nama: 'Andi',
        alamat: 'RT 02',
        no_hp: '08123456788'
    }
];

const getNextId = () => {
    return warga.length > 0
        ? Math.max(...warga.map(w => w.id)) + 1
        : 1;
};

module.exports = {
    warga,
    getNextId
};