/*

*/
;(function($){
	$.jTips = {};
	$.jTips.defaults = {
		tid			: 'tp_tips',//Tips的id
		zIndex		: 9999,
		sizeIcon    : 8,
		borderIconColor : '#CFCFCF',
		bgIconColor : '#FFFFFF',
		boxShadow	: 'box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.1);',
		padding		: 0,
		topIcon     : _topIcon,
		leftIcon    : _leftIcon,
		rightIcon   : _rightIcon,
		bottomIcon  : _bottomIcon,
		ileft 		: 10,
		itop 		: 10,
		showOn		: 'mouseover',
		hideOn		: 'mouseout',
		contentAttr : 'jtip-title',
		ajax		: false,
		ajaxMethod	: 'GET',
		ajaxAttr	: 'href',
		content		: null,
		parentNode	: null,//Tips顯示的對象 默認為本身
		target		: null,
		hideWrap	: -9999,
		afterCreate	: _createCallBack,
		hook		: 'topleft'// topleft topright bottomright bottomleft lefttop leftbottom righttop rightbottom
		
	};	   
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
	function _createCallBack(options) {
		$("#"+options.tid).mouseover(function(){
			$(this).stop();
			$.jTips.show(options);
		});
		$("#"+options.tid).mouseout(function(){
			$(this).stop();
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
	function _topIcon(options) {
		var options = $.extend({},$.jTips.defaults,options);
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
		var options = $.extend({},$.jTips.defaults,options);
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
		var options = $.extend({},$.jTips.defaults,options);
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
		var options = $.extend({},$.jTips.defaults,options);
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
		
		$("#"+options.tid).css({
			left : (options.setting.parentLeft - (options.sizeIcon+options.padding))+'px',
			top : (options.setting.parentTop-options.setting.tipsHeight)+'px'
		});
		$("#"+options.tid).fadeIn(100);
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
		
		$("#"+options.tid).css({
			left : ((options.setting.parentLeft+options.setting.parentWidth) - options.setting.tipsWidth + (options.sizeIcon+options.padding))+'px',
			top : (options.setting.parentTop-options.setting.tipsHeight)+'px'
		});	
		$("#"+options.tid).fadeIn(100);
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
		$("#"+options.tid).css({
			left : l +'px',
			top : (options.setting.parentTop-options.setting.tipsHeight)+'px'
		});
		$("#"+options.tid).fadeIn(100);
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
		
		$("#"+options.tid).css({
			left : (options.setting.parentLeft - (options.sizeIcon+options.padding))+'px',
			top : (options.setting.parentTop+options.setting.parentHeight)+'px'
		});
		$("#"+options.tid).fadeIn(100);
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
		
		$("#"+options.tid).css({
			left : ((options.setting.parentLeft+options.setting.parentWidth) - options.setting.tipsWidth + (options.sizeIcon+options.padding))+'px',
			top : (options.setting.parentTop+options.setting.parentHeight)+'px'
		});		
		$("#"+options.tid).fadeIn(100);
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
		$("#"+options.tid).css({
			left : l +'px',
			top : (options.setting.parentTop+options.setting.parentHeight)+'px'
		});	
		$("#"+options.tid).fadeIn(100);
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
		
		$("#"+options.tid).css({
			left : options.setting.parentLeft - options.setting.tipsWidth+'px',
			top : options.setting.parentTop - (options.sizeIcon+options.padding)+'px'
		});
		$("#"+options.tid).fadeIn(100);
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
		
		$("#"+options.tid).css({
			left : options.setting.parentLeft - options.setting.tipsWidth+'px',
			top : options.setting.parentTop + (options.setting.parentHeight - options.setting.tipsHeight) + (options.sizeIcon+options.padding) +'px'
		});
		$("#"+options.tid).fadeIn(100);
	}
	function _leftcenter(options){
		options.itop = (options.setting.tipsInnerHeight - options.iconHeight)/2;
		options.itop = options.itop<=0?0:options.itop;	
		var icon = options[options.setting.sp+'Icon'](options);
		$("#"+options.tid+"_content").append(icon);
		var t = (options.setting.parentHeight - options.setting.tipsHeight)/2;
		t = options.setting.parentTop + t;
		$("#"+options.tid).css({
			top : t +'px',
			left : options.setting.parentLeft - options.setting.tipsWidth+'px'
		});
		$("#"+options.tid).fadeIn(100);
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
		
		$("#"+options.tid).css({
			left : options.setting.parentLeft + options.setting.parentWidth+'px',
			top : options.setting.parentTop - (options.sizeIcon+options.padding)+'px'
		});	
		$("#"+options.tid).fadeIn(100);
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
		
		$("#"+options.tid).css({
			left : options.setting.parentLeft + options.setting.parentWidth+'px',
			top : options.setting.parentTop + (options.setting.parentHeight - options.setting.tipsHeight) + (options.sizeIcon+options.padding) +'px'
		});	
		$("#"+options.tid).fadeIn(100);
	}
	function _rightcenter(options){
		options.itop = (options.setting.tipsInnerHeight - options.iconHeight)/2;
		options.itop = options.itop<=0?0:options.itop;	
		var icon = options[options.setting.sp+'Icon'](options);
		$("#"+options.tid+"_content").append(icon);
		
		var t = (options.setting.parentHeight - options.setting.tipsHeight)/2;
		t = options.setting.parentTop + t;
		$("#"+options.tid).css({
			top : t +'px',
			left : options.setting.parentLeft + options.setting.parentWidth+'px'
		});
		$("#"+options.tid).fadeIn(100);
	}
	
	/*
		獲取Tips的內容信息
	*/
	function _getTipsContent(options) {
		var options = $.extend({},$.jTips.defaults,options);
		if(options.content === null) {
			if(options.ajax) {
				//ajax code	
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
		var str = '<div class="jTips-content" id="'+options.tid+'_content" style="position:relative; float:left;zoom:1;'+options.boxShadow+'background:'+options.bgIconColor+'; border:1px solid '+options.borderIconColor+';">'+options.content+'</div>';	
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
		//$("#"+options.tid).css('display','none');
		$.jTips.hookAnimate[options.hook](options);
	}
	/*
		創建用於顯示的Tips
	*/
	$.jTips.create = function(options){
		var options = $.extend({},$.jTips.defaults,options);
		var od = $("#"+options.tid);
		var container = _container(options);
		if( od.size() ) {
			od.html(container);	
		} else {
			$(document.body).append('<div class="jTips-wrap" id="'+options.tid+'" style="padding:'+( options.sizeIcon + options.padding )+'px;position:absolute;left:'+options.hideWrap+'px;">'+container+'</div>');
			options.afterCreate();
		}
		//計算顯示位置并顯示Tip
		_positionTips(options);
	}
	$.jTips.hide = function(options){
		var options = $.extend({},$.jTips.defaults,options);
		$("#"+options.tid).fadeOut(100,function(){
			$(this).css({left:options.hideWrap+'px',display:'block'});
		});
	}
	$.jTips.show = function(options){
		var options = $.extend({},$.jTips.defaults,options);
		if(options.parentNode === null) return;
		//create 但是尚未顯示
		$.jTips.create(options);
	}
	$.jTips.getTid = function(){
		return 'jTip' + Math.floor(Math.random() * 99999);
	}
	$.fn.jTips = function(options){
		if (!$(this).length) {
			return this;
		}
		var options = $.extend({},$.jTips.defaults,options);
		
		$(this).each(function(i){
			
			$(this)[options.showOn](function(){
				if(options.target != null) {
					options.parentNode = $(options.target);
				} else {
					options.parentNode = $(this);
				}
				$.jTips.show(options);								 
			});
			$(this)[options.hideOn](function(){$.jTips.hide(options);	});			  
		});
	}
	
})(jQuery);