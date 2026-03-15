-- Run this once to set up your database
CREATE DATABASE IF NOT EXISTS hackathon;
USE hackathon;

CREATE TABLE IF NOT EXISTS `groups` (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('completed','in progress')
);

CREATE TABLE IF NOT EXISTS members (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  group_id   INT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name  VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  phone      VARCHAR(30)  NOT NULL,
  school     VARCHAR(150) NOT NULL,
  idea       TEXT         NOT NULL,
  photo      VARCHAR(255) NOT NULL,
  joined_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE
);
