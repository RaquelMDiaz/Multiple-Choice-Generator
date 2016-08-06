<?php
	//Connect to the database.
	include 'db.php';

	$errors = false;
	
	//See request_data JSON in create_test.js and edit_test.js
	if (isSET($_POST['test_questions']) && isSET($_POST ['test_name'])) {
		
		$questions = json_decode($_POST['test_questions'] );
		
		$_POST['test_name'] = strip_tags(trim($_POST['test_name']));
		$_POST['test_name'] = $my_db_object->real_escape_string($_POST['test_name']);
		
		$check_test_query = "SELECT test_name_id FROM test_names WHERE test_name = '" . $_POST['test_name'] . "'";
		$check_test_result = $my_db_object->query($check_test_query );
		
		if ($check_test_result->num_rows > 0) {
			$check_test_result->free();
			$errors = true;
			$error_msgs ['database'] = 'The entry already exists!';
			echo $error_msgs ['database'];
			exit ();
		} else {
			$check_test_result->free ();
		}
		
		$insert_test_query = "INSERT INTO test_names SET test_name = '" . $_POST ['test_name'] . "'";
		if ($my_db_object->query ( $insert_test_query ) === false) {
			$errors = true;
			$error_msgs ['database'] = 'The request is invalid: ' . $my_db_object->error;
			echo $error_msgs ['database'];
			exit ();
		} else {
			$test_id = $my_db_object->insert_id;
		}
		
		for($i = 0; $i < count ( $questions ); $i ++) {
			
			for ($e = 0; $e < count($questions[$i]); $e++){
				$questions[$i][$e] = strip_tags(trim($questions[$i][$e]));
				$questions[$i][$e] = $my_db_object->real_escape_string($questions[$i][$e]);
			}
			//Check if the question text already exits in database.
			$check_question_query = "SELECT quest_id FROM test_questions WHERE question = '" . $questions[$i][0] . "'";
			$check_question_result = $my_db_object->query ( $check_question_query );
			
			if ($check_question_result->num_rows > 0) {
				//In case it exits link the existing question to the new test.
				$row = $check_question_result->fetch_assoc();
				$question_id = $row['quest_id'];
				$check_question_result->free ();
				
			} else {
				//Otherwise save the question to database.
				$check_test_result->free ();
				$insert_question_query = "INSERT INTO test_questions SET question = '" . $questions[$i][0] . "', correct_answer = '" . $questions[$i][1] . "', incorrect_1 = '" . $questions[$i][2] . "', incorrect_2 = '" . $questions[$i][3] . "', incorrect_3 = '" . $questions[$i][4]."'";
				
				if ($my_db_object->query ( $insert_question_query ) === false) {
					$errors = true;
					$error_msgs ['database'] = 'The request is invalid: ' . $my_db_object->error;
					echo $error_msgs ['database'];
					exit ();
				} else {
					$question_id = $my_db_object->insert_id;
				}
			}
					
			$insert_question_test_lookup_query = "INSERT INTO test_lookup SET q_id = " . $question_id . ", t_id = " . $test_id;
			if ($my_db_object->query ( $insert_question_test_lookup_query ) === false) {
				$errors = true;
				$error_msgs ['database'] = 'The request is invalid ' . $my_db_object->error;
				echo $error_msgs ['database'];
				exit ();
			}
		}
	}
	$my_db_object->close ();
?>