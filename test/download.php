<?php
/*
*数据提取 回调下载测试
*/

require_once('DataExtract.class.php');

try{

	$DE = new DataExtract(array(
		'user' => '用户名',
		'pwd'  => '密码',
		'cookiePath' => './',
		'timeOut' => 0,
		'host' => 'http://192.168.118.89:8089/DataExtract'
	));
	//登录到提取平台
	$DE->login();
	
	$downLoadUrl = $_GET['downloadDataUrl'];
	
	if( $_GET['status'] != 0 ) {
		//提取失败
		exit;	
	}
	
	
	$content = $DE->download( $downLoadUrl );	
	file_put_contents('test.csv', $content);
	
} catch( Exception $e ) {
	 echo 'Message: ' .$e->getMessage();	
	  exit;
}
?>