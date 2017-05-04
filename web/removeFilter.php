<?php
  if (isset($_REQUEST["name"])) {
    include("dbConnect.inc");
    $name = $_REQUEST["name"];
    $db->query("DELETE FROM filtered WHERE name='$name';");
    $db->close();
  }
?>
