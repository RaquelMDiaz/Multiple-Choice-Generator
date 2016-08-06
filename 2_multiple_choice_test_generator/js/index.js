$(document).ready(function() {
	/*The tests stored in the database, if any, are displayed in the selection box. The data provided from the server (retrieve_tests.php) is 
	retrieved and the JSON object literal is converted with the getJSON function.*/
	$.getJSON('./php/retrieve_tests.php', function(response_data) {
		/*Loop through items of the JSON object retrieved by the server so as to display them in the selection box that will contain all the tests
		available in the database.*/
		$.each(response_data, function(index, test_name) {
			$('#tests_box').prepend('<option value="' + test_name + '">' + test_name + '</option>');
		})
			/*On clicking the html tag 'option', the following buttons will be shown.*/
			$(document).on('click', 'option', function(){
				$('#delete_test_button').show()
				$('#edit_test_button').show()
			/*If there is an error and the data can not be retrieved, a pop-up message containing an error appears.*/
			.fail(function() {
					alert('Error! Please try again.');
			});
		})
	
	});
		/*On clicking the edit_test_button, the corresponding test will be retrieved from the database.*/
		$(document).on('click', '#edit_test_button', function(e){
			e.preventDefault();
			var test_name = $( "#tests_box option:selected" ).val();
			/*The attribute of the location object is set to the URL of the edit_test.html file. The name of the test is assigned to it.*/
			$(location).attr('href','http://localhost/raquel/html/edit_test.html?test_name=' + test_name);
		});
		
		/*On clicking the delete_test_button, the user will be prompted to confirm deletion.*/
		$(document).on('click', '#delete_test_button', function(e){
			e.preventDefault();
			if(!confirm('Do you really want to delete this test?')){
				return false;
			} else {
				/*If the user confirms deletion, the following code is executed.
				The name of the test displayed in the option html tag is stored as an object literal and stored in a variable.*/
				var request_data = {test_name : $( "#tests_box option:selected" ).val()};
				/*The data is retrieved from the server (delete_test.php) as a JSON object and converted via getJSON function. The php file in
				question will handle the deletion request.*/
				$.getJSON('./php/delete_test.php', request_data, function(response_data) {
				/*If deletion was successful, the user will be informed.*/
					alert('The test was successfully deleted.');
					location.reload();
				}).fail(function() {
					/*Otherwise, a pop-up error message will be shown.*/
					alert('Error! The test could not be deleted.');
				});
			}
		});
});