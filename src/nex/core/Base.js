(function(){
var noArgs = [],
	enumerables = Nex.enumerables,
	TC = function() {},
	chain = function(object) {
		TC.prototype = object;
		var result = new TC();
		TC.prototype = null;
		return result;
	},
    Base = function(){};
	
	Nex.chain = chain;
	
	Nex.apply( Base, {
		$className: 'Nex.Base',
        $isClass: true,	
		superclass : null,
		extend: function(superClass) {
            var superPrototype = superClass.prototype,
                basePrototype, prototype, name;
			var className = this.$className || '';	
			//isObject....	
			if( Nex.isObject(superClass) ) {
				this.override( superClass );
				return;
			}
			for (name in superClass) {
				//this[name] = Nex.clone(superClass[name]);
				this[name] = superClass[name];
			}
			this._optionsList = [];	
			
			/*
			* var F = function(){};
			* F.prototype = superPrototype;
			* prototype = this.prototype = new F();
			*/
            prototype = this.prototype = chain(superPrototype);
            this.superclass = prototype.superclass = superPrototype;
			prototype.self = this;

            if (!superClass.$isClass) {
                basePrototype = Base.prototype;
                for (name in basePrototype) {
                    if (name in prototype) {
                        prototype[name] = basePrototype[name];
                    }
                }
            }
			this.$className = className;
			prototype.$className = className;
        },
		override: function(members) {
            var prototype = this.prototype,
                names = [],
                i, ln, name, member,
				cloneFunction = function(method){
					return function() {
						return method.apply(this, arguments);
					};	
				};
				
			var className = this.$className || '';	
			
            for (name in members) {
                names.push(name);
            }
			
            if (enumerables) {
                names.push.apply(names, enumerables);
            }
			
            for (i = 0,ln = names.length; i < ln; i++) {
                name = names[i];

                if (members.hasOwnProperty(name)) {
                    member = members[name];
					
                    if (typeof member == 'function' && !member.$isClass) {
						if (typeof member.$owner != 'undefined') {
							member = cloneFunction(member);
						}
                        member.$owner = this;
                        member.$name = name;
                    }

                    prototype[name] = member;
                }
            }
			
			prototype.$className = className;	
			prototype.self = this;	
			
            return this;
        },
		addStatics: function(members) {
            var member, name;

            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    this[name] = member;
                }
            }

            return this;
        },
		addMembers: function(members) {
            var prototype = this.prototype,
                names = [],
                i, ln, name, member;
				
			var className = this.$className || '';	
			
            for (name in members) {
                names.push(name);
            }

            if (enumerables) {
                names.push.apply(names, enumerables);
            }

            for (i = 0,ln = names.length; i < ln; i++) {
                name = names[i];

                if (members.hasOwnProperty(name)) {
                    member = members[name];

                    if (typeof member == 'function' && !member.$isClass) {
                        member.$owner = this;
                        member.$name = name;
                    }

                    prototype[name] = member;
                }
            }
			
			prototype.$className = className;	
			prototype.self = this;	
			
            return this;
        },
		addMember: function(name, member) {
			var m = {};
			m[name] = member;
           	this.addMembers(m);
            return this;
        },
		implement: function() {
            this.addMembers.apply(this, arguments);
        },
		
        /**
         * Borrow another class' members to the prototype of this class.
         *
         *     Nex.define('Bank', {
         *         money: '$$$',
         *         printMoney: function() {
         *             alert('$$$$$$$');
         *         }
         *     });
         *
         *     Nex.define('Thief', {
         *         ...
         *     });
         *
         *     Thief.borrow(Bank, ['money', 'printMoney']);
         *
         *     var steve = new Thief();
         *
         *     alert(steve.money); // alerts '$$$'
         *     steve.printMoney(); // alerts '$$$$$$$'
         *
         * @param {Nex.Base} fromClass The class to borrow members from
         * @param {Array/String} members The names of the members to borrow
         * @return {Nex.Base} this
         * @static
         * @inheritable
         * @private
         */
        borrow: function(fromClass, members) {
            var prototype = this.prototype,
                fromPrototype = fromClass.$isClass ? fromClass.prototype : 
				( (fromClass = Nex.getClass(fromClass)) ? fromClass.prototype : {} ),
                i, ln, name, fn, toBorrow;

            members = $.isArray( members ) ? [].concat(members) : [ members ];

            for (i = 0,ln = members.length; i < ln; i++) {
                name = members[i];

                toBorrow = fromPrototype[name];

                if (typeof toBorrow == 'function') {
                    fn = function() {
                        return toBorrow.apply(this, arguments);
                    };

                    fn.$owner = this;
                    fn.$name = name;

                    prototype[name] = fn;
                }
                else {
                    prototype[name] = toBorrow;
                }
            }
			
			prototype.self = this;	
				
            return this;
        },
		setXtype : function(xtype){
			var undef;
			if( xtype === undef ) return this;
			
			this.xtype = xtype;
			
			//Nex.classes[ xtype ] = this;
			Nex.addXtype( xtype, this );
			
			return this;	
		},
		setAliasName : function( aliasName ){
			var self = this;
			if( aliasName ) {
				var aliasNames = $.trim(aliasName).split(/\s+/g);
				$.each( aliasNames,function(i,n){
					Nex.setNamespace( n,self );
					Nex.addAlias( n,self );
				} );
			}	
			return self;
		},
		_optionsList : [],
		setOptions : function( options ){
			if( Nex.isObject( options ) ) {
				var _opts = options;
				options = function(){
					return Nex.clone(_opts);
				}
			}
			if( Nex.isFunction( options ) ) {
				this._optionsList.push( function( opt, scope ){
					return options.call( this, opt, scope );
				} );
			}
			return this;
		},
		getOptions : function( scope ){
			var list = this._optionsList || [];
			var opt = this.getSuperClassOptions( scope ) || {};
			var len = list.length;
			if( len ) {
				for( var i = 0; i < len; i++ ) {
					var o = list[i];
					Nex.apply( opt, o.call( this, opt, scope || this ) );	
				}
			}
			return opt;
		},
		getSuperClass : function(){
			return this.superclass ? this.superclass.self : null;	
		},
		getSuperClassOptions : function( scope ){
			var subClass = this,
				superClass = null,
				opts = [],
				opt = {};
			while( superClass = subClass.getSuperClass() ) {
				opts.push( superClass.getOptions( scope ) );	
				subClass = superClass;
			}
			
			opts.reverse();
			
			$.each( opts,function( i, d ){
				Nex.apply( opt, d );	
			} );
			
			return opt;
		},
		create : function(){
			return Nex.create.apply( Nex, [ this ].concat( [].slice.apply( arguments ) ) );	
		}
	} );
	Nex.apply( Base.prototype, {
		isInstance : true,
		$className : 'Nex.Base',
		self 	   : Base,
        superclass : null,
        callParent : function(args) {
            var method,
                superMethod = (method = this.callParent.caller) && 
                              (method = method.$owner ? method : method.caller) &&
                               method.$owner.superclass[method.$name];
				superMethod = superMethod || TC;	
            return superMethod.apply(this, args || noArgs);
        },
		extend : function( data ){
			var self = this;
			var Class = self.self;	
			if( data && $.isPlainObject( data ) ) {
				Class.override.call( self, data );
			}
			return self;
		},
		/*
		*动态添加组合
		*	obj.addMixins( mixin1,mixin2,... )
		*/
		addMixins : function(){
			var self = this;
			var opt = this.configs;
			
			var mixs = [].slice.call( arguments, 0);
			
			var configs = [], properties = {}, i=0, len = mixs.length;
			
			if( !len ) return self;
			
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
			Nex.applyIf( self, properties );
			//组合参数
			if( configs.length ) {
				var mopts = {};	
				for( var i=0, len=configs.length; i<len; i++ ) {
					var cfg = configs[i];
					if( Nex.isFunction( cfg ) ) {
						Nex.apply( mopts, cfg( mopts, self ) || {} );	
					} 	
					if( Nex.isObject( cfg ) ) {
						Nex.apply( mopts, Nex.clone( cfg ) );		
					}
				}
				Nex.applyIf( opt, mopts );
			}
			return self;
		},
		initConfigs : function( cfg ){
			var self = this;
			var Class = self.self;
			var opts = Class.getOptions( self );
			if( Nex.isFunction( cfg ) ) {
				cfg = cfg.call( self,opts ) || {};	
			}
			var configs = Nex.apply( {}, cfg, opts );//$.extend({},opts,cfg);
			//事件只初始化一次把， 会被后面的覆盖
			//self.initEvents(configs);//初始化用户自定义事件
			/*
			if( Nex.isNex(configs.parent) ) {
				var pid = configs.parent.C('id');
				configs.parent = pid;	
			}
			*/
			self.configs = configs;
			
			if( 'mixins' in configs ) {
				var mixins = configs.mixins;
				delete configs.mixins;
				
				var mixs = [];
			
				if( Nex.isPlainObject( mixins ) ) {
					$.each( mixins, function(i,v){
						mixs.push( v );	
					} );
				} else {
					mixs = Nex.isArray( mixins ) ? mixins : [ mixins ];	
				}
				self.addMixins.apply( self, mixs );
			}
			
			/*如果参数中有properties,则当前属性会赋值到当前对象的properties*/
			var properties = [ configs.properties, configs.override ];
			configs.properties = null;
			configs.override = null;
			delete configs.properties;
			delete configs.override;
			$.each( properties,function(i,proto){
				if( !proto ) return;
				if( $.isFunction( proto ) ) {
					proto = proto.call( self,configs );
				}
				if( !proto ) return;
				if( Nex.isObject( proto ) ) {
					self.extend( proto );
				}	
			} );
			
			return configs;
		},
		/*
		*组件参数设置和获取
		*/
		C : function(key,value){
			if( typeof key == 'undefined') {
				return this.configs;	
			}
			if( typeof value == 'undefined' && typeof key !== 'object' ) {
				return this.configs[key];
			}
			if( $.isFunction( value ) ) {
				this.configs[key] = value.call( this,this.configs[key] );	
			} else if( $.isPlainObject( key ) ) {
				var conf = key;
				var opt = this.configs;
				
				if( value ) {
					$.extend( opt,conf );
					return this;	
				}
				
				for (var k in conf) {
					var newValue = conf[k];
					var oldValue = opt[k];
	
					if ( $.isArray( oldValue ) ) {
						oldValue.push.apply(oldValue, newValue);
					} else if ($.isPlainObject( oldValue )) {
						$.extend( oldValue, newValue)
					} else {
						opt[k] = newValue;
					}
				}
			} else {
				this.configs[key] = value;
			}
			return this;
		},
		set : function(){
			return this.C.apply(this,arguments);	
		},
		get : function(){
			return this.C.apply(this,arguments);	
		},
		setConfig : function(){
			return this.C.apply(this,arguments);		
		},
		getConfig : function(){
			return this.C.apply(this,arguments);		
		},
        // Default constructor, simply returns `this`
        constructor: function( cfg ) {
			this.initConfigs.apply( this,arguments );
            return this;
        }	
	} );
	
	Nex.Base = Base;
	
	Nex.classes['Nex.Base'] = Base;
})();