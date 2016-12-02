/*
*Core
*/
(function(global, $){
	var Nex = {},
		objectPrototype = Object.prototype,
        toString = objectPrototype.toString,
        enumerables = true,
        enumerablesTest = { toString: 1 },
        emptyFn = function(){},
        i;

    global.Nex = Nex;

    Nex.global = global;

    for (i in enumerablesTest) {
        enumerables = null;
    }

    if (enumerables) {
        enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
                       'toLocaleString', 'toString', 'constructor'];
    }

    /**
     * An array containing extra enumerables for old browsers
     * @property {String[]}
     */
    Nex.enumerables = enumerables;
	
	Nex.apply = function(object, config, defaults) {
        if (defaults) {
            Nex.apply(object, defaults);
        }

        if (object && config && typeof config === 'object') {
            var i, j, k;

            for (i in config) {
                object[i] = config[i];
            }

            if (enumerables) {
                for (j = enumerables.length; j--;) {
                    k = enumerables[j];
                    if (config.hasOwnProperty(k)) {
                        object[k] = config[k];
                    }
                }
            }
        }

        return object;
    };
	Nex.applyIf = function(object, config) {
        var property;
		if (object) {
			for (property in config) {
				if (object[property] === undefined) {
					object[property] = config[property];
				}
			}
		}

		return object;
    };
	
	var userAgent = navigator.userAgent.toLowerCase();
	var uaMatch = /msie ([\w.]+)/.exec( userAgent ) || [];
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
	//baseUrl = baseUrl ? baseUrl+'/':baseUrl;
	/*如果是IE浏览器 加上各版本样式*/
	$(document).ready(function(){
		if( Nex.isIE && Nex.IEVer ) {
			var cls = ['nex-ie'];
			var bd = $(document.body);
			cls.push( 'nex-ie'+Nex.IEVer );
			if( Nex.IEVer<8 ) {
				cls.push( 'nex-ielt8' );
			}
			if( Nex.IEVer<9 ) {
				cls.push( 'nex-ielt9' );
			}
			bd.addClass( cls.join(' ') );
		}
	});
	
	function getTemplate(o){
		var o = o || {};
		return {
			cache1 : {},
			cache2 : {},
			helper : $.noop,//兼容用
			ltag : o.ltag || '<%',
			rtag : o.rtag || '%>',
			simple :  o.simple || false,
			compile1 : function(str, data, extArgs){
				var fn = this.cache1[str] ? this.cache1[str] :
				 new Function(extArgs ? "obj,"+extArgs : "obj",
				"var p=[],print=function(){p.push.apply(p,arguments);};" +
				"with(obj){p.push('" +
				str
				  .replace(/[\r\t\n]/g, " ")
				  .split(this.ltag).join("\t")
				  .replace(new RegExp("((^|"+this.rtag+")[^\t]*)'","g"), "$1\r")
				  .replace(new RegExp("\t=(.*?)"+this.rtag,"g"), "',$1,'")
				  .split("\t").join("');")
				  .split(this.rtag).join("p.push('")
				  .split("\r").join("\\'")
			  + "');}return p.join('');");
				this.cache1[str] = fn;
				return data ? fn( data ) : fn;
			},
			compile2 : function(str, data, extArgs){//简单的模版
				var fn = this.cache2[str] ? this.cache2[str] :
				 new Function(extArgs ? "obj,"+extArgs : "obj",
				"var p=[],print=function(){p.push.apply(p,arguments);};" +
				"with(obj){p.push('" +
				str
				  .replace(/[\r\t\n]/g, " ")
				  .split(this.ltag).join("\t")
				  //.replace(new RegExp("((^|"+this.rtag+")[^\t]*)'","g"), "$1\r")
				  .replace(new RegExp("\t(.*?)"+this.rtag,"g"), "',$1,'")
				  .split("\t").join("');")
				  .split(this.rtag).join("p.push('")
				  .split("\r").join("\\'")
			  + "');}return p.join('');");
				this.cache2[str] = fn;
				return data ? fn( data ) : fn;
			},
			compile : function(){
				if( this.simple ) {
					return this.compile2.apply(this,arguments);	
				} else {
					return this.compile1.apply(this,arguments);		
				}
			}	
		};	
	}
	//common
	Nex.apply( Nex, {
		userAgent : userAgent,
		aid : 1,
		tabIndex : 1,
		zIndex : 99999,
		topzIndex : 99999999,
		scrollbarSize : false,
		resizeOnHidden : true,	
		easingDef : $.easing.def ? $.easing.def : 'swing',
		/*
		*根据参数返回模版对象
		*@param {Object} o ltag rtag simple(简单模式) 
		*@return {Object}
		*/
		getTemplate : getTemplate,
		/*
		*dirname
		*/
		dirname : function(baseUrl){
			baseUrl = baseUrl + '';
			baseUrl = baseUrl.split('/');
			baseUrl.pop();
			baseUrl = baseUrl.join('/');
			return baseUrl;
		},
		/*
		*private
		*safair不支持
		*/
		/*getcwd : function(h){
			return getCurrentScript(h);	
		},*/
		baseUrl : baseUrl,
		getCurrentScriptUrl : function(){
			return this.baseUrl;	
		},
		template : getTemplate(),
		/*
		*返回随机字符串
		*@param {Number} 返回自定的长度的随机字符串 默认是6位
		*@return {String}
		*/
		generateMixed : function(n){
			var n = n || 6;
			var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
			var res = "";
			 for(var i = 0; i < n ; i ++) {
				 var id = Math.ceil(Math.random()*35);
				 res += chars[id];
			 }
			 return res;	
		},
		/*
		*返回一个不重复字符串,使用方法同generateMixed
		*/
		unique : function(n){
			return this.uuid(n)
		},
		uuid : function(n){
			var str = Nex.generateMixed(n||6);
			var aid = str+'-'+Nex.aid++;
			return aid;		
		},
		distArr : function( arr ){
			var obj={},temp=[];
			for(var i=0;i<arr.length;i++){
				if(!obj[arr[i]]){
					temp.push(arr[i]);
					obj[arr[i]] =true;
				}
			}
			return temp;	
		}
	} );
	
	Nex.apply( Nex, {
		/*
		*检测当前对象是否是Nex类
		*/
		isClass : function(v){
			return  typeof v === 'function' && v.$isClass  ? true : false;
		},
		isNexConstructor : function(obj){
			return this.isClass(obj);	
		},
		/*
		*检测当前对象是否是Nex实例对象
		*/
		isNex : function(obj){
			return this.isInstance(obj);	
		},
		isInstance : function(v){
			return  typeof v === 'object' && v.isInstance  ? true : false;
		},
		/*
		*判断当前对象是否是xtype的对象类型 
		*/
		isXtype : function(obj){
			return typeof obj === 'object' && ('xtype' in obj )	? true : false;
		},
		/*
		*检测是否是jquery实例
		*/
		isjQuery : function(obj){
			return $.type(obj) === 'object' && ('_outerWidth' in obj) ? true :　false;	
		},
		/**
         * Clone almost any type of variable including array, object, DOM nodes and Date without keeping the old reference
         * @param {Object} item The variable to clone
         * @return {Object} clone
         */
        clone: function(item) {
            if (item === null || item === undefined) {
                return item;
            }

            // DOM nodes
            // TODO proxy this to Ext.Element.clone to handle automatic id attribute changing
            // recursively
            if (item.nodeType && item.cloneNode) {
                return item.cloneNode(true);
            }

            var type = toString.call(item);

            // Date
            if (type === '[object Date]') {
                return new Date(item.getTime());
            }

            var i, j, k, clone, key;

            // Array
            if (type === '[object Array]') {
                i = item.length;

                clone = [];

                while (i--) {
                    clone[i] = Nex.clone(item[i]);
                }
            }
            // Object
            else if (type === '[object Object]' && item.constructor === Object) {
                clone = {};

                for (key in item) {
                    clone[key] = Nex.clone(item[key]);
                }

                if (enumerables) {
                    for (j = enumerables.length; j--;) {
                        k = enumerables[j];
                        clone[k] = item[k];
                    }
                }
            }

            return clone || item;
        },
        /**
         * Returns the type of the given variable in string format. List of possible values are:
         *
         * - `undefined`: If the given value is `undefined`
         * - `null`: If the given value is `null`
         * - `string`: If the given value is a string
         * - `number`: If the given value is a number
         * - `boolean`: If the given value is a boolean value
         * - `date`: If the given value is a `Date` object
         * - `function`: If the given value is a function reference
         * - `object`: If the given value is an object
         * - `array`: If the given value is an array
         * - `regexp`: If the given value is a regular expression
         * - `element`: If the given value is a DOM Element
         * - `textnode`: If the given value is a DOM text node and contains something other than whitespace
         * - `whitespace`: If the given value is a DOM text node and contains only whitespace
         *
         * @param {Object} value
         * @return {String}
         * @markdown
         */
        typeOf: function(value) {
            if (value === null) {
                return 'null';
            }

            var type = typeof value;

            if (type === 'undefined' || type === 'string' || type === 'number' || type === 'boolean') {
                return type;
            }

            var typeToString = toString.call(value);

            switch(typeToString) {
                case '[object Array]':
                    return 'array';
                case '[object Date]':
                    return 'date';
                case '[object Boolean]':
                    return 'boolean';
                case '[object Number]':
                    return 'number';
                case '[object RegExp]':
                    return 'regexp';
            }

            if (type === 'function') {
                return 'function';
            }

            if (type === 'object') {
                if (value.nodeType !== undefined) {
                    if (value.nodeType === 3) {
                        return (/\S/).test(value.nodeValue) ? 'textnode' : 'whitespace';
                    }
                    else {
                        return 'element';
                    }
                }

                return 'object';
            }

			throw new Error('Failed to determine the type of the specified value "' + value + '". This is most likely a bug.');			
        },

        /**
         * Returns true if the passed value is empty, false otherwise. The value is deemed to be empty if it is either:
         *
         * - `null`
         * - `undefined`
         * - a zero-length array
         * - a zero-length string (Unless the `allowEmptyString` parameter is set to `true`)
         *
         * @param {Object} value The value to test
         * @param {Boolean} allowEmptyString (optional) true to allow empty strings (defaults to false)
         * @return {Boolean}
         * @markdown
         */
        isEmpty: function(value, allowEmptyString) {
            return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (Nex.isArray(value) && value.length === 0);
        },

        /**
         * Returns true if the passed value is a JavaScript Array, false otherwise.
         *
         * @param {Object} target The target to test
         * @return {Boolean}
         * @method
         */
        isArray: ('isArray' in Array) ? Array.isArray : function(value) {
            return toString.call(value) === '[object Array]';
        },

        /**
         * Returns true if the passed value is a JavaScript Date object, false otherwise.
         * @param {Object} object The object to test
         * @return {Boolean}
         */
        isDate: function(value) {
            return toString.call(value) === '[object Date]';
        },

        /**
         * Returns true if the passed value is a JavaScript Object, false otherwise.
         * @param {Object} value The value to test
         * @return {Boolean}
         * @method
         */
        isObject: (toString.call(null) === '[object Object]') ?
        function(value) {
            // check ownerDocument here as well to exclude DOM nodes
            return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
        } :
        function(value) {
            return toString.call(value) === '[object Object]';
        },

		isPlainObject : function(obj){
			return $._isPlainObject ? $._isPlainObject( obj ) : $.isPlainObject( obj );
		},
        /**
         * @private
         */
        isSimpleObject: function(value) {
            return value instanceof Object && value.constructor === Object;
        },
        /**
         * Returns true if the passed value is a JavaScript 'primitive', a string, number or boolean.
         * @param {Object} value The value to test
         * @return {Boolean}
         */
        isPrimitive: function(value) {
            var type = typeof value;

            return type === 'string' || type === 'number' || type === 'boolean';
        },

        /**
         * Returns true if the passed value is a JavaScript Function, false otherwise.
         * @param {Object} value The value to test
         * @return {Boolean}
         * @method
         */
        isFunction:
        // Safari 3.x and 4.x returns 'function' for typeof <NodeList>, hence we need to fall back to using
        // Object.prorotype.toString (slower)
        (typeof document !== 'undefined' && typeof document.getElementsByTagName('body') === 'function') ? function(value) {
            return toString.call(value) === '[object Function]';
        } : function(value) {
            return typeof value === 'function';
        },

        /**
         * Returns true if the passed value is a number. Returns false for non-finite numbers.
         * @param {Object} value The value to test
         * @return {Boolean}
         */
        isNumber: function(value) {
            return typeof value === 'number' && isFinite(value);
        },

        /**
         * Validates that a value is numeric.
         * @param {Object} value Examples: 1, '1', '2.34'
         * @return {Boolean} True if numeric, false otherwise
         */
        isNumeric: function(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },

        /**
         * Returns true if the passed value is a string.
         * @param {Object} value The value to test
         * @return {Boolean}
         */
        isString: function(value) {
            return typeof value === 'string';
        },

        /**
         * Returns true if the passed value is a boolean.
         *
         * @param {Object} value The value to test
         * @return {Boolean}
         */
        isBoolean: function(value) {
            return typeof value === 'boolean';
        },

        /**
         * Returns true if the passed value is an HTMLElement
         * @param {Object} value The value to test
         * @return {Boolean}
         */
        isElement: function(value) {
            return value ? value.nodeType === 1 : false;
        },

        /**
         * Returns true if the passed value is a TextNode
         * @param {Object} value The value to test
         * @return {Boolean}
         */
        isTextNode: function(value) {
            return value ? value.nodeName === "#text" : false;
        },

        /**
         * Returns true if the passed value is defined.
         * @param {Object} value The value to test
         * @return {Boolean}
         */
        isDefined: function(value) {
            return typeof value !== 'undefined';
        },
		isPlainObject : function(value){
			return $._isPlainObject(value);	
		},
		unDefined: function (val, d) {
			return val === undefined ? d : val;
		}
    });

    var check = function(regex){
            return regex.test(Nex.userAgent);
        },
		isStrict = document.compatMode == "CSS1Compat",
        version = function (is, regex) {
            var m;
            return (is && (m = regex.exec(Nex.userAgent))) ? parseFloat(m[1]) : 0;
        },
		docMode = document.documentMode,
        isOpera = check(/opera/),
        isOpera10_5 = isOpera && check(/version\/10\.5/),
        isChrome = check(/\bchrome\b/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari2 = isSafari && check(/applewebkit\/4/), 
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isSafari5 = isSafari && check(/version\/5/),
        isIE = !isOpera && check(/msie/),
        isIE7 = isIE && ((check(/msie 7/) && docMode != 8 && docMode != 9) || docMode == 7),
        isIE8 = isIE && ((check(/msie 8/) && docMode != 7 && docMode != 9) || docMode == 8),
        isIE9 = isIE && ((check(/msie 9/) && docMode != 7 && docMode != 8) || docMode == 9),
		isIE10 = isIE && ((check(/msie 10/) && docMode != 7 && docMode != 8 && docMode != 9) || docMode == 10),
        isIE6 = isIE && check(/msie 6/),
        isGecko = !isWebKit && check(/gecko/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isGecko4 = isGecko && check(/rv:2\.0/),
        isGecko5 = isGecko && check(/rv:5\./),
        isFF3_0 = isGecko3 && check(/rv:1\.9\.0/),
        isFF3_5 = isGecko3 && check(/rv:1\.9\.1/),
        isFF3_6 = isGecko3 && check(/rv:1\.9\.2/),
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isLinux = check(/linux/),
        chromeVersion = version(true, /\bchrome\/(\d+\.\d+)/),
        firefoxVersion = version(true, /\bfirefox\/(\d+\.\d+)/),
        ieVersion = version(isIE, /msie (\d+\.\d+)/),
        operaVersion = version(isOpera, /version\/(\d+\.\d+)/),
        safariVersion = version(isSafari, /version\/(\d+\.\d+)/),
        webKitVersion = version(isWebKit, /webkit\/(\d+\.\d+)/),
        isSecure = /^https/i.test(window.location.protocol);

    try {
        document.execCommand("BackgroundImageCache", false, true);
    } catch(e) {}

    var nullLog = function () {};
    nullLog.info = nullLog.warn = nullLog.error = Nex.emptyFn;

    Nex.apply( Nex, {
        
		
        SSL_SECURE_URL : isSecure && isIE ? 'javascript:\'\'' : 'about:blank',


        USE_NATIVE_JSON : false,


        isStrict: isStrict,


        isIEQuirks: isIE && !isStrict,

        
        isOpera : isOpera,

        
        isOpera10_5 : isOpera10_5,

        
        isWebKit : isWebKit,

        
        isChrome : isChrome,

        
        isSafari : isSafari,

        
        isSafari3 : isSafari3,

        
        isSafari4 : isSafari4,

        
        isSafari5 : isSafari5,

        
        isSafari2 : isSafari2,

		IEVer : ieVersion,
        
        isIE : isIE,

        
        isIE6 : isIE6,

        
        isIE7 : isIE7,

        
        isIE8 : isIE8,

        
        isIE9 : isIE9,

        
        isGecko : isGecko,

        
        isGecko3 : isGecko3,

        
        isGecko4 : isGecko4,

        
        isGecko5 : isGecko5,

        
        isFF3_0 : isFF3_0,

        
        isFF3_5 : isFF3_5,

        
        isFF3_6 : isFF3_6,

        
        isFF4 : 4 <= firefoxVersion && firefoxVersion < 5,

        
        isFF5 : 5 <= firefoxVersion && firefoxVersion < 6,

        
        isLinux : isLinux,

        
        isWindows : isWindows,

        
        isMac : isMac,

        
        chromeVersion: chromeVersion,

        
        firefoxVersion: firefoxVersion,

        
        ieVersion: ieVersion,

        
        operaVersion: operaVersion,

        
        safariVersion: safariVersion,

        
        webKitVersion: webKitVersion,

        
        isSecure: isSecure,

        
        escapeRe : function(s) {
            return s.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
        },
		
        
        log :
            nullLog,
		
        
        invoke : function(arr, methodName){
            var ret = [],
                args = Array.prototype.slice.call(arguments, 2);
            $.each(arr, function(i,v) {
                if (v && typeof v[methodName] == 'function') {
                    ret.push(v[methodName].apply(v, args));
                } else {
                    ret.push(undefined);
                }
            });
            return ret;
        }
		
		
    } );
	Nex.apply( Nex, {
		htmlEncode: (function() {
			var entities = {
				'&': '&amp;',
				'>': '&gt;',
				'<': '&lt;',
				'"': '&quot;'
			}, keys = [], p, regex;
	
			for (p in entities) {
				keys.push(p);
			}
	
			regex = new RegExp('(' + keys.join('|') + ')', 'g');
	
			return function(value) {
				return (!value) ? value : String(value).replace(regex, function(match, capture) {
					return entities[capture];
				});
			};
		})(),
		htmlDecode: (function() {
			var entities = {
				'&amp;': '&',
				'&gt;': '>',
				'&lt;': '<',
				'&quot;': '"'
			}, keys = [], p, regex;
	
			for (p in entities) {
				keys.push(p);
			}
	
			regex = new RegExp('(' + keys.join('|') + '|&#[0-9]{1,5};' + ')', 'g');
	
			return function(value) {
				return (!value) ? value : String(value).replace(regex, function(match, capture) {
					if (capture in entities) {
						return entities[capture];
					} else {
						return String.fromCharCode(parseInt(capture.substr(2), 10));
					}
				});
			};
		})(),
		addCssRules : function(style, cssSelector, cssText, update){
			function fcamelCase( all, letter ) {
				return ( letter + "" ).toUpperCase();
			}
			function camelCase( string ){
				var rmsPrefix = /^-ms-/,
					rdashAlpha = /-([\da-z])/gi;
				return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
			}
			function $caller(cssSelector, cssText, update){
				var undef;
				var update = update === undef ? true : update;
				return update ? updateRules.apply(this,[cssSelector, cssText]) : addRules.apply(this,[cssSelector, cssText]);
			};
			function addRules( cssSelector, cssText ){
				var styleSheet = style.styleSheet?style.styleSheet:style.sheet;
				var rules = styleSheet.cssRules || styleSheet.rules;
				if( styleSheet.addRule ) {
					styleSheet.addRule(cssSelector,cssText);	
				} else {
					styleSheet.insertRule(cssSelector+"{"+cssText+"}", rules.length);	
				}
				return $caller;
			}
			function updateRules( cssSelector, cssText ){
				var styleSheet = style.styleSheet?style.styleSheet:style.sheet;
				var rules = styleSheet.cssRules || styleSheet.rules;
				var rule = null;
				for( var i=0, len=rules.length; i<len; i++ ) {
					//只修改最后一个样式
					if( rules[i].selectorText.toLowerCase() === cssSelector.toLowerCase() ) {
						rule = rules[i];
					}
				}
				if( !rule ) {
					return addRules( cssSelector, cssText );
				} else {
					var css = ( cssText + "" ).split(';');
					for( var k=0, len2 = css.length; k < len2; k++ ) {
						var d = css[k].split(':');
						rule.style[ $.trim(camelCase(d[0])) ] = d[1];	
					}	
				}
				return $caller;
			}
			return cssSelector ? $caller(cssSelector, cssText, update) : $caller;
		},
		parseUrl : function( url ){
			var urlParseRE = /^\s*(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/;	
			if ( $.type( url ) === "object" ) {
				return url;
			}
			var matches = urlParseRE.exec( url || "" ) || [];
			return {
				href:         matches[  0 ] || "",
				hrefNoHash:   matches[  1 ] || "",
				hrefNoSearch: matches[  2 ] || "",
				domain:       matches[  3 ] || "",
				protocol:     matches[  4 ] || "",
				doubleSlash:  matches[  5 ] || "",
				authority:    matches[  6 ] || "",
				username:     matches[  8 ] || "",
				password:     matches[  9 ] || "",
				host:         matches[ 10 ] || "",
				hostname:     matches[ 11 ] || "",
				port:         matches[ 12 ] || "",
				pathname:     matches[ 13 ] || "",
				directory:    matches[ 14 ] || "",
				filename:     matches[ 15 ] || "",
				search:       matches[ 16 ] || "",
				hash:         matches[ 17 ] || ""
			};
		},
		/*
		*监控一个函数并使得此函数有 before after 回调
		*	examples : 
		*		f = Nex.monitor( fn );
		*		f.before( function(){
		*			console.log('before call')	
		*		} );
		*		f.after( function(){
		*			console.log('after call')	
		*		} )
		*/
		monitor : function( fn ){
			var newFn;
			newFn = function(){
				var rt;
				newFn._callBefore.apply( this, arguments );
				rt = fn.apply( this, arguments );	
				newFn._callAfter.apply( this, arguments );
				return rt;
			}
			
			var q = [];
			
			newFn._callBefore = function(){
				for( var i=0, len=q.length; i<len; i++ ) {
					var cb = q[i];
					if( !cb ) continue;
					if( cb.above ) {
						cb.fn.apply( this, arguments );	
					}
				}	
			};
			newFn._callAfter = function(){
				for( var i=0, len=q.length; i<len; i++ ) {
					var cb = q[i];
					if( !cb ) continue;
					if( !cb.above ) {
						cb.fn.apply( this, arguments );	
					}
				}	
			};
			newFn.before = function( fn ){
				return q.push( {
					above : true,
					fn : fn	
				} ) - 1;
			};	
			newFn.after = function( fn ){
				return q.push( {
					above : false,
					fn : fn	
				} ) - 1;
			};
			newFn.remove = function( i ){
				return q[i] && (q[i] = null);
			};
			newFn.beforeOnce = function( fn ){
				var i;
				i = newFn.before( function(){
					fn.apply( this, arguments );
					newFn.remove(i);	
				} );
			};	
			newFn.afterOnce = function( fn ){
				var i;
				i = newFn.after( function(){
					fn.apply( this, arguments );
					newFn.remove(i);	
				} );
			};
			
			return newFn;
		}
	} );
	Nex.apply( Nex, {
		//数组移动算法
		// pos 要移动的元素下标
		array_move : function(iarr,pos,target,t) {//t 代表是前还是后 1 代表前 0 代表后
	
			if(pos == target) return iarr;
			var __arr = iarr;
			//支持字符下标
			var _iarr = iarr = [].concat(__arr);
			iarr = [];
			var j=0,
				len = _iarr.length;
			for(;j<len;j++) {
				var _i = iarr.push(j);
				if( j == pos) {
					pos = _i-1;
				} else if( j == target ) {
					target = _i-1;
				}
			}
			//core
			var _p = iarr[pos];//记录元副本
			if( pos>target ) {
				if(!t) {
					target++;
				}
				for(var i=pos;i>=0;i--) {
					if(i == target) {
						iarr[i] = _p;
						break;
					}
					iarr[i] = iarr[i-1];
				}
			} else if( pos<target ) {
				if(t) {
					target--;
				}
				for(var i=pos;i<=target;i++) {
					
					if( i == target ) {
						iarr[i] = _p;
					} else {
						iarr[i] = iarr[i+1];
					}	
				}
			}
			//字符下标
			
			var new_arr = __arr;
			new_arr.length = 0;
			//new_arr.push.apply(new_arr,_iarr); //不建议用 因为 _iarr 会有长度限制 63444
			var k=0,
				len = iarr.length;
			for( ;k<len;k++ ) {
				new_arr.push( _iarr[ iarr[k] ] );
			}
			iarr = new_arr;
			return iarr;
		},
		/*
		*删除数组元素 index 为下标或者下标数组 或者回调函数 回调返回true即可
		*/
		array_splice : function(index,arr){
			var self = this,undef;
			if( !$.isArray( arr ) ) return arr;
			
			var call = index;
			
			if( $.isArray( index ) && index.length<=1 ) {
				index = index[0];
			}
			
			if( index === undef ) return arr;
			
			//如果index 不是数组或者不是回调时 直接调用splice;
			if( !$.isArray( index ) && !$.isFunction(index) ) {
				if( isNaN( parseInt( index ) ) ) return arr;
				arr.splice( parseInt(index),1 );
				return arr;
			}
			
			var _arr = self.copy( arr );
			var index = $.isArray( index ) ? index : ($.isFunction(index) ? [] : [index]);
			var _index = {};
			$.each(index,function(i,v){
				_index[v] = true;	
			});
			
			arr.length = 0;
			
			$.each( _arr,function(i,v){
				if( $.isFunction( call ) ) {
					var r = call.call(v,i,v);	
					if( r === true ) {
						_index[i] = true;	
					}
				}
				if( !(i in _index) ) {
					arr.push(v);	
				}	
			} );
			
			return arr;
		},
		/*				
		*数组插入 index 需要插入的位置 arr源数组,_arr需要插入的值可以是数组,t 0后面  1前面 _arr 长度不要超过6W+
		*/
		array_insert : function(index,_arr,arr,t){//t=before
			var self = this,
				undef,
				t = t === undef ? 0 : t;
			if( !$.isArray( arr ) ) return arr;
			
			var call = index;
			
			if( !$.isArray( _arr ) ) _arr = [ _arr ];
			
			if( index === undef ) return arr;
			
			var len = arr.length;
			if( index<len ) {
				if( t )	{
					_arr = _arr.concat( [ arr[index] ] );	
				} else {
					_arr = [ arr[index] ].concat( _arr );
				}
			}
			_arr = [index,1].concat( _arr );
			arr.splice.apply(arr,_arr);
			return arr;
		},
		array_clear : function(arr){
			arr.length = 0;
			return arr;
		},
		array_copy : function(arr){
			return [].concat( arr );	
		},
		//解决数组迭代时使用splice问题方案,在迭代之前应该使用copyArray复制出来
		copyArray : function(arr){
			return [].concat( arr );
		},
		//copy只是对数组或对象只是增加一个引用计数，并不是深复制
		copy : function(data){
			if( $.isArray( data ) ) {
				return  [].concat(data);	
			} else if( $.isPlainObject(data) ) {
				return $.extend({},data);
			} else {
				return data;	
			}
		},
		//只接受 字符串 number 
		inArray : function(elem,arr){
			if( $.type( elem ) === 'number' ) {
				elem = elem+'';	
			}
			if ( arr ) {
				var len = arr.length;
				var i = 0;
				for ( ; i < len; i++ ) {
					// Skip accessing in sparse arrays
					var v = arr[ i ];
					if( $.type( v ) === 'number' ) {
						v = v+'';	
					}
					if ( i in arr && (v === elem) ) {
						return i;
					}
				}
			}
			return -1;
		},
		str_number : function(num,elc){//elc 截取的小数位
			var num = num + '';
			if( $.type( num ) === 'string' ) {
				var n = num.split('.');
				if( n.length>1 ) {
					var ext = n[1].substring(0,elc);	
					if( ext !== '' ) {
						num = [n[0],ext].join('.');	
					} else {
						num = n[0];
					}
				}	
			}
			return Number(num);
		},
		/*
		*判断元素垂直滚动条是否滚动到底 @dom
		*/
		_checkYScrollEnd : function( el ){
			var scrollTop = 0;
			var clientHeight = 0;
			var scrollHeight = 0;	
			if( el === document.body || el === document || el === window ) {
				if (document.documentElement && document.documentElement.scrollTop) {
					scrollTop = document.documentElement.scrollTop;
				} else if (document.body) {
					scrollTop = document.body.scrollTop;
				}
				if (document.body.clientHeight && document.documentElement.clientHeight) {
					clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight: document.documentElement.clientHeight;
				} else {
					clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight: document.documentElement.clientHeight;
				}
				scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
			} else {
				if( !el.nodeType ) return false;
				scrollTop = el.scrollTop;
				clientHeight = el.clientHeight;
				scrollHeight = el.scrollHeight;
			}
			if( clientHeight >= scrollHeight ) {
				return false;
			} else if (scrollTop + clientHeight >= scrollHeight) {//必须要使用>= 因为缩放后会大于scrollHeight
				return true;
			} else {
				return false;
			}	
		},
		/*
		*判断元素水平滚动条是否滚动到底 @dom
		*/
		_checkXScrollEnd : function( el ){
			var scrollLeft = 0;
			var clientWidth = 0;
			var scrollWidth = 0;	
			if( el === document.body || el === document || el === window ) {
				if (document.documentElement && document.documentElement.scrollLeft) {
					scrollLeft = document.documentElement.scrollLeft;
				} else if (document.body) {
					scrollLeft = document.body.scrollLeft;
				}
				if (document.body.clientWidth && document.documentElement.clientHeight) {
					clientWidth = (document.body.clientWidth < document.documentElement.clientWidth) ? document.body.clientWidth: document.documentElement.clientWidth;
				} else {
					clientWidth = (document.body.clientWidth > document.documentElement.clientWidth) ? document.body.clientWidth: document.documentElement.clientWidth;
				}
				scrollWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
			} else {
				if( !el.nodeType ) return false;
				scrollLeft = el.scrollLeft;
				clientWidth = el.clientWidth;
				scrollWidth = el.scrollWidth;
			}
			if( clientWidth >= scrollWidth ) {
				return false;
			} else if (scrollLeft + clientWidth >= scrollWidth) {//必须要使用>= 因为缩放后会大于scrollWidth
				return true;
			} else {
				return false;
			}		
		},
		/*
		*验证是否滚动到低 @el dom @a left/top
		*/
		isScrollEnd : function( el,a ){
			var self = this,
				undef;
			if( a == 'left' ) {
				return self._checkXScrollEnd( el );	
			} else {
				return self._checkYScrollEnd( el );		
			}
		},
		/*
		*判断是否出现滚动条
		* @param el dom
		* @param a left top
		* @param t boolean defalut:false 如果t=true则只要超出宽度就会认定有滚动条，但是未必有滚动条一般拿来检测是否子节点的宽度大于父节点
		*/
		hasScroll: function( el, a, t ) {
			
			var el = $(el)[0];//el 是dom
			
			//If overflow is hidden, the element might have extra content, but the user wants to hide it
			/*
			//IE下 只要overflow-x/overflow-y设置了hidden那么获得的overflow就是hidden 所以我们要只取-x -y
			if ( $( el ).css( "overflow" ) === "hidden") {
				return false;
			}
			*/
			if( t !== true ) {
				if( a === "left" ) {
					if ( $( el ).css( "overflow-x" ) === "hidden") {
						return false;
					}
				} else {
					if ( $( el ).css( "overflow-y" ) === "hidden") {
						return false;
					}	
				}
			}
			var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
				has = false;
			if ( el[ scroll ] > 0 ) {
				return true;
			}
			// TODO: determine which cases actually cause this to happen
			// if the element doesn't have the scroll set, see if it's possible to
			// set the scroll
			el[ scroll ] = 1;
			has = ( el[ scroll ] > 0 );
			el[ scroll ] = 0;
			return has;
		},
		/*
		* 获取浏览器滚动条大小
		*/
		getScrollbarSize: function () {
			if (!Nex.scrollbarSize) {
				var db = document.body,
					div = document.createElement('div');

				div.style.width = div.style.height = '100px';
				div.style.overflow = 'scroll';
				div.style.position = 'absolute';

				db.appendChild(div); 
				
				Nex.scrollbarSize = {
					width: div.offsetWidth - div.clientWidth,//竖
					height: div.offsetHeight - div.clientHeight//横
				};
				//IE下 出现过有一边获取不到的情况 就是为0
				Nex.scrollbarSize.width = Nex.scrollbarSize.width || Nex.scrollbarSize.height;
				Nex.scrollbarSize.height = Nex.scrollbarSize.height || Nex.scrollbarSize.width;
				
				Nex.scrollbarSize.x = Nex.scrollbarSize.height;
				Nex.scrollbarSize.y = Nex.scrollbarSize.width;
				
				db.removeChild(div);
				
			}
			return Nex.scrollbarSize;
		},
		//工具集合
		util : {},
		addUtil : function(n,v){
			Nex.setDefined('Nex.util.'+n, v);
			return this.util[n] = v;	
		},
		getUtil : function(n){
			return this.util[n];	
		},
		extendUtil : function(n,v){
			return this.apply( this.util[n],v );
		},
		removeUtil : function(){
			this.util[n] = null;
			delete this.util[n];
			return this;
		},
		//所有组合mixins
		mixins : {},
		addMixins : function( n,v ){
			Nex.setDefined('Nex.mixins.'+n, v);
			v = $.isFunction( v ) ? v.call( this ) : v;
			return this.mixins[n] = v;	
		},
		getMixins : function(n){
			return this.mixins[n];	
		},
		extendMixins : function(n,v){
			return this.apply( this.mixins[n],v );
		},
		removeMixins : function(){
			this.mixins[n] = null;
			delete this.mixins[n];
			return this;
		},
		/*直接使用jquery 的Deferred对象 所以要使用when需要确定jquery版本支持Deferred*/
		when : function(){
			var arr = [].slice.apply(arguments);
			var deferreds = [];
			for( var i=0,len=arr.length;i<len;i++ ) {
				var cmp;
				var deferred = arr[i];
				if( Nex.isXtype( deferred ) || Nex.isString( deferred ) ) {
					var cmp = Nex.create( deferred );
					if( cmp && cmp.getDeferred ) {
						deferred = cmp.getDeferred();	
					} else {
						deferred = null;
					}
				}
				
				if( Nex.isInstance( deferred ) ) {
					deferred = deferred.getDeferred ? deferred.getDeferred() : null;
				}
				if( deferred ) {
					deferreds.push( deferred );
				}
			}
			return $.extend($.when.apply( $, deferreds ),{
				success : function(){
					this.done.apply( this,arguments )	
				},
				error : function(){
					this.fail.apply( this,arguments )	
				},
				complete : function(){
					this.always.apply( this,arguments )	
				}	
			});	
		},
		emptyFn : $.noop,
		error : function( msg ){
			var undef,
				e = new Error((msg===undef?'':msg));
			throw e;
			return e;	
		}	
	} );	
	Nex.apply( Nex, {
		/*类的别名*/
		aliases : {},
		/*
		*xtype对应的类
		*/
		xtypes : {},
		/*类*/
		classes : {},
		getClass : function( name ){
			return this.classes[name] || this.aliases[name] || this.xtypes[name];
		},
		addClass : function( name,cls ){
			this.classes[name] = cls;
			Nex.setDefined(name, cls);
			return this;
		},
		addXtype : function( name,cls ){
			this.xtypes[name] = cls;
			return this;	
		},
		addAlias : function( name,cls ){
			this.aliases[name] = cls;
			Nex.setDefined(name, cls);
			return this;	
		},
		/*
		*作用同：define('A','B');
		*只是会如果传入的是Function 会做处理
		*/
		setDefined : function(n, v){
			define(n, function(){
				return v;	
			});	
			return this;
		},
		/*
		*创建类
		*	examples:
		*		function Class( age,name ){
		*			this.age = age;
		*			this.name=name;	
		*		}
		*		Class.prototype = {
		*			getAge : function(){
		*				return this.age; 	
		*			},
		*			getName : function(){
		*				return this.name; 	
		*			}
		*		}
		*		var obj = new Class( 21, nobo );
		*		or
		*		var obj = Nex.createClass( Class, 21, 'nobo' );
		*/
		createClass : (function(){
			function cloneFn( fn ){
				var constructor = function(){};
				constructor.prototype = fn.prototype;
				return constructor;
			}
			return 	function(){//Class, argv1,argv2,...
				var Class = arguments[0];
				var Args  = [].slice.call( arguments, 1 );	
				
				if( typeof Class != 'function' ) {
					return null;	
				}
				
				var instance = new (cloneFn( Class ));
				Class.apply( instance, Args );
				return instance;
			};
		})(),
		/*
		*实例化Nex类
		*	examples:
		*		Nex.define('MyApp',{
		*			age : null,
		*			name : null,
		*			constructor : function( age, name ){
		*				if( Nex.isObject( age ) ) {
		*					this.age = age.age;
		*					this.name=age.name;	
		*				} else {
		*					this.age = age;
		*					this.name=name;
		*				}
		*			},
		*			say : function(){
		*				alert('Hello '+this.name);	
		*			}	
		*		});
		*		new MyApp(21, 'nobo');
		*		or
		*		Nex.create('MyApp', 21, 'nobo');
		*		or
		*		Nex.create(MyApp, 21, 'nobo');
		*		or
		*		Nex.create({
		*			xtype : 'MyApp',
		*			age : 21,
		*			name : 'nobo'	
		*		});
		*/
		create : function(){
			var self = this,undef;
			var argvs = [].slice.apply(arguments);
			
			var Class = argvs[0];
			var params = argvs.slice(1);
			
			var len = argvs.length;
			if( len<=0 ) return false;
			
			if( Nex.isInstance( Class ) ) {
				return Class;	
			}
			
			if( Nex.isClass( Class ) ) {
				return Nex.createClass.apply( Nex, [ Class ].concat( params ) );
			}
			
			if( Nex.isXtype(Class) ) {
				var opts = Class;
				var xtype = opts.xtype;
				delete opts.xtype;	
				Class = Nex.getClass( xtype );
				if( Class ) {
					if( Nex.isInstance( Class ) ) {
						return Class;			
					}
					return Nex.createClass.apply( Nex, [ Class,opts  ].concat( params ) ); 	
				} else {
					return false;	
				}
			}
			
			if( Nex.isString( Class ) ) {
				Class = Nex.getClass( Class );	
				if( !Class ) {
					return false;	
				}
				if( Nex.isInstance( Class ) ) {
					return Class;			
				}
				return Nex.createClass.apply( Nex, [ Class ].concat( params ) );
			}
			
			return false;
		},
		Create : function(){
			return this.create.apply( this, arguments );	
		},
		getLoader : function(){
			return  null;	
		},
		isReady : false,
		//需要改进如果define没有加载任何依赖时 不会触发complete
		onReady : function(fn){
			if( !Nex.isFunction(fn) ) return this;
			var loader = this.getLoader();
			Nex.isReady = false;
			var startReady = function(){
				if( loader && !loader.isLoading() ) {
					Nex.isReady = true;	
				} else if( !loader ) {
					Nex.isReady = true;		
				}
				if( Nex.isReady ) {
					fn();	
				} else {
					var $call = function(s){
						var args = [].slice.apply( arguments, [0] );
						var isCache = args.pop();
						if( !isCache ) {
							fn();
						} else {
							loader.complete( $call );
						}	
					};
					loader.complete( $call );
				}	
			};
			$(function(){
				startReady();
			});	
		}	
	} );
})(window, jQuery);