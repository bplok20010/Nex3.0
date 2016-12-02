/*
Nex.location
eg
index.html#/Home/Login
*/
(function( factory ) {
	if ( typeof $define === "function" ) {
		
		$define([], function(){
			
			factory( jQuery );	
		} );
	} else {

		factory( jQuery );
	}
}(function( $ ) {
	//"use strict";
	var route = Nex.define('Nex.route.Route',{
		extend : 'Nex.AbstractComponent',
		xtype : 'route',
		alias : 'Nex.Route',
		configs : function(){
			return {
				prefix : 'nexroute-',
				ajax : null,
				data : {},
				_qdata : {},
				autoDestroy : false,
				removeHTag : true,//删除 #
				removeHTagData : '#', 
				location : window.location,
				doc : document,
				timeout_id : null,
				hash : '',
				_iframe : null,
				_delay : 50,
				_currentHash : '',
				caseInsensitiveMatch : false,
				supportHashChange : (function(win){
					var  documentMode = document.documentMode;
					return ('onhashchange' in window) && ( documentMode === void 0 || documentMode > 7 );	
				})(window),
				events : {
					onStart : $.noop,
					onCreate : $.noop,
					onGetHash : $.noop,
					onInitHashChange : $.noop,
					onVisitPage : $.noop,
					onHashChange : $.noop
				}
			};		
		}	
	});
	route.override({
		routes : [],
		//历史记录
		history : [],
		currentUrl : '/',
		currentUrlInfo : {},
		currentUrlData : {},
		currentParams : {},
		initComponent : function(opt) {
			var self = this;
			self.callParent(arguments);
			
			self.routes = [];
			self.history = [];
			self.currentUrlInfo = {};
			self.currentUrlData = {};
			self.currentParams = {};
			
			self.initRoute();
		},
		sysEvents : function(){
			var self = this;
			var opt = self.configs;
			self.callParent(arguments);
			self.bind('onGetHash._sys',function(opt){
				if( opt.removeHTag ) {
					opt.hash = opt.hash.replace( opt.removeHTagData ,'');	
				}
			});	
			self.bind('onInitHashChange._sys', self.checkRoute );
			self.bind('onHashChange._sys', self.checkRoute );	
			return self;
		},
		_getHash : function( url ) {
			var self = this;
			var opt = self.C();
            url = url || opt.location.href;
			return '#' + decodeURIComponent(url).replace( /^[^#]*#?(.*)$/, '$1' );
        },
		getHash : function( url ){
			var self = this;	
			var opt = self.C();
			opt.hash = self._getHash( url );
			self.fireEvent('onGetHash',[ opt ]);	
			return opt.hash;
		},
		/*
		*@description url分解
		*@param {string} url 需要分解的url地址
		*@return {object} 返回分解后的url
	    *
	    *   | member name   | Description    |
	    *   |---------------|----------------|
	    *   | href          | A normalized version of the provided URL if it was not an absolute URL |
	    *   | protocol      | The protocol including the trailing colon                              |
	    *   | host          | The host and port (if the port is non-default) of the normalizedUrl    |
	    *   | search        | The search params, minus the question mark                             |
	    *   | hash          | The hash string, minus the hash symbol
	    *   | hostname      | The hostname
	    *   | port          | The port, without ":"
	    *   | pathname      | The pathname, beginning with "/"
		*/
		urlResolve : function( url ){
			var self = this,
				opt = this.configs,
				href = url+'',
				reg = /^http/,
				urlNode = document.createElement("a");
			if( !href ) {
				href = opt.location.href;	
			}	
			if ( Nex.isIE ) {
				// Normalize before parse.  Refer Implementation Notes on why this is
				// done in two steps on IE.
				if( Nex.IEVer<8 && !reg.test( href ) ) {
					if( href.charAt(0) !== '/' ) {
						href = opt.location.protocol.replace(/:$/, '')+'://'+location.hostname+'/'+href;
					} else {
						href = opt.location.protocol.replace(/:$/, '')+'://'+location.hostname+href;	
					}
				}
				urlNode.setAttribute("href", href);
				href = urlNode.href;
			}	
			urlNode.setAttribute('href', href);
			return {
				href: urlNode.href,
				protocol: urlNode.protocol ? urlNode.protocol.replace(/:$/, '') : '',
				host: urlNode.host,
				search: urlNode.search ? urlNode.search.replace(/^\?/, '') : '',
				hash: urlNode.hash ? urlNode.hash.replace(/^#/, '') : '',
				hostname: urlNode.hostname,
				port: urlNode.port,
				pathname: urlNode.pathname && urlNode.pathname.charAt(0) === '/' ? urlNode.pathname : '/' + urlNode.pathname
			};
		},
		_initHashChange : function(){
			var self = this;
			var opt = self.C();	
			var iframe, timeoutID;
			
			opt.last_hash = self._getHash();
			
			iframe = $('<iframe tabindex="-1" title="empty"/>').hide()
			
				.one( 'load', function(){
					 self.history_set( self._getHash() );
					//计时器监控hanschange
					self._poll();
				})
				// Load Iframe src if specified, otherwise nothing.
				.attr( 'src', 'javascript:0' )
				// Append Iframe after the end of the body to prevent unnecessary
				// initial page scrolling (yes, this works).
				.insertAfter( 'body' );
			
			opt._iframe = iframe;
			opt._iframe_win = iframe[0].contentWindow;
			
		},
		history_get : function() {
			var self = this;
			var opt = self.C();	
			return self._getHash( opt._iframe_win.location.href );
		},
		history_set : function( hash, history_hash ) {
			var self = this;
			var opt = self.C();	
			var iframe = opt._iframe_win;
			var iframe_doc = iframe.document;
			var doc = opt.doc;
			if ( hash !== history_hash ) {
			  // Update Iframe with any initial `document.title` that might be set.
			  iframe_doc.title = doc.title;
			  
			  // Opening the Iframe's document after it has been closed is what
			  // actually adds a history entry.
			  iframe_doc.open();
			  
			  // Set document.domain for the Iframe document as well, if necessary.
			  //domain && iframe_doc.write( '<script>document.domain="' + domain + '"</script>' );//''
			  
			  iframe_doc.close();
			  
			  // Update the Iframe's hash, for great justice.
			  iframe.location.hash = hash;
			}
		  },
		_poll : function() {
			var self = this;
			var opt = self.C();	
			  var hash = self._getHash(),
			  	last_hash = opt.last_hash,
				history_hash = self.history_get( last_hash );
			  if ( hash !== last_hash ) {
				self.history_set( opt.last_hash = hash, history_hash );
				self.fireEvent('onHashChange',[self.getHash(),opt]);
			  } else if ( history_hash !== last_hash ) {
				location.href = location.href.replace( /#.*/, '' ) + history_hash;
			  }
			  
			  opt.timeout_id = setTimeout( function(){
					self._poll();									
				}, opt._delay );
		},
		initRoute : function(){
			var self = this;
			var opt = self.C();	
			if( opt.supportHashChange ) {
				$(window).bind('hashchange.'+opt.id,function(){
					self.fireEvent('onHashChange',[ self.getHash(),opt ]);	
				});	
				setTimeout( function(){
					self.fireEvent('onInitHashChange',[ self.getHash(),opt ]);	
				},10 );
				//self.fireEvent('onCreate',[ opt ]);
			} else {
				$(document).ready(function(){
					self._initHashChange();		
					setTimeout( function(){
						self.fireEvent('onInitHashChange',[ self.getHash(),opt ]);	
					},10 );
					//self.fireEvent('onCreate',[ opt ]);						   
				});
			}
		},
		'reload' : function(){
			var self = this,
				opt = this.configs;
				self.checkRoute( self.currentUrl );
			return self;		
		}, 
		//@m true 默认产生历史记录 false 不产生历史记录
		redirectTo : function( path, m ){
			var m = this._undef( m,true );
			if( m ) {
				this.configs.location.hash = path;
			} else {
				this.checkRoute( path );
			}
			return this;	
		},
		path : function( path, m ){
			this.redirectTo.apply( this,arguments );
			return this;		
		},
		//所有hash都会加上 "/" 有时间再修改 不应该加上/
		checkRoute : function( hash,opt ){
			var self = this,
				opt = opt || this.configs,
				path = '';//'/'	
			/*if( hash.charAt(0) !== '/' ) {
				hash = '/'+hash;	
			}*/
			
			self.currentUrl = hash;
			self.history.push( hash );
			
			var _hash = {
				hash : hash
			};
			
			var e = self.fireEvent('onVisitPage',[ _hash ]);
			if( e === false ) {
				return;	
			}
			
			self.currentUrl = _hash.hash === hash ? self.currentUrl : _hash.hash;
			
			if( hash ) {
				var ourl = Nex.parseUrl( hash );//self.urlResolve(hash);
				path = ourl.pathname ? ourl.pathname : path;
			}
			
			self.currentUrlInfo = ourl;
			
			var params = {};
			if( hash && ourl && ourl.search ) {
				ourl.search = ourl.search.replace(/^\?/,'');
				var p = ourl.search.split('&');
				$.each( p,function(i,v){
					if( !v ) return;
					var param = v.split('=');
					params[ param[0] ] = param[1] ? param[1] : '';
				} );	
			}
			
			var r = self.parseRoute( path ) || {};
			
			self.currentUrlData = r;
			
			self.currentParams = $.extend(r.pathParams,params);
			
			if( r && $.isFunction(r.callback) ) {
				r.callback.call( self,self.currentParams );
			}
		},
		/*
		*examples:
			var p1 = '/Index/:action';
				pathRegExp(p1,{}).exec('/Index/index'); // action=index true
				pathRegExp(p1,{}).exec('/Index/index/'); // false
				pathRegExp(p1,{}).exec('/Index/index/a...'); // false
			var p1 = '/Index/:action*';
				pathRegExp(p1,{}).exec('/Index/index'); // action=index true
				pathRegExp(p1,{}).exec('/Index/index/'); // action=index/ true
				pathRegExp(p1,{}).exec('/Index/index/a...'); // action=index/a... true
			var p1 = '/Index/:action?';
				pathRegExp(p1,{}).exec('/Index/index'); // action=index true
				pathRegExp(p1,{}).exec('/Index/index/'); // action=null true
			var x = pathRegExp(p1,{}).exec('/Index/index/a...'); // false	
			var p = switchRouteMatcher( '/Index/get',x );
		*/
		pathRegExp : function(path, opts) {
		  opts = opts || {};	
		  var insensitive = opts.caseInsensitiveMatch,
			  ret = {
					originalPath: path,
					regexp: path
				  },
				  keys = ret.keys = [];
			
			  path = path
				.replace(/([().])/g, '\\$1')
				.replace(/(\/)?:(\w+)([\?|\*])?/g, function(_, slash, key, option){
				  var optional = option === '?' ? option : null;
				  var star = option === '*' ? option : null;
				  keys.push({ name: key, optional: !!optional });
				  slash = slash || '';
				  return ''
					+ (optional ? '' : slash)
					+ '(?:'
					+ (optional ? slash : '')
					+ (star && '(.+?)' || '([^/]+)')
					+ (optional || '')
					+ ')'
					+ (optional || '');
				})
				.replace(/([\/$\*])/g, '\\$1');
			
			  ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
			  return ret;
		},
		/*
		*实际路径根据route匹配出参数
		*/
		switchRouteMatcher : function(url, route) {
			  var keys = route.keys,
				  params = {};
		
			  if (!route.regexp) return null;
		
			  var m = route.regexp.exec(url);
			  if (!m) return null;
		
			  for (var i = 1, len = m.length; i < len; ++i) {
				var key = keys[i - 1];
		
				var val = 'string' == typeof m[i]
					  ? decodeURIComponent(m[i])
					  : m[i];
		
				if (key && val) {
				  params[key.name] = val;
				}
				//如果是自定义路由 则使用下标
				if( !key && val ) {
					params[i - 1] = val;	
				}
			  }
			  return params;
		},
		/*
		*匹配正确的url
		*/
		parseRoute : function(url) {
			var self = this,
				opt = this.configs,
				routes = this.routes;
			/*if( self._otherwise.slice(-1) ) {
				routes.push( self._otherwise.slice(-1) );	
			}	*/	
			  // Match a route
			  var params, match;
			  $.each(routes, function(i, route) {
					if (!match && route && (params = self.switchRouteMatcher(url, route))) {
					  match = $.extend({
						  		pathParams : params,
								params : params
						 	},route);
					}
			  });
			  // No route matched; fallback to "otherwise" route
			  if( !match ) {
				  	match = {
						pathParams : {},
						params : {}	
					};
					if( $.isFunction( self._otherwise ) ) {
						match.callback = self._otherwise;
					} else {
						match.callback = function(){
							self.redirectTo( self._otherwise+'', false );	
						};
					} 
			  }
			  return match;
		},
		removeRoute : function( path ){
			var self = this;
			var routes = self.routes;
			var rp = $.type( path ) === 'regexp' ? path.toString() : path + '';
			$.each( routes, function( i, route ){
				if( route.originalPath == rp ) {
					routes[ i ] = null;	
				}
			} );	
			return self;
		},
		/*
		* 注：相同的path不会会被覆盖，如果想删除已经定义的path 使用when(path,null)
		*/
		when : function( path,func ){
			var self = this,
				opt = this.configs;	
			//批量添加
			if( arguments.length === 1 ) {
				if( $.isPlainObject( path ) ) {
					$.each( path,function(k,v){
						self.when( k,v );	
					} );	
				}
				if( $.isFunction( path ) ) {
					var r = path.call( self );
					if( r ) {
						self.when( r );	
					}	
				}
				return self;
			}
			if( func === null ) {
				return self.removeRoute( path );	
			}
			//如果是字符串 表示当前地址会重定向到后面地址的解析这样的重定向不触发历史记录
			if( $.type( func ) === 'string' ) {
				var redirectTo = func;
				func = function(){
					self.redirectTo( redirectTo, false );	
				};
			}
			
			var routes = self.routes;
			
			if( $.type( path ) === 'regexp' ) {
				routes.push(
					{
						callback : func,
						originalPath : path.toString(),
						regexp : path,
						keys : []
					}
				);	
			} else {
				routes.push(
					$.extend( {
							callback : func
						},self.pathRegExp( path,{
							caseInsensitiveMatch : opt.caseInsensitiveMatch	
						} ) )
				);
			}
			/*if (path) {
				var redirectPath = path+'';
				if( redirectPath.charAt(0) !== '/' ) {
					redirectPath = '/'+redirectPath;	
				}
				self.routes[redirectPath] = $.extend( {
						callback : func
					},self.pathRegExp( redirectPath,{
					caseInsensitiveMatch : opt.caseInsensitiveMatch	
				} ) );
			}*/
			return self;
		},
		_otherwise : null,
		//会覆盖原有的
		otherwise : function( func ){
			this._otherwise = func;
			return this;
		},
		destroy : function(  ){
			var self = this,
				opt = this.configs;	
			if( opt.supportHashChange ) {	
				$(window).unbind('.'+opt.id);
			} else {
				clearTimeout( opt.timeout_id );	
			}
			//self.removeCmp();
			self.callParent(arguments);
			return this;
		}
		//start stop
	});
}));