const express = require('express');

const app = express();

app.use(express.json());

app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/warga', require('./routes/warga'));
app.use('/tagihan', require('./routes/tagihan'));
app.use('/pembayaran', require('./routes/pembayaran'));
app.use('/laporan', require('./routes/laporan'));

app.listen(3000, () => {
    console.log('Server berjalan di port 3000');
});