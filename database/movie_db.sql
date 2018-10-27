mysql editor
========================

1. create database movie_development;

2. use movie_development;


3. CREATE TABLE `user` (
	  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	  `username` varchar(16) NOT NULL,
	  `password` varchar(60) NOT NULL,
	  `name` varchar(16) NOT NULL,
	  `image_url` varchar(60)NOT NULL
	);

4. CREATE TABLE `follower` (
	  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	  `user_id` int(11) NOT NULL,
	  `follower_id` int(11) NOT NULL
	);

5. CREATE TABLE `movie`(
	`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`name` varchar(60) NOT NUll,
	`release_date` date,
	`overview` varchar(500) NOT NUll,
	`director` varchar(60),
	`genres` varchar(60),
	`language` varchar(60),
	`runtime` varchar(60),
	`budget` varchar(60),
	`writer` varchar(60),
	`region` varchar(60)
	);

6. CREATE TABLE `likedmovie`(
	`id` int(11) NOT NUll AUTO_INCREMENT PRIMARY KEY,
	`user_id` int(11) NOT Null,
	`movie_id` int(11) NOT NULL
	)

7. CREATE TABLE `dislikedmovie`(
	`id` int(11) NOT NUll AUTO_INCREMENT PRIMARY KEY,
	`user_id` int(11) NOT Null,
	`movie_id` int(11) NOT NULL
	)