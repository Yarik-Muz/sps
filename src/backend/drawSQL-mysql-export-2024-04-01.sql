CREATE TABLE `parking`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `parking_name` VARCHAR(255) NOT NULL,
    `capacity` INT NOT NULL,
    `free_places` INT NOT NULL,
    `date_time` DATETIME NOT NULL
);