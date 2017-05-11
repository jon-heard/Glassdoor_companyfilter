<?php
  $host = "localhost";
  $username = "root";
  $password = "mysql";
  $database = "glassdoor_filter";

  global $db;
  $db = new mysqli($host, $username, $password, $database);
  if ($db->connect_error) {
    die("Connection failed: " . $db->connect_error);
  }
?>
