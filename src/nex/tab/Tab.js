/*
jquery.nexTabs.js
http://www.extgrid.com/tabs
author:nobo
qq:505931977
QQ交流群:13197510
email:zere.nobo@gmail.com or QQ邮箱

*/
(function( factory ) {
	if ( typeof $define === "function" ) {
		
		$define(['Nex.tab.SimpleTab'], function(){
			
			factory( jQuery );	
		} );
	} else {

		factory( jQuery );
	}
}(function( $ ) {
	//"use strict";
	var tab = Nex.define('Nex.tab.Tab',{
		extend : 'Nex.tab.SimpleTab',
		alias : 'Nex.Tab',
		xtype : 'tabpanel tab',
		configs : function(opt){
			return {
				prefix : 'nextab-',
				borderCls : [opt.borderCls,'nex-tab-border'].join(' '),
				containerCls : [opt.containerCls,'nex-tab'].join(' '),
				autoScrollCls : [opt.autoScrollCls,'nex-tab-auto-scroll'].join(' '),
				tabLayout   : 'top',//top bottom right left
				sideWidth   : 150,//tabLayout为right left 时的宽度
				forceFit    : false,//stab header会自动分配列宽
				tabHeaderCls: '',
				tabBodyCls  : '',
				tabScrollAnimate :　true,
				tabScrollDuration : 200,
				tabScrollEasing : 'easeOutQuad',
				scrollStep  : 100,
				scrollDelay : 100,
				scrollSpeed : 10
			};
		}	
	});
	tab.override({
		sysEvents : function(){
			var self = this;
			var opt = self.configs;
			//必须要先执行
			self.bind("onCreate._sys",self._checkScroll,self);
			
			self.callParent(arguments);
			//检测是需要出现 left right 按钮
			self.bind("onAddTab._sys",self._checkScroll,self);
			self.bind("onRemoveTab._sys",self._checkScroll,self);
			//_checkScrollEdge 必须要在执行_checkScroll后才执行  因为需要检测scrollBar是否创建
			self.bind("onRemoveTab._sys",self._checkScrollEdge,self);
			self.bind("onAddTab._sys",self._isDisabledSTools,self);
			self.bind("onSwitchTab._sys",self.scrollToTab,self);
			self.bind("onTabLayoutChange._sys",self._refreshTabScrollBtn,self);
			self.bind("onSizeChange._sys",self._refreshTabScrollBtn,self);
			
			return self;
		},
		_setTabLayout : function(){
			var self = this;
			var opt=this.configs;
			
			self.callParent(arguments);
			
			if( !self.isInit() ) {
				self.refreshViewSize();
				self.scrollToTab(self.getCurrentTab());
			}
			
			return self;	
		},
		_setLeftAlign : function(){
			var self = this;
			var opt=this.configs;	
			var h = self.getTabHeader();
			var b = self.getTabBody();
			h.addClass( 'nex-stab-header-left' );
			b.addClass( 'nex-stab-body-left' );
			
			var tw = self._getTabItemsWrap();
			tw.css('marginLeft','');
			
			self._removeVerticalView( 'tabHeader' );
			self._setHorizontalView( 'tabHeader',h );
		},
		_setRightAlign : function(){
			var self = this;
			var opt=this.configs;	
			var h = self.getTabHeader();
			var b = self.getTabBody();
			h.addClass( 'nex-stab-header-right' );
			b.addClass( 'nex-stab-body-right' );
			
			var tw = self._getTabItemsWrap();
			tw.css('marginLeft','');
			
			self._removeVerticalView( 'tabHeader' );
			self._setHorizontalView( 'tabHeader',h );
		},
		//水平
		_setHLViewSize : function(){
			var self = this,
				opt=this.configs,
				undef;
			var container = self.getContainer();	
			var header = self.getTabHeader();
			var header_inner = $('#'+opt.id+'_header_inner');
			var body = self.getTabBody();
			var cw = container._width();
			var ch = container._height();
			//getTabHeader
			header._removeStyle('width height left top right');
			header_inner._removeStyle('width height left top right');
			body._removeStyle('margin-left margin-right');
			
			var sideWidth = parseInt(opt.sideWidth,10);
			var bw = cw - sideWidth;
			
			header._outerWidth( sideWidth );
			header_inner._outerWidth( header._width() );
			
			header.css( {
				left : container.css('paddingLeft'),	
				top : container.css('paddingTop')
			} );
			
			body.css('marginLeft',sideWidth);
			
			if( !self.isAutoWidth() ) {
				body._outerWidth( bw );
				$('>.nex-stab-body-item',body)._outerWidth( body._width() );
			} else {
				body._removeStyle( 'width' );
				$('>.nex-stab-body-item',body)._removeStyle( 'width' );
			}
			if( !self.isAutoHeight() ) {
				header._outerHeight( ch );
				header_inner._outerHeight( header._height() );
				//body._outerHeight( ch );
				$('>.nex-stab-body-item',body)._outerHeight( body._height() );
			} else {	
				header._removeStyle( 'height' );		
				header_inner._removeStyle( 'height' );	
				//body._removeStyle( 'height' );		
				$('>.nex-stab-body-item',body)._removeStyle( 'height' );		
			}
		},
		_setHRViewSize : function(){
			var self = this,
				opt=this.configs,
				undef;
			var container = self.getContainer();	
			var header = self.getTabHeader();
			var header_inner = $('#'+opt.id+'_header_inner');
			var body = self.getTabBody();
			var cw = container._width();
			var ch = container._height();
			
			header._removeStyle('width height left top right');
			header_inner._removeStyle('width height left top right');
			body._removeStyle('margin-left margin-right');
			
			var sideWidth = parseInt(opt.sideWidth,10);
			var bw = cw - sideWidth;
			
			header._outerWidth( sideWidth );
			header_inner._outerWidth( header._width() );
			
			header.css( {
				right : container.css('paddingRight'),	
				top : container.css('paddingTop')
			} );
			
			body.css('marginRight',sideWidth);
			
			if( !self.isAutoWidth() ) {
				body._outerWidth( bw );
				$('>.nex-stab-body-item',body)._outerWidth( body._width() );
			} else {
				body._removeStyle( 'width' );
				$('>.nex-stab-body-item',body)._removeStyle( 'width' );
			}
			if( !self.isAutoHeight() ) {
				header._outerHeight( ch );
				header_inner._outerHeight( header._height() );
				//body._outerHeight( ch );
				$('>.nex-stab-body-item',body)._outerHeight( body._height() );
			} else {	
				header._removeStyle( 'height' );		
				header_inner._removeStyle( 'height' );	
				//body._removeStyle( 'height' );		
				$('>.nex-stab-body-item',body)._removeStyle( 'height' );		
			}
		},
		//垂直
		_setVViewSize : function(){
			var self = this,
				opt=this.configs,
				undef;
			var container = self.getContainer();	
			var theader = self.getTabHeader();
			var theader_inner = $('#'+opt.id+'_header_inner');
			var body = self.getTabBody();
			var cw = container._width();
			var ch = container._height();
			
			theader._removeStyle('width height left top right');
			theader_inner._removeStyle('width height left top right');
			body._removeStyle('margin-left margin-right');
			
			if( !self.isAutoWidth() ) {
				theader._outerWidth( cw );
				var hw = theader._width();
				var isPre = String(opt.tabHeaderWidth).indexOf('%') === -1 ? false : true; 
				var iw = parseFloat( opt.tabHeaderWidth );
				if( isPre ) {
					iw = hw * ( iw/100 );	
				}
				iw = parseInt( iw );
				var w = hw;
				
				if( iw ) {
					w = iw
				}
				
				theader_inner.width( w );	
				//header_inner._outerWidth( hw );
				//body._outerWidth( cw );
				$('>.nex-stab-body-item',body)._outerWidth( body._width() );
			} else {
				theader._removeStyle( 'width' );
				if( !parseInt( opt.tabHeaderWidth ) ) {
					theader_inner._removeStyle( 'width' );
				}
				//body._removeStyle( 'width' );
				$('>.nex-stab-body-item',body)._removeStyle( 'width' );
			}
			if( !self.isAutoHeight() ) {
				//var th = ch - header._outerHeight();
				//body._outerHeight( th );
				$('>.nex-stab-body-item',body)._outerHeight( body._height() );
			} else {
				//body._removeStyle( 'height' );		
				$('>.nex-stab-body-item',body)._removeStyle( 'height' );		
			}
		},
		doSetViewSize : function(){
			var self = this,
				opt=this.configs,
				undef;
			var tabLayout = String(opt.tabLayout).toLowerCase();
			
			//Nex.panel.Panel.fn._setViewSize.apply( this,arguments );	
			self.superclass.superclass.doSetViewSize.apply( this,arguments );	
			
			switch( tabLayout ) {
				case 'left':
					self._setHLViewSize();
					break;
				case 'right':
					self._setHRViewSize();
					break;
				default : 
					self._setVViewSize();
					break; 	
			};
		},
		_getTabItemsWrap : function(){
			var opt = this.configs;	
			return $('#'+opt.id+'_items_t');
		},
		_getTabHeaderInner : function( d ){
			var self = this;
			var opt = self.configs;	
			var html = [];
			
			var closeCls = d.closable ? 'nex-stab-header-item-closable' : '';
			var hasIcon = d.icon || d.iconCls ? true : false;
			var disabledCls = !d.disabled ? '' : 'nex-stab-header-item-disabled';
			html.push( '<div class="nex-stab-header-item nex-tab-header-item '+ [disabledCls,closeCls,d.hcls].join(' ') +'" id="'+opt.id+'_'+d.id+'_header" tid="'+d.id+'"><div class="nex-stab-item-inner">' );	
			if( $.isFunction(opt.titleFormat) ) {
				d.title = opt.titleFormat.call( self,d.title,d,opt );	
			}
			if( hasIcon ) {
				var style = d.icon ? ("background-image: url("+d.icon+")") : "";
				html.push( '<span class="nex-stab-item-icon '+d.iconCls+'" style="'+style+'"></span>' );	
			}
			html.push( '<span class="nex-stab-item-text">'+d.title+'</span>' );
			if( closeCls ) {
				html.push( '<a href="javascript:void(0);" class="nex-stab-item-close"></a>' );			
			}
			html.push( '</div></div>' );	
			
			return html.join('');	
		},
		_getTabTools : function(){
			var html = [];
			html.push('<div class="nex-tab-tool nex-tab-left"></div>');	
			html.push('<div class="nex-tab-tool nex-tab-right"></div>');	
			return html.join('');
		},
		_getTabHeaderTpl : function(){
			var self = this;
			var opt = self.configs;	
			var html = [
				'<div class="nex-stab-header nex-tab-header '+opt.tabHeaderCls+'" id="'+opt.id+'_tab_header">',
					'<div id="'+opt.id+'_header_inner" class="nex-stab-header-inner nex-tab-header-inner">',//辅助作用
					'<div id="'+opt.id+'_items_wraper" class="nex-stab-header-wrap nex-tab-header-wrap">',
					'<div id="'+opt.id+'_items_t" class="nex-tab-header-wrap-inner">'
			];
			var items = opt.items;
			var len = items.length;
			
			for( var i=0;i<len;i++ ) {
				html.push( self._getTabHeaderInner( items[i] ) );
			}
			
			html.push( '</div><div class="nex-tab-clear"></div></div>' );
			html.push( '<div id="'+opt.id+'_tools" class="nex-tab-tools clearFix">'+self._getTabTools()+'</div>' );
			html.push( '</div></div>' );
			return html.join('');
		},
		__scroll_t : 0,
		__scroll_t2 : 0,
		//重载
		_setTabEvents : function(){
			var self = this;
			var opt = self.configs;	
			
			self.callParent(arguments);
			//Nex.tab.SimpleTab.fn._setTabEvents.apply(self,arguments);	
			var tool = self._getScrollTools();
			var theader = self.getTabHeader();
			tool.disableSelection();
			theader.undelegate('._tool')
			theader.delegate('.nex-tab-left',{
				'click._tool' : function(e){
					if( $(this).hasClass('nex-tab-tool-disabled') ) {
						return;	
					}
					var r = self.fireEvent('onTabLeftClick',[opt]);
					if( r !== false ) {
						self.scrollTabLeft();	
					}	
				},
				'mouseenter._tool' : function(e){
					if( $(this).hasClass('nex-tab-tool-disabled') ) {
						return;	
					}
					self.fireEvent('onTabLeftOver',[opt]);	
				},
				'mouseleave._tool' : function(e){
					if( $(this).hasClass('nex-tab-tool-disabled') ) {
						return;	
					}
					self.fireEvent('onTabLeftOut',[opt]);	
				},
				'mousedown._tool' : function(){
					if( $(this).hasClass('nex-tab-tool-disabled') ) {
						return;	
					}	
					self.fireEvent('onTabLeftMouseDown',[opt]);	
					if( self.__scroll_t ){
						clearTimeout( self.__scroll_t );	
						clearTimeout( self.__scroll_t2 );	
						self.__scroll_t = 0;
						self.__scroll_t2 = 0;
					}
					//_getCurrentLeft
					self.__scroll_t = setTimeout(function(){
						self.__scroll_t2 = setInterval(function(){
							self._scrollTab( self._getCurrentLeft() + 10,false );
						},opt.scrollSpeed);
					},opt.scrollDelay);
					$(document).one('mouseup._tool',function(){
						clearTimeout( self.__scroll_t );	
						clearTimeout( self.__scroll_t2 );	
						self.__scroll_t = 0;
						self.__scroll_t2 = 0;
					});
				},
				'mouseup._tool' : function(){
					if( $(this).hasClass('nex-tab-tool-disabled') ) {
						return;	
					}	
					self.fireEvent('onTabLeftMouseUp',[opt]);	
					clearTimeout( self.__scroll_t );	
					clearTimeout( self.__scroll_t2 );	
					self.__scroll_t = 0;
					self.__scroll_t2 = 0;
				}
			}).delegate('.nex-tab-right',{
				'click._tool' : function(e){
					if( $(this).hasClass('nex-tab-tool-disabled') ) {
						return;	
					}
					var r = self.fireEvent('onTabRightClick',[opt]);	
					if( r !== false ) {
						self.scrollTabRight();	
					}	
				},
				'mouseenter._tool' : function(e){
					if( $(this).hasClass('nex-tab-tool-disabled') ) {
						return;	
					}
					self.fireEvent('onTabRightOver',[opt]);	
				},
				'mouseleave._tool' : function(e){
					if( $(this).hasClass('nex-tab-tool-disabled') ) {
						return;	
					}
					self.fireEvent('onTabRightOut',[opt]);	
				},
				'mousedown._tool' : function(){
					if( $(this).hasClass('nex-tab-tool-disabled') ) {
						return;	
					}	
					self.fireEvent('onTabRightMouseDown',[opt]);	
					if( self.__scroll_t ){
						clearTimeout( self.__scroll_t );	
						clearTimeout( self.__scroll_t2 );	
						self.__scroll_t = 0;
						self.__scroll_t2 = 0;
					}
					//_getCurrentLeft
					self.__scroll_t = setTimeout(function(){
						self.__scroll_t2 = setInterval(function(){
							self._scrollTab( self._getCurrentLeft() - 10,false );
						},opt.scrollSpeed);
					},opt.scrollDelay);
					$(document).one('mouseup._tool',function(){
						clearTimeout( self.__scroll_t );	
						clearTimeout( self.__scroll_t2 );	
						self.__scroll_t = 0;
						self.__scroll_t2 = 0;
					});
				},
				'mouseup._tool' : function(){
					if( $(this).hasClass('nex-tab-tool-disabled') ) {
						return;	
					}	
					self.fireEvent('onTabRightMouseUp',[opt]);	
					clearTimeout( self.__scroll_t );	
					clearTimeout( self.__scroll_t2 );	
					self.__scroll_t = 0;
					self.__scroll_t2 = 0;
				}		
			});
		
			return this;
		},
		_removeTab : function( tid ){
			var self = this,
				opt=this.configs;
			var tabs = opt.items;	
			var curr = self.getCurrentTab();
			var i = 0;
			var len = tabs.length;
			for( ;i<len;i++ ) {
				if( tabs[i]['disabled'] ) continue;
				if( tabs[i]['id'] == tid ) break;	
			}
			
			if( curr == tid ) {
				var t = i+1 > len-1 ? i-1 : i+1;
				if( tabs[t] && !tabs[t]['disabled'] ) {
					self.switchTab(tabs[t]['id']);	
				} else {
					self._currentTab = null;	
				}
			}
			
			self.empytTabContent( tid );
			
			var th = self.getTabItemHeader( tid );
			var tb = self.getTabItemBody( tid );	
			
			th.remove();
			tb.remove();
			
			delete self._tabItems[tid];
			
			tabs.splice(i,1); 	
			
			return self;	
		},
		_disabledTabLeft : function(){
			var self = this;
			var opt = self.C();
			var scrollBar = self._getScrollTools();	
			$('.nex-tab-left',scrollBar).addClass('nex-tab-tool-disabled');
		},
		_disabledTabRight : function(){
			var self = this;
			var opt = self.C();
			var scrollBar = self._getScrollTools();		
			$('.nex-tab-right',scrollBar).addClass('nex-tab-tool-disabled');
		},
		_enableTabLeft : function(){
			var self = this;
			var opt = self.C();
			var scrollBar = self._getScrollTools();	
			$('.nex-tab-left',scrollBar).removeClass('nex-tab-tool-disabled');
		},
		_enableTabRight : function(){
			var self = this;
			var opt = self.C();
			var scrollBar = self._getScrollTools();		
			$('.nex-tab-right',scrollBar).removeClass('nex-tab-tool-disabled');
		},
		/*
		*检测left right btn是否可以禁用
		*/
		_isDisabledSTools : function(){
			var self = this;
			var opt = self.configs;	
			
			if( opt.tabLayout !== 'top' && opt.tabLayout !== 'bottom' ) return;
				
			var wrap = $('#'+opt.id+'_header_inner');
			var scrollBar = self._getScrollTools();
			var ul = $('#'+opt.id+'_items_t');
			var left = 0;
			if( self.__lastLeft !== null ) {
				left = self.__lastLeft;
			} else {
				left = parseInt(ul.css('marginLeft'));
				left = isNaN( left ) ? 0 : left;
			}
			//left
			if( left>=0 ) {
				self._disabledTabLeft();	
			} else {
				self._enableTabLeft();		
			}
			//right
			var wrap_w = wrap.width()-scrollBar.outerWidth();
			var width = ul.outerWidth();
			var diff = wrap_w - width;
			diff = diff >= 0 ? 0 : diff;
			if( diff>=0 || Math.abs(left)>=Math.abs(diff) ) {
				self._disabledTabRight();		
			} else {
				self._enableTabRight();	
			}
		},
		/*
		*...scrollTab 滚动指定宽度
		*/
		__lastLeft : null,
		_scrollTab : function(left,func){
			var self = this;
			var opt = self.configs;	
			
			if( opt.tabLayout !== 'top' && opt.tabLayout !== 'bottom' ) return;
			
			var ul = $('#'+opt.id+'_items_t');
			var wrap = $('#'+opt.id+'_header_inner');
			
			var wrap_w = wrap.width()- self._getScrollBarWidth();
			var width = ul.outerWidth();
			var diff = wrap_w - width;
			diff = diff >= 0 ? 0 : diff;
			
			left = left >= 0 ? 0 : left;
			left = Math.abs( left ) > Math.abs(diff) ? diff : left;
			
			if( self.__lastLeft !== null && self.__lastLeft === left ) {
				return self;	
			}
			
			self.__lastLeft = left;
			var ul = $('#'+opt.id+'_items_t');
			if( !opt.tabScrollAnimate || func === false ) {
				ul.css('marginLeft',left);	
			} else {
				ul.stop(true,true)
				  .animate({
						marginLeft : left	   
					},opt.tabScrollDuration,opt.tabScrollEasing,function(){
						if( $.isFunction( func ) ) {
							func.call(self);	
						}
					});
			}
			/*检测是否滚到到边缘*/	
			self._isDisabledSTools();
			return self;
		},
		_getCurrentLeft : function(){
			var self = this;
			var opt = self.configs;
			
			if( opt.tabLayout !== 'top' && opt.tabLayout !== 'bottom' ) return;
			
			if( self.__lastLeft !== null ) {
				return self.__lastLeft;	
			}
			
			var ul = $('#'+opt.id+'_items_t');	
			var left = ul.css('marginLeft');
			return isNaN( parseFloat( left ) ) ? 0 : parseFloat( left );
		},
		//水平
		_getScrollToTabPos1 : function( item,wrap,bd,pos ){
			var self = this;
			var opt = self.configs;
			
			//if( opt.tabLayout !== 'top' && opt.tabLayout !== 'bottom' ) return;
			
			var args = arguments;
			var _lp = args[ args.length-1 ];
			var wp = wrap || item.parent();
			var bd = bd;
			var f = item;
			var pos = !isNaN(parseInt( _lp )) ? parseInt( _lp ) : wp.css('marginLeft');
			var sLeft = 0;
			var _sLeft = pos;
			_sLeft = isNaN( parseFloat( _sLeft ) ) ? 0 : parseFloat( _sLeft );
			
			var offset = bd.offset();
			var borderWidth = parseInt(bd.css('borderLeftWidth')) || 0;
			var paddingLeft = parseInt(bd.css('paddingLeft')) || 0;
			//校正可视区域
			offset.left += borderWidth + paddingLeft;
			var w = bd.width() - self._getScrollBarWidth();
			
			var fo = f.offset();
			var fw = f.outerWidth();
			
			var outerWidth = 0;
			if( offset.left > fo.left ) {
				outerWidth = offset.left - fo.left;
			} else if( (offset.left+w) < (fo.left+fw) ) {
				outerWidth = (offset.left+w) - (fo.left+fw);
			}
			
			sLeft = _sLeft + outerWidth;
			
			return sLeft;	
		},
		//垂直
		_getScrollToTabPos2 : function( item,bd,pos ){
			var self = this;
			var opt = self.configs;
			
			var args = arguments;
			var _lp = args[ args.length-1 ];
			//var wp = wrap || item.parent();
			//var bd = bd;
			var f = item;
			var pos = !isNaN(parseInt( _lp )) ? parseInt( _lp ) : bd.scrollTop();
			var sTop = 0;
			var _sTop = pos;
			_sTop = isNaN( parseFloat( _sTop ) ) ? 0 : parseFloat( _sTop );
			
			var offset = bd.offset();
			var borderTop = parseInt(bd.css('borderTopWidth')) || 0;
			var paddingTop = parseInt(bd.css('paddingTop')) || 0;
			//校正可视区域
			offset.top += borderTop + paddingTop;
			
			var h = bd.height();
			
			var fo = f.offset();
			var fh = f.outerHeight();
		
			var outerHeight = 0;
			if( offset.top > fo.top ) {
				outerHeight = fo.top - offset.top;
			} else if( (offset.top+h) < (fo.top+fh) ) {
				outerHeight = (fo.top+fh) - (offset.top+h);
			}
			
			sTop = _sTop + outerHeight;
			
			return sTop;	
		},
		scrollToTab : function( tid ){
			var self = this;
			var opt = self.configs;
			
			if( !self._toolBarShow ) {
				return;	
			}
			
			var bd = $('#'+opt.id+'_header_inner');//nextab-7_header_inner
			var wrap = $('#'+opt.id+'_items_t');//_items_t	
			var item = self.getTabItemHeader(tid);
			if( !item.length ) return;
			var pos = 0;
			if( opt.tabLayout === 'top' || opt.tabLayout === 'bottom' ) {
				pos = self._getScrollToTabPos1( item,wrap,bd );
				self._scrollTab( pos );
			} else {
				var sTop = bd.scrollTop();
				pos = self._getScrollToTabPos2( item,bd,bd.scrollTop() );
				bd.scrollTop( Math.abs(pos) );
			}
		},
		scrollTabLeft : function(){
			var self = this;
			var opt = self.configs;
			
			if( !self._toolBarShow ) {
				return;	
			}
			
			if( opt.tabLayout !== 'top' && opt.tabLayout !== 'bottom' ) return;
			
			var ul = $('#'+opt.id+'_items_t');
			var left = ul.css('marginLeft');
			left = isNaN( parseFloat( left ) ) ? 0 : parseFloat( left );
			left += opt.scrollStep;
		
			self._scrollTab( left );
		},
		scrollTabRight : function(){
			var self = this;
			var opt = self.configs;
			
			if( !self._toolBarShow ) {
				return;	
			}
			
			if( opt.tabLayout !== 'top' && opt.tabLayout !== 'bottom' ) return;
			
			var ul = $('#'+opt.id+'_items_t');
			
			var left = ul.css('marginLeft');
			left = isNaN( parseFloat( left ) ) ? 0 : parseFloat( left );
			
			left -= opt.scrollStep;
			
			self._scrollTab( left );
		},
		//vertical horizontal
		_getTabCast : function(){
			var self = this;
			var opt = self.configs;	
			if( opt.tabLayout === 'top' || opt.tabLayout === 'bottom' ) {
				return 'horizontal';	
			} else {
				return 'vertical';		
			}	
		},
		/*
		*检测tab选项卡是否需要添加滚动按钮 只支持top bottom
		*/
		_toolBarShow : false,
		_checkScroll : function(){
			var self = this;
			var opt = self.configs;	
			
			var inner_header = $('#'+opt.id+'_header_inner');//nextab-7_header_inner
			var inner_items = $('#'+opt.id+'_items_t');//_items_t
			
			var isScroll = false;
			var cast = self._getTabCast();
			if( cast === 'horizontal' ) {
				isScroll = inner_header._width() > inner_items._width() ? false : true;
			} else {
				isScroll = inner_header._height() > inner_items._height() ? false : true;	
			}
			
			self._toolBarShow = isScroll;
		
			if( cast !== 'horizontal' ) return self;
			
			var scrollBar = self._getScrollTools();
			
			if( isScroll ) {
				scrollBar.stop(true,true).fadeIn();
			} else {
				scrollBar.stop(true,true).fadeOut();
			}
			return self;
		},
		_getScrollTools : function(){
			var opt = this.configs;		
			return $('#'+opt.id+'_tools');
		},
		_getScrollBarWidth : function(){
			var opt = this.configs;	
			if( this._toolBarShow )	{
				return $('#'+opt.id+'_tools').outerWidth();	
			}
			return 0;
		},
		/*删除tab时 会自动滚动到边缘 防止删除最后的tab而不会自动滚动*/
		_checkScrollEdge : function(){
			var self = this;
			var opt = self.C();	
			if( opt.tabLayout !== 'top' && opt.tabLayout !== 'bottom' ) return;
			var inner_header = $('#'+opt.id+'_header_inner');//nextab-7_header_inner
			var inner_items = $('#'+opt.id+'_items_t');//_items_t
			var wrap_w = inner_header._width()-self._getScrollBarWidth();
			var items_w = inner_items.outerWidth();
			var ml = parseInt(inner_items.css('marginLeft'));
			ml = isNaN( ml ) ? 0 : ml;
			var visible_w = items_w - Math.abs( ml );
			var diff = wrap_w - visible_w;	
			var left = ml + diff;
			left = left > 0 ? 0 : left;
			if( diff>=0 ) {
				self._scrollTab( left );
			}
		},
		_refreshTabScrollBtn : function( align ){
			var cast = this._getTabCast();
			if( cast !== 'horizontal' ) {
				var tools = this._getScrollTools();
				tools.stop(true,true).fadeOut();
			}
			this._checkScroll();
			this._checkScrollEdge();
			this.scrollToTab( this.getCurrentTab() );		
		}
	});
}));