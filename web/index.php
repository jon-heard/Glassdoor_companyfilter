<?php
  ///////////////////////////////////////////////////////////////////////////////////
  // Returns company names in the db that match any item in the 'in' argument
  //   in - Array of company names that must be matched by the return
  //   returns - json array of company names
  ///////////////////////////////////////////////////////////////////////////////////
  // Test url:
  //   localhost/content/glassdoor_companyFilter/v1/companies/?in[]=Acadian Asset&in[]=Adventive&in[]=bad&in[]=Applause
  ///////////////////////////////////////////////////////////////////////////////////

  if (isset($_REQUEST["in"])) {
    include("dbConnect.inc");

    // Main execution for this php script (run at the end)
    function main($db) {
      $in = $_REQUEST["in"];
      $sql = "SELECT name FROM filtered WHERE name IN (???)";
      $stmt = createStatementWithStringArrayBinding($db, $sql, $in);
      $stmt->execute();
      $stmt->bind_result($name);
      // Output filtered list (as json)
      $prefix = "";
      echo("[");
      while ($stmt->fetch()) {
        echo($prefix . "\"" . $name . "\"");
        $prefix = ", ";
      }
      echo("]");

      $stmt->close();
      $db->close();
    }

    // Makes a prepared statement with bindings to an array of string values
    //   $db - Database connection
    //   $sql - SQL statement to prepare with '???' for the array input
    //       ie. triple '?' converts to '?,?,?,?,?' if array has 5 elements
    //   $array - Array of values to bind to the prepared statement result
    function createStatementWithStringArrayBinding($db, $sql, $array) {
      $parameterList = implode(',', array_fill(0, count($array), '?'));
      $sql = str_replace("???", $parameterList, $sql);
      $stmt = $db->prepare($sql);

      // Assume array contains all strings here, must adjust line if not so
      $typeList = implode('', array_fill(0, count($array), 's'));

      array_unshift($array, $typeList);

      // http://stackoverflow.com/a/16120923
      if (strnatcmp(phpversion(),'5.3') >= 0) //Reference required if PHP 5.3+
      {
        $refs = array();
        foreach ($array as $key => $value)
            $refs[$key] = &$array[$key];
        $oldArray = $array;
        $array = $refs;
      }

      call_user_func_array(array($stmt, 'bind_param'), $array);
      return $stmt;
    }


    main($db);
  }
?>
