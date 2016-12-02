<?php
	$post = $_POST;
	file_put_contents('./demo/'.$post['name'].'.js', $post['code']);	
