/*
jTips
NOBO/小周
@:zere.nobo@gmail.com
505931977
2013-01-10
*/
var jTipsLoader = 'data:image/gif;base64,R0lGODlhEAAQANU9ANPT0/f399HR0dfX18nJycrKysbGxvz8/PDw8Ojo6NXV1fv7+/j4+M/Pz8XFxcTExOLi4tnZ2e/v7/Pz89TU1MjIyPT09Obm5uPj49ra2vX19fHx8dLS0vn5+eTk5OHh4fb29uvr68vLy+zs7MPDw9DQ0Ofn58zMzOnp6dzc3OXl5djY2M7OzsHBwdvb2+rq6u7u7t3d3d/f397e3tbW1vLy8u3t7fr6+uDg4P7+/v39/cfHx////////wAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFAAA9ACwAAAAAEAAQAAAGw0CeULfJ8QQUSiZ3EDo7H8KEF9k9AAeGxsnI7HYfXmJnsPFCkYDwlno4BDzGI6NbsAy4Q3MBKxmMABs8OF87CBgXNzw6KUYdBwgiHBgWPBQkCi8LOTpON0ZOAAYOJy5OpyAmAw0CAyYgQqA8BwoVJDscpzkWijw5OQEfLC25FhgUcwtOF0ITMTMTFV8isBBCIgOVdToQttYTIluiBIlCDC4AAToDDh48KgYGER1cI2fxCjwBBTj0p8oqKChoIGRDJyFBAAAh+QQFAAA9ACwAAAAAEAAQAAAGbECekIfAAYQAHGLIhBR2OyG0gGMKJQSoFJpgXm48bJTH5elQxIIAjJV2dYNCEboOC98DqBG6qw/hfEdWg4SFVgB8O11DYlBJfG9CbFk7Sk94QnVYcjw4eGN9bBBMgKChgyhPpgUXhEWCSUtDQQAh+QQFAAA9ACwAAAAAEAAQAAAGvkCekLfAURQN4UY3FAYCvNRjp+AFCjjGkBHx8CyEnVe1ozJ1kF1Fk4M4NDyFg8SBTirlFY9R1VVOGFBQFhgAFSg5Nzw3K2w8IV5DiU0dOjUZOw0CAyYgTUMeDQ4OAgA7UyUTnzwgFwMNNC0FERtNBzc5TTgKIbkjQzo4DxQYFjwTUAsyJ7k4PAclZTsIOTkvDZl7BL8jUzgHPDkRDgYfPAkGDQcHGRFQQgsfBKoROw4XORrvwBu5AhQcICxoEgQAOw==';
;(function($){
	
	$.jTips = {};
	$.jTips.Timer = {};// 0表示 显示中
	$.jTips.queue = [];
	$.jTips.ajaxCache = {};
	$.jTips.defaults = {
		randomid	: true,//为每个tip分配不同的id
		tid			: 'tp_tips',//Tips的id
		zIndex		: 9999,
		sizeIcon    : 7,
		skin		: 'black',//默認肤色
		borderIconColor : '#CFCFCF',
		bgIconColor : '#FFFFFF',
		textColor	: '#000000',
		borderRadius: 3,//圆角
		boxShadow	: 'box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.1);',
		padding		: 0,//> < △ 距离 目标的高度
		topIcon     : _topIcon, //生成 ∨
		leftIcon    : _leftIcon, //生成 >
		rightIcon   : _rightIcon,//生成 <
		bottomIcon  : _bottomIcon,//生成 △
		ileft 		: 6,// 小图标的 移动距离
		itop 		: 6,// 小图标的 移动距离
		showOn		: 'mouseover',//触发事件
		hideOn		: 'mouseout',//关闭触发时间
		contentAttr : 'jtip-title',//提示内容 属性
		ajax		: false,//是否用ajax
		ajaxDataType: 'html',
		ajaxCache	: false,
		ajaxData	: null,
		ajaxMethod	: 'GET',
		ajaxAttr	: 'href',//获取ajax url
		ajaxSuccess	: _ajaxSuccess,
		ajaxError	: _ajaxError,
		ajaxWaitText: '<img width="16" height="16" src='+jTipsLoader+' />',
		wTime		: 0,//毫秒 關閉延遲時間 0=>Tips立马关闭 1~∞ Tips会等待时间关闭，当mouseover的时候不会关闭
		//closeButton	: true,//添加关闭按钮 添加关闭按钮后 不会自动关闭 
		content		: null,//tips内容 必须，没有则自动获取
		parentNode	: null,//Tips顯示的對象 默認為本身 必须
		target		: null,// 显示对象
		hideWrap	: 'none',//创建后 隐藏
		afterCreate	: _createCallBack,//第一次创建tips调用 
		onShow		: _onShow,//Tips显示函数
		onHide		: _onHide,//Tips关闭函数
		hook		: 'topcenter'// topleft topright bottomright bottomleft lefttop leftbottom righttop rightbottom 默认方式
		
	};
	
	//Tips的顯示位置計算後的Icon
	$.jTips.hooks = {
		topleft : $.jTips.defaults.topIcon,
		topright : $.jTips.defaults.topIcon,
		topcenter : $.jTips.defaults.topIcon,
		bottomright : $.jTips.defaults.bottomIcon,
		bottomleft : $.jTips.defaults.bottomIcon,
		bottomcenter : $.jTips.defaults.bottomIcon,
		lefttop : $.jTips.defaults.leftIcon,
		leftbottom : $.jTips.defaults.leftIcon,
		leftcenter : $.jTips.defaults.leftIcon,
		righttop : $.jTips.defaults.rightIcon,
		rightbottom : $.jTips.defaults.rightIcon,
		rightcenter : $.jTips.defaults.rightIcon
	};
	//Tips的顯示位置計算
	$.jTips.hookAnimate = {
		topleft : _topleft,
		topright : _topright,
		topcenter : _topcenter,
		bottomright : _bottomright,
		bottomleft : _bottomleft,
		bottomcenter : _bottomcenter,
		lefttop : _lefttop,
		leftbottom : _leftbottom,
		leftcenter : _leftcenter,
		righttop : _righttop,
		rightbottom : _rightbottom,
		rightcenter : _rightcenter
	};
	//皮肤
	$.jTips.skins = {
		'white'	: {
			borderIconColor : '#CFCFCF',
			bgIconColor : '#FFFFFF',
			textColor	: '#000000'
		},
		'black'	: {
			borderIconColor : '#161616',
			bgIconColor : '#161616',
			textColor	: '#EFEFEF'
		},
		'gray'	: {
			borderIconColor : '#282828',
			bgIconColor : '#282828',
			textColor	: '#EFEFEF'
		},
		'yel1'	: {
			borderIconColor : '#D1B07C',
			bgIconColor : '#FFFFDA',
			textColor	: '#69675A'
		},
		'blue' : {
			borderIconColor : '#ADCEEA',
			bgIconColor : '#EFF7FE',
			textColor	: '#000000'
		}
	}
	function _setSkin(options){
		//var options = $.extend({},$.jTips.defaults,options);
		var skin = $.jTips.skins[options.skin];
		return $.extend(options,skin);
	}
	function _onShow(options) {
		if( $("#"+options.tid).is(":hidden")) {
			$("#"+options.tid).css({
				left:options.left,
				top:options.top
			}).fadeIn(100);
		} else {
			$("#"+options.tid).css({
				left:options.left,
				top:options.top
			});
		}
	}
	function _onHide(options) {
		//var options = $.extend({},$.jTips.defaults,options);
		if(options.wTime>=1) {
			$.jTips.Timer[options.tid] = setTimeout(function(){
				$("#"+options.tid).fadeOut(100);
			},options.wTime);
		} else if(options.wTime==0 ){
			$("#"+options.tid).fadeOut(100);	
		}	
	}
	$.jTips.showTip = function(options) {
		_onShow(options);
	}
	$.jTips.hideTip = function(options) {
		if(options.wTime>=1 || options.wTime==0 ) {
			_onHide(options);	
		} else {
			$("#"+options.tid).fadeOut(100);
		}
	}
	$.jTips.clearTimer = function(options){
		if($.jTips.Timer[options.tid]) {
			clearTimeout($.jTips.Timer[options.tid]);
			//console.log($.jTips.Timer[options.tid]+'清空');
			$.jTips.Timer[options.tid] = 0;
		}
	};
	function _setVisibility(options,v) {
		if(v) {
			$("#"+options.tid).css({
				display:'block',
				visibility:'hidden'
			});
		} else {
			$("#"+options.tid).css({
				display:'none',
				visibility:'visible'
			});
		}
	}
	function _createCallBack(options) {
		$("#"+options.tid).mouseover(function(){
			$.jTips.clearTimer(options);
		});
		$("#"+options.tid).mouseout(function(){
			$.jTips.hide(options);								  
		});	
	}
	function _getIconSzie(options){
		var iconWidth = (options.sizeIcon-1) * 2;
		var iconHeight = options.sizeIcon;
		switch(options.setting.sp) {
			case 'top':
			case 'bottom':
				options.iconWidth = iconWidth;
				options.iconHeight = iconHeight;
				break;
			case 'left':
			case 'right':
				options.iconWidth = iconHeight;
				options.iconHeight = iconWidth;
				break;
			default:
				options.iconWidth = iconWidth;
				options.iconHeight = iconHeight;
		}
		return options;
	}
	function _ajaxSuccess(options) {
		if( $("#"+options.tid).is(":hidden")) {
			return false;
		}
		$.jTips.show(options);
	}
	function _ajaxError(options) {
		if( $("#"+options.tid).is(":hidden")) {
			return false;
		}
		$.jTips.show(options);	
	}

	function _ajaxTips(options){
		var url = $(options.parentNode).attr(options.ajaxAttr);
		$.ajax({
			url :  url,
			dataType : options.ajaxDataType,
			type : options.ajaxMethod,
			data : options.ajaxData,
			error : function(XMLHttpRequest, textStatus, errorThrown){
				options.content = errorThrown;
				if(options.ajaxCache) {
					$.jTips.ajaxCache[url] = options.content;
				}
				options.ajaxError(options);
			},
			success : function(data,status){
				options.content = data;
				options.status = status;
				if(options.ajaxCache) {
					$.jTips.ajaxCache[url] = options.content;
				}
				options.ajaxSuccess(options);
			},
			cache : options.ajaxCache
		});	
	}
	function _topIcon(options) {
		//var options = $.extend({},$.jTips.defaults,options);
		var left = options.ileft;
		var size = options.sizeIcon;
		if(size<=0) return '';
		var bgColor = options.bgIconColor;
		var borderColor = options.borderIconColor;
		var size2 = size - 1;
		var size3 = size2 - 1;
		var icon = '<div style="position: absolute; bottom:0px; left:'+left+'px; margin:0px; padding:0px;">'
					+'<b  style="position:absolute;line-height:0;font-size:0;overflow:hidden; border-width: '+size+'px '+size2+'px 0; border-color: '+borderColor+' transparent transparent; border-style: solid dashed dashed;left:0px; display: inline-block; height:0px; width:0px; z-index:1;"></b>'
					+'<b style="position:absolute; border-width: '+size2+'px '+size3+'px 0; border-color: '+bgColor+' transparent transparent; border-style: solid dashed dashed;left:1px; display: inline-block;line-height:0;font-size:0;overflow:hidden; height:0px; width:0px; z-index:2;"></b>'	
					+'</div>';
		return icon;
	}
	function _leftIcon(options) {
		//var options = $.extend({},$.jTips.defaults,options);
		var top = options.itop;
		var size = options.sizeIcon;
		if(size<=0) return '';
		var bgColor = options.bgIconColor;
		var borderColor = options.borderIconColor;
		var size2 = size - 1;
		var size3 = size2 - 1;
		var icon = '<div style="position: absolute; right:0px; top:'+top+'px; margin:0px; padding:0px;">'
					+'<b  style="position:absolute; border-width: '+size2+'px 0 '+size2+'px '+size+'px; border-color: transparent transparent transparent '+borderColor+'; border-style:dashed dashed dashed solid ;left:0px; line-height:0;font-size:0;overflow:hidden;display: inline-block; height:0px; width:0px; z-index:1;"></b>'
					+'<b style="position:absolute; border-width: '+size3+'px 0 '+size3+'px '+size2+'px; border-color: transparent transparent transparent '+bgColor+'; border-style:dashed dashed dashed solid ;left:0px; line-height:0;font-size:0;overflow:hidden;top:1px; display: inline-block; height:0px; width:0px; z-index:2;"></b>'	
					+'</div>';
		return icon;
	}
	function _rightIcon(options) {
		//var options = $.extend({},$.jTips.defaults,options);
		var top = options.itop;
		var size = options.sizeIcon;
		if(size<=0) return '';
		var bgColor = options.bgIconColor;
		var borderColor = options.borderIconColor;
		var size2 = size - 1;
		var size3 = size2 - 1;
		var icon = '<div style="position: absolute; left:-'+size+'px; top:'+top+'px; margin:0px; padding:0px;">'
					+'<b  style="position:absolute; border-width: '+size2+'px '+size+'px '+size2+'px 0; border-color: transparent '+borderColor+' transparent transparent ; border-style:dashed solid dashed dashed ;left:0px; line-height:0;font-size:0;overflow:hidden;display: inline-block; height:0px; width:0px; z-index:1;"></b>'
					+'<b style="position:absolute; border-width: '+size3+'px '+size2+'px '+size3+'px 0; border-color: transparent '+bgColor+' transparent transparent ; border-style:dashed solid dashed dashed ;left:1px;line-height:0;font-size:0;overflow:hidden; top:1px; display: inline-block; height:0px; width:0px; z-index:2;"></b>'	
					+'</div>';
		return icon;	
	}
	function _bottomIcon(options) {
		//var options = $.extend({},$.jTips.defaults,options);
		var left = options.ileft;
		var size = options.sizeIcon;
		if(size<=0) return '';
		var bgColor = options.bgIconColor;
		var borderColor = options.borderIconColor;
		var size2 = size - 1;
		var size3 = size2 - 1;
		var icon = '<div style="position: absolute; top:-'+size+'px; left:'+left+'px; margin:0px; padding:0px;">'
					+'<b  style="position:absolute;line-height:0;font-size:0;overflow:hidden; border-width:0px '+size2+'px '+size+'px ; border-color: transparent transparent '+borderColor+'; border-style: dashed dashed solid ;left:0px; display: inline-block; height:0px; width:0px; z-index:1;"></b>'
					+'<b style="position:absolute; line-height:0;font-size:0;overflow:hidden;border-width: 0 '+size3+'px '+size2+'px; border-color: transparent transparent '+bgColor+' ; border-style:dashed dashed solid ;left:1px; display: inline-block; top:1px; height:0px; width:0px; z-index:2;"></b>'	
					+'</div>';
		return icon;
	}
	
	function _topleft(options){
		if(options.setting.parentWidth <= (options.ileft*2+options.iconWidth/2)) {
			options.ileft = options.setting.parentWidth/2;
			options.ileft = options.ileft - options.iconWidth/2;
			options.ileft = options.ileft<0?0:options.ileft;
		}
		//內容 小於 圖標
		if(options.setting.tipsInnerWidth < options.iconWidth) {
			options.sizeIcon = options.setting.tipsInnerWidth - 2;
			options.sizeIcon = (options.sizeIcon)/2;
			options.ileft = 1;
		} else if( options.setting.tipsInnerWidth<=(options.ileft+options.iconWidth)) {
			 options.ileft = 0;
		}
		var icon = options[options.setting.sp+'Icon'](options);
		$("#"+options.tid+"_content").append(icon);
		
		options.left = (options.setting.parentLeft - (options.sizeIcon+options.padding))+'px';
		options.top = (options.setting.parentTop-options.setting.tipsHeight)+'px';
		options.onShow(options);
	}
	function _topright(options){
		if(options.setting.parentWidth <= (options.ileft*2+options.iconWidth/2)) {
			options.ileft = options.setting.parentWidth/2;
			//options.ileft = options.ileft - options.iconWidth/2;
			options.ileft = options.setting.tipsInnerWidth - options.ileft - options.iconWidth/2;
			if( (options.ileft + options.iconWidth)>=options.setting.tipsInnerWidth) {
				options.ileft = options.setting.tipsInnerWidth - options.iconWidth;
			}
		} else {
			options.ileft = options.setting.tipsInnerWidth - (options.ileft + options.iconWidth);
		}
		//內容 小於 圖標
		if(options.setting.tipsInnerWidth < options.iconWidth) {
			options.sizeIcon = options.setting.tipsInnerWidth - 1;
			options.sizeIcon = (options.sizeIcon)/2;
			options.ileft = 1;
			
		} else if( options.ileft<0) {
			 options.ileft = (options.setting.tipsInnerWidth - options.iconWidth)/2;
			 
		}
		var icon = options[options.setting.sp+'Icon'](options);
		$("#"+options.tid+"_content").append(icon);
		
		options.left = ((options.setting.parentLeft+options.setting.parentWidth) - options.setting.tipsWidth + (options.sizeIcon+options.padding))+'px';
		options.top = (options.setting.parentTop-options.setting.tipsHeight)+'px';
		options.onShow(options);
	}
	function _topcenter(options){
		
		options.ileft = (options.setting.tipsInnerWidth - options.iconWidth)/2;
		//內容 小於 圖標
		if(options.setting.tipsInnerWidth < options.iconWidth) {
			options.sizeIcon = options.setting.tipsInnerWidth - 2;
			options.sizeIcon = (options.sizeIcon)/2;
			options.ileft = 1;
		}
		var icon = options[options.setting.sp+'Icon'](options);
		$("#"+options.tid+"_content").append(icon);
		var l = (options.setting.parentWidth - options.setting.tipsWidth)/2;
		l = options.setting.parentLeft + l;
		options.left = l +'px';
		options.top = (options.setting.parentTop-options.setting.tipsHeight)+'px';
		options.onShow(options);
	}
	function _bottomleft(options){
		if(options.setting.parentWidth <= (options.ileft*2+options.iconWidth/2)) {
			options.ileft = options.setting.parentWidth/2;
			options.ileft = options.ileft - options.iconWidth/2;
			options.ileft = options.ileft<0?0:options.ileft;
		}
		//內容 小於 圖標
		if(options.setting.tipsInnerWidth < options.iconWidth) {
			options.sizeIcon = options.setting.tipsInnerWidth - 2;
			options.sizeIcon = (options.sizeIcon)/2;
			options.ileft = 1;
		} else if( options.setting.tipsInnerWidth<=(options.ileft+options.iconWidth)) {
			 options.ileft = 0;
		}
		var icon = options[options.setting.sp+'Icon'](options);
		$("#"+options.tid+"_content").append(icon);
		
		options.left = (options.setting.parentLeft - (options.sizeIcon+options.padding))+'px';
		options.top = (options.setting.parentTop+options.setting.parentHeight)+'px';
		options.onShow(options);
	}
	function _bottomright(options){
		if(options.setting.parentWidth <= (options.ileft*2+options.iconWidth/2)) {
			options.ileft = options.setting.parentWidth/2;
			//options.ileft = options.ileft - options.iconWidth/2;
			options.ileft = options.setting.tipsInnerWidth - options.ileft - options.iconWidth/2;
			if( (options.ileft + options.iconWidth)>=options.setting.tipsInnerWidth) {
				options.ileft = options.setting.tipsInnerWidth - options.iconWidth;
			}
		} else {
			options.ileft = options.setting.tipsInnerWidth - (options.ileft + options.iconWidth);
		}
		//內容 小於 圖標
		if(options.setting.tipsInnerWidth < options.iconWidth) {
			options.sizeIcon = options.setting.tipsInnerWidth - 2;
			options.sizeIcon = (options.sizeIcon)/2;
			options.ileft = 1;
			
		} else if( options.ileft<0) {
			 options.ileft = (options.setting.tipsInnerWidth - options.iconWidth)/2;
			 
		}
		var icon = options[options.setting.sp+'Icon'](options);
		$("#"+options.tid+"_content").append(icon);
			
		options.left = ((options.setting.parentLeft+options.setting.parentWidth) - options.setting.tipsWidth + (options.sizeIcon+options.padding))+'px';
		options.top = (options.setting.parentTop+options.setting.parentHeight)+'px';
		options.onShow(options);
	}
	function _bottomcenter(options){
		options.ileft = (options.setting.tipsInnerWidth - options.iconWidth)/2;
		//內容 小於 圖標
		if(options.setting.tipsInnerWidth < options.iconWidth) {
			options.sizeIcon = options.setting.tipsInnerWidth - 2;
			options.sizeIcon = (options.sizeIcon)/2;
			options.ileft = 1;
		}
		var icon = options[options.setting.sp+'Icon'](options);
		$("#"+options.tid+"_content").append(icon);
		var l = (options.setting.parentWidth - options.setting.tipsWidth)/2;
		l = options.setting.parentLeft + l;
		
		options.left = l +'px';
		options.top = (options.setting.parentTop+options.setting.parentHeight)+'px';
		options.onShow(options);
	}
	function _lefttop(options){
		if(options.setting.parentHeight <= (options.itop*2+options.iconHeight/2)) {
			options.itop = options.setting.parentHeight/2;
			options.itop = options.itop - options.iconHeight/2;
			options.itop = options.itop<=0?0:options.itop;
		} else {
			options.itop = options.itop<=0?0:options.itop;	
		}
		var icon = options[options.setting.sp+'Icon'](options);
		$("#"+options.tid+"_content").append(icon);
		
		options.left = options.setting.parentLeft - options.setting.tipsWidth+'px';
		options.top = options.setting.parentTop - (options.sizeIcon+options.padding)+'px';
		options.onShow(options);
	}
	function _leftbottom(options){
		if(options.setting.parentHeight <= (options.itop*2+options.iconHeight/2)) {
			options.itop = options.setting.parentHeight/2;
			options.itop = options.setting.tipsInnerHeight - options.itop - options.iconHeight/2;
			options.itop = options.itop<=0?0:options.itop;
			if( (options.itop + options.iconHeight)>=options.setting.tipsInnerHeight) {
				options.itop = options.setting.tipsInnerHeight - options.iconHeight;
			}
		} else {
			options.itop = options.setting.tipsInnerHeight - (options.itop + options.iconHeight);
		}
		var icon = options[options.setting.sp+'Icon'](options);
		$("#"+options.tid+"_content").append(icon);
		
		options.left = options.setting.parentLeft - options.setting.tipsWidth+'px';
		options.top = options.setting.parentTop + (options.setting.parentHeight - options.setting.tipsHeight) + (options.sizeIcon+options.padding) +'px';
		options.onShow(options);
	}
	function _leftcenter(options){
		options.itop = (options.setting.tipsInnerHeight - options.iconHeight)/2;
		options.itop = options.itop<=0?0:options.itop;	
		var icon = options[options.setting.sp+'Icon'](options);
		$("#"+options.tid+"_content").append(icon);
		var t = (options.setting.parentHeight - options.setting.tipsHeight)/2;
		
		t = options.setting.parentTop + t;
		options.top = t +'px';
		options.left = options.setting.parentLeft - options.setting.tipsWidth+'px';
		options.onShow(options);
	}
	function _righttop(options){
		if(options.setting.parentHeight <= (options.itop*2+options.iconHeight/2)) {
			options.itop = options.setting.parentHeight/2;
			options.itop = options.itop - options.iconHeight/2;
			options.itop = options.itop<=0?0:options.itop;
		} else {
			options.itop = options.itop<=0?0:options.itop;	
		}
		
		var icon = options[options.setting.sp+'Icon'](options);
		$("#"+options.tid+"_content").append(icon);
		
		options.left = options.setting.parentLeft + options.setting.parentWidth+'px';
		options.top = options.setting.parentTop - (options.sizeIcon+options.padding)+'px';
		options.onShow(options);
	}
	function _rightbottom(options){
		if(options.setting.parentHeight <= (options.itop*2+options.iconHeight/2)) {
			options.itop = options.setting.parentHeight/2;
			options.itop = options.setting.tipsInnerHeight - options.itop - options.iconHeight/2;
			options.itop = options.itop<=0?0:options.itop;
			if( (options.itop + options.iconHeight)>=options.setting.tipsInnerHeight) {
				options.itop = options.setting.tipsInnerHeight - options.iconHeight;
			}
		} else {
			options.itop = options.setting.tipsInnerHeight - (options.itop + options.iconHeight);
		}
		var icon = options[options.setting.sp+'Icon'](options);
		$("#"+options.tid+"_content").append(icon);
		
		options.left = options.setting.parentLeft + options.setting.parentWidth+'px';
		options.top = options.setting.parentTop + (options.setting.parentHeight - options.setting.tipsHeight) + (options.sizeIcon+options.padding) +'px';
		options.onShow(options);
	}
	function _rightcenter(options){
		options.itop = (options.setting.tipsInnerHeight - options.iconHeight)/2;
		options.itop = options.itop<=0?0:options.itop;	
		var icon = options[options.setting.sp+'Icon'](options);
		$("#"+options.tid+"_content").append(icon);
		
		var t = (options.setting.parentHeight - options.setting.tipsHeight)/2;
		t = options.setting.parentTop + t;
		options.top = t +'px';
		options.left = options.setting.parentLeft + options.setting.parentWidth+'px';
		options.onShow(options);
	}
	
	/*
		獲取Tips的內容信息
	*/
	function _getTipsContent(options) {
		//var options = $.extend({},$.jTips.defaults,options);
		if(options.content === null) {
			if(options.ajax) {
				//ajax code	
				var url = $(options.parentNode).attr(options.ajaxAttr);
				if(url) {
					if($.jTips.ajaxCache[url]) {
						if(options.ajaxCache) {
							options.content = 	$.jTips.ajaxCache[url];
						} else {
							_ajaxTips(options);
							options.content = options.ajaxWaitText;	
						}
					} else {
						_ajaxTips(options);
						options.content = options.ajaxWaitText;
					}
				}
			} else {
				options.content = $(options.parentNode).attr(options.contentAttr);	
				
			}
		}
		return options;
	}
	/*
		生成Tips內容，并返回HTML
	*/
	function _container(options){
		var options = _getTipsContent(options);
		if(options.content == '' || options.content === null) return '';
		var str = '<div class="jTips-content" id="'+options.tid+'_content" style="position:relative;border-radius:'+options.borderRadius+'px; float:left;zoom:1;'+options.boxShadow+'background:'+options.bgIconColor+'; border:1px solid '+options.borderIconColor+'; color:'+options.textColor+';">'+options.content+'</div>';	
		return str;
	}
	//得到當前的顯示方式 left top bottom right
	function _getShowStyle(options){
		var str = options.hook;
		var tstr = options.hook.substr(0,3);//top
		if(tstr == 'top') {
			return 	{s:tstr,a:options.hook.substr(3)};
		}
		tstr = options.hook.substr(0,4);//left
		if(tstr == 'left') {
			return 	{s:tstr,a:options.hook.substr(4)};
		}
		tstr = options.hook.substr(0,6);//bottom
		if(tstr == 'bottom') {
			return 	{s:tstr,a:options.hook.substr(6)};
		}
		tstr = options.hook.substr(0,5);//right
		if(tstr == 'right') {
			return 	{s:tstr,a:options.hook.substr(5)};
		}
		return 	{s:'top',a:'left'};
	}
	//計算Tips的顯示座標
	function _positionTips(options){
		//var options = $.extend({},$.jTips.defaults,options);
		var isHidden = false;
		
		if( $("#"+options.tid).is(":hidden")) {
			isHidden = true;
		}
		
		if(isHidden) {
			_setVisibility(options,true);
		}
		options.setting = {};
		var parentLeft=0,parentTop=0,parentWidth=0,parentHeight=0,tipsWidth=0,tipsHeight=0,
			windowWidth=0,windowHeight=0,scrollTop=0,scrollLeft=0;
		//Tips大小
		tipsWidth = $("#"+options.tid).outerWidth();
		tipsHeight = $("#"+options.tid).outerHeight();
		tipsInnerWidth = $("#"+options.tid+"_content").outerWidth();
		tipsInnerHeight = $("#"+options.tid+"_content").outerHeight();
		options.setting.tipsWidth = tipsWidth;
		options.setting.tipsHeight = tipsHeight;
		options.setting.tipsInnerWidth = tipsInnerWidth;
		options.setting.tipsInnerHeight = tipsInnerHeight;
		//options.itop = tipsHeight>(options.itop*2) ? options.itop : tipsHeight/2;
		//options.ileft = tipsWidth>(options.ileft*2) ? options.ileft : tipsWidth/2;
		//窗口大小
		windowWidth = $(window).width();
		windowHeight = $(window).height();
		scrollTop = $(document).scrollTop();
		scrollLeft = $(document).scrollLeft();
		
		options.setting.windowWidth = windowWidth;
		options.setting.windowHeight = windowHeight;
		options.setting.scrollTop = scrollTop;
		options.setting.scrollLeft = scrollLeft;
		//元素的位置 座標
		parentWidth = $(options.parentNode).outerWidth();
		parentHeight = $(options.parentNode).outerHeight();
		
		options.setting.parentWidth = parentWidth;
		options.setting.parentHeight = parentHeight;
		var pos = $(options.parentNode).offset();
		parentLeft = pos.left;
		parentTop = pos.top;
		
		options.setting.parentLeft = parentLeft;
		options.setting.parentTop = parentTop;
		//計算出 元素 上 下 左 右的可顯示空間
		var ptop=0,pbottom=0,pleft=0,pright=0;
		pleft = parentLeft - scrollLeft;
		pleft = pleft<=0 ? 0 : pleft;
		ptop = parentTop - scrollTop;
		ptop = ptop<=0 ? 0 : ptop;
		pright = windowWidth - (pleft+parentWidth);
		pright = pright<=0 ? 0 : pright;
		pbottom = windowHeight - (ptop+parentHeight);
		pbottom = pbottom<=0 ? 0 : pbottom;
		//得出Tips 各個地方是否有足夠空間顯示
		var pstyle = {
			top : ptop>=tipsHeight ? true : false,
			bottom : pbottom>=tipsHeight ? true : false,
			left : pleft>=tipsWidth ? true : false,
			right : pright>=tipsWidth ? true : false
		};
		//得出Tips顯示在上還是下 左或右
		var _sp = _getShowStyle(options);
		var sp = _sp.s;
		var ap = _sp.a;
		switch(sp) {
			case 'top':
				sp = pstyle[sp] ? sp : 'bottom';
				sp = pstyle[sp] ? sp : 'top';
				break;
			case 'left':
				sp = pstyle[sp] ? sp : 'right';
				sp = pstyle[sp] ? sp : 'left';
				break;
			case 'bottom':
				sp = pstyle[sp] ? sp : 'top';
				sp = pstyle[sp] ? sp : 'bottom';
				break;
			case 'right':
				sp = pstyle[sp] ? sp : 'left';
				sp = pstyle[sp] ? sp : 'right';
				break;
			default:
				sp = pstyle[sp] ? sp : 'top';
				sp = pstyle[sp] ? sp : 'bottom';
		}
		options.setting.sp = sp;
		options.hook = sp+ap;
		//取得方向圖標Icon
		//var icon = options[sp+'Icon'](options);
		//$("#"+options.tid+"_content").append(icon);
		options = _getIconSzie(options);
		if(isHidden) {
			_setVisibility(options,false);
		}
		
		$.jTips.hookAnimate[options.hook](options);
	}
	/*
		創建用於顯示的Tips
	*/
	$.jTips.create = function(options){
		//var options = $.extend({},$.jTips.defaults,options);
		var od = $("#"+options.tid);
		
		options = _setSkin(options);
		
		var container = _container(options);
		if( od.size() ) {
			od.html(container);	
			
		} else {
			$(document.body).append('<div class="jTips-wrap" id="'+options.tid+'" style="padding:'+( options.sizeIcon + options.padding )+'px;position:absolute;display:'+options.hideWrap+';">'+container+'</div>');
			options.afterCreate(options);
		}
		$.jTips.clearTimer(options);
		//計算顯示位置并顯示Tip
		_positionTips(options);
	}
	$.jTips.hide = function(options){
		options.onHide(options);
	}
	//core
	$.jTips.show = function(options){
		//var options = $.extend({},$.jTips.defaults,options);
		if(options.parentNode === null) return;
		//create 但是尚未顯示
		$.jTips.create(options);
	}
	$.jTips.getTid = function(){
		return 'jTip' + Math.floor(Math.random() * 99999);
	}
	$.fn.jTips = function(opt){
		if (!$(this).length) {
			return this;
		}
		//var options = $.extend({},$.jTips.defaults,options);
		$(this).each(function(i){
							  
			var options = $.extend({},$.jTips.defaults,opt);
			if(options.randomid) {
				this.tid = $.jTips.getTid();
				$.jTips.queue.push(this.tid);
			}
			$(this)[options.showOn](function(){
				if(this.tid) {
					options.tid = this.tid;	
				}
				if(options.target != null) {
					options.parentNode = $(options.target);
				} else {
					options.parentNode = $(this);
				}
				$.jTips.show(options);								 
			});
			$(this)[options.hideOn](function(){$.jTips.hide(options);});
			$(this).data('options',options);
			$(this).data('showOn',function(){
				$.jTips.show(options);							
			});
			$(this).data('hideOn',function(){
				$.jTips.hide(options);							
			});
		});
	}
	
})(jQuery);