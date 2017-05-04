<?php
  if (isset($_REQUEST["name"])) {
    include("dbConnect.inc");
    $name = $_REQUEST["name"];
    $db->query("INSERT INTO filtered(name) VALUE ('$name');");
    $db->close();
  }
?>
