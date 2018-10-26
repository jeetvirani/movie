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

