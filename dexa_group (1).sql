-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 02 Nov 2026 pada 17.49
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dexa_group`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `attendances`
--

CREATE TABLE `attendances` (
  `id_attendance` int(11) NOT NULL,
  `employee_id` varchar(36) NOT NULL,
  `employee_name` varchar(150) NOT NULL,
  `attendance_date` date NOT NULL,
  `check_in` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `photo` varchar(1000) NOT NULL,
  `notes` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `attendances`
--

INSERT INTO `attendances` (`id_attendance`, `employee_id`, `employee_name`, `attendance_date`, `check_in`, `photo`, `notes`) VALUES
(2, '7d15d3f1-542b-4719-8553-13e5e29207f3', 'HRD Dexa Group', '2026-11-03', '2026-11-03 00:42:50.128305', 'https://res.cloudinary.com/dyoghcxwy/image/upload/v1793641367/dexa-group/attendance/x76dkftg4pympxqxwlmd.jpg', 'WFH lembur new project dexa'),
(3, 'a0db047b-3aff-4cbd-8df3-d4665fb09eef', 'Ryan Windanu', '2026-11-03', '2026-11-03 00:46:18.735485', 'https://res.cloudinary.com/dyoghcxwy/image/upload/v1793641576/dexa-group/attendance/z2xo5yw4pgnclhgfwrey.jpg', 'fixed bug '),
(4, '2fb16eb4-8c23-4879-80a1-c7e9f26a8b3d', 'Florencia Ancika', '2026-11-03', '2026-11-03 00:47:25.537763', 'https://res.cloudinary.com/dyoghcxwy/image/upload/v1793641643/dexa-group/attendance/me1qph4mupxdslqymrsb.jpg', 'Susun laporan harian');

-- --------------------------------------------------------

--
-- Struktur dari tabel `employees`
--

CREATE TABLE `employees` (
  `id` varchar(36) NOT NULL,
  `name` varchar(150) NOT NULL,
  `employee_code` varchar(30) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `position` varchar(100) NOT NULL,
  `department` varchar(100) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `role` enum('HRD','EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `employees`
--

INSERT INTO `employees` (`id`, `name`, `employee_code`, `email`, `password_hash`, `position`, `department`, `phone`, `role`, `isActive`, `created_at`, `updated_at`) VALUES
('2fb16eb4-8c23-4879-80a1-c7e9f26a8b3d', 'Florencia Ancika', 'DEXA03', 'florencia@dexagroup.com', '$2b$12$1sLQYnYekk3Zc5Dd6UzkluWB9MEMMr2K3yd4ABN4/HueUWVGpQtwe', 'Intern', 'Human Resources', '087965412365', 'HRD', 1, '2026-11-03 00:42:07.881779', '2026-11-03 00:42:07.881779'),
('7d15d3f1-542b-4719-8553-13e5e29207f3', 'HRD Dexa Group', 'DEXA01', 'hrd@dexagroup.com', '$2b$12$c9gzK.OPjS4c.QC4tmHWneAwuhWxpkpi4xmAH14905nVKhYojO1BW', 'Human Resources Development', 'Human Resources', '084751236974', 'HRD', 1, '2026-11-02 23:46:08.148727', '2026-11-03 00:18:22.000000'),
('a0db047b-3aff-4cbd-8df3-d4665fb09eef', 'Ryan Windanu', 'DEXA02', 'ryan@dexagroup.com', '$2b$12$JXOS3JsDCN8IfAYYDgeh0ONRneZro0YAcfD2hTgWZNR0NapEkzloW', 'Leader', 'Marketing', '084576912547', 'EMPLOYEE', 1, '2026-11-03 00:40:40.290467', '2026-11-03 00:40:40.290467');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`id_attendance`),
  ADD UNIQUE KEY `IDX_62374204f547f1723cee88f7d9` (`employee_id`,`attendance_date`);

--
-- Indeks untuk tabel `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_56162b5f24af743a154680684f` (`employee_code`),
  ADD UNIQUE KEY `IDX_765bc1ac8967533a04c74a9f6a` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `attendances`
--
ALTER TABLE `attendances`
  MODIFY `id_attendance` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
