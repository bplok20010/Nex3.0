(function(){
	Nex.apply(Nex, {
		GET_CMPS_CLEAR : false,
		RESIZE_DELAY   : 100,
		MAX_REMOVE_NUM : 5	
	});
	Nex.define('Nex.ComponentManager',{
		singleton : true,//单例模式
		//alias : 'Nex.ComponentManager',
		extend : 'Nex.EventObject',
		//构造函数
		constructor : function(){
			this.callParent( arguments );	
			this.compRoot = 'root';
			this.components = {};
			this._levelCmps = {};
			this._autoResizeLevelCmps = {};
			this.fireEvent('onCreate',[this.configs]);
		},
		sysEvents : function(){
			this.callParent( arguments );	
			var self = this;
			$(function(){
				var winSize = {
					width : $(window).width(),	
					height : $(window).height()
				};	
				var wt = 0;	
				$(window).unbind("resize.ComponentManager");
				$(window).bind("resize.ComponentManager",function(){
					if( wt ) {
						clearTimeout( wt );	
						wt = 0;
					}
					wt = setTimeout(function(){
						clearTimeout( wt );	
						wt = 0;
						var win_w = $(window).width();
						var win_h = $(window).height();
						if( winSize.width === win_w && winSize.height === win_h ) {
							return;	
						}
						winSize.width = win_w;
						winSize.height = win_h;
						
						self.fireEvent("onResize");	
						self.fireEvent("onBrowserResize");	
					},Nex.RESIZE_DELAY);			
				});
								 
			});
			self.bind( 'onResize._sys',self._resize,self );
			return self;
		},
		//清理comps 删除无用的cmp
		_refreshCmps : function( m ){
			var self = this,undef;	
			var cmps = self.components;
			var i = 0;
			for( var id in cmps ) {
				if(!self.isExists( id )) {
					i++;	
				}
			}
			if( m || (i && i>=Nex.MAX_REMOVE_NUM) ) {
				self.cmpChange();	
			}
			return i;
		},
		/*
		*获取组件 获取所有组件时 每次都会调用_refreshCmps清空无效的组件
		*/
		getCmp : function(id){
			var self = this,undef;
			if( id === undef ) {
				if( Nex.GET_CMPS_CLEAR ) {
					self._refreshCmps();
				}
				return self.components;
			}
			self.isExists( id );	
			return Nex.unDefined(self.components[id],null);	
		},
		//获取当前分组名的所有组件
		getGroup : function(name){
			var self = this,undef;
			if( name === undef ) {
				return [];
			}
			var c = [];
			var comps = self.getCmp();
			if( name === '*' ) {
				$.each( comps,function(i,d){
					c.push(d);					   
				} );
				return c;	
			}
			
			name = $.trim(name+'').split(/\s+/g);
			
			if( !name ) return c;
			
			for( var id in comps ) {
				var obj = comps[id];
				if( obj ) {
					var gname = $.trim(obj.C('groupName')+'').split(/\s+/g);
					var str_gname = String(gname);
					for( var i=0,len=name.length;i<len;i++ ) {
						var n = name[i];
						if( gname.length && str_gname.indexOf(n)!== -1 ) {// name === gname
							c.push( obj );
							break;
						}	
					}
				}
			}
			return c;
		},
		register : function( id, cmp ){
			if( Nex.isInstance( id ) ) {
				cmp = id;
				id = cmp.configs.id;	
			}
			this.components[id] = cmp;
			this.cmpChange();	
		},
		addCmp : function(id,cmp){
			this.register.apply( this, arguments );
		},
		/*
		*组件有变动 如 增 删 位置变动时应该调用 特别是 "增"其次是"位置变动"再次是"删" 
		*/
		cmpChange : function(){
			this.__disposed1 = false;	
		},
		//删除组件
		removeCmp : function(id){
			//this._cmps[id] = null;
			var cmp = this.components[id];
			if( cmp ) {
				if( cmp.isInstance ) {
					cmp.onDestroy();
					cmp.fireEvent('onDestroy');	
				}
				this.components[id] = null;
				delete this.components[id];
			}
		},
		//判断id是否存在 如果不存在则删除
		isExists : function(id){
			var self = this;
			var cmp = self.components[id];
			
			if( cmp && (cmp.getDom()).length ) {
				return true;	
			}
	
			//autoDestroy 如果清除dom后组件就不再用，autoDestroy设置为true autoResize 应该也是为true的
			//这里可能存有bug 例如window按关闭后会销毁dom但是window组件还是存在的  --components
			//self._cmps[id] = null;//不再设置为null，而是获取dom是否存在
			if( cmp && cmp.C('autoDestroy') ) {
				self.removeCmp(id);	
			}
			//如果组件找不到dom 那么就从resize列表移除
			//delete self._cmps[id];	
			return false;
		},
		_getDomCmps : function( el ){//待更新
			var el = $(el);
			if( !el.length ) return false;
			var self = this	
				,undef
				,rlist = []
				,cmp = el.closest('.nex-component-item')
				,pid;
				
			pid = cmp.length ? cmp.attr('id') : self.compRoot;
			
			var cmps = self.components;
			var levelCmps = self.getLevelCmps();
			var list = levelCmps[pid] || [];
			
			for( var i=0,len=list.length;i<len;i++ ) {
				var d = list[i];
				var cmp = cmps[d.id];
				if( !cmp ) continue;
				rlist.push( cmp )	;
			}
			return rlist;	
		},
		//更新指定dom下的组件大小
		resizeDom : function(el){////待更新
			var rlist = this._getDomCmps( el );
			if( rlist === false ) return this;
			for( var i=0;i<rlist.length;i++ ) {
				var cmp = rlist[i];
				if( cmp && cmp.isAcceptResize() ) {
					cmp.resize();	
				}
			}
			return this;
		},
		//更新所有组件大小 如果指定cid 只更新指定组件下的所有组件的大小
		resize : function( cid ){
			this._resize( cid );	
			return this;
		},
		//更新组件的层级关系
		refreshComponents : function(){
			this.refreshLevelCmps();
		},
		//获取当前ID组件下的子组件 
		getChildrens : function( id ){//待更新
			var self = this,undef;
			var rlist = [];
			var cmps = self.components;
			var levelCmps = self.getLevelCmps();
			
			var pid = id || this.compRoot;
			
			var list = levelCmps[pid] || [];
			
			for( var i=0,len=list.length;i<len;i++ ) {
				var d = list[i];
				var cmp = cmps[d.id];
				if( !cmp ) continue;
				rlist.push( cmp );
			}
			return rlist;
		},
		//获取当前ID组件下的所有子组件 
		getAllChildrens : function( id ){//待更新
			var self = this,undef;
			var list = [];
			var _list = self.getChildrens( id );
			list = list.concat( _list );
			for( var i=0,len=_list.length;i<len;i++ ) {
				var cmp = _list[i];
				if( !cmp ) continue;
				var id = cmp.C( 'id' );
				list = list.concat(self.getAllChildrens( id ));	
			}
			return list;
		},
		//获取当domID下的子组件
		getChildrensByDom : function( el ){
			var self = this,undef;
			return self._getDomCmps( el ) || [];
		},
		//获取当前domID组件下的所有子组件 
		getAllChildrensByDom : function( el ){
			var self = this,undef;
			//self.refreshComponents();
			var list = [];
			var _list = self._getDomCmps( el ) || [];
			list = list.concat( _list );
			for( var i=0,len=_list.length;i<len;i++ ) {
				var cmp = _list[i];
				if( !cmp ) continue;
				var id = cmp.C( 'id' );
				list = list.concat(self.getAllChildrens( id ));	
			}
			return list;
		},
		/*
		*刷新组件之间的层级关系 
		*/
		refreshLevelCmps : function(){
			this.__disposed1 = false;
			return this.getLevelCmps();	
		},
		/*
		*遍历组件之间的层级关系 
		*/
		__disposed1 : false,
		getLevelCmps : function(){
			var self = this,undef;
	
			if( self.__disposed1 ) {
				return self._levelCmps;	
			}
			
			self._refreshCmps();
			
			var cmps = self.components;
			var list = cmps;
			
			self._levelCmps = {};
			
			var lcs = self._levelCmps;
	
			for( var id in list ) {
				var cmp = list[id];
				if( cmp ) {
					
					var pid = self.compRoot;
					
					var parent = $("#"+id).parents(".nex-component-item:first");
					if( parent.length ) {
						var _id = parent.attr('id');
						var  _p = cmps[_id];
						if( _p ) {
							pid = _id;
						}
					}
					var data = {
						id : id,
						pid : pid
					};
					
					lcs[pid] = lcs[pid] === undef ? [] : lcs[pid];
					lcs[pid].push( data );
				}	
			}
			
			self.__disposed1 = true;
	
			return self._levelCmps;
		},
		/*
		*更新当前id下 autoResize=true的子组件大小
		*/
		_resize : function( cid ){
			var self = this,undef;
			var cmps = self.components;
			var cid = cid === undef ? self.compRoot : cid;
			
			var list = self.getChildrens(cid);
			
			if( !$.isArray( list ) ) return;
			
			for( var i=0;i<list.length;i++ ) {
				var cmp = list[i];
				if( cmp ) {
					if( cmp.isAcceptResize() ) {
						cmp.resize();
					} else {
						//不应该开启
						//self._resize( cmp.configs.id );	
					}
				}
			}
		},
		/*
		给组件发送消息 一般当作自定义消息来使用
		@ *ids 发送的组件ID 可以是数组 或者是 组件对象，如果为"*"则发送给所有组件
		@ *evt 发送的消息事件
		@ params 发送的参数 可以是数组
		@ sender 发送者 这个参数可以通过 arguments[ arguments.length-1 ] 获得
		*/
		sendMessage : function( ids,evt,params,sender ){
			var self = this,undef;
			var cmps = self.getCmp();
			var params = Nex.unDefined( params,[] );
			params = $.isArray( params ) ? params : [ params ];
			if( sender ) {
				params.push( sender );		
			}
			if( ids === undef ) return false;
			
			if( ids === '*' ) {
				for( var obj in cmps ) {
					var cmp = cmps[obj];
					if( !cmp.isSleep() ) {
						cmp.fireEvent(evt,params);
					}
				}	
			}
			
			ids = $.isArray( ids ) ? ids : [ ids ];
			
			for( var i=0,len=ids.length;i<len;i++ ) {
				var cmpid = ids[i];
				if( Nex.isInstance( cmpid ) ) {
					if( !cmpid.isSleep() ) {
						cmpid.fireEvent(evt,params);
					}
				} else {
					cmp = cmps[cmpid];
					if( cmp ) {
						if( !cmp.isSleep() ) {
							cmp.fireEvent(evt,params);	
						}
					}
				}
			}
			return true;
		},
		/*作用同sendMessage 只是会立即返回*/
	
		postMessage : function(ids,evt,params,sender){
			var self = this,undef;
			setTimeout(function(){
				self.sendMessage( ids,evt,params,sender );					
			},0);
			return true;
		},
		/*
		给组件发送消息 一般当作自定义消息来使用
		@ *name 组件的groupName
		@ *evt 发送的消息事件
		@ params 发送的参数 可以是数组
		@ sender 发送者 这个参数可以通过 arguments[ arguments.length-1 ] 获得
		*/
		sendMessageByGroupName : function(name,evt,params,sender){
			var self = this,undef;
			
			if( name === undef ) return false;
			
			var cmps = self.getGroup( name );
			
			var params = Nex.unDefined( params,[] );
			params = $.isArray( params ) ? params : [ params ];
			if( sender ) {
				params.push( sender );		
			}
			
			for( var i=0,len=cmps.length;i<len;i++ ) {
				var cmp = cmps[i];
				if( !cmp.isSleep() ) {
					cmp.fireEvent(evt,params);
				}
			}	
				
			return true;	
		},
		sendMessageToGroup : function(){
			return this.sendMessageByGroupName.apply( this,arguments );	
		},
		/*作用同sendMessageByGroupName 只是会立即返回*/
		postMessageByGroupName : function(name,evt,params,sender){
			var self = this,undef;
			setTimeout(function(){
				self.sendMessageByGroupName( name,evt,params,sender );					
			},0);
			return true;	
		},
		postMessageToGroup : function(){
			return this.postMessageByGroupName.apply( this,arguments );	
		}
	});	
	//Nex.ComponentManager = new Nex.ComponentManager();
	$.each( ['gc','removeComponent'
			,'removeServer','get','getCmp','getGroup','getChildrens','getAllChildrens'
			,'getChildrensByDom','getAllChildrensByDom','refreshComponents','resize'
			,'sendMessage','postMessage','sendMessageByGroupName','sendMessageToGroup'
			,'postMessageByGroupName','postMessageToGroup'],function(i,method){
		var m = Nex.ComponentManager;
		var alias = {
			gc 				: '_refreshCmps',
			removeComponent	: 'removeCmp',
			removeServer	: 'removeCmp',
			get				: 'getCmp',
			resize			: '_resize'	
		};
		var returnself = {
			gc 							: true,
			removeComponent 			: true,
			removeServer				: true,
			resize 						: true,
			sendMessage 				: true,
			postMessage 				: true,
			sendMessageByGroupName 		: true,
			sendMessageToGroup 			: true,
			postMessageByGroupName 		: true,
			postMessageToGroup 			: true
		};
		Nex[ method ] = function(){
			var tmp = m[ alias[method] || method ].apply( m,arguments );
			return returnself[method] ? this : tmp;
		};
	} );
	jQuery.fn.extend({
		resizeCmp : function() {
			return this.each(function(){
				Nex.ComponentManager.resizeDom( this );	
			});
		},
		sendMessage : function( eventType,params,sender ){
			var arg = [].slice.apply(arguments);
			
			if( !arg.length ) return this;
			
			var everyone = true;
			if( $.type(arg[ arg.length-1 ]) === 'boolean' ) {
				everyone = arg[ arg.length-1 ];
				arg.pop();
			}
			return this.each(function(){
				
				var cmps = everyone ? Nex.ComponentManager.getAllChildrensByDom( this ) : Nex.ComponentManager.getChildrensByDom( this );
				
				Nex.ComponentManager.sendMessage.apply( Nex.ComponentManager,[ cmps ].concat( arg ) );
			});	
		},
		postMessage : function( eventType,params,sender ){
			var arg = [].slice.apply(arguments);
			
			if( !arg.length ) return this;
			
			var everyone = true;
			if( $.type(arg[ arg.length-1 ]) === 'boolean' ) {
				everyone = arg[ arg.length-1 ];
				arg.pop();
			}
			return this.each(function(){
				
				var cmps = everyone ? Nex.ComponentManager.getAllChildrensByDom( this ) : Nex.ComponentManager.getChildrensByDom( this );
				
				Nex.ComponentManager.postMessage.apply( Nex.ComponentManager,[ cmps ].concat( arg ) );
			});		
		}
	});
})();