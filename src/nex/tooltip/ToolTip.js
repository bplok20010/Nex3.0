/*
Nex.tooltip.ToolTip
*/
(function( factory ) {
	if ( typeof $define === "function" ) {
		
		$define([
			'Nex.window.Window'
		], function(){
			
			factory( jQuery );	
		} );
	} else {

		factory( jQuery );
	}
}(function( $ ) {
	var tooltip = Nex.define('Nex.tooltip.ToolTip',{
		extend : 'Nex.window.Window',
		alias : 'Nex.ToolTip',
		xtype : 'tooltip',
		configs : function(opt){
			opt._showAt.visibleable = false;
			opt._showAt.yAlign = 'bottom'
			return {
				prefix : 'nextooltip-',
				border : true,
				autoResize : false,
				borderCls : [opt.borderCls,'nex-tooltip-border'].join(' '),
				containerCls : [opt.containerCls,'nex-tooltip'].join(' '),
				tabIndex : -1,
				autoScroll : false,	
				autoSizeOnShow : false,
				draggable : false,
				resizeable : false,
				showHeader : false,
				/*是否显示箭头*/
				showArrow : true,
				/*箭头容器大小 默认是arrowSize*/
				arrowWrapSize : '',
				/*箭头大小*/
				arrowSize : 7,
				/*箭头不居中时的偏移量*/
				arrowOffset : 5,
				arrowDir : '',// 默认为 dir
				/*如果为空则 则使用showAt的align或dirAlign*/
				arrowAlign : '',
				arrowBorderWidth : 1,
				/*颜色值不设置 则使用默认样式*/
				/*背景颜色*/
				backColor : '',
				/*边框样式*/
				borderColor : '',
				borderWidth : 1,
				borderStyle : 'solid',
				/*文本颜色*/
				textColor : '',
				/*
				* tip显示方位 默认bottom
				* top bottm left right 
				* 方位在空间不足的情况下或自动转换 eg top和bottom left和right
				*/
				autoChangeDir : true,
				dir : 'bottom',
				/*
				* 居中方式
				* 当dir=bottom top时dirAlign= left center right
				* 当dir=left right时dirAlign= top center bottom
				*/
				dirAlign : 'center',
				/*偏移量*/
				offset : 0
			};	
		}
	});
	tooltip.override({
		initComponent : function(){
			var opt = this.configs;
			this.callParent(arguments);
			/*初始化 参数*/
			opt._showAt.visibleable = opt.autoChangeDir;	
			if( opt.dir == 'bottom' || opt.dir == 'top' || opt.dir == 'center' ) {
				opt._showAt.zAlign = 'y';
				opt._showAt.offsetY = opt.offset;
				opt._showAt.yAlign = opt.dir;
				opt._showAt.xAlign = opt.dirAlign;
				if( Nex.inArray( opt.dirAlign, ['left','center','right'] ) == -1 ) {
					opt._showAt.xAlign = 'center';	
				}
			}
			if( opt.dir == 'left' || opt.dir == 'right' ) {
				opt._showAt.zAlign = 'x';
				opt._showAt.offsetX = opt.offset;
				opt._showAt.xAlign = opt.dir;
				opt._showAt.yAlign = opt.dirAlign;
				if( Nex.inArray( opt.dirAlign, ['top','center','bottom'] ) == -1 ) {
					opt._showAt.xAlign = 'center';	
				}
			}
		},
		sysEvents : function(){
			var self = this;
			var opt = self.configs;
			
			self.callParent( arguments );
			
			self.bind('onResetPosition._sys',self._setArrow,self);
			
			return self;
		},
		initCss : function(){
			var self = this;
			var opt = self.configs;
			
			self.callParent(arguments);
			
			opt.backColor && self.setBackColor(opt.backColor);
			
			opt.borderColor && self.setBorderColor(opt.borderColor);
			
			opt.textColor && self.setTextColor(opt.textColor);
				
		},
		setBackColor : function(color){
			this.addCssRules('background-color:'+color);
			return this;	
		},
		setBorderColor : function(color){
			var opt = this.configs;
			this.addCssRules('border:'+parseInt(opt.borderWidth)+'px '+opt.borderStyle+' '+color);
			return this;		
		},
		setTextColor : function(color){
			this.addCssRules('color:'+color);
			return this;		
		},
		/*
		* 重新设置tip内容
		*/
		setContent : function(){
			this.html.apply(this, arguments);	
			this.resetPosition();
			return this;
		},
		/*
		* 重写
		*/
		_showBeforeEffect : function(){
			var el = this.el;	
			var opt = this.configs;
			/*显示窗口*/
			el._show();
			/*创建箭头*/
			//if( !self.arrowEl || opt.resetPosOnShow ) {
			this._setArrow();
			//}
			/*隐藏窗口 执行动画效果*/
			el.hide();
		},
		/*箭头元素*/
		arrowEl : null,
		_direction : 'bottom',
		_setArrow : function(){
			this.refreshArrow();
		},
		refreshArrow : function(){
			var self = this;	
			var opt = self.configs;
			if( !opt.showArrow ) {
				return;	
			}
			if( self.arrowEl ) {
				self.arrowEl.remove();	
			}
			var dir = self.getDirection();
			if( dir == 'center' ) {
				return;	
			}
			var arrow = self.createArrow(dir);
			self.arrowEl = arrow;
			self.el.append(arrow);	
			self.refreshArrowPos();
			/*设置arrow的颜色边框样式*/
			self.setArrowStyle();
		},
		refreshArrowPos : function(){
			var self = this;	
			var opt = this.configs;
			
			//self.el._show();
			
			var posConf = self._currShowAt.configs;
			var dir = self.getDirection();
			
			self._direction = dir;
			
			var showConf = {
				at : posConf.at,
				el : self.arrowEl,
				autoShow : false,
				parent : self.el,
				xAlign : posConf.xAlign,
				yAlign : posConf.yAlign,
				zAlign : posConf.zAlign	
			};
			
			if( Nex.inArray(dir, ['top', 'bottom']) !== -1 ) {
				showConf.zAlign = 'y';	
			}
			if( Nex.inArray(dir, ['left', 'top']) !== -1 ) {
				showConf.zAlign = 'x';	
			}
			
			if( showConf.zAlign == 'y' ) {
				posConf.yAlign != 'center' && (showConf.offsetX = opt.arrowOffset);
				opt.arrowAlign && (showConf.xAlign = opt.arrowAlign);
				opt.arrowDir && (showConf.yAlign = opt.arrowDir);
			}
			if( showConf.zAlign == 'x' ) {
				posConf.xAlign != 'center' && (showConf.offsetY = opt.arrowOffset);
				opt.arrowAlign && (showConf.yAlign = opt.arrowAlign);
				opt.arrowDir && (showConf.xAlign = opt.arrowDir);
			}
			
			var pos2 = Nex.Create('showAt', showConf);
				
			var position = pos2.getShowPos();
			
			self.fireEvent('onGetArrowPos',[position]);
			
			if( showConf.zAlign == 'y' ) {
				self.arrowEl.css('left', position.left);
			}
			if( showConf.zAlign == 'x' ) {
				self.arrowEl.css('top', position.top);
			}
		},
		setArrowStyle : function(){
			//_direction	
			var self = this;
			var opt = self.configs;
			var dir = self._direction;
			
			/*清空所有边框 背景样式*/
			self.addCssRules('.nex-tooltip-arrow-top .nex-tooltip-arrow', 'border-top-color:');
			self.addCssRules('.nex-tooltip-arrow-bottom .nex-tooltip-arrow', 'border-bottom-color:');
			self.addCssRules('.nex-tooltip-arrow-left .nex-tooltip-arrow', 'border-left-color:');
			self.addCssRules('.nex-tooltip-arrow-right .nex-tooltip-arrow', 'border-right-color:');
			
			self.addCssRules('.nex-tooltip-arrow-top .nex-tooltip-arrow-bg', 'border-top-color:');
			self.addCssRules('.nex-tooltip-arrow-bottom .nex-tooltip-arrow-bg', 'border-bottom-color:');
			self.addCssRules('.nex-tooltip-arrow-left .nex-tooltip-arrow-bg', 'border-left-color:');
			self.addCssRules('.nex-tooltip-arrow-right .nex-tooltip-arrow-bg', 'border-right-color:');
			
			if(opt.borderColor) {
				self.addCssRules('.nex-tooltip-arrow-'+dir+' .nex-tooltip-arrow', 'border-'+dir+'-color:'+opt.borderColor);	
			}
			if(opt.backColor) {
				self.addCssRules('.nex-tooltip-arrow-'+dir+' .nex-tooltip-arrow-bg', 'border-'+dir+'-color:'+opt.backColor);	
			}
			
		},
		getShowAtPos : function(){
			var self = this;
			var opt = self.configs;
			
			var pos = self.callParent(arguments);
			
			if( opt.showArrow ) {
				var dir = self.getDirection();
				var size = opt.arrowWrapSize ? opt.arrowWrapSize : opt.arrowSize;	
				if( Nex.inArray(dir, ['top', 'bottom']) !== -1 ) {
					pos.top += dir == 'top' ? size*-1 : parseInt(size, 10); 
				}
				if( Nex.inArray(dir, ['left', 'right']) !== -1 ) {
					pos.left += dir == 'left' ? size*-1 : parseInt(size, 10); 
				}
			}
		
			return pos;	
		},
		/*
		* 获取当前显示的方向 left top right bottom center
		*/
		getDirection : function(){
			var pos = this._currShowAt;
			var dir = 'center';
			if( this.configs.arrowDir ) {
				return this.configs.arrowDir;
			};
			if( !pos ){
				return dir;	
			}	
			var posConf = pos.configs;
			if( posConf.zAlign == 'y' ) {
				if( posConf.yAlign == 'top' || posConf.yAlign == 'bottom' ) {
					dir = posConf.yAlign;	
				} 
			}
			if( posConf.zAlign == 'x' ) {
				if( posConf.xAlign == 'left' || posConf.xAlign == 'right' ) {
					dir = posConf.xAlign;	
				} 
			}
			return dir;
		},
		_getTopArrow : function(){
			var opt =this.configs;
			var size = opt.arrowSize;
			var bw = opt.arrowBorderWidth;
			var size2 = size - bw;
			var html = [
				'<b class="nex-tooltip-arrow nex-tooltip-arrow-border" style="border-width: '+size+'px;left:0px; z-index:1;"></b>',
				'<b class="nex-tooltip-arrow nex-tooltip-arrow-bg" style="border-width: '+size2+'px; left:'+bw+'px; z-index:2;"></b>'	
			];
			return html.join('');
		},
		_getBottomArrow : function(){
			var opt =this.configs;
			var size = opt.arrowSize;
			var bw = opt.arrowBorderWidth;
			var size2 = size - bw;
			var html = [
				'<b class="nex-tooltip-arrow nex-tooltip-arrow-border" style="border-width: '+size+'px;left:0px; z-index:1;"></b>',
				'<b class="nex-tooltip-arrow nex-tooltip-arrow-bg" style="border-width: '+size2+'px; left:'+bw+'px; top:'+(bw*2)+'px; z-index:2;"></b>'	
			];
			return html.join('');	
		},
		_getLeftArrow : function(){
			var opt =this.configs;
			var size = opt.arrowSize;
			var bw = opt.arrowBorderWidth;
			var size2 = size - bw;
			var html = [
				'<b class="nex-tooltip-arrow nex-tooltip-arrow-border" style="border-width: '+size+'px;left:0px; z-index:1;"></b>',
				'<b class="nex-tooltip-arrow nex-tooltip-arrow-bg" style="border-width: '+size2+'px; left:0px; top:'+bw+'px; z-index:2;"></b>'	
			];
			return html.join('');		
		},
		_getRightArrow : function(){
			var opt =this.configs;
			var size = opt.arrowSize;
			var bw = opt.arrowBorderWidth;
			var size2 = size - bw;
			var html = [
				'<b class="nex-tooltip-arrow nex-tooltip-arrow-border" style="border-width: '+size+'px;left:0px; z-index:1;"></b>',
				'<b class="nex-tooltip-arrow nex-tooltip-arrow-bg" style="border-width: '+size2+'px; left:'+(bw*2)+'px; top:'+bw+'px; z-index:2;"></b>'	
			];
			return html.join('');			
		},
		/*
		* 获取箭头
		* pos = top bottom left right
		*/
		getArrow : function( pos ){
			switch(pos) {
				case 'top' : 
					return this._getTopArrow();
					break;	
				case 'bottom' : 
					return this._getBottomArrow();
					break;	
				case 'left' : 
					return this._getLeftArrow();
					break;	
				case 'right' : 
					return this._getRightArrow();
					break;				
			}
		},
		/*
		* 创建一个箭头 返回jQuery对象
		*/
		createArrow : function( pos ){
			var opt = this.configs;
			var pos = pos || 'bottom';
			var html = [
				'<div class="nex-tooltip-arrow-wrap nex-tooltip-arrow-',pos,'">',
					this.getArrow(pos),
				'</div>'
			];
			var arrow = $(html.join(''));
			arrow.width(opt.arrowSize*2);
			arrow.height(opt.arrowSize*2);
			return arrow;	
		}	
	});
}));