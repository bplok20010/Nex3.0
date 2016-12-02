(function(){
	Nex.define('Nex.EventObject',{
		xtype : 'eventobject',
		configs : {
			context : null,
			stopOnFalse : true,
			/*
			*事件名映射：
			*	expamles : 
			*	Event.eventMaps.onWindowClick = 'onClick';
			*	Event.fireEvent('onWindowClick'); //实际触发的是onClick
			*	Event.bind('onWindowClick',func); //实际绑定的是onClick
			*/
			eventMaps : {},
			/*
			*事件列表
			* examples:
			*	events.onClick = [ {}... ]
			*/
			events : {},
			listeners : {}		
		},
		initConfigs : function(cfg){
			var cfg = this.callParent(arguments);	
			cfg.self = this;
			this.initEvents(cfg);
			this.sysEvents();//系统事件
			this.bindConfigsEvnet();//自定义事件
			return cfg;
		},
		initEvents : function(opt){
			var self = this;
			var ev = opt.events ? opt.events : {};
			opt.events = {};
			var events = {};
			function bind(e){
				if( $.isPlainObject(e) && !$.isEmptyObject(e) ) {
					for(var i in e){
						var _evt = String(i),
							fn = e[i],
							context = null;	
						if( $.isPlainObject( fn ) && !$.isEmptyObject( fn ) ) {
							context = fn.scope || fn.context || null;
							fn = fn.func || fn.fn || fn.callBack || fn.callback;
						}
						if( $.isFunction( fn ) && fn !== $.noop ) {
							self.bind(_evt,fn,context);	
						}
					}
				}	
			}
			bind.call(self,ev);
			bind.call(self,opt.listeners || {});
			//opt.events = events;
		},
		/*
		*系统事件
		*/
		sysEvents : function(){
			var self = this;
			var opt = self.configs;
		},
		bindConfigsEvnet : function(){
			var self = this;
			var opt = self.configs;
			var e = opt.events ? opt.events : {};
			var reg = /^@?on[A-Z][\S|\.]*$/;///^@?on[A-Z][\w|\.]*$/
			for(var x in opt ) {
				if( reg.test(x) ) {
					var fn = opt[x],
						context = null;
					
					if( $.isPlainObject( fn ) && !$.isEmptyObject( fn ) ) {
						context = fn.context || fn.scope || null;	
						fn = fn.func || fn.fn || fn.callBack || fn.callback;
					}
					if( $.isFunction(fn) && fn !== $.noop ){
						self.bind(x,fn,context);	
					}
				}
			}
		},
		$eventIndex : 1,
		/*
		* 事件绑定
		*  @eventType {String} 事件名
		*  @func      {Function|{ scope,fn }} 事件回调
		*  @scope     {Object} this对象(可选)
		*  @return    {int} 事件ID or false
		*/
		bind : function(eventType, func, scope){
			if( typeof eventType == "undefined" ) {
				return false;	
			}
			if( eventType === '' || eventType === '@' ) {
				return false;	
			}
			var self = this;
			var opt = self.configs;
			var event = opt.events;
			//批量绑定支持
			if( $.type( eventType ) === 'object' ) {
				var ids = [];
				for( var ev in eventType ) {
					var context = scope;
					var fn = eventType[ev];
					if( $.isPlainObject( fn ) && !$.isEmptyObject( fn ) ) {
						context = fn.scope || fn.context || context;
						fn = fn.func || fn.fn || fn.callBack || fn.callback;
					}
					var _i = self.bind( ev,fn,context );	
					ids.push( _i );
				}
				return ids;
			} else {//字符串 
				var _ev = String(eventType).split(/\s+|,/);	
				if( _ev.length>1 ) {
					var len = _ev.length;
					var ids = [];
					for( var _e=0;_e<len;_e++ ) {
						if( !_ev[_e] ) continue;
						ids.push( self.bind( _ev[_e],func,scope ) );
					}
					return ids;
				}					
			}
			
			var _f1 = eventType.charAt(0);
			if( _f1 === '@' ) {
				scope = self;
				eventType = eventType.slice(1);	
			}	
			
			var _type = eventType.split(".");
			eventType = _type[0];
			_type = _type.slice(1);
			var ext = _type.join('.');//_type.length == 2 ? _type[1] : '';
			
			if( !eventType ) {
				return false;	
			}
			
			//事件名映射处理
			//eventMaps
			if( eventType in opt.eventMaps ) {
				eventType = opt.eventMaps[eventType];
			}
			
			event[eventType] = event[eventType] || [];
			
			if( $.isFunction( event[eventType] ) ) {
				event[eventType] = [];
			}
			
			if( !$.isFunction( func ) || func === $.noop ) {
				return false;	
			}
			
			var _e = {
					scope : !!scope ? scope : null,
					func : func,
					ext : ext,
					_index : self.$eventIndex++
				};
			
			var id = event[eventType].push(_e);
		
			return _e._index;
		},
		on : function(){
			return this.bind.apply(this,arguments);	
		},
		/*
		*同bind 区别在于只执行一次
		*/
		one : function(eventType, func, scope){
			if( typeof eventType == "undefined" ) {
				return false;	
			}
			var func = func || $.noop;
			var self = this;
			var scope = !!scope ? scope : self;
			
			var _ = function(){
					self.unbind(_.id);
					var r = func.apply(this, arguments);
					return r;
				},
				id = null;
				
			id = self.bind( eventType, _, scope );
			_.id = id;
			return id;
		},
		/*
		* 取消事件绑定
		*  @eventType {String} 事件名,
		*  @id        Number 事件ID
		*/
		unbind : function(eventType,id){
			var self = this;
			var undef;
			var opt = self.configs;
			//...unbind('onClick onClick2.yrd')
			var _ev = String(eventType).split(/\s+|,/);	
			if( _ev.length>1 ) {
				var len = _ev.length;
				for( var _e=0;_e<len;_e++ ) {
					if( !_ev[_e] ) continue;
					self.unbind( _ev[_e] );
				}
				return self;
			}					
			
			var event = opt.events;
			var id = id === undef ? false : id;
			
			//...unbind(3)
			if( typeof eventType === 'number' ) {
				for( var tp in event ) {
					self.unbind( tp,eventType );	

				}
				return self;		
			}
			
			var _type = String(eventType).split(".");
			eventType = _type[0];
			_type = _type.slice(1);
			var ext = _type.join('.');
			//...unbind('.test')
			if( eventType === '' && ext !== '' ) {
				for( var tp in event ) {
					self.unbind( [tp,ext].join('.') );	
				}
				return self;	
			}
			
			//事件名映射处理
			//eventMaps
			if( eventType in opt.eventMaps ) {
				eventType = opt.eventMaps[eventType];
			}
			
			if( !(eventType in event) ) {
				return self;	
			}
			
			if( $.isFunction( event[eventType] ) ) {
				event[eventType] = [];
				return self;
			}
			var ves = [];
			if(id === false) {
				if( ext === '' ) {
					event[eventType] = [];
				} else {
					for(var i=0;i<event[eventType].length;i++) {
						var _e = event[eventType][i];
						if( (typeof _e === 'object') && _e.ext === ext ) {
							///event[eventType][i] = null;	
							continue;
						}
						ves.push( _e );
					}
				}
			} else {
				for(var i=0;i<event[eventType].length;i++) {
					var _e = event[eventType][i];
					if( (typeof _e === 'object') && _e._index === id ) {
						continue;
					}
					ves.push( _e );
				}
			}
			event[eventType] = ves;
			return self;
		},
		off : function(){
			return this.unbind.apply(this,arguments);	
		},
		/*
		* 锁定事件
		*  @eventType {String} 事件名
		*/
		lockEvent : function(eventType){
			var self = this;	
			//事件锁
			var eventLocks = self._eventLocks || {};
			eventLocks[eventType] = true;
			self._eventLocks = eventLocks;
			return true;
		},
		/*
		* 取消锁定事件
		*  @eventType {String} 事件名
		*/
		unLockEvent : function(eventType){
			var self = this;	
			//事件锁
			var eventLocks = self._eventLocks || {};
			eventLocks[eventType] = false;
			self._eventLocks = eventLocks;
			return true;
		},
		_denyEvent : false,
		_eventLocks : null,
		_executeEventMaps : null,//正在的执行的事件
		/*
		* 事件触发
		*  @eventType {String} 事件名 如果事件名带@开头 说明当前事件是系统事件 不会因为睡眠而阻止
		*  @data      {Array} 事件参数(可选)
		*/
		fireEvent : function(eventType,data){
			var self = this;
			var undef;
			if( self._denyEvent ) {
				return;	
			}
			var opt = self.configs;
			
			var context = opt.context || self;
			
			var ct = String(eventType).charAt(0);
			var _sys = false;
			if( ct === '@' ) {
				_sys = true;
				eventType = String(eventType).slice(1);	
			}	
			
			if( !eventType ) {
				return;	
			}
			//事件名映射处理
			//eventMaps
			if( eventType in opt.eventMaps ) {
				eventType = opt.eventMaps[eventType];
			}
			
			var events = opt.events[eventType];
			var data = data === undef ? [] : data;
			
			//判断data 是否 arguments
			if( $.isArray( data ) ) {
				data = data;	
			} else if( $.type( data ) === 'object' ){
				if( 'callee' in data && 'length' in data ) {
					data = data	
				} else {
					data = [data];	
				}
			} else {
				data = [data];
			}
			//data = $.isArray( data ) ? data : [data];
			//添加事件锁
			var eventLocks = self._eventLocks || {};
			if( eventLocks[eventType] ) {
				return;	
			}
			self._executeEventMaps = self._executeEventMaps || {};
			//防止死循环事件
			if( self._executeEventMaps[eventType] ) {
				return;	
			}
			self._executeEventMaps[eventType] = true;
			
			var r = true;
			if($.isArray(events) ) {
				var len = events.length;
				for(var i=0;i<len;i++) {
					var _e = events[i];
					if( $.isPlainObject( _e ) ) {
						r = _e.func.apply(_e.scope || context,data);
					} else if( $.isFunction( _e ) ){
						r = _e.apply(self,data);
					}
					if( opt.stopOnFalse ) {
						if(r === false) break;	
					}
				}	
				
			} else if($.isFunction(events)) {
				r = events.apply(self,data);
			}
			
			self._executeEventMaps[eventType] = false;
			
			return r;
		},
		fire : function(){
			return this.fireEvent.apply(this,arguments);	
		}
	});	
})();