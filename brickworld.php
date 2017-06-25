<!DOCTYPE html>
<html>
<head>
<meta charset = "utf-8" />
<title>Brickworld</title>
<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="js/phaser.js"></script>
<style>
body {
	padding: 0px;
	margin: 0px;
}
</style>
</head>
<body>
<?php
echo 'Name: ' . htmlspecialchars($_POST["name"]) . '!<br>';
$fn = htmlspecialchars($_POST["fname"]);
?>
<script type="text/javascript">
var fname = "<?php echo $fn ?>";
</script>
<script src="js/brickworld2.js"></script>
</body>
</html>
