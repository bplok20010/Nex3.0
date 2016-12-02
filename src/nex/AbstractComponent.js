(function(){
	Nex.define('Nex.AbstractComponent',{
		extend : 'Nex.EventObject',
		xtype : 'abstractcomponent',
		_isInit : false,
		configs : function(){
			return {
				prefix : 'nex',
				id : '',
				renderTo : document.body,
				autoDestroy : true,
				autoRender : true,
				denyManager : false,
				init : $.noop,
				renderTpl : '',
				renderData : {},
				renderSelectors : {},
				groupName : '',
				cacheData : {},
				tpl : {},
				template  : Nex.getTemplate(),
				parent : null,
				deferred : $.Deferred ? $.Deferred() : null,
				views : {},
				plugins : [],
				defalutxType : 'panel',
				defaults : {},
				html : '',
				items : []
			}	
		},
		getScrollbarSize : Nex.getScrollbarSize,
		//判断当前是否正在初始化
		isInit : function(){
			return 	this._isInit;
		},
		constructor : function(){
			this.callParent( arguments );
			var opt = this.configs;
			opt.id = this.getId();
			if( opt.autoRender ) {
				this.initRender();
			}
		},
		rendered : false,
		initRender : function( el,after ){
			var self = this;
			var opt = this.configs;
			
			//如果已经渲染则不能重复渲染
			if( this.rendered ) {
				return this;	
			}
			
			self._isInit = true;
			
			self.initPlugins();
			
			//系统初始化调用
			/*if( $.isFunction( opt.init ) && opt.init!==$.noop ) {
				opt.init.call(self,opt);
			}*/
			
			opt.renderTo = this._undef( el,opt.renderTo );
			opt.renderAfter = this._undef( after,opt.renderAfter );
			
			this.fireEvent("onStart",[opt]);
			this.onStart( opt );
			
			//设置状态， 已经渲染
			this.rendered = true;
			//添加组件到组件管理器
			if( !opt.denyManager ) {
				Nex.ComponentManager.register( self );//register
			}
			
			this.initInstance( opt );
			
			return this;	
		},
		_initPlugins : false,
		initPlugins : function(){
			var self = this;
			var opt = this.configs;
			
			var plugins = opt.plugins || [];
			
			if( self._initPlugins ) {
				return self;	
			}
			
			self._initPlugins = true;
			
			for( var i=0, len=plugins.length; i<len; i++ ) {
				self.constructorPlugin( plugins[i] );
			}
			
			return self;
		},
		constructorPlugin : function( plugin ){
			var _plugin = plugin;
			var plugin = Nex.create( plugin );
			if( plugin && typeof plugin.init == 'function' ) {
				plugin.init( this );	
			} else {
				if( typeof _plugin == 'function' ) {
					_plugin( this );		
				}	
			}	
			return this;
		},
		onStart : function(){},
		initInstance : function(cfg){
			var self = this;
			var opt = self.configs;	
			
			self.onInitComponent(opt);
			self.fireEvent('onInitComponent',[opt]);
			
			self.initContainer();
			//initRenderTpl
			self.initRenderTpl();
			
			self.initComponent(opt);
			//初始化组件大小
			self.initComponentSize(opt);
			
			self.initRenderContent(opt);//initRenderContent
			//渲染完成
			self.onAfterRender();
			self.fireEvent('onAfterRender',[opt]);
			
			self.onCreate(opt);
			self.fireEvent('onCreate',[opt]);
			this._isInit = false;	
		},
		initContainer : function(){},
		initRenderTpl : function(){},
		initComponent : function(){
			this.constructPlugins();	
		},
		initComponentSize : function(){
			this.setSize();
		},
		initRenderContent : function(){},
		onInitComponent : function(){},
		onAfterRender : function(){},
		onCreate : function(){},
		constructPlugins : function(){},
		setSize : function(){},
		render : function( el,after ){
			if( this.rendered ) {
				this.renderTo.apply( this,arguments );
			} else {
				this.initRender.apply( this,arguments );	
			}
			return this;	
		},
		//判断是否render
		isRendered : function(){
			return this.rendered;	
		},
		_checkToRender : function(){
			if( !this.rendered ) {
				this.render();	
			}	
		},
		renderTo : function(){},
		_getId : function(){
			var opt = this.configs;
			return opt.prefix + (++Nex.aid);	
		},
		getId : function(){
			var opt = this.configs;
			if( Nex.isEmpty( opt.id ) ) {
				return this._getId();	
			}
			return opt.id;	
		},
		/*
		* @m default=false true(更新层级关系)
		*/
		enableAutoResize : function(  ){	
			this.configs.autoResize = true;
			return this;
		},
		/*
		* @m default=false true(更新层级关系)
		*/
		disabledAutoResize : function( m ){
			this.configs.autoResize = false;
			return this;
		},
		_undef : function (val, d) {
			return val === undefined ? d : val;
		},
		resize : function(){
			var self = this;
			var opt = self.configs;
			//if( Nex.ComponentManager ) {
				setTimeout(function(){
					Nex.ComponentManager.fireEvent("onResize",[opt.id]);		
				},0);
			//}	
		},	
		__ars : true,
		//判断当前组件是否接受autoResize
		isAcceptResize : function(){
			var opt = this.configs;
			return opt.autoResize && this.__ars;	
		},
		setAcceptResize : function(m){
			var m = m === undefined ? true : m;
			this.__ars = !!m;
			return this;	
		},
		/**
		 * 模板处理函数(用户自定义模版级别最高,其次模板函数,最后_Tpl中的模版)
		 *  @tpl {String,Function} 模板内容
		 *  @data {Object} 模板数据 如果tpl是Function data不一定需要Object
		 *  @return {String} 模板内容
		 */
		tpl : function( tpl, data ){
			var self = this;
			var opt = self.configs;
			var undef;
			
			if( tpl === undef ) tpl = "";
			if( data === undef ) data = {};
			
			if( tpl === "" ) return tpl;
			
			var argvs = [].slice.apply( arguments, [ 1 ] );
			
			var renderer = self.getTplFn( tpl );
			
			return renderer.apply(self,argvs);
			
		},
		getTplFn : function( str, extParams ){
			var self = this;
			var opt = self.configs;
			var undef;
			if( !opt.template ) {
				if( $.isFunction(str) ){
					return str;
				} else if( str in self ) {
					return self[str];
				} else {
					return function(){
						return str;	
					};
				}
			}
			if( $.isFunction( str ) ){
				return str;
			}else if( str in opt.tpl && opt.tpl[str] ) {
				return opt.template.compile( opt.tpl[str], null, extParams );
			} else if( str in self ) {
				return self[str];
			} else {
				return opt.template.compile( str + "", null, extParams );
			}
		},
		/*
		*  调用当前对象里的某个API，但是不会触发里面的事件(部分函数除外例如setGridBody,因为里面事件通过计时器触发)
		*  @param1 {String} 需要调用的API
		*  @param2~N 被调用的API参数(可选)
		*/
		denyEventInvoke : function(){//method,arg1,arg2....
			var self = this;
			var r;
			if( arguments.length ){
				var argvs = [];
				for( var i=0;i<arguments.length;i++ ) {
					argvs.push(arguments[i]);	
				}
				var method = argvs[0];
				if( method in self ) {
					self._denyEvent = true;
					argvs.splice(0,1);
					r = self[method].apply(self,argvs);
					self._denyEvent = false;
				}
			}
			return r;
		},
		/*
		* API调用管理,作用在于通过该函数调用的会过滤被锁定的函数
		*  @param1 {String} 需要调用的API
		*  @param2~N 被调用的API参数(可选)
		*/
		methodInvoke : function(){//method,arg1,arg2....
			var self = this;
			var r;
			
			var methodLocks = self._methodLocks || {};
			
			if( arguments.length ){
				var argvs = [];
				for( var i=0;i<arguments.length;i++ ) {
					argvs.push(arguments[i]);	
				}
				var method = argvs[0];
				
				if( methodLocks[method] ) {
					return;	
				}
				
				if( method in self ) {
					argvs.splice(0,1);
					r = self[method].apply(self,argvs);
				}
			}
			return r;
		},
		/*
		* 锁定API
		*  @method {String} API名
		*/
		lockMethod : function(method){
			var self = this;	
			//事件锁
			var methodLocks = self._methodLocks || {};
			methodLocks[method] = true;
			self._methodLocks = methodLocks;
			return true;	
		},
		/*
		* 取消锁定API
		*  @method {String} API名
		*/
		unLockMethod : function(method){
			var self = this;	
			//事件锁
			var methodLocks = self._methodLocks || {};
			methodLocks[method] = false;
			self._methodLocks = methodLocks;
			return true;	
		},
		__sleep : false,
		isSleep : function(){
			return this.__sleep;	
		},
		//睡眠 睡眠后无法通过sendMessageToGroup给组件发送消息 并不会影响fireEvent
		sleep : function(){
			this.__sleep = true;
			return this;	
		},
		//唤醒
		wakeup : function(){
			this.__sleep = false;
			return false;
		},
		//获取组件的父级组件
		getParent : function(){
			var opt = this.configs;
			if( opt.parent !== null ) {
				if( Nex.isInstance( opt.parent ) ) {
					return opt.parent;	
				}
				var _p = Nex.get(opt.parent);
				if( _p ) return _p;
			}
			return null;
		},
		removeCmp :  function( m ){
			//var self = this,undef;
			var opt = this.configs;
			//if( Nex.ComponentManager && m !== false ) {
			Nex.ComponentManager.removeCmp( opt.id );
			//}
		},
		/*
		*移除组件 最好需要重载
		*/
		destroy : function(){
			this.removeCmp();
			return this;
		},
		onDestroy : function(){},
		getDom : function(){
			return [];	
		},
		getDeferred : function(){
			var opt = this.configs;
			return opt.deferred;
		}
	});	
})();