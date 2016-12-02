<?php
	$files = array();
	$filesnames = scandir('./demo');
	foreach ($filesnames as $name) {
		if (!preg_match("/\.js$/",$name)){ 
 			continue; 
		}
		$files[] = $name;
	}
	echo implode(',', $files);
