var my_question_sets_array = [];
var new_question_list = [];
var update_question_list = [];
var original_question_list = [];
var my_deleted_elements = [];
var question_index = 0;

$(document).ready(function() {
	var url =  window.location.search;
	var parameter_array = url.split('?');
	var test_name_parameter_array = parameter_array[1].split('=');
	var url_test_name = decodeURIComponent(test_name_parameter_array[1]);
	var request_data = {test_name : url_test_name};
	
	$.getJSON('../php/get_test_questions.php', request_data, function(response_data) {
		$.each(response_data, function(key, value) {
			var length = my_question_sets_array.push(value);
			var last_index = length-1;
			printQuestionSet(value, last_index);
			$('#test_name').val(url_test_name);
		})
		$('.edit_question').show();
	}).fail(function() {
		alert('Error! Please try again.');
	});

	$(document).on('click','.edit_question', function(e){
		e.preventDefault();
		$('#my_edit_overlay #overlay_add_question_set').hide();
		$('#my_edit_overlay #change_question').show();
		$('#my_edit_overlay').show();
		$('#my_display_overlay').find('.error').remove();
		
		var question_set = $(this).parent().find('.answer').attr('name');
		var question_set_index = question_set.substring(6);
		$('.in-overlay').attr('id', question_set_index);
		$('#test_question').val(my_question_sets_array[question_set_index][0]);
		$('#correct_question').val(my_question_sets_array[question_set_index][1])
		$('#incorrect_question1').val(my_question_sets_array[question_set_index][2])
		$('#incorrect_question2').val(my_question_sets_array[question_set_index][3])
		$('#incorrect_question3').val(my_question_sets_array[question_set_index][4])
		
		var quesion_overlay = $($(this).attr('rel'));
		quesion_overlay.prepend('<div class="overlay-close"></div>').show();
	} );
	
	$(document).on('click', '#cancel_question', function(e) {
		e.preventDefault();
		$('#my_edit_overlay').hide();
	});	
	
	$(document).on('click', '#change_question', function(e) {
		e.preventDefault();
		
		var my_errors = false;
		$('#my_display_overlay').find('.error').remove();
		
		$('#my_display_overlay :text').each(function() {
			if ($(this).val() == '') {
				$(this).before('<div class="error">Please provide a value for this field!</div>');
				my_errors = true;
			}
		});
		
		if (my_errors) {
			return false;
		} else {
			//Do I need this?
			var form_element = $(this).parent();
			// read the values into an array
			var my_question_set = [$('#test_question').val(), $('#correct_question').val(), $('#incorrect_question1').val(), $('#incorrect_question2').val(), $('#incorrect_question3').val() ];
			var new_question_set_copy = my_question_set.slice();
			var shuffled_question_set = shuffleAnswers(new_question_set_copy);
			
			question_index = $('.in-overlay').attr('id');
			
			var check_element_exists = checkIfElementExists(my_question_sets_array, my_question_set);
			if ( check_element_exists === undefined || check_element_exists == question_index) {
				$('#my_edit_overlay').hide();
				original_question_list.push(my_question_sets_array[question_index][0]);
				my_question_sets_array[question_index] = my_question_set;
				update_question_list.push(my_question_set);
			} else {
				alert('Attention: questions can not be repeated!');
				return;
			}
			
			var questions_div = $('#display_section').find('#display_questions_sets');
			var test  = $(questions_div).find('.question_set');
			$(questions_div).children('.question_set').each(function(index, element) {
				
				var answer = $(this).find('.answer').attr('name');
				var my_deleted_elements = answer.substring(6);
				
				if( my_deleted_elements == question_index ){
					
					$(element).empty();
					
					var question_set_html = '';
					question_set_html += '<h3 class = "question">' + my_question_set[0] + '</h3>';
	  
					question_set_html += '<input type="radio" name="answer'+question_index+'" value="' + 
					shuffled_question_set[1]+'" class="answer">'+shuffled_question_set[1] + '<br>';
	  
					question_set_html += '<input type="radio" name="answer'+question_index+'" value="' + 
					shuffled_question_set[2] + '" class="answer">' + shuffled_question_set[2] + '<br>';

					question_set_html += '<input type="radio" name="answer'+question_index+'" value="' + 
					shuffled_question_set[3] +'" class="answer">' + shuffled_question_set[3] + '<br>';
	  
					question_set_html += ' <input type="radio" name="answer'+question_index+'" value="'+ 
					shuffled_question_set[4] + '" class="answer">' + shuffled_question_set[4] + '<br><br>';
	  
					question_set_html += '<input type="submit" name="delete_question" id="delete_question" value="Delete Question">';
					question_set_html += '<input type="submit" rel="#quesion_overlay" name="edit_question" id="edit_question" value="Edit Question">';
					$(element).prepend(question_set_html);
				}
			});
		}
	});
	
	$(document).on('click','#delete_question', function(e){
		e.preventDefault();
		if (!confirm('Do you really want to delete this question?')) {
			return false;
		} else {		
			var question_set = $(this).parent().find('.answer').attr('name');
			var question_set_index = question_set.substring(6);
			$(this).parent().remove();
			my_deleted_elements.push(my_question_sets_array[question_set_index]);
		}
	});
	
	 $('#add_question_set').click(function(e) {
		e.preventDefault();
		 
		$('#my_display_overlay :text').each(function() {
			$(this).val('');
		});
		$('#my_display_overlay').find('.error').remove();
		$('#my_edit_overlay #overlay_add_question_set').show();
		$('#my_display_overlay #change_question').hide();
		$('#my_edit_overlay').show();

			
		var quesion_overlay = $($(this).attr('rel'));
		quesion_overlay.prepend('<div class="overlay-close"></div>').show();		  
		});
	 
	 $(document).on('click', '#overlay_add_question_set', function(e) {
			e.preventDefault();
			my_errors = false;
			$('#my_display_overlay').find('.error').remove();
			$('#my_display_overlay :text').each(function() {
				if ($(this).val() == '') {
					$(this).before('<div class="error">Please provide a value for this field!</div>');
					my_errors = true;
				}
			});
			
			if (my_errors) {
				return false;
			} else {
				var my_question_set = [$('#test_question').val(), $('#correct_question').val(), $('#incorrect_question1').val(), $('#incorrect_question2').val(), $('#incorrect_question3').val() ];
				var new_question_set_copy = my_question_set.slice();
				var shuffled_question_set = shuffleAnswers(new_question_set_copy);
				
				var question_exist = false;
				// check if question exists in the question set list and the question set was previously deleted then consider it is not existent
				if (checkIfElementExists(my_question_sets_array, my_question_set) !== undefined && my_deleted_elements !== undefined && checkIfElementExists(my_deleted_elements, my_question_set) === undefined ) {
					question_exist = true;
				}
				
				if ( question_exist ) {
					alert('Attention: questions can not be repeated!');
					return;
				} else {
					$('#my_edit_overlay').hide();
					question_index = my_question_sets_array.push(my_question_set);
					new_question_list.push(my_question_set);
					question_index = question_index - 1;
					printQuestionSet(my_question_set, question_index);
					$('.edit_question').show();
				}
			}
		});
	 
		$('#evaluate_test').click(function(e){
			e.preventDefault();
			
			var evaluate_counter = 0;
			$('#display_questions_sets .question_set').each(function() {
				var option_name = $(this).find('.answer').attr('name');
				var my_deleted_elements = option_name.substring(6);
				var correct_answer = my_question_sets_array[my_deleted_elements][1];
				var selected_option = $(':radio[name="answer' + my_deleted_elements + '"]:checked').val();
				if (selected_option == correct_answer) {
					evaluate_counter++;
				}
			});

			$('#score_section').empty();
			$('#score_section').show();

			var total = my_question_sets_array.length - my_deleted_elements.length;
				$('#score_section').append("<h3>" + "Score: " + evaluate_counter + " out of " + total + "</h3>");
		});
		
		$('#reset_test').click(function(e){
			e.preventDefault();
			$(this).parent().find(':radio').attr('checked',false);
		 });
		
		$('#save_test').click(function(e){
			e.preventDefault();
			var my_errors = false;
			
			if (my_question_sets_array.length - my_deleted_elements.length == 0) {
				alert('Each test must have at least one question.');
				my_errors = true;
			}
			
				var deleted_questions_list 	= JSON.stringify(my_deleted_elements);
				var updated_questions_list 	= JSON.stringify(update_question_list);
				var original_questions_list = JSON.stringify(original_question_list);
				var new_questions_list 		= JSON.stringify(new_question_list);
				var selected_test_name 		= $('#test_name').val();
				var request_data = {
					test_name : selected_test_name, 
					deleted_questions 	: deleted_questions_list,
					updated_questions 	: updated_questions_list,
					original_questions	: original_questions_list,
					new_questions		: new_questions_list
				};
				
				$.post('../php/update_test.php', request_data , function(response_data){
					alert('The test saved successfully.');
					$(location).attr('href','http://localhost/raquel/index.html');
				})
				  .fail(function() {
					  alert('Error! The test could not be saved. Please try again.');
				}); 
		});
  });