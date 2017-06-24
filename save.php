<?php
$data = $_POST['jsonString'];
$f = $_POST['fname'];
//set mode of file to writable.
//chmod("website-contents.json",0777);
$a = fopen($f, 'w');
chmod($f,0777);
//$f = fopen("website-contents.json", "w") or die("fopen failed");
//$f = "website-contents.json";
$current = file_get_contents($f);
$current .= $data;
//fwrite($f, $current);
//fclose($f);
file_put_contents($f, $current);
?>