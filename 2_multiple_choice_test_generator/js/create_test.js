/*The following variables store multidimensional arrays containing the question sets input by the user and the question sets that the user decides
to erase from the display section in the create_test.html file.*/
var my_question_sets_array = [];
var my_deleted_question_sets = [];

$(document).ready(function() {
	/*On clicking the button add_question_set, the following code will be executed.*/
	$('#add_question_set').click(function(e) {
		e.preventDefault();
		/*First, the corresponding completeness check is performed so as to prevent any input field from being empty.*/
		var my_errors = false;
		$('#test_generator .error').remove();
		$('#test_generator :text').each(function() {
			if ($(this).val() == '') {
				$(this).after('<div class="error">Please provide a value for this field!</div>');
				my_errors = true;
			}
		});

		if (my_errors) {
			return false;
		} else {
				/*If no errors were found, the following code will be executed.
				A new question set is created as an array. This array contains the data input by the user and collected with jQuery.*/
				var new_question_set = [$('#test_question').val(), $('#correct_question').val(), $('#incorrect_question1').val(), $('#incorrect_question2').val(), $('#incorrect_question3').val() ];
				/*The variable question_set_index stores the result of the function checkIfElementExists -see functions_library.js, lines 55 to
				61. The purpose of said function is to check if the newly input question has already been entered in the same test. It takes two parameters,
				whose arguments are the main array containing all input from the user and the last input question set.*/
				var question_set_index = checkIfElementExists(my_question_sets_array, new_question_set);
				/*The following variable stores the result of the same function. In this case, the arguments are the array of deleted question sets
				and the question index stored in the previous variable. The purpose is to determine if the question set that the user decided to
				erase exists in the array od deleted question sets.*/
				var deleted_question_set_index  = checkIfElementExists(my_deleted_question_sets, question_set_index);
			/*If the question_set_index variable has the value 'undefined', the new question set is pushed into the main_question_set_array.*/
			if (question_set_index === undefined) {
				/*The updated length of the main_question_set_array is stored in the array_length variable.*/
				var array_length = my_question_sets_array.push(new_question_set);
				/**/
				var radio_button_index = array_length - 1;
				/**/
				var new_question_set_copy = new_question_set.slice();
				var shuffled_question_set = shuffleAnswers(new_question_set_copy);

				printQuestionSet(shuffled_question_set, radio_button_index);
					
				$('#test_generator :text').each(function() {
					$(this).val('');
				});
			} else if (question_set_index >= 0 && deleted_question_set_index >= 0) {
				//We are adding a question we prevously deleted
				new_question_set_copy = new_question_set.slice();
				shuffled_question_set = shuffleAnswers(new_question_set_copy);
				my_deleted_question_sets.splice(deleted_question_set_index, 1);

				printQuestionSet(shuffled_question_set, question_set_index);
				$('#test_generator :text').each(function() {
					$(this).val('');
				});		
			} else {			
				alert("This question has already been entered!");
			}
	   }
	});

	$(document).on('click', '#delete_question', function(e) {
		e.preventDefault();
		if (!confirm('Do you really want to delete this question?')) {
			return false;
		} else {
			var current_question_set = $(this).parent().find('.question').text();
			for (i = 0; i < my_question_sets_array.length; i++) {
				if (current_question_set == my_question_sets_array[i][0]) {
				my_deleted_question_sets.push(i);
				$(this).parent().remove();
				}
			}
		}
	});

	$('#evaluate_test').click(function(e) {
		e.preventDefault();
		// my_errors = false;
		$('#display_questions_sets').find('.error').remove();

			if (!confirm('You are about to submit your answers. Do you really want to continue?')) {
				return false;
			} else {
			// variable to save the number of
			// correct answers
				var evaluate_counter = 0;
				$('#display_questions_sets .question_set').each(function() {
					var option_name = $(this).find('.answer').attr('name');
					var question_set_index = option_name.substring(6);
					var correct_answer = my_question_sets_array[question_set_index][1];
					var selected_option = $(':radio[name="answer' + question_set_index + '"]:checked').val();
					if (selected_option == correct_answer) {
						evaluate_counter++;
					}
			});

			$('#score_section').empty();
			$('#score_section').show();

			var total = my_question_sets_array.length - my_deleted_question_sets.length;
				$('#score_section').append("<h3>" + "Score: " + evaluate_counter + " out of " + total + "</h3>");
			}
			
		});
					
		$('#reset_test').click(function(e){
			e.preventDefault();
			$(this).parent().find(':radio').attr('checked',false);
		});
					
		$('#save_test').click(function(e){
			e.preventDefault();
					  
			var my_errors = false; 
			$('#display_section .error').remove();
			$('#display_section :text').each(function() {
				if ($(this).val() == '') { 
					$(this).after('<div class="error">Please provide a name for the test</div>');
					my_errors = true; 
				} 
			}); 
				
				if (my_question_sets_array.length - my_deleted_question_sets.length == 0){
					alert("You need at least one question to save a test");
					my_errors = true;
				}
					  
				if(my_errors) { 
					return false;  
				} else {
					
					for (i = 0; i < my_deleted_question_sets.length; i++){
						my_question_sets_array.splice(my_deleted_question_sets[i], 1);
					}
									
					var input_data = JSON.stringify(my_question_sets_array);
					var test_name_value = $('#test_name').val();
					var request_data = {test_name : test_name_value, test_questions : input_data};
							  
					$.post('../php/save_test.php', request_data , function(response_data){
						alert('The test was saved successfully!');
						$(location).attr('href','http://localhost/raquel/index.html');
					})
					.fail(function() { 
						alert('Error! Please try again.');
					}); 
				} 
			});
					 
});