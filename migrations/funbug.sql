-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 25, 2025 at 05:38 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `funbug`
--

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;

CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `technologies` text DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `year` year(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`, `category`, `description`, `technologies`, `link`, `status`, `year`) VALUES
(1, 'FUN TREE', 'Mobile Application', 'Ứng dụng di động hướng dẫn người dùng trồng cây dựa trên hình ảnh được cung cấp, sử dụng AI để nhận diện và đưa ra lời khuyên phù hợp', 'Flutter, Dart, Node.js, JavaScript, AI/ML', 'https://github.com/', 'Completed', 2024),
(2, 'Website Quản lý Dự án', 'Web Platform', 'Hệ thống web toàn diện cho sinh viên và giáo viên quản lý và chấm điểm dự án tốt nghiệp với giao diện hiện đại và tính năng đa dạng', 'Nuxt.js, TypeScript, JavaScript, PostgreSQL', 'https://github.com/', 'Completed', 2023),
(3, 'RABILOO', 'Educational Platform', 'Website môn học với ba hệ thống con dành cho sinh viên, giáo viên và admin. Tính năng nổi bật là đăng nhập bằng nhận diện khuôn mặt', 'React.js, PHP, MySQL, JavaScript, Computer Vision', 'https://github.com/', 'Completed', 2022),
(4, 'FUN COURSE', 'E-learning Platform', 'Marketplace khóa học tương tự Udemy với các tính năng AI tiên tiến như hệ thống gợi ý thông minh và phân tích học tập', 'React.js, Node.js, JavaScript, AI Recommendation', 'https://github.com/', 'Completed', 2024),
(5, 'MICROORGANISM GAME', 'Educational Game', 'Game giáo dục tương tác giúp học sinh khám phá và hiểu rõ hơn về thế giới vi sinh vật qua gameplay hấp dẫn', 'Unity, C#, Game Development, Educational Design', 'https://github.com/', 'Completed', 2023),
(6, 'LIGHT\'S', 'Health & Wellness App', 'Ứng dụng hỗ trợ sức khỏe tinh thần, cung cấp các gợi ý hàng ngày như games thư giãn và playlists âm nhạc với linh vật cá voi xanh đáng yêu', 'Flutter, Firebase, Node.js, JavaScript, Dart', 'https://github.com/', 'Completed', 2024),
(7, 'THIN BARBER SHOP', 'Web Platform', 'Website hợp tác với Thin barber shop', 'React JS', 'https://thinbabershop.com/', 'Completed', 2024);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
