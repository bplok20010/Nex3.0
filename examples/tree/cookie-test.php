<?php
class LoginSniper {
	private $username;
	private $password;
	public $sniperHost = 'http://127.0.0.1/ajax.uchome/Nex3.0/examples/tree/cookie-test2.php';
	public $cookie = "";
	function __construct( $username="", $password="" ){
		$this->username	= $username;
		$this->password	= $password;	
		$this->startLogin();
	}
	protected function startLogin(){
		$content = array(
			'http' => array(
				'method' => 'POST',
				'header' => '
					Cookie : '.$this->cookie.'\r\n
					Content-Type: application/x-www-form-urlencoded; charset=UTF-8
				',
				'content' => http_build_query(array(
					'username' => $this->username,
					'password' => $this->password,
				), '', '&')
			)
		);
		$this->cookie = file_get_contents($this->sniperHost, false, stream_context_create($content));
	}
}
$login = new LoginSniper();
echo $login->cookie;
?>