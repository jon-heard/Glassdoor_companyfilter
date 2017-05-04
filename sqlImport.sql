
CREATE TABLE IF NOT EXISTS `filtered` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (id),
  INDEX name (name)
);

