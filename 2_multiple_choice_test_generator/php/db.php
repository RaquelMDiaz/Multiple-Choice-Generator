<?php
	$db_server = '127.0.0.1';
	$db_user = 'rd';
	$db_password = '';
	$db_name = 'test_generator';
	
	define("DB_HOST", "127.0.0.1");
	define("DB_USER", "rd");
	define("DB_PASSWORD", "");
	define("DB_DATABASE", "test_generator");

	$my_db_object = new mysqli($db_server, $db_user, $db_password, $db_name);
	  
	if ($my_db_object->connect_error) {
		die('Connection failed (' . $my_db_object->connect_errno . ') ' . $my_db_object->connect_error);
	}
?>