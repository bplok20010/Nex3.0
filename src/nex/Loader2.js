/*
*注：自定义加载扩展时 使用toUrl需要明确指出
* expamles:
*	var url = require.toUrl(name+'.js');
*	require([url],function(d){
*		onload(d)	
*	});
*/
/*扩展require*/
(function(){
	var req = require;
	/*模块加载状态*/
	var STATUES = {
		FETCHING  : 1,
		LOADED    : 2,
		LOADERROR : 3	
	};	
	var fetchingList = {};
	
	function getCurrentScript(h) {
		var stack,
			DOC = document,
			undef,
			h = h === undef ? true : false,
			head = DOC.getElementsByTagName("head")[0]
			;
		try {
		  a._b.c(); //强制报错,以便捕获e.stack
		} catch (e) { //safari的错误对象只有line,sourceId,sourceURL
		  if( e.sourceURL ) {
			return e.sourceURL; //safari
		  }
		  stack = e.stack;
		  if (!stack && window.opera) {//opera
			  //opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
			  stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
		  }
		}
		if (stack) {//chrome
		  stack = stack.split(/[@ ]/g).pop(); //取得最后一行,最后一个空格或@之后的部分
		  stack = stack[0] === "(" ? stack.slice(1, -1) : stack.replace(/\s/, ""); //去掉换行符
		  return stack.replace(/(:\d+)?:\d+$/i, ""); //去掉行号与或许存在的出错字符起始位置
		}
		//IE
		var context = h ? head : DOC;
		var nodes = context.getElementsByTagName("script");
		for (var i = nodes.length, node; node = nodes[--i]; ) {
		  if ( node.readyState === "interactive") {
			  return node.src;//node.className = 
		  }
		}
	}
	var baseUrl = getCurrentScript( false );
	baseUrl = baseUrl.split('/');
	baseUrl.pop();
	baseUrl = baseUrl.join('/');
	/*设置require配置参数*/
	req.config({
		paths : {
			Nex : baseUrl	
		},
		packages : [
			{
				 name	 : 'Nex',
                 location: baseUrl,
                 main	 : 'Nex'	
			}
		]	
	});
	
	function getCount(){
		var i = 0;
		for( var k in fetchingList ) {
			i++	
		}	
		return i;	
	}
	function getFetchedCount(){
		var i = 0;
		for( var k in fetchingList ) {
			if( fetchingList[k] == STATUES.LOADED ) {
				i++	
			}
		}	
		return i;	
	}
	function getFetchProgress(){
		return getFetchedCount()*100/getCount();
	}
	function checkComplete(){
		var i = 0;
		for( var k in fetchingList ) {
			if( fetchingList[k] > STATUES.FETCHING ) {
				i++	
			}
		}
		if( getCount() == i ) {
			req.emit('complete', fetchingList);	
		}		
	}
	req.on('loaderror', function( name ){
		fetchingList[name] = STATUES.LOADERROR;	
		req.emit('progress', getFetchProgress());	
		checkComplete();
	});
	req.on('fetch', function( id ){
		fetchingList[name] = STATUES.FETCHING;	
	});
	req.on('load', function( id ){
		fetchingList[name] = STATUES.LOADED;	
		req.emit('progress', getFetchProgress());	
		checkComplete();
	});
	req.on('nametourl', function( map ){
		if( /^Nex\./.test(map.name) ) {
			map.name = map.name.replace(/\./ig, '/');	
		} 
		/*if( map.name == 'Nex' ) {
			map.name = 'Nex/Nex'	
		}*/
	});
	/*加载CSS*/
	define('css', {
		load : function(name, req, onload){
			var url = require.toUrl(name+'.css');
			appendLink(url);
			setTimeout(function(){
				onload(true);	
			},10);
			function appendLink(url){
				var head = document.getElementsByTagName('head')[0] ||  document.documentElement;	
				var node = document.createElement("link");
				node.charset = 'utf-8';
				node.rel = "stylesheet";
				node.href = url;
				head.appendChild(node);	
			}
		}	
	});
})();