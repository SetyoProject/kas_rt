const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kas_rt'
});

db.connect((err) => {
    if (err) {
        console.log('Koneksi gagal');
        console.log(err);
    } else {
        console.log('Database Connected');
    }
});

module.exports = db;