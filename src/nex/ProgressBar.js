/*
Nex.ProgressBar
*/
define(function(require){
	require('Nex/container/Container');
		
	var ProgressBar = Nex.define('Nex.ProgressBar','Nex.container.Container',{
		xtype : 'progressbar',
		configs : function(opt){
			return 	{
				prefix : 'nexprogressbar-',
				tabIndex : false,
				disabledItems : true,
				denyEvents : true,
				containerCls : opt.containerCls+' nex-progress',
				width : 200,
				height : 16,
				//设置背景颜色
				fontSize : null,
				bgColor : [],//'#E0E0E0','#16BC5C'
				textColor : [],//'#ccc','#FFF'
				/*进度条值0~100*/
				value : 0,
				/*进度条显示的文本内容*/
				text : '<%=value%>%',
				_defText : '&nbsp;',
				//默认不开启动画方式显示
				animate : false,
				animEasing : 'easeOutCubic',
				animDuration : 500
			};
		}
	});
	ProgressBar.override({
		/*禁用PADDING*/
		_setPadding : function(){},
		initComponent : function(){
			var self = this;
			var opt = this.configs;
			var el = this.el;
			
			self.callParent(arguments);
			
			var progress = Math.max(Math.min(parseFloat(opt.value, 10) || 0, 100), 0);
			
			opt.value = progress;
			
			if( Nex.isEmpty(opt.text) ) {
				opt.text = opt._defText;
			}
			
			var text = self.tpl( opt.text, { value : opt.value } ); 
			
			var html = [
				'<div id="',opt.id,'_bg" class="nex-progress-text nex-progress-bg">',text,'</div>',
				'<div id="',opt.id,'_bar" class="nex-progress-bar" style="width:',progress,'%;">',
					'<div id="',opt.id,'_text" class="nex-progress-text">',text,'</div>',
				'</div>'
			];
			
			el.html(html.join(''));
			
			self.setBackColor(opt.bgColor);
			
			self.setTextColor(opt.textColor);
			
			self.setFontSize(opt.fontSize);
			
		},
		doSetViewSize : function(){
			var self = this;
			var opt = this.configs;
			var el = self.el;
			var bg = $('#'+opt.id+'_bg');
			var bar = $('#'+opt.id+'_bar');
			var text = $('#'+opt.id+'_text'); 
			if( !self.isAutoWidth() ) {
				var w = el._width();
				bg._outerWidth( w );	
				text._outerWidth( w );	
			} else {
				bg._removeStyle('width');	
				text._removeStyle('width');	
			}
			if( !self.isAutoHeight() ) {
				var h = el._height();
				bg._outerHeight( h );	
				bar._outerHeight( h );	
				text._outerHeight( h );	
			} else {
				bg._removeStyle('height');		
				bar._removeStyle('height');	
				text._removeStyle('height');	
			}			
		},
		setBackColor : function(color){
			var opt = this.configs;
			var $bg = $('#'+opt.id+'_bg');
			var $bar = $('#'+opt.id+'_bar');
			var color = Nex.isArray(color) ? color : [color];
			if( color[0] ) {
				$bg.css('backgroundColor', color[0]);
			}
			if( color[1] ) {
				$bar.css('backgroundColor', color[1]);
			}
			return this;
		},
		setTextColor : function(color){
			var opt = this.configs;
			var $bg = $('#'+opt.id+'_bg');
			var $text = $('#'+opt.id+'_text');
			var color = Nex.isArray(color) ? color : [color];
			if( color[0] ) {
				$bg.css('color', color[0]);
			}
			if( color[1] ) {
				$text.css('color', color[1]);
			}
			return this;
		},
		setFontSize : function(size){
			var opt = this.configs;
			var $bg = $('#'+opt.id+'_bg');
			var $text = $('#'+opt.id+'_text');
			if( size ) {
				$bg.css('fontSize', size);
				$text.css('fontSize', size);
			}	
			return this;
		},
		getProgress : function(){
			return this.configs.value;	
		},
		setProgress : function(){
			return this.updateProgress.apply(this, arguments);	
		},
		getValue : function(){
			return this.configs.value;		
		},
		setValue : function(){
			return this.updateProgress.apply(this, arguments);	
		},
		/*更新进度条显示文字*/
		updateText : function(text){
			var self = this;
			var opt = this.configs;
			if( Nex.isDefined(text) ) {
				opt.text = text;
			} else {
				text = opt.text;
			}
			
			text = self.tpl( text, { value : opt.value } );	
		
			var $bg = $('#'+opt.id+'_bg');
			var $text = $('#'+opt.id+'_text'); 
			$bg.html(text);
			$text.html(text);
			return self;
		},
		/*
		*更新进度条
		*@value 进度条数值
		*@text 可选 进度条文字 如果是Boolean则当作anim 
		*@anim 可选 是否动画显示
		*/
		updateProgress : function(value, text, anim){
			var self = this;
			var opt = this.configs;	
			var $bar = $('#'+opt.id+'_bar');
			
			var value = Math.max(Math.min(parseFloat(Nex.unDefined(value, opt.value),10) || 0, 100), 0);
			
			var anim = Nex.unDefined(Nex.isBoolean(text) ? text : anim, opt.animate);
			
			if( opt.value != value ) {
				self.fireEvent('onProgressChange', [value]);	
			}
		
			opt.value = value;
			
			$bar.stop(true, true);
			
			if( anim ) {
				$bar.animate({
					width : value+'%'	
				}, opt.animDuration, opt.animEasing);	
			} else {
				$bar.css('width', value + '%');	
			}
			
			if( Nex.isDefined(text) && !Nex.isBoolean(text) ) {
				self.updateText(text);	
			} else {
				self.updateText();		
			}
			
			return self;
		},
		/*
		*设置一个循环等待进度条
		* @setting object 设置参数:
		* {
		*	duration : 2000,//每次进度条完成时间
		*   easing : 'swing',
		*	text : '请稍候...',//等待时显示的文本
		* }
		*/
		_wt : 0,
		wait : function(setting){
			var self = this;
			var opt = this.configs;	
			var setting = $.extend({
				duration : 2000,
				text : '',
				easing : 'swing'	
			},setting || {});
			if( !setting.duration ) return self;
			var stop = false;
			clearTimeout(self._wt);
			var loop = function(){
				if( stop ) {
					self.updateProgress(0, '', false);
					clearTimeout(self._wt);
					return;	
				}
				self.updateProgress(0, '', false);
				opt.animDuration = setting.duration;
				opt.animEasing = setting.easing;
				self.updateProgress(1000, setting.text, true);
				self._wt = setTimeout(function(){
					loop();	
				},setting.duration)
			}
			loop();
			return function(text){
				stop = true;
				loop();	
				if( text ) {
					self.updateText(text);	
				}
			};
		}
	});
	
	return ProgressBar;
});	