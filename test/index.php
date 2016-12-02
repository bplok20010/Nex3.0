<?php
/*
*数据提取 创建提取任务测试
*/
require_once('DataExtract.class.php');

try {

	$DE = new DataExtract(array(
		'user' => '用户名',
		'pwd'  => '密码',
		'cookiePath' => './',
		'timeOut' => 0
	));
	//登录到提取平台
	$DE->login();
	
	$data = $DE->post('/user/task/createTask', array(
		"appId" => 22,//APP ID
		"templateId" => 153,// Template ID
		"stat_date" => '20150916', //模版查询条件
		"seqId" => 'test', //应用程序任务ID
		"url" => "http://192.168.118.87/ajax.uchome/Nex3.0/test/download.php" //回调
	));
	var_dump( $data );

}catch(Exception $e) {
	 echo 'Message: ' .$e->getMessage();	
	  exit;
}


?>