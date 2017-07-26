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
$possibilities = htmlspecialchars($_POST["possibilities"]);
$course = htmlspecialchars($_POST["course"]);
$goal = htmlspecialchars($_POST["goal"]);
$progress = htmlspecialchars($_POST["progress"]);
?>
<script type="text/javascript">
var fname = "<?php echo $fn ?>";
var clearPossibilities = "<?php echo $possibilities ?>"=="0";
var clearCourse = "<?php echo $course ?>"=="0";
var clearProgress = "<?php echo $progress ?>"=="0";
var clearGoalreaching = "<?php echo $goal ?>"=="0";
</script>
<script src="js/buttonworld.js"></script>
</body>
</html>
