-- =========================================================
-- AI Sports Tournament Planner - Database Schema for XAMPP
-- Database Name: sports_planner
-- =========================================================

CREATE DATABASE IF NOT EXISTS `sports_planner` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sports_planner`;

-- Drop existing tables if re-creating
DROP TABLE IF EXISTS `matches`;
DROP TABLE IF EXISTS `players`;
DROP TABLE IF EXISTS `documents`;
DROP TABLE IF EXISTS `ai_generations`;
DROP TABLE IF EXISTS `tournaments`;
DROP TABLE IF EXISTS `teams`;
DROP TABLE IF EXISTS `users`;

-- 1. Users Table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tournaments Table
CREATE TABLE `tournaments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `sport` VARCHAR(255) NULL,
  `format` VARCHAR(255) NULL,
  `num_teams` INT NULL,
  `start_date` DATE NULL,
  `end_date` DATE NULL,
  `venue` VARCHAR(255) NULL,
  `grounds` INT DEFAULT 1,
  `match_duration` INT NULL,
  `rest_time` INT NULL,
  `description` TEXT NULL,
  `status` VARCHAR(255) DEFAULT 'Draft',
  `rules` JSON NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Teams Table
CREATE TABLE `teams` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `sport` VARCHAR(255) NULL,
  `captain` VARCHAR(255) NULL,
  `coach` VARCHAR(255) NULL,
  `status` VARCHAR(255) DEFAULT 'Active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Players Table
CREATE TABLE `players` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `team_id` INT NULL,
  `name` VARCHAR(255) NOT NULL,
  `age` INT NULL,
  `jersey` INT NULL,
  `position` VARCHAR(255) NULL,
  `contact` VARCHAR(255) NULL,
  `status` VARCHAR(255) DEFAULT 'Active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_players_teams` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Matches Table
CREATE TABLE `matches` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tournament_id` INT NULL,
  `round` VARCHAR(255) NOT NULL,
  `team1` VARCHAR(255) NULL,
  `team2` VARCHAR(255) NULL,
  `venue` VARCHAR(255) NULL,
  `date` DATE NULL,
  `time` VARCHAR(5) NULL,
  `ground` VARCHAR(255) NULL,
  `status` VARCHAR(255) DEFAULT 'Scheduled',
  `result` VARCHAR(255) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_matches_tournaments` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. AI Generations Log Table
CREATE TABLE `ai_generations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `type` VARCHAR(255) NULL,
  `prompt` TEXT NULL,
  `response` JSON NULL,
  `status` VARCHAR(255) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. RAG Documents Table
CREATE TABLE `documents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `sport` VARCHAR(255) NULL,
  `category` VARCHAR(255) NULL,
  `path` VARCHAR(255) NULL,
  `status` VARCHAR(255) DEFAULT 'Pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- Sample Seed Data
-- =========================================================

-- Demo User (Password: demo1234, BCrypt hash: $2a$10$K7.t8mZ7R2L60Dk1c0tJceZ5G95j4qGfK5F/M9a909a.Yx55Z3t5K -> bcrypt hash for demo1234)
INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES
(1, 'Demo Organizer', 'demo@planner.com', '$2a$10$w8QpGzFqB0q0X5r.6y/1Oe8w3H4J6.h5v8V1b2C3d4E5f6G7h8I9J');

-- Sample Teams
INSERT INTO `teams` (`id`, `name`, `sport`, `captain`, `coach`, `status`) VALUES
(1, 'Thunder XI', 'Cricket', 'Captain 1', 'Coach 1', 'Active'),
(2, 'Royal Strikers', 'Cricket', 'Captain 2', 'Coach 2', 'Active'),
(3, 'Blue Hawks', 'Cricket', 'Captain 3', 'Coach 3', 'Active'),
(4, 'Iron Wolves', 'Cricket', 'Captain 4', 'Coach 4', 'Active');

-- Sample Players
INSERT INTO `players` (`team_id`, `name`, `age`, `jersey`, `position`, `contact`, `status`) VALUES
(1, 'Player 1.1', 19, 1, 'Batsman', '9800000000', 'Active'),
(1, 'Player 1.2', 21, 2, 'Bowler', '9800000001', 'Active'),
(2, 'Player 2.1', 20, 1, 'Batsman', '9801000000', 'Active'),
(2, 'Player 2.2', 22, 2, 'Bowler', '9801000001', 'Active');

-- Sample Tournament
INSERT INTO `tournaments` (`id`, `name`, `sport`, `format`, `num_teams`, `start_date`, `end_date`, `venue`, `grounds`, `match_duration`, `rest_time`, `description`, `status`, `rules`) VALUES
(1, 'City Cricket Cup', 'Cricket', 'Knockout', 8, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'City Sports Complex', 2, 120, 30, 'Annual inter-club knockout cricket tournament.', 'Active', '["20 overs per side", "15 minute late-arrival forfeit"]');

-- Sample Matches
INSERT INTO `matches` (`tournament_id`, `round`, `team1`, `team2`, `venue`, `date`, `time`, `ground`, `status`, `result`) VALUES
(1, 'Quarter Final 1', 'Thunder XI', 'Royal Strikers', 'City Sports Complex', CURDATE(), '09:00', 'Ground 1', 'Completed', 'Thunder XI won by 24 runs'),
(1, 'Quarter Final 2', 'Blue Hawks', 'Iron Wolves', 'City Sports Complex', CURDATE(), '11:30', 'Ground 2', 'Scheduled', NULL);
