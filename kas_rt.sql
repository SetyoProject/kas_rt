-- =====================================
-- DATABASE KAS RT
-- =====================================

CREATE DATABASE IF NOT EXISTS kas_rt;
USE kas_rt;

-- =====================================
-- TABEL USERS
-- =====================================

CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','bendahara') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- TABEL WARGA
-- =====================================

CREATE TABLE warga (
    id_warga INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    alamat TEXT NOT NULL,
    no_hp VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- TABEL TAGIHAN
-- =====================================

CREATE TABLE tagihan (
    id_tagihan INT AUTO_INCREMENT PRIMARY KEY,
    id_warga INT NOT NULL,
    bulan VARCHAR(20) NOT NULL,
    tahun YEAR NOT NULL,
    jumlah_tagihan DECIMAL(10,2) NOT NULL,
    status ENUM('Lunas','Belum Lunas')
    DEFAULT 'Belum Lunas',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tagihan_warga
    FOREIGN KEY (id_warga)
    REFERENCES warga(id_warga)
    ON DELETE CASCADE
);

-- =====================================
-- TABEL PEMBAYARAN
-- =====================================

CREATE TABLE pembayaran (
    id_pembayaran INT AUTO_INCREMENT PRIMARY KEY,
    id_tagihan INT NOT NULL,
    id_user INT NOT NULL,
    tanggal_bayar DATE NOT NULL,
    jumlah_bayar DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pembayaran_tagihan
    FOREIGN KEY (id_tagihan)
    REFERENCES tagihan(id_tagihan)
    ON DELETE CASCADE,

    CONSTRAINT fk_pembayaran_user
    FOREIGN KEY (id_user)
    REFERENCES users(id_user)
);

-- =====================================
-- DATA AWAL USERS
-- =====================================

INSERT INTO users (username,password,role)
VALUES
('admin','123','admin'),
('bendahara','123','bendahara');

-- =====================================
-- DATA AWAL WARGA
-- =====================================

INSERT INTO warga (nama,alamat,no_hp)
VALUES
('Budi Santoso','RT 01/RW 02','08123456789'),
('Andi Saputra','RT 01/RW 02','08129876543'),
('Siti Aminah','RT 02/RW 02','081377777777');

-- =====================================
-- DATA AWAL TAGIHAN
-- =====================================

INSERT INTO tagihan
(id_warga,bulan,tahun,jumlah_tagihan,status)
VALUES
(1,'Juni',2026,20000,'Belum Lunas'),
(2,'Juni',2026,20000,'Belum Lunas'),
(3,'Juni',2026,20000,'Belum Lunas');

-- =====================================
-- DATA AWAL PEMBAYARAN
-- =====================================

INSERT INTO pembayaran
(id_tagihan,id_user,tanggal_bayar,jumlah_bayar)
VALUES
(1,2,CURDATE(),20000);

-- =====================================
-- TRIGGER OTOMATIS LUNAS
-- =====================================

DELIMITER $$

CREATE TRIGGER trg_pembayaran_lunas
AFTER INSERT ON pembayaran
FOR EACH ROW
BEGIN

    UPDATE tagihan
    SET status = 'Lunas'
    WHERE id_tagihan = NEW.id_tagihan;

END$$

DELIMITER ;

-- =====================================
-- VIEW LAPORAN PEMBAYARAN
-- =====================================

CREATE VIEW v_laporan_pembayaran AS
SELECT
    p.id_pembayaran,
    w.nama,
    t.bulan,
    t.tahun,
    p.tanggal_bayar,
    p.jumlah_bayar
FROM pembayaran p
JOIN tagihan t
    ON p.id_tagihan = t.id_tagihan
JOIN warga w
    ON t.id_warga = w.id_warga;

-- =====================================
-- VIEW WARGA BELUM LUNAS
-- =====================================

CREATE VIEW v_warga_belum_lunas AS
SELECT
    w.id_warga,
    w.nama,
    t.bulan,
    t.tahun,
    t.jumlah_tagihan
FROM tagihan t
JOIN warga w
    ON t.id_warga = w.id_warga
WHERE t.status = 'Belum Lunas';