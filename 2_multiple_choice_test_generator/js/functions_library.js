function shuffleAnswers(question_set_array_copy){
  		var original_answers = question_set_array_copy;
		var question = original_answers.shift();
  		var shuffled_answers = [];
		
  		var random_index = Math.round(Math.random() * 3);
    	shuffled_answers.push(original_answers[random_index]);
		var erased_answers = original_answers.splice(random_index, 1);
		
		random_index = Math.round(Math.random() * 2);
    	shuffled_answers.push(original_answers[random_index]);
		erased_answers = original_answers.splice(random_index, 1);
		
		random_index = Math.round(Math.random() * 1);
    	shuffled_answers.push(original_answers[random_index]);
		erased_answers = original_answers.splice(random_index, 1);
		
		shuffled_answers.push(original_answers[0]);
		original_answers.pop();
		shuffled_answers.unshift(question);
		
		return shuffled_answers; 
}

function printQuestionSet(my_shuffled_question_set, radio_button_index){
	var question_set = '<div class = "question_set">';

	question_set += '<h3 class = "question">'
			+ my_shuffled_question_set[0] + '</h3>';

	question_set += '<input type="radio" name="answer' + radio_button_index + '" value="'
			+ my_shuffled_question_set[1] + '" class="answer">' + my_shuffled_question_set[1]
			+ '<br>';

	question_set += '<input type="radio" name="answer' + radio_button_index + '" value="'
			+ my_shuffled_question_set[2] + '" class="answer">' + my_shuffled_question_set[2]
			+ '<br>';

	question_set += '<input type="radio" name="answer' + radio_button_index + '" value="'
			+ my_shuffled_question_set[3] + '" class="answer">' + my_shuffled_question_set[3]
			+ '<br>';

	question_set += ' <input type="radio" name="answer' + radio_button_index + '" value="'
			+ my_shuffled_question_set[4] + '" class="answer">' + my_shuffled_question_set[4]
			+ '<br><br>';

	question_set += '<input type="submit" name="delete_question" id="delete_question" value= "Delete Question">';
	question_set += '<input type="submit" name="edit_question" class="edit_question" value= "Edit Question">';
	question_set += '</div>';
	
	$('#display_questions_sets').append(question_set);

}

function checkIfElementExists(main_array, question_set) {
	for (i = 0; i < main_array.length; i++) {
		if (question_set[0] == main_array[i][0]) {
			return i;
		}
	}
}