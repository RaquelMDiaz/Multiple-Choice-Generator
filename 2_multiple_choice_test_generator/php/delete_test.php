<?php
	include 'db.php';
	$errors = false;

	if (isset($_GET['test_name'])) {
		$test_name = urldecode($_GET['test_name']);
		$test_name = strip_tags(trim($test_name));
		$test_name = $my_db_object->real_escape_string($test_name );

		$get_test_query = "SELECT test_name_id FROM test_names WHERE test_name ='" . $test_name . "'";

		$get_test_query_result = $my_db_object->query ( $get_test_query );
		if ($get_test_query_result === false) {
			die ( 'The request is invalid ' . $my_db_object->error );
		}

		$retrieve_test_num_rows = $get_test_query_result->num_rows;

		if ($retrieve_test_num_rows > 0) {
			$test_data = $get_test_query_result->fetch_assoc();
			$get_quest_id_query = "SELECT q_id FROM test_lookup WHERE t_id = " . $test_data['test_name_id'];		
			$get_quest_id_result = $my_db_object->query($get_quest_id_query);
					
			if ($get_quest_id_result === false) {
				die('The request is invalid ' . $my_db_object->error);
			}
					
			if ($get_quest_id_result->num_rows == 0){
				die ( 'The entry requested was not found.' );
			}

			while ($row = $get_quest_id_result->fetch_assoc()){
				$delete_question_query = "DELETE FROM test_questions WHERE quest_id = " . $row['q_id'];
				$delete_question_query_result = $my_db_object->query($delete_question_query);

				if ($delete_question_query_result === false) {
					die('The request is invalid ' . $my_db_object->error);
				}			
			}

			$delete_quest_id_query = "DELETE FROM test_lookup WHERE t_id = ". $test_data['test_name_id'];	
			$delete_quest_id_result = $my_db_object->query($delete_quest_id_query);

			if ($delete_quest_id_result === false) {
				die('The request is invalid ' . $my_db_object->error);
			}

			$delete_test_query = "DELETE FROM test_names WHERE test_name ='" . $test_name . "'";
			$delete_test_query_result = $my_db_object->query($delete_test_query);

			if ($delete_test_query_result === false) {
				die('The request is invalid ' . $my_db_object->error);
			}
		} else {
			echo json_encode(false);	
			die();
		}
	} else {
		die('The name of the test was not found.');
	}

	echo json_encode(true);	
	$my_db_object->close();
?>