/*Base Class*/
(function(win){
var makeCtor = function() {
		function constructor() {
			return this.constructor.apply(this, arguments);
		}
		return constructor;
	},
	Base = Nex.Base
	;
	Nex.apply( Nex, {
		baseChain : function(className){
			var basePrototype = Base.prototype;
			var cls = makeCtor();
			
			Base.extend.call( cls,Base );
			
			if( className ) {
				cls.$className = className;	
				cls.prototype.$className = className;	
			}
			return cls;
		},
		extend : function(className, superName, members){
			var subClass,
				superClass,
				extendClass;
			if( arguments.length === 2 && Nex.isObject(superName) ) {
				members = superName;	
				superName  = null;
			}
			if( typeof className === 'function' && className.$isClass ) {
				subClass = className;
			} else {
				subClass = Nex.getClass( className );
			}
			
			if( subClass.isInstance ) {
				throw new Error("class is isInstance");		
			}
			
			if( !subClass ) {
				throw new Error("class not defined");	
			}
			if( arguments.length === 1 ) return subClass;
			members = Nex.apply({},members) || {};
			extendClass = members.extend || superName;
			
			delete members.extend;
			
			if( extendClass && typeof extendClass === 'function' && extendClass.$isClass ) {
				superClass = extendClass;
			} else {
				superClass = extendClass ? Nex.getClass( extendClass ) : extendClass;
			}
			if( superClass ) {
				subClass.extend( superClass );
			}
			
			var aliasName,xtype,configs,mixins;
			if( 'alias' in members && members.alias ) {
				aliasName = members.alias + "";
				delete members.alias; 	
			}
			if( 'xtype' in members && members.xtype ) {
				xtype = members.xtype + "";
				delete members.xtype; 
			}
			if( 'configs' in members && members.configs ) {
				configs = members.configs;
				delete members.configs; 	
			}
			if( 'mixins' in members && members.mixins ) {
				mixins = members.mixins;
				delete members.mixins; 	
			}
			
			if( configs ) {
				subClass.setOptions(configs);		
			}	
			
			subClass.override( members );
			
			this._setMixins( mixins, subClass );
			
			var isSingleton = !!subClass.prototype.singleton;
			//判断是否单例模式 singleton = true
			if( isSingleton ) {
				subClass = new subClass();	
			}
			//别名设置
			if( aliasName ) {
				this._setAliasName( aliasName, subClass );
			}
			if( !isSingleton && subClass.$isClass ) {
				this._setClassXtype( xtype, subClass );	
			}
			
			return subClass;
		},
		/*
		* 组合是不会覆盖原有成员
		*/
		_setMixins : function( mixins, subClass ){
			var mixs = [];
			
			if( Nex.isPlainObject( mixins ) ) {
				$.each( mixins, function(i,v){
					mixs.push( v );	
				} );
			} else {
				mixs = Nex.isArray( mixins ) ? mixins : [ mixins ];	
			}
			
			var configs = [], properties = {}, i=0, len = mixs.length;
			
			if( !len ) return;
			
			for( ;i<len;i++ ) {
				var m = mixs[i];
				if( Nex.isString( m ) ) {
					m = Nex.getClass( m );	
					if( !m ) continue;
				}
				if( Nex.isClass( m ) ) {
					configs.push( function( opt, scope ){
						return m.getOptions( scope );	
					} );	
					Nex.apply( properties, m.prototype || {} );
				} else if( Nex.isObject( m ) ){
					if( m.configs ) {
						configs.push( m.configs );
					}
					delete m.configs;
					Nex.apply( properties, m );
				}
			}
			//组合成员
			Nex.applyIf( subClass.prototype, properties );
			//组合参数
			if( configs.length ) {
				subClass.setOptions( function( opts,scope ){
					var opts = opts || {};
					var scope = scope || this;
					
					var mopts = {};	
					for( var i=0, len=configs.length; i<len; i++ ) {
						var cfg = configs[i];
						if( Nex.isFunction( cfg ) ) {
							Nex.apply( mopts, cfg( mopts, scope ) || {} );	
						} 	
						if( Nex.isObject( cfg ) ) {
							Nex.apply( mopts, Nex.clone( cfg ) );		
						}
					}
					return Nex.applyIf( opts, mopts );
				} );
			}
		},
		_setAliasName : function( aliasName, subClass ){
			var aliasNames = $.trim(aliasName).split(/\s+/g);	
			$.each( aliasNames,function(i,n){
				if( !n ) return;
				Nex.setNamespace( n,subClass );
				Nex.addAlias( n,subClass );
			} );
		},
		_setClassXtype : function( xtype, subClass ){
			var xtypes = $.trim(xtype).split(/\s+/g);
			$.each( xtypes,function(i,t){
				if( !t ) return;
				subClass.setXtype(t);		
			} );	
		},
		namespace : function( str ){
			var undef,
				t = win,
				s = str+'';	
			s = s.split('.');
			for( var i=0,len=s.length-1;i<len;i++ ) {
				var e = s[i];
				if( !(e in t) || !t[e] ) {
					t[e] = {};	
				}
				t = t[e];	
			}	
			return t[s[i]] = t[s[i]] === undef ? {} : t[s[i]];
		},
		setNamespace : function(str,v){
			var undef,
				t = win,
				s = str+'';	
			v = v === undef ? {} : v;	
			s = s.split('.');
			for( var i=0,len=s.length-1;i<len;i++ ) {
				var e = s[i];
				if( !(e in t) || !t[e] ) {
					t[e] = {};	
				}
				t = t[e];	
			}	
			return t[s[i]] = v;
		},
		getNamespace : function( str ){
			var undef,
				t = win,
				s = str+'';	
			s = s.split('.');
			for( var i=0,len=s.length-1;i<len;i++ ) {
				var e = s[i];
				if( !(e in t) || !t[e] ) {
					return undef;
				}
				t = t[e];	
			}	
			return t[s[i]];
		},
		ns : function(){
			return this.namespace.apply( this, arguments );	
		},
		/*
		*定义类
		*	extend 继承
		*	alias  别名
		*	xtype 设置组件的xtype 注意实际中  alias和xtype的唯一区别是 alias会自动生成命名控件
		*	configs 参数
		*	mixins  组合
		*	singleton 单例模式	
		*/		
		define : function(className, superName, overrides){
			if( !arguments.length ) {
				throw new Error('className not exists!');	
			}
			var subClass = Nex.baseChain(className);
			
			//this.setNamespace( className, subClass );
			
			this.classes[ className ] = subClass;
			//定义模块
			Nex.setDefined(className, subClass);
			
			this.setNamespace( className, this.extend.apply(this, arguments) );
			//this.extend.apply(this, arguments);
			return subClass;
		}
	} );
})(window);