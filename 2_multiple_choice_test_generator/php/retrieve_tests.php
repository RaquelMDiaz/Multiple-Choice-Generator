<?php
	include 'db.php';
	$errors = false;
	
	$get_test_query = "SELECT test_name FROM test_names";
	$get_test_query_result = $my_db_object->query($get_test_query);
	
	if ($get_test_query_result === false) {
		die('The request is invalid ' . $my_db_object->error);
	}

	$num_rows_tests = $get_test_query_result->num_rows;
	 
	if ($num_rows_tests > 0) {
		$test_names = $get_test_query_result->fetch_all();
		echo json_encode($test_names);
	} else {
		echo json_encode('The entries requested were not found.');
	}

	$my_db_object->close ();
?>