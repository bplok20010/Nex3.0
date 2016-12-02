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
