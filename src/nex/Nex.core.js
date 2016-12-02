/*
jquery.easing.js
*/
jQuery.easing['jswing']=jQuery.easing['swing'];jQuery.extend(jQuery.easing,{def:'easeOutQuad',swing:function(x,t,b,c,d){return jQuery.easing[jQuery.easing.def](x,t,b,c,d);},easeInQuad:function(x,t,b,c,d){return c*(t/=d)*t+b;},easeOutQuad:function(x,t,b,c,d){return-c*(t/=d)*(t-2)+b;},easeInOutQuad:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t+b;return-c/2*((--t)*(t-2)-1)+b;},easeInCubic:function(x,t,b,c,d){return c*(t/=d)*t*t+b;},easeOutCubic:function(x,t,b,c,d){return c*((t=t/d-1)*t*t+1)+b;},easeInOutCubic:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t+b;return c/2*((t-=2)*t*t+2)+b;},easeInQuart:function(x,t,b,c,d){return c*(t/=d)*t*t*t+b;},easeOutQuart:function(x,t,b,c,d){return-c*((t=t/d-1)*t*t*t-1)+b;},easeInOutQuart:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t+b;return-c/2*((t-=2)*t*t*t-2)+b;},easeInQuint:function(x,t,b,c,d){return c*(t/=d)*t*t*t*t+b;},easeOutQuint:function(x,t,b,c,d){return c*((t=t/d-1)*t*t*t*t+1)+b;},easeInOutQuint:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t*t+b;return c/2*((t-=2)*t*t*t*t+2)+b;},easeInSine:function(x,t,b,c,d){return-c*Math.cos(t/d*(Math.PI/2))+c+b;},easeOutSine:function(x,t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b;},easeInOutSine:function(x,t,b,c,d){return-c/2*(Math.cos(Math.PI*t/d)-1)+b;},easeInExpo:function(x,t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b;},easeOutExpo:function(x,t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b;},easeInOutExpo:function(x,t,b,c,d){if(t==0)return b;if(t==d)return b+c;if((t/=d/2)<1)return c/2*Math.pow(2,10*(t-1))+b;return c/2*(-Math.pow(2,-10*--t)+2)+b;},easeInCirc:function(x,t,b,c,d){return-c*(Math.sqrt(1-(t/=d)*t)-1)+b;},easeOutCirc:function(x,t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b;},easeInOutCirc:function(x,t,b,c,d){if((t/=d/2)<1)return-c/2*(Math.sqrt(1-t*t)-1)+b;return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b;},easeInElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4;}
else var s=p/(2*Math.PI)*Math.asin(c/a);return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;},easeOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4;}
else var s=p/(2*Math.PI)*Math.asin(c/a);return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b;},easeInOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);if(a<Math.abs(c)){a=c;var s=p/4;}
else var s=p/(2*Math.PI)*Math.asin(c/a);if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b;},easeInBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b;},easeOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;},easeInOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;},easeInBounce:function(x,t,b,c,d){return c-jQuery.easing.easeOutBounce(x,d-t,0,c,d)+b;},easeOutBounce:function(x,t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b;}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b;}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b;}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b;}},easeInOutBounce:function(x,t,b,c,d){if(t<d/2)return jQuery.easing.easeInBounce(x,t*2,0,c,d)*.5+b;return jQuery.easing.easeOutBounce(x,t*2-d,0,c,d)*.5+c*.5+b;}});
/*
jquery.mousewheel.js
*/
(function($){var types=['DOMMouseScroll','mousewheel'];if($.event.fixHooks){for(var i=types.length;i;){$.event.fixHooks[types[--i]]=$.event.mouseHooks;}}
$.event.special.mousewheel={setup:function(){if(this.addEventListener){for(var i=types.length;i;){this.addEventListener(types[--i],handler,false);}}else{this.onmousewheel=handler;}},teardown:function(){if(this.removeEventListener){for(var i=types.length;i;){this.removeEventListener(types[--i],handler,false);}}else{this.onmousewheel=null;}}};$.fn.extend({mousewheel:function(fn){return fn?this.bind("mousewheel",fn):this.trigger("mousewheel");},unmousewheel:function(fn){return this.unbind("mousewheel",fn);}});function handler(event){var orgEvent=event||window.event,args=[].slice.call(arguments,1),delta=0,returnValue=true,deltaX=0,deltaY=0;event=$.event.fix(orgEvent);event.type="mousewheel";if(orgEvent.wheelDelta){delta=orgEvent.wheelDelta/120;}
if(orgEvent.detail){delta=-orgEvent.detail/3;}
deltaY=delta;if(orgEvent.axis!==undefined&&orgEvent.axis===orgEvent.HORIZONTAL_AXIS){deltaY=0;deltaX=-1*delta;}
if(orgEvent.wheelDeltaY!==undefined){deltaY=orgEvent.wheelDeltaY/120;}
if(orgEvent.wheelDeltaX!==undefined){deltaX=-1*orgEvent.wheelDeltaX/120;}
args.unshift(event,delta,deltaX,deltaY);return($.event.dispatch||$.event.handle).apply(this,args);}})(jQuery);
/*
 * jQuery hashchange event - v1.3 - 7/21/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,e,b){var c="hashchange",h=document,f,g=$.event.special,i=h.documentMode,d="on"+c in e&&(i===b||i>7);function a(j){j=j||location.href;return"#"+j.replace(/^[^#]*#?(.*)$/,"$1")}$.fn[c]=function(j){return j?this.bind(c,j):this.trigger(c)};$.fn[c].delay=50;g[c]=$.extend(g[c],{setup:function(){if(d){return false}$(f.start)},teardown:function(){if(d){return false}$(f.stop)}});f=(function(){var j={},p,m=a(),k=function(q){return q},l=k,o=k;j.start=function(){p||n()};j.stop=function(){p&&clearTimeout(p);p=b};function n(){var r=a(),q=o(m);if(r!==m){l(m=r,q);$(e).trigger(c)}else{if(q!==m){location.href=location.href.replace(/#.*/,"")+q}}p=setTimeout(n,$.fn[c].delay)}$.browser.msie&&!d&&(function(){var q,r;j.start=function(){if(!q){r=$.fn[c].src;r=r&&r+a();q=$('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){r||l(a());n()}).attr("src",r||"javascript:0").insertAfter("body")[0].contentWindow;h.onpropertychange=function(){try{if(event.propertyName==="title"){q.document.title=h.title}}catch(s){}}}};j.stop=k;o=function(){return a(q.location.href)};l=function(v,s){var u=q.document,t=$.fn[c].domain;if(v!==s){u.title=h.title;u.open();t&&u.write('<script>document.domain="'+t+'"<\/script>');u.close();q.location.hash=v}}})();return j})()})(jQuery,this);
/*******************************************
***************jQuery功能扩展****************
********************************************/
/*
*因为父元素的display为none 那么隐藏的子元素获取高度为0
*可调用_display短暂的显示，要记得调用后也要_hidden返回原始状态
*@param {string} 如果设置就会对元素添加样式否则直接设置display:block
*/
$.fn._display = function(_e){
	var _e = _e || 'nex-hide2show';
	var $this = $(this);
	return $this.add( $this.parents(':hidden') ).filter(function(){
			return $(this).css('display') == 'none';
		}).each( function(){
			$(this).addClass(_e);		
		} );
};
/*状态
*@param {string} 如果设置就会对元素移除样式否则直接设置display:none
*/
$.fn._hidden = function(_e){
	var _e = _e || 'nex-hide2show';
	return this.each(function(i){
		$(this).removeClass(_e);	
	});
};
/*
*获取和设置元素宽高
*使用同$.fn.width,不同在于如果元素隐藏也能正确获取到宽高
*/
$.fn._width = function(_e){
	if(_e==undefined){
		var f = this[0];
		if(f==window || f==document || f==document.body ){
			return this.width()||document.body.clientWidth;
		}
		var p = null,
			$f = $(f);
		var isHidden = $f.is(":hidden");
		if( isHidden ) {
			p = $f._display('nex-hide2show');
		}
		var w = $f.width();
		if( isHidden ) {
			p._hidden('nex-hide2show');	
		}
		return w||0;
	}
	return this.width(_e);
};
/*
*获取和设置元素宽高
*使用同$.fn.height,不同在于如果元素隐藏也能正确获取到宽高
*/
$.fn._height = function(_e){
	if(_e==undefined){
		var f = this[0];
		if(f==window || f==document || f==document.body ){
			return this.height()||document.body.clientHeight;
		}
		var p = {},
			$f = $(f);
		var isHidden = $f.is(":hidden");
		if( isHidden ) {
			p = $f._display('nex-hide2show');
		}
		var h = $(f).height();
		if( isHidden ) {
			p._hidden('nex-hide2show');	
		}
		return h||0;
	}
	return this.height(_e);
}; 
/*
*获取和设置元素宽高
*@param {int} 设置宽高
*使用同$.fn.outerWidth,不同在于可以设置宽高
*/
$.fn._outerWidth = function(_e){
	if(_e==undefined || _e === false || _e === true){
		var f = this[0];
		if(f==window || f==document || f==document.body ){
			return this.width()||document.body.clientWidth;
		}
		var $f = $(f),p = null;
		var isHidden = $f.is(":hidden");
		if( isHidden ) {
			p = $f._display('nex-hide2show');
		}
		var w = this.outerWidth(!!_e)||0;
		if( isHidden ) {
			p._hidden('nex-hide2show');	
		}
		return w;
	}
	var isIE= Nex.isIE;
	return this.each(function(){
		var $this = $(this);					  
		if( !$.support.boxModel ){
			$this.width(_e);
		}else{
			var $f = $this,
				p = null,
				isHidden = $f.is(":hidden");
			if( isHidden ) {
				p = $f._display('nex-hide2show');
			}
			var _w = _e-($f.outerWidth()-$f.width());
			_w = _w<0?0:_w;
			$f.width(_w);
			if( isHidden ) {
				p._hidden('nex-hide2show');	
			}
		}
	});
}; 
/*
*获取和设置元素宽高
*@param {int} 设置宽高
*使用同$.fn.outerHeight,不同在于可以设置宽高
*/
$.fn._outerHeight = function(_f){
	if(_f==undefined || _f === false || _f === true){
		var f = this[0];
		if(f==window || f==document || f==document.body ){
			return this.height()||document.body.clientHeight;
		}
		var $f = $(f),p = null;
		var isHidden = $f.is(":hidden");
		if( isHidden ) {
			p = $f._display('nex-hide2show');
		}
		var h = this.outerHeight(!!_f)||0;
		if( isHidden ) {
			p._hidden('nex-hide2show');	
		}
		return h;
	}
	var isIE= Nex.isIE;
	return this.each(function(){
		var $this = $(this);					  
		if( !$.support.boxModel ){
			$this.height(_f);
		}else{
			var $f = $this,
				p = null,
				isHidden = $f.is(":hidden");
			if( isHidden ) {
				p = $f._display('nex-hide2show');
			}
			var _h = _f-($f.outerHeight()-$f.height());
			_h = _h<0?0:_h;
			$f.height(_h);
			if( isHidden ) {
				p._hidden('nex-hide2show');	
			}
		}
	});
};
/*
*返回相对offsetParent的绝对高度，而不是相对
*/
$.fn._position = function(_f){
	var undef;
	if( _f === undef ) {
		var t = this.eq(0);
		var op = t.offsetParent();
		if( op.is('body') || op.is('html') ) {
			return t.offset();	
		} else {
			var _a = t.offset(),
				_b = op.offset(),
				_c = parseFloat(op.css('borderLeftWidth')) || 0,
				_e = parseFloat(op.css('paddingLeft')) || 0,
				_c1 = parseFloat(op.css('borderTopWidth')) || 0,
				_e1 = parseFloat(op.css('paddingTop')) || 0;
			/*_c = isNaN( _c ) ? 0 : _c;
			_e = isNaN( _e ) ? 0 : _e;
			_c1 = isNaN( _c1 ) ? 0 : _c1;
			_e1 = isNaN( _e1 ) ? 0 : _e1;	*/
			var pos = {
				top : _a.top - _b.top - _c1 - _e1,
				left : _a.left - _b.left - _c - _e
			};
			return {
				top : pos.top + op.scrollTop(),	
				left : pos.left + op.scrollLeft()
			};
		}
	} else {
		return this.css( _f );	
	}
};
/*
*用CSS设置top=-100000px来达到隐藏的效果
*/
$.fn._show = function(fn){
	this.removeClass('nex-hidden');	
	if( fn && $.isFunction(fn) ) {
		fn.call(this);	
	}
	return this;
};
/*
*去除_show的隐藏效果
*/
$.fn._hide = function(fn){
	this.addClass('nex-hidden');	
	if( fn && $.isFunction(fn) ) {
		fn.call(this);	
	}
	return this;
};
/*
*检测是否是纯对象
*/
$._isPlainObject = function(obj){
	var r = $.isPlainObject(obj);
	if( r && '_outerWidth' in obj ) {
		r = false;	
	}
	return r;
};
/*
*兼容jquery低版本也支持parseHtml
*/
$._parseHTML = $.parseHTML = $.parseHTML || function( data, context, scripts ){
	var parsed,rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		scripts = context;
		context = 0;
	}
	context = context || document;

	// Single tag 
	if ( (parsed = rsingleTag.exec( data )) ) {
		return [ context.createElement( parsed[1] ) ];
	}

	parsed = jQuery.buildFragment( [ data ], $(context), scripts ? null : [] );
	return jQuery.merge( [],parsed.fragment.childNodes );

};
/*
*移除元素css内联样式扩展
*/
jQuery.fn.extend({
	/*
	*移除style属性(移除cssText的css)
	*@param {string} 需要移除的样式属性 可用 "," " " 分割
	*@param {boolean} 是否全匹配  否则模糊匹配 默认模糊匹配
	IE9以上最好直接用css('border','')
	*/
	_removeStyle : function(proto,m){
		proto = proto+'';
		var _proto = $.trim(proto.toLowerCase());
		_proto = _proto.replace(/\s+/g,',').split(',');
		var proto = {};
		$.each( _proto,function(i,v){
			proto[v] = true;						
		} );
		return this.each(function(){
			var cssText = this.style.cssText;
			if( cssText ) {
				var css = cssText.split(';');
				var data = {};
				$.each( css , function(i,v){
					if( v ) {
						var d = v.split(':');
						if( d.length ) {
							data[$.trim(d[0].toLowerCase())] = $.trim(d[1]);
						}
					}
				} );
				var t = [];
				for( var k in data ) {
					if( m ) {
						if( k in proto ) continue;	
					} else {
						//if( k.indexOf(proto) === 0 ) continue;	
						var r = false;
						for( var key in proto ) {
							if( k.indexOf(key) === 0 ) r=true;	
						}
						if( r ) {
							continue;	
						}
					}
					t.push( k+":"+data[k]+';' );
				}
				this.style.cssText = t.join("");
			}
		});	
	},
	_visible : function( bool ){
		var undef;
		bool = bool === undef ? true : bool;
		var visible = !!bool;
		return this.each(function(){
			var $this = $(this);					  
			if( visible ) {
				$this._removeStyle('visibility');
			} else {
				$this.css('visibility','hidden');	
			}
		});	
	}				 
});
/*
selection扩展
*/
jQuery.support.selectstart = false;
jQuery.fn.extend({
	disableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".nex-disableSelection", function( event ) {
				event.preventDefault();
			});
	},
	enableSelection: function() {
		return this.unbind( ".nex-disableSelection" );
	}
});
/*
兼容 jquery 1.9 以上 移除 $.support.boxMoal
*/
if( jQuery.support.boxModel === undefined ) {
	jQuery.support.boxModel = document.compatMode === "CSS1Compat";
}
/*
是否支持 onselectstart 检查
*/
jQuery(function() {
	var body = document.body,
		div = body.appendChild( div = document.createElement( "div" ) );
		
	$.support.selectstart = "onselectstart" in div;

	// set display to none to avoid a layout bug in IE
	// http://dev.jquery.com/ticket/4014
	body.removeChild( div ).style.display = "none";
});

define(function(require){
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
	
	return Nex;
})(window, jQuery);
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
	return Nex;	
});
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
(function(){
	Nex.define('Nex.Component',{
		extend : 'Nex.AbstractComponent',
		xtype : 'component',
		_isInit : false,
		configs : function(){
			return {
				prefix : 'component-',
				tag : 'div',
				renderTo : document.body,
				renderAfter : true,
				autoDestroy : true,//自动回收 ，如果el 不存在时会触发
				autoResize : false,//如果你的组件大小都是一个固定值应该设置为false 如果可以是百分比或者auto 则应该设置true
				selectionable : true, 
				autoSize : false,
				width : '', 
				height : '',
				realWidth : null,//实际 ,width=auto时 如果max min width height 没起作用那么realWidth = auto
				realHeight : null,//同上
				_width : null,//和realWidth 不同的是 _width是一个数值
				_height : null,
				__width : 0,
				__height : 0,
				maxWidth : 0,
				maxHeight : 0,
				minHeight : 0,
				minWidth : 0,
				disabledItems : false,
				focusable : true,
				tabIndex : false,
				attrs : {},
				style : {},
				'class' : '',
				containerCls : 'nex-component',
				borderCls    : '',
				uiPrefix  : 'nex-ui',
				ui : 'defalut',//default = nex-ui-default
				uiCls : [],//icon = nex-ui-default-icon
				cls : '',
				cssText : ''
			}	
		},
		onStart : function( opt ){
			this.callParent(arguments);
			opt.__width = opt.width;
			opt.__height = opt.height;
		},
		renderedContainer : false,
		initContainer : function(){
			var self = this;
			var opt = self.configs;	
			
			self.callParent(arguments);
			
			if( self.renderedContainer ) {
				return self;	
			}
			
			var render = $( $.isWindow(opt.renderTo) ? document.body : opt.renderTo );
			var container;
			
			var cls = [
				opt.containerCls,
				'nex-component-item'
			];
			
			if( opt.border === true ) {
				cls.push( opt.borderCls );	
			}
			
			if( opt.ui ) {
				var ui = [opt.uiPrefix,opt.ui].join('-')
				cls.push(ui);	
				var uiCls = $.isArray(opt.uiCls) ? opt.uiCls : [ opt.uiCls ];
				$.each( uiCls,function(i,uc){
					if( !uc ) return;
					cls.push( [ui,uc].join('-') );	
				} );
			}
			if( opt['cls'] ) {
				cls.push( opt['cls'] );	
			}
			if( opt['class'] ) {
				cls.push( opt['class'] );	
			}
			var tag = opt.tag || 'div';
			
			container = $( document.createElement( tag ) );
			container.attr({
				id : opt.id,
				"class" : cls.join(' ')	
			});
		
			if( opt.renderAfter ) {
				render.append(container);
			} else {
				render.prepend(container);
			}
			opt.views['container'] = container;
			
			self.el = container;
			
			if( opt.cssText ) {
				container[0].style.cssText = opt.cssText;
			}
			container.attr( opt.attrs )
				     .css( opt.style );
			if( !opt.selectionable ) {
				self._disableSelection();	
			}
			
			if( opt.focusable && opt.tabIndex !== false ) {
				//设置tabIndex=-1 
				container.attr( {
					tabIndex : opt.tabIndex	   
				} );
			}
			
			self.renderedContainer = true;
			
			return self;
		},
		onContainerCreate : function(){},
		initRenderTpl : function(){
			var self = this;
			var opt = self.configs;	
			
			self.callParent(arguments);
			
			var el = self.el;
			
			var renderData = Nex.apply( {}, opt.renderData, opt );
			
			var tpl = opt.renderTpl;
			if( Nex.isFunction(tpl) ) {
				tpl = tpl.call(self,renderData);	
			} else if( Nex.isArray(opt.renderTpl) ) {
				tpl = self.tpl( tpl.join(''), renderData );	
			} else {
				tpl = self.tpl( tpl + "", renderData );		
			}
			
			el.html(tpl);
			
			$.each( opt.renderSelectors, function(k,s){
				opt.views[k] = $(s,el);	
				self[k] = opt.views[k];
			} );
			
			self.onContainerCreate(el, opt);
			
			self.fireEvent("onContainerCreate",[el,opt]);
			
			return self;	
		},
		initRenderContent : function(){
			this.doRenderContent();
			return this;	
		},
		//_appendContent
		doRenderContent : function(){
			var self = this;
			var opt = self.configs;	
			var lbody = self.getBody();
			if( opt.disabledItems ) return lbody;
			var items = opt['html'];
			self.addComponent( lbody,items,null,opt.defaults );
			var items = opt['items'];
			self.addComponent( lbody,items,null,opt.defaults );
			return lbody;
		},
		setSize : function(){
			return this.setContainerSize.apply(this,arguments);	
		},
		setContainerSize : function(width, height){
			var self = this,
				opt = self.configs;
			opt.width = Nex.unDefined(width, opt.width);
			opt.height = Nex.unDefined(height, opt.height);	
			var wh ={
				width : opt.width,
				height : opt.height	
			};
			self.fireEvent('onSetContainerSize',[wh,opt]);
			self.el.css({
				width : wh.width,
				height : wh.height	
			});
			return this;	
		},
		getContainer : function(){
			var self = this,
				opt = self.configs;
			return opt.views['container'];	
		},
		getBody : function(){
			var self = this,
				opt = self.configs;
			return opt.views['container'];
		},
		_disableSelection : function(){
			this.el.disableSelection();	
		},
		//判断当前对象是否还存在
		isExists : function(){
			var self = this,
				opt = self.configs,
				dom = self.getDom();
			if( !self.isRendering() ) {
				return true;	
			}	
			if( dom.length ) {
				return true;	
			} else {
				if( opt.autoDestroy ) {
					self.removeCmp(opt.id);	
				}	
			}
			return false;
		},
		/*
		*解析xtype 到容器
		*@param {String,Dom} 容器
		*@param {Array,Nex,Xtype} 组件列表 
		*@param {Boolean}  true:append(默认) false:prepend,
		*@param {Object} defaults
		*/
		parseItems : function(renderTo,items,after,def){
			var self = this,
				opt = self.configs,
				undef;
			var after = (after === undef) || (after === null) ? true : after;
			
			var def = $.extend({ xtype : opt.defalutxType }, def || {});
			
			var ac = after ? 'append' : 'prepend';
			if( $.isFunction( items ) && !Nex.isClass( items ) ) {
				items = items.call( self,renderTo );
			}
			var components = [];
			var items = Nex.isArray( items ) ? items : [items];
			if( renderTo && items.length ) {
				for( var i=0;i<items.length;i++ ) {
					var _item = items[i];
					if( _item === '' || _item === undef ) continue;
					if( Nex.isFunction( _item ) && !Nex.isClass( _item ) ) {
						_item = _item.call(self,renderTo,opt);	
						if( _item === '' 
							|| $.type( _item ) === 'boolean' 
							|| $.type( _item ) === 'null' 
							|| $.type( _item ) === 'undefined' 
						) {
							continue;	
						}
					}
					if( Nex.isPlainObject( _item ) && !Nex.isInstance( _item ) ) {
						_item = $.extend( {}, def, _item );	
					}
					if( Nex.isInstance( _item ) ) {
						//$( renderTo )[ac]( _item.getDom() );
						_item.render( renderTo,ac );
						components.push( _item );
						//self.addChildCmpList( _item );
					} else if( Nex.isClass( _item ) || Nex.isXtype( _item ) ){
						if( !Nex.Create ) continue;
						var cmp;
						if( Nex.isXtype( _item ) ) {
							cmp = Nex.Create( $.extend( { parent : opt.id }, _item, {renderTo:renderTo,autoRender:true} ) );	
						} else {
							cmp = Nex.Create( _item,$.extend({},def,{renderTo:renderTo,parent : opt.id,autoRender:true}) );		
						}
						components.push( cmp );
						//self.addChildCmpList( cmp );
						//这里可以改成设置参数 renderAfter : after
						if( !after ) {
							$( renderTo )[ac]( cmp.getDom() );	
						}
					} else if( Nex.isjQuery( _item ) || Nex.isElement( _item ) ) {
						$( renderTo )[ac]( _item );	
						components.push( _item );
					} else {
						_item = _item + '';
						var html = $._parseHTML( _item );//修正相同字符 不创建bug
						html = $(html).clone();
						components.push( html );
						$( renderTo )[ac]( html );				
					}	
				}
			}
			return components;
		},
		addComponent :　function( renderTo,items,after ){
			return this.parseItems.apply(this,arguments);
		},
		addCmp :　function( renderTo,items,after ){
			return this.parseItems.apply(this,arguments);
		},
		/*
		*解析xtype 到容器
		*@param {Array,Nex,Xtype} 组件列表 
		*@param {String,Dom} 容器
		*@param {Boolean} 内部插入 默认是 后 
		*/
		renderComponent : function( items,renderTo,after,def ){
			return this.parseItems( renderTo,items,after,def );	
		},
		//应该放到Html组件 因为有部分组件没有继承Html 所以先放在这里
		renderTo : function( obj,after ){
			var self = this;
			var opt = this.configs;
			var undef;
			var after = after === undef ? true : after;
			var ac = after ? 'append' : 'prepend';
			if( !obj ) return self;
			if( !self.isExists() ) return self;
			var _st = false;
			if( Nex.isInstance( obj ) && obj.isExists() ) {
				var bd = obj.getBody();
				bd[ac]( self.getEl() );
				_st = true;
			} else {
				var el = $(obj);
				if( el.length ) {
					el[ac]( self.getEl() );	
					_st = true;
				}	
			}
			if( opt.autoResize && _st ) {
				self.resize();
				//if( Nex.ComponentManager ) {
					Nex.ComponentManager.cmpChange();	
				//}
			}
			return self;
		},
		getDom : function(){
			var self = this,
				opt = self.configs;
			return $('#'+opt.id);
		},
		getEl : function(){
			return this.el || this.getDom();	
		},
		getChildrens : function(){
			var opt = this.configs;
			return Nex.ComponentManager.getChildrens( opt.id );	
		},
		getAllChildrens : function(){
			var opt = this.configs;
			return Nex.ComponentManager.getAllChildrens( opt.id );	
		},
		//获取组件的父级组件
		getParent : function(){
			var el = this.getDom(),
				opt = this.configs,
				cmp = null;
			if( !el.length ) return cmp;
			if( opt.parent !== null ) {
				if( Nex.isInstance( opt.parent ) ) {
					return opt.parent;	
				}
				var _p = Nex.get(opt.parent);
				if( _p ) return _p;
			}
			var p = el.parent('.nex-component-item'),
				_id = p.attr('id');
			cmp = _id ? Nex.get(id) : null;
			return cmp ? cmp : null;
		},
		
		/*
		*判断元素垂直滚动条是否滚动到底 @dom
		*/
		_checkYScrollEnd : function( el ){
			return Nex._checkYScrollEnd( el );
		},
		/*
		*判断元素水平滚动条是否滚动到底 @dom
		*/
		_checkXScrollEnd : function( el ){
			return Nex._checkXScrollEnd( el );	
		},
		/*
		*验证是否滚动到低 @el dom @a left/top
		*/
		isScrollEnd : function( el,a ){
			return Nex.isScrollEnd( el,a );	
		},
		//应该放到html
		//计算 max/min/cut width height 
		__getCalcSize : function( size,t ){
			var self = this,
				undef,
				opt = this.configs;	
			if( $.isFunction( size ) ) {
				size = size.call( self );	
			}
			if( size === undef ) size = 0;
			//暂不提供百分比支持
			size = parseInt(size);
			return 	isNaN(size)?0:size;	
		},
		_getCutWidth : function(){
			var self = this,
				opt = this.configs;	
			//var pw = opt.pWidth;
			var size = opt.cutWidth;
			return 	self.__getCalcSize(size,0);
		},
		_getCutHeight : function(){
			var self = this,
				opt = this.configs;	
			var size = opt.cutHeight;
			return 	self.__getCalcSize(size,1);
		},
		_getMinWidth : function(){
			var self = this,
				opt = this.configs;	
			var size = opt.minWidth;
			return 	self.__getCalcSize(size,0);
		},
		_getMaxWidth : function(){
			var self = this,
				opt = this.configs;	
			var size = opt.maxWidth;
			return 	self.__getCalcSize(size,0);	
		},
		_getMinHeight : function(){
			var self = this,
				opt = this.configs;	
			var size = opt.minHeight;
			return 	self.__getCalcSize(size,1);		
		},
		_getMaxHeight : function(){
			var self = this,
				opt = this.configs;	
			var size = opt.maxHeight;
			return 	self.__getCalcSize(size,1);			
		},
		/*
		* 把自己从管理从删除 会触发onDestroy 
		*/
		removeCmp :  function(){
			this.callParent(arguments);
			Nex.gc();
		},
		destroy : function(){
			this.el.remove();
			this.callParent();
			return this;
		}
	});	
})();