-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 27, 2025 at 10:01 AM
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
-- Database: `funplay`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` varchar(50) NOT NULL,
  `post_id` varchar(50) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'neutral',
  `rate` double NOT NULL DEFAULT 0,
  `reactions_total_count` int(11) DEFAULT 0,
  `comment_count` int(11) DEFAULT 0,
  `isTaggedSentiment` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` varchar(50) NOT NULL,
  `created_time` datetime NOT NULL,
  `permalink_url` varchar(1000) NOT NULL,
  `full_picture` varchar(1000) NOT NULL,
  `shares_count` int(11) NOT NULL DEFAULT 0,
  `reactions_total_count` int(11) NOT NULL DEFAULT 0,
  `message` text NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'neutral',
  `rate` double NOT NULL DEFAULT 0,
  `isTaggedSentiment` tinyint(1) DEFAULT 0,
  `address` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `isTaggedPosition` tinyint(1) NOT NULL DEFAULT 0,
  `latitude` double NOT NULL DEFAULT 0,
  `longitude` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `post_images`
--

CREATE TABLE `post_images` (
  `id` int(11) NOT NULL,
  `post_id` varchar(50) DEFAULT NULL,
  `full_picture_src` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `refresh_token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sub_comments`
--

CREATE TABLE `sub_comments` (
  `id` varchar(50) NOT NULL,
  `parent_comment_id` varchar(50) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'neutral',
  `rate` double NOT NULL DEFAULT 0,
  `isTaggedSentiment` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sub_post_images`
--

CREATE TABLE `sub_post_images` (
  `id` int(11) NOT NULL,
  `post_id` varchar(50) DEFAULT NULL,
  `image_height` int(11) DEFAULT NULL,
  `image_width` int(11) DEFAULT NULL,
  `image_src` varchar(1000) DEFAULT NULL,
  `target_id` varchar(50) DEFAULT NULL,
  `target_url` varchar(1000) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name_account` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user_favorites`
--

CREATE TABLE `user_favorites` (
  `user_id` int(11) NOT NULL,
  `post_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comments_ibfk_1` (`post_id`);
ALTER TABLE `comments` ADD FULLTEXT KEY `message` (`message`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `posts` ADD FULLTEXT KEY `message` (`message`);

--
-- Indexes for table `post_images`
--
ALTER TABLE `post_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_images_ibfk_1` (`post_id`);

--
-- Indexes for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `sub_comments`
--
ALTER TABLE `sub_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sub_comments_ibfk_1` (`parent_comment_id`);
ALTER TABLE `sub_comments` ADD FULLTEXT KEY `message` (`message`);

--
-- Indexes for table `sub_post_images`
--
ALTER TABLE `sub_post_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sub_post_images_ibfk_1` (`post_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_favorites`
--
ALTER TABLE `user_favorites`
  ADD PRIMARY KEY (`user_id`,`post_id`),
  ADD KEY `favorite_id` (`post_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `post_images`
--
ALTER TABLE `post_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sub_post_images`
--
ALTER TABLE `sub_post_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `post_images`
--
ALTER TABLE `post_images`
  ADD CONSTRAINT `post_images_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sub_comments`
--
ALTER TABLE `sub_comments`
  ADD CONSTRAINT `sub_comments_ibfk_1` FOREIGN KEY (`parent_comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sub_post_images`
--
ALTER TABLE `sub_post_images`
  ADD CONSTRAINT `sub_post_images_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_favorites`
--
ALTER TABLE `user_favorites`
  ADD CONSTRAINT `fk_user_favorites_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
