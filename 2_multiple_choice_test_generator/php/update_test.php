<?php
	include 'db.php';
	$errors = false;

	if (isset($_POST['test_name'])) {
		
		$_POST['test_name'] = strip_tags (trim($_POST['test_name']));
		$_POST['test_name'] = $my_db_object->real_escape_string($_POST['test_name']);
		
		if (isset($_POST['deleted_questions'])) {
			$deleted_questions = json_decode($_POST['deleted_questions']);
			
			for($i = 0; $i < count($deleted_questions); $i ++) {
				
				$question = strip_tags(trim($deleted_questions[$i][0]));
				$question = $my_db_object->real_escape_string($deleted_questions[$i][0]);
				
				$retrieve_question_query = "SELECT quest_id FROM test_questions WHERE question ='" . $question . "'";
				
				$retrieve_question_result = $my_db_object->query($retrieve_question_query);
				if ($retrieve_question_result === false) {
					die ('The request is invalid ' . $my_db_object->error);
				}
				
				$row = $retrieve_question_result->fetch_assoc();
				
				//Check if the question is linked to more than one test
				$quest_id = $row ['quest_id'];
				$retrieve_test_lookup_query = "SELECT t_id FROM test_lookup WHERE q_id = " . $quest_id;
				$retrieve_test_lookup_result = $my_db_object->query ( $retrieve_test_lookup_query );
				
				if ($retrieve_test_lookup_result === false) {
					die('The request is invalid ' . $my_db_object->error);
				}
				
				$number_of_rows = $retrieve_test_lookup_result->num_rows;
				if ($number_of_rows == 1) {
					//If the question is used in only one test it can be DELETEd.
					$deleted_questions_query = "DELETE FROM test_questions WHERE quest_id = " . $quest_id;
					$delete_question_result = $my_db_object->query ( $deleted_questions_query );
					
					if ($delete_question_result === false) {
						die ( 'The request is invalid ' . $my_db_object->error );
					}
				}
				
				//In any case the link to the test has to be DELETEd
				$_POST['test_name'] = strip_tags(trim($_POST['test_name']));
				$_POST['test_name'] = $my_db_object->real_escape_string($_POST['test_name']);
				
				$retrieve_test_query = "SELECT test_name_id FROM test_names WHERE test_name ='" . $_POST['test_name'] . "'";
				$retrieve_test_result = $my_db_object->query ( $retrieve_test_query );
				
				if ($retrieve_test_result === false) {
					die ( 'The request is invalid ' . $my_db_object->error );
				}
				
				$row = $retrieve_test_result->fetch_assoc ();
				$test_name_id = $row ['test_name_id'];
				
				$delete_test_lookup_query = "DELETE FROM test_lookup WHERE t_id = " . $test_name_id . " AND q_id = " . $quest_id;
				$delete_test_lookup_query = $my_db_object->query ( $delete_test_lookup_query );
				
				if ($delete_test_lookup_query === false) {
					die ( 'IThe request is invalid: ' . $my_db_object->error );
				}
			}
		}
		
		if (isset($_POST['updated_questions']) && isset($_POST['original_questions'])) {
			$updated_questions = json_decode($_POST['updated_questions']);
			$original_questions = json_decode($_POST['original_questions']);
			
			for($i = 0; $i < count($original_questions); $i ++) {
				$original_questions[$i] = strip_tags(trim( $original_questions[$i]));
				$original_questions[$i] = $my_db_object->real_escape_string($original_questions[$i]);
			}
			
			for($i = 0; $i < count($updated_questions); $i ++) {			
				for ($e = 0; $e < count($updated_questions[$i]); $e++){
					$updated_questions[$i][$e] = strip_tags(trim($updated_questions[$i][$e]));
					$updated_questions[$i][$e] = $my_db_object->real_escape_string($updated_questions[$i][$e]);
				}
				
				//Check if the question text already exits in database.
				$check_question_query = "SELECT quest_id FROM test_questions WHERE question = '" . $original_questions[$i]. "'";
				$check_question_result = $my_db_object->query ( $check_question_query );
				
				if ($check_question_result === false) {
					die('The request is invalid ' . $my_db_object->error);
				}
				
				if ($check_question_result->num_rows > 0) {
					//In case it exits link the existing question to the new test
					$row = $check_question_result->fetch_assoc();
					$quest_id = $row['quest_id'];
					$check_question_result->free();
				} else {
					//Otherwise save the question to database.
					die('question not found');
				}
				
				$update_question_query = "UPDATE test_questions SET question = '" . $updated_questions[$i][0] . "', correct_answer = '" . $updated_questions[$i][1] . "', incorrect_1 = '" . $updated_questions[$i][2]. "', incorrect_2 = '" . $updated_questions[$i][3] . "', incorrect_3 = '" . $updated_questions [$i][4] . "'WHERE quest_id = " . $quest_id;
				$update_question_result = $my_db_object->query ( $update_question_query );
				
				if ($update_question_result === false) {
					die('The request is invalid ' . $my_db_object->error);
				}
			}
		}
		
		if (isset($_POST['new_questions'])) {
			
			$new_test_questions = json_decode($_POST['new_questions']);
			
			$check_test_query = "SELECT test_name_id FROM test_names WHERE test_name = '" . $_POST ['test_name'] . "'";
			$check_test_result = $my_db_object->query ( $check_test_query );
			
			if ($check_test_result === false) {
				die ( 'IThe request is invalid: ' . $my_db_object->error );
			}
			
			if ($check_test_result->num_rows > 0) {
				$row = $check_test_result->fetch_assoc ();
				$test_name_id = $row ['test_name_id'];
				$check_test_result->free ();
			} else {
				die('The test was not found.');
			}
			
			for ($i = 0; $i < count($new_test_questions); $i ++) {
					
				for($e = 0; $e < count($new_test_questions[$i]); $e++) {
					$new_test_questions[$i][$e] = strip_tags(trim($new_test_questions[$i][$e]));
					$new_test_questions[$i][$e] = $my_db_object->real_escape_string($new_test_questions[$i][$e]);
				}
				
				//Check if the question text already exits in database.
				$check_question_query = "SELECT quest_id FROM test_questions WHERE question = '" . $new_test_questions[$i][0] . "'";
				$check_question_result = $my_db_object->query($check_question_query);
				
				if ($check_question_result === false) {
					die('IThe request is invalid: ' . $my_db_object->error);
				}
				
				if ($check_question_result->num_rows > 0) {
					//In case it exits link the existing question to the new test
					$row = $check_question_result->fetch_assoc();
					$quest_id = $row['quest_id'];
					$check_question_result->free();
				} else {
					//Otherwise save the question to database.
					$check_question_result->free();
					$insert_question_query = "INSERT INTO test_questions SET question = '" . $new_test_questions[$i][0] . "', correct_answer = '" . $new_test_questions[$i][1] . "', incorrect_1 = '" . $new_test_questions[$i][2] . "', incorrect_2 = '" . $new_test_questions[$i][3] . "', incorrect_3 = '" . $new_test_questions[$i][4] . "'";
					
					if ($my_db_object->query($insert_question_query ) === false) {
						die('The request is invalid ' . $my_db_object->error);
					} else {
						$quest_id = $my_db_object->insert_id; //insert_id?
					}
				}
				
				$insert_test_lookup_query = "INSERT INTO test_lookup SET q_id = " . $quest_id . ", t_id = " . $test_name_id;
				if ($my_db_object->query($insert_test_lookup_query) === false) {
					die('The request is invalid ' . $my_db_object->error);
				}
			}
		}
	} else {
		die('Error! Please try again.');
	}
	$my_db_object->close();
?>