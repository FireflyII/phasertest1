<?php
	$data = $_POST['jsonString'];
	$f = $_POST['fname'];
	$myfile = fopen($f, "a") or die("Unable to open file!");
	fwrite($myfile, "\n".$data);
	fclose($myfile);
?>
