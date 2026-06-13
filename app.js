const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// koneksi database
require('./config/db');

// ========================
// MIDDLEWARE
// ========================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: 'kas_rt_secret_key',
        resave: false,
        saveUninitialized: false
    })
);

// ========================
// EJS
// ========================

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ========================
// STATIC FILE
// ========================

app.use(express.static(path.join(__dirname, 'public')));

// ========================
// ROUTES
// ========================

app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/warga', require('./routes/warga'));
app.use('/tagihan', require('./routes/tagihan'));
app.use('/pembayaran', require('./routes/pembayaran'));
app.use('/pengeluaran', require('./routes/pengeluaran'));
app.use('/laporan', require('./routes/laporan'));
app.use('/', require('./routes/monitor'));

// ========================
// HOME
// ========================

app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

// ========================
// 404
// ========================

app.use((req, res) => {
    res.status(404).send('404 - Halaman Tidak Ditemukan');
});

// ========================
// SERVER
// ========================

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});