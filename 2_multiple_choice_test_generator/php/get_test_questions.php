<?php
	include 'db.php';
	$errors = false;

	if (isset ( $_GET ['test_name'] )) {
		
		$test_name = urldecode($_GET ['test_name']);
		$test_name = strip_tags(trim($test_name));
		$test_name = $my_db_object->real_escape_string($test_name);
		
		$get_test_query = "SELECT question, correct_answer, incorrect_1, incorrect_2, incorrect_3
						   FROM test_questions, test_names, test_lookup
						   WHERE test_name_id = t_id
						   AND quest_id = q_id
						   AND test_name ='" . $test_name . "'";
		
		$get_test_query_result = $my_db_object->query ( $get_test_query );
		if ($get_test_query_result === false) {
			die ( 'The request is invalid ' . $my_db_object->error );
		}
		
		$num_rows_tests = $get_test_query_result->num_rows;
		
		if ($num_rows_tests > 0) {
			$test_names = $get_test_query_result->fetch_all();
			echo json_encode ( $test_names );
		} else {
			echo json_encode(false);
		}
		
	} else {
		die('The name of the test was not found!');
	}

	$my_db_object->close ();
?>