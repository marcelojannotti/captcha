<?php
class Captcha {
  public function check($value) {
    if(!isset($_COOKIE['captcha_hash'])) {
      return false;
    } elseif (self::hash($value) == $_COOKIE['captcha_hash']) {
      return true;
    } else {
      return false;
    }
  }

  function hash($value) {
    $value = strtolower($value);
    $value64=str_split(base64_encode($value));
    $value =str_split($value);
    $hash = '';
    $tenMin =  round(time()/(60*10));
    foreach ($value64 as $x => $v) {
      $hash .= base_convert(((ord($v)+ord($value[$x%count($value)])+$tenMin)%32),10,32);
    }
    return $hash;
  }
}
?>
