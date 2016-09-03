<?php
include "captcha.php";
$captcha = (isset($_POST['captcha'])?$_POST['captcha']:$_GET['captcha']);
$msg = (!Captcha::check($captcha)?"Verification code is wrong.":false);
?>

<!DOCTYPE html>
<html>
<body>
<?php
if ($msg) {
echo $msg;
} else {
echo "Thank you ".$name.". You typed all right.";
}?>
</body>
</html>
