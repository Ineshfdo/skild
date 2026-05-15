-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 15, 2026 at 06:39 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `skild_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `user_clerk_id` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `skill_id` varchar(36) NOT NULL,
  `skill_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `user_clerk_id`, `username`, `skill_id`, `skill_name`, `created_at`) VALUES
(38, 'user_3DFiqn6TNYo5udp0pjSUAzBLMIS', 'Inesh', 'tnuben5r5ymp0plctz', 'dewdweedwed dewdewdewd w d', '2026-05-12 05:23:29'),
(39, 'user_3DFiqn6TNYo5udp0pjSUAzBLMIS', 'Inesh', 'sk-code-review', 'Code Quality Sentinel', '2026-05-12 05:23:32');

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `id` varchar(36) NOT NULL,
  `author_clerk_id` varchar(255) NOT NULL,
  `author_username` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`tags`)),
  `install_command` varchar(500) NOT NULL,
  `prompt_config` text NOT NULL DEFAULT '',
  `usage_example` text NOT NULL DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `skills`
--

INSERT INTO `skills` (`id`, `author_clerk_id`, `author_username`, `title`, `description`, `tags`, `install_command`, `prompt_config`, `usage_example`, `created_at`) VALUES
('sk-code-review', 'user_3DFiqn6TNYo5udp0pjSUAzBLMIS', 'Inesh', 'Code Quality Sentinel', 'Automatically reviews pull requests for security vulnerabilities, performance bottlenecks, and adherence to clean code principles.', '[\"Development\", \"Security\", \"DevOps\"]', 'npm install @skild/code-sentinel', 'analysis_level: \"strict\"\nplugins: [\"security\", \"complexity\", \"patterns\"]\nreport_type: \"inline-comments\"', 'const sentinel = new Sentinel();\nawait sentinel.reviewPR(process.env.GITHUB_PR_ID);', '2026-05-08 04:08:10'),
('sk-data-viz', 'user_3DFiqn6TNYo5udp0pjSUAzBLMIS', 'Inesh', 'Intelligent Data Visualizer', 'Transforms raw CSV or JSON data into beautiful, interactive charts. Automatically selects the best visualization type based on data patterns.', '[\"Data\", \"Frontend\", \"AI\"]', 'npm install @skild/data-viz', 'default_theme: \"dark\"\nchart_library: \"chartjs\"\nauto_detect_types: true', 'import { visualize } from \"@skild/data-viz\";\n\nconst data = await fetchCSV(\"sales.csv\");\nconst chart = visualize(data);', '2026-05-08 04:08:10'),
('sk-research-01', 'user_3DFiqn6TNYo5udp0pjSUAzBLMIS', 'Inesh', 'Deep Research Agent', 'An agentic skill that performs comprehensive web research using multiple search engines and synthesizes findings into a markdown report.', '[\"AI\", \"Research\", \"Automation\"]', 'npm install @skild/research-agent', 'system_prompt: \"You are a research assistant. Use the provided tools to verify facts and cite sources.\"\nsearch_depth: 3\noutput_format: \"markdown\"', 'import { research } from \"@skild/research-agent\";\n\nawait research(\"Future of quantum computing\");', '2026-05-08 04:08:10'),
('sk-sql-opt', 'user_3DFiqn6TNYo5udp0pjSUAzBLMIS', 'Inesh', 'SQL Performance Optimizer', 'Analyzes your database queries and provides actionable recommendations for indexing, rewriting, and schema improvements.', '[\"Database\", \"Backend\", \"Performance\"]', 'npm install @skild/sql-optimizer', 'engine: \"mysql\"\nexplain_analyze: true\nmax_recommendations: 5', 'const query = \"SELECT * FROM orders JOIN users ON orders.user_id = users.id WHERE orders.total > 1000\";\nconst advice = await optimizer.analyze(query);', '2026-05-08 04:08:10'),
('tnuben5r5ymp0plctz', 'user_3DFiqn6TNYo5udp0pjSUAzBLMIS', 'Inesh', 'dewdweedwed dewdewdewd w d', 'dewe edweddwedw', '[\"System\",\"Automation\",\"Web\",\"Security\"]', 'edw dewd dew', 'dewdewde de wdewdwdedeewdedwedde', 'dewedwedwed dewdewdedewde', '2026-05-11 04:35:55');

-- --------------------------------------------------------

--
-- Table structure for table `upvotes`
--

CREATE TABLE `upvotes` (
  `id` int(11) NOT NULL,
  `user_clerk_id` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `skill_id` varchar(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `upvotes`
--

INSERT INTO `upvotes` (`id`, `user_clerk_id`, `username`, `skill_id`, `created_at`) VALUES
(73, 'user_3DFiqn6TNYo5udp0pjSUAzBLMIS', 'Inesh', 'sk-code-review', '2026-05-12 05:23:39');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `clerk_id` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`clerk_id`, `email`, `username`, `image_url`, `created_at`) VALUES
('user_3DFiqn6TNYo5udp0pjSUAzBLMIS', 'ineshfernando643@gmail.com', 'Inesh', 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zREZpcW16aUFBcVdNQ2NLYzRyaG8waUxjUU8ifQ', '2026-05-06 07:15:01'),
('user_3DNgXm6pFDGgqAPcZ1MKb8Urb9g', 'ineshkavinda669@gmail.com', 'Inesh', 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zRE5nWGhVTEFjM0doTkgwSlRLZ1BsU3JQRVkifQ', '2026-05-07 04:26:57');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_user_skill` (`user_clerk_id`,`skill_id`),
  ADD KEY `fk_fav_skill` (`skill_id`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_author` (`author_clerk_id`),
  ADD KEY `idx_created` (`created_at`);
ALTER TABLE `skills` ADD FULLTEXT KEY `idx_search` (`title`,`description`);

--
-- Indexes for table `upvotes`
--
ALTER TABLE `upvotes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_user_upvote` (`user_clerk_id`,`skill_id`),
  ADD KEY `fk_upvote_skill` (`skill_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`clerk_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `upvotes`
--
ALTER TABLE `upvotes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `fk_fav_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_fav_user` FOREIGN KEY (`user_clerk_id`) REFERENCES `users` (`clerk_id`) ON DELETE CASCADE;

--
-- Constraints for table `skills`
--
ALTER TABLE `skills`
  ADD CONSTRAINT `fk_skill_author` FOREIGN KEY (`author_clerk_id`) REFERENCES `users` (`clerk_id`) ON DELETE CASCADE;

--
-- Constraints for table `upvotes`
--
ALTER TABLE `upvotes`
  ADD CONSTRAINT `fk_upvote_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_upvote_user` FOREIGN KEY (`user_clerk_id`) REFERENCES `users` (`clerk_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
