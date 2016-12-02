/*

*/
;(function($){
	$.jTips = {};
	$.jTips.defaults = {
		tid			: 'tp_tips',
		zIndex		: 9999,
		sizeIcon    : 8,
		borderIconColor : '#CFCFCF',
		bgIconColor : '#FFFFFF',
		topIcon     : _topIcon,
		leftIcon    : _leftIcon,
		rightIcon   : _rightIcon,
		bottomIcon  : _bottomIcon,
		ileft 		: 10,
		itop 		: 10,
		contentAttr : 'title',
		ajax		: false,
		ajaxAttr	: 'href',
		content		: null,
		parentNode	: null,
		hideWrap	: -9999,
		hook		: 'topleft'// topleft topright bottomright bottomleft lefttop leftbottom righttop rightbottom
		
	};	   
	$.jTips.hooks = {
		topleft : $.jTips.defaults.topIcon,
		topright : $.jTips.defaults.topIcon,
		bottomright : $.jTips.defaults.bottomIcon,
		bottomleft : $.jTips.defaults.bottomIcon,
		lefttop : $.jTips.defaults.leftIcon,
		leftbottom : $.jTips.defaults.leftIcon,
		righttop : $.jTips.defaults.rightIcon,
		rightbottom : $.jTips.defaults.rightIcon
	};
	function _topIcon(options) {
		var options = $.extend({},$.jTips.defaults,options);
		var left = options.ileft;
		var size = options.sizeIcon;
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
	function _container(options){
		var options = $.extend({},$.jTips.defaults,options);
		var icon = $.jTips.hooks[options.hook](options);
		var str = '<div class="jTips-content" id="'+options.tid+'_content" style="position:relative; border:1px solid '+options.borderIconColor+';">'+options.content+icon+'</div>';	
		return str;
	}
	$.jTips.create = function(options){
		var options = $.extend({},$.jTips.defaults,options);
		var od = $("#"+options.tid);
		var container = _container(options);
		if( od.size() ) {
			od.html(container);	
		} else {
			$(document.body).append('<div class="jTips-wrap" id="'+options.tid+'" style="padding:'+( options.sizeIcon +1 )+'px;position:absolute;left:'+options.hideWrap+'px;">'+container+'</div>');	
		}
	}
	$.jTips.hide = function(options){
		var options = $.extend({},$.jTips.defaults,options);
		$("#"+options.tid).css('left',options.hideWrap+'px');
	}
	$.jTips.show = function(options){
		var options = $.extend({},$.jTips.defaults,options);
		if(options.parentNode === null) return;
		$("#"+options.tid).css('left','100px');
	}
	$.fn.jTips = function(options){
		var options = $.extend({},$.jTips.defaults,options);
		$(this).hover(function(){
			options.parentNode = this;
			$.jTips.create(options);	
			$.jTips.show(options);
		},function(){
			$.jTips.hide(options);	
		});
	}
	/*demo*/
	$(function(){
		$(document.body).append($.jTips.create({content:'adfasdf<br>asdf<br>asdf',hook:'lefttop'}));	
		var sb = _rightIcon({sizeIcon:8});
		$("#demo1").append(sb);	
		var sb = _bottomIcon({sizeIcon:8});
		$("#demo1").append(sb);	
		var sb = _leftIcon({sizeIcon:8});
		$("#demo1").append(sb);	
		var sb = _topIcon({sizeIcon:8});
		$("#demo1").append(sb);	
	});
	
})(jQuery);