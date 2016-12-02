/*
SimpleTab.js
http://www.extgrid.com/tabs
author:nobo
qq:505931977
QQ交流群:13197510
email:zere.nobo@gmail.com or QQ邮箱

*/
(function( factory ) {
	if ( typeof $define === "function" ) {
		
		$define(['Nex.panel.Panel'], function(){
			
			factory( jQuery );	
		} );
	} else {

		factory( jQuery );
	}
}(function( $ ) {
	//"use strict";
	var tab = Nex.define('Nex.tab.SimpleTab',{
		extend : 'Nex.panel.Panel',
		alias : 'Nex.SimpleTab',
		xtype : 'simpletab stab stabpanel',
		configs : function(opt){
			return {
				prefix : 'nexstab-',
				///_initMethod : opt._initMethod.concat(['_initTabStart']),
				autoResize : true,
				renderTo : document.body,
				disabledItems : true,
				border : false,
				autoScroll : false,
				denyEvents : true,
				borderCls : [opt.borderCls,'nex-stab-border'].join(' '),
				containerCls : [opt.containerCls,'nex-stab'].join(' '),
				autoScrollCls : [opt.autoScrollCls,'nex-stab-auto-scroll'].join(' '),
				tabHeaderSelectionable : true,
				firstShowAnim : true,//
				animSwitch : false,//开启动画方式切入tab
				switchEasing : 'easeOutCirc',
				switchDuration : 200,
				showTabTips : false,//预留--
				tabLayout : 'top',//top bottom
				forceFit : false,//tab header会自动分配列宽
				tabHeaderCls : '',
				tabHeaderWidth : 0,//100%
				tabBodyCls : '',
				/*隐藏的Tab会设置为display:none*/
				hideToNone : true,
				width : '100%',
				height : '100%',
				lazyLoad : true,//切换Tab时才生成Tab内容
				titleFormat : null,//标题格式化
				defaultShowTab : null,
				_tabsData : function(){
					return {
						id : null,
						title : '',
						html : '',
						hcls : '',
						bcls : '',
						style : {},
						padding : null,
						autoShow : false,
						autoScroll : false,
						closable : false,
						items : [],
						icon : '',
						iconCls : '',
						disabled : false
					}
				},
				defaults : {},
				items : [],
				views : {},
				cls : '',
				switchOnType : 1//showOnType : 1,//0 mouseover 1 click 
				//events : {}
			};	
		}		
	});
	tab.override({
		initComponent : function(){
			this.callParent(arguments);
			this.initTab();
			return this;
		}, 
		initTab : function(){
			var self = this;
			var opt = self.configs;
			opt.items = $.isArray(opt.items) ? opt.items.concat([]) : [];
			self._initTabsData()
				._setTabHeader()
				//._setTabBody()
				._setTabEvents()
				._setTabLayout();	
		},
		sysEvents : function(){
			var self = this;
			var opt = self.configs;
			
			self.callParent(arguments);
			
			//添加tab 样式
			self.bind('onHeaderCreate._sys',function( el ){
				el.addClass('nex-panel-tab-header');
				$('>.nex-panel-tools',el).addClass('nex-panel-tab-tools')
			},self);
			self.bind('onBodyCreate._sys',function( el ){
				el.addClass('nex-stab-body');
			},self);
			self.bind('onFooterCreate._sys',function( el ){
				el.addClass('nex-stab-footer');
			},self);
			
			self.bind("onCreate._sys",self._initTab,self);
			self.bind("onTabClick._sys",self._clickToShow,self);
			self.bind("onTabOver._sys",self._setTabOverCls,self);
			self.bind("onTabOver._sys",self._overToShow,self);
			self.bind("onTabOut._sys",self._unsetTabOverCls,self);
			
			return self;
		},
		_parseTabData : function(d){
			var self = this;
			var opt = self.configs;	
			
			if( $.isPlainObject( d ) && d.__init ) {
				return d;	
			} 
			
			var d = $.extend({},opt._tabsData.call( self ),opt.defaults,d);
			if( d.id === null || d.id==="" || typeof d.id !== 'string' ) {
				d.id = 'tab_'+Nex.uuid();	
			}
			d.__init = true;
			
			self._tabItems[d.id] = d;
			
			return d;
		},
		_tabItems : {},
		_initTabsData : function(){
			var self = this;
			var opt = self.configs;	
			self._tabItems = {};
			var tab = {};
			var len = opt.items.length;
			for( var i=0;i<len;i++ ) {
				var item = opt.items[i];
				tab = self._parseTabData( item );
				opt.items[i] = tab;
			}
			return self;
		},
		//设置items
		setItems : function( items ){
			var list = $.isArray(items) ? items.concat([]) : [];
			this.C( 'items',list );
			return this._initTabsData();	
		},
		getItems : function(){
			return this.configs.items;	
		},
		getItemData : function( id ){
			return this._tabItems[ id ];	
		},
		getTabData : function( id ){
			return this._tabItems[ id ];		
		},
		_doSetViewSize : function(){
			var self = this,
				opt=this.configs,
				undef;
			
			self.callParent(arguments);
				
			var container = self.getContainer();	
			var theader = self.getTabHeader();
			//tabHeaderWidth
			var theader_inner = $('#'+opt.id+'_header_inner');
			
			var body = self.getTabBody();
			
			var cw = container._width();
			var ch = container._height();
			if( !self.isAutoWidth() ) {
				theader.width( cw );
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
				//body._outerWidth( cw );
				//==========
				if( opt.forceFit ) {
					$('.nex-stab-header-wrap',theader).width( w );
				} else {
					$('.nex-stab-header-wrap',theader)._removeStyle( 'width' );	
				}
				
				$('>.nex-stab-body-item',body)._outerWidth( body._width() );
			} else {
				theader._removeStyle( 'width' );
				if( !parseInt( opt.tabHeaderWidth ) ) {
					theader_inner._removeStyle( 'width' );
				}
				//body._removeStyle( 'width' );
				if( opt.forceFit ) {
					$('.nex-stab-header-wrap',theader)._removeStyle( 'width' );	
				}
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
		_clickToShow : function(tid,d,opt){
			var self = this;
			var opt = self.configs;
			if( opt.switchOnType === 1 ) {
				self.switchTab(tid);
			}
		},
		_overToShow : function(tid,d,opt){
			var self = this;
			var opt = self.configs;
			if( opt.switchOnType === 0 ) {
				self.switchTab(tid);	
			}	
		},
		unselectHeader : function(){
			var self = this;
			var opt = self.configs;	
			opt.views['header'].bind('selectstart.tabs',function(){return false;});	
			return self;
		},
		/*
		*tabLayout top bottom
		*/
		_getTabHeaderInner : function( d ){
			var self = this;
			var opt = self.configs;	
			var html = [];
			
			var closeCls = d.closable ? 'nex-stab-header-item-closable' : '';
			var hasIcon = d.icon || d.iconCls ? true : false;
			var disabledCls = !d.disabled ? '' : 'nex-stab-header-item-disabled';
			html.push( '<td><div class="nex-stab-header-item '+ [disabledCls,closeCls,d.hcls].join(' ') +'" id="'+opt.id+'_'+d.id+'_header" tid="'+d.id+'"><div class="nex-stab-item-inner">' );	
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
			html.push( '</div></div></td>' );	
			
			return html.join('');	
		},
		_getTabHeaderTpl : function(){
			var self = this;
			var opt = self.configs;	
			var html = [
				'<div class="nex-stab-header '+opt.tabHeaderCls+'" id="'+opt.id+'_tab_header">',
					'<div id="'+opt.id+'_header_inner" class="nex-stab-header-inner">',//辅助作用
					'<table cellpadding="0" cellspacing="0" border="0" class="nex-stab-header-wrap">',
						'<tbody><tr id="'+opt.id+'_items_wraper">'
			];
			var items = opt.items;
			var len = items.length;
			
			for( var i=0;i<len;i++ ) {
				html.push( self._getTabHeaderInner( items[i] ) );
			}
			
			html.push( '</tr></tbody></table></div></div>' );
			return html.join('');
		},
		_setTabHeader : function(){
			var self = this;
			var opt = self.configs;	
			var container = self.getContainer();
			var theader = $( self._getTabHeaderTpl() );
			container.append(theader);
			opt.views['tabHeader'] = theader;
			if( !opt.tabHeaderSelectionable ) {
				theader.disableSelection();	
			}
			self.fireEvent("onTabHeaderCreate",[theader],opt);
			return self;
		},
		_setTabEvents : function(){
			var self = this,
				opt=this.configs;
			var theader = self.getTabHeader();	
			theader.undelegate('._tab').delegate('.nex-stab-header-item',{
				'click._tab' : function(e){
					if( $(this).hasClass('nex-stab-header-item-disabled') ) {
						return;	
					}
					var tid = $(this).attr('tid');
					var data = self.getTabData( tid );
					self.fireEvent('onTabClick',[tid,data,opt]);	
				},
				'dblclick._tab' : function(e){
					if( $(this).hasClass('nex-stab-header-item-disabled') ) {
						return;	
					}
					var tid = $(this).attr('tid');
					var data = self.getTabData( tid );
					self.fireEvent('onTabDblClick',[tid,data,opt]);		
				},
				'mouseenter._tab' : function(e){
					if( $(this).hasClass('nex-stab-header-item-disabled') ) {
						return;	
					}
					var tid = $(this).attr('tid');
					var data = self.getTabData( tid );
					self.fireEvent('onTabOver',[tid,data,opt]);	
				},
				'mouseleave._tab' : function(e){
					if( $(this).hasClass('nex-stab-header-item-disabled') ) {
						return;	
					}
					var tid = $(this).attr('tid');
					var data = self.getTabData( tid );
					self.fireEvent('onTabOut',[tid,data,opt]);		
				}
			});
			
			theader.undelegate('._tabc').delegate( '.nex-stab-item-close',{
				'click._tabc' : function(e){
					var $p = $(this).closest('.nex-stab-header-item');
					if( $p.hasClass('nex-stab-header-item-disabled') ) {
						return;	
					}
					
					var tid = $p.attr('tid');
					
					self.removeTab( tid );	
					
					e.preventDefault();
					e.stopPropagation();
				}	
			} );
			
			self.fireEvent("onSetTabEvents",[opt]);
			return self;
		},
		_setTabLayout : function(){
			var self = this;
			var opt=this.configs;
			
			var tabLayout = (opt.tabLayout+'').toLowerCase();
			opt.tabLayout = tabLayout;
			self._removeAlignCls();
			
			switch( tabLayout ) {
				case 'top' :
					self._setTopAlign();
					break;
				case 'bottom' :
					self._setBottomAlign();
					break;
				case 'right' :
					self._setRightAlign();
					break;	
				case 'left' :
					self._setLeftAlign();
					break;		
				default : 	
					self._setTopAlign();
					break;
			}
			
			return self;	
		},
		setTabLayout : function( align ){
			var self = this;
			var opt=this.configs;	
			
			var r = self.fireEvent("onBeforeTabLayoutChange",[align,opt]);
			if( r === false ) return r;
			
			opt.tabLayout = align;
			self._setTabLayout();
			
			self.fireEvent("onTabLayoutChange",[align,opt]);
			
			return self;
		},
		_removeAlignCls : function(){
			var self = this;
			var opt=this.configs;	
			var h = self.getTabHeader();
			var b = self.getTabBody();
			h.removeClass('nex-stab-header-top nex-stab-header-bottom nex-stab-header-right nex-stab-header-left');
			b.removeClass('nex-stab-body-top nex-stab-body-bottom nex-stab-body-right nex-stab-body-left');	
			//防止设置height 而影响top bottom的高度设置
			h.css({
				height : ''	
			});
		},
		_setTopAlign : function(){
			var self = this;
			var opt=this.configs;	
			var c = self.getContainer();
			var ph = self.getHeader();
			var h = self.getTabHeader();
			var b = self.getTabBody();
			h.addClass( 'nex-stab-header-top' );
			b.addClass( 'nex-stab-body-top' );
			if( ph ) {
				ph.after( h )	
			} else {
				c.prepend( h );	
			}
			self._removeHorizontalView( 'tabHeader' );
			self._setVerticalView( 'tabHeader',h );
		},
		_setBottomAlign : function(){
			var self = this;
			var opt=this.configs;	
			var c = self.getContainer();
			var h = self.getTabHeader();
			var b = self.getTabBody();
			h.addClass( 'nex-stab-header-bottom' );
			b.addClass( 'nex-stab-body-bottom' );
			c.append( h );
			self._removeHorizontalView( 'tabHeader' );
			self._setVerticalView( 'tabHeader',h );
		},
		_setTabOverCls : function( tid,data,opt ){
			var self = this;
			var tab = self.getTabItemHeader( tid );
			tab.addClass('nex-stab-header-item-over');
		},
		_unsetTabOverCls : function( tid,data,opt ){
			var self = this;
			var tab = self.getTabItemHeader( tid );
			tab.removeClass('nex-stab-header-item-over');
		},
		getTabHeader : function(){
			var opt=this.configs;	
			return opt.views['tabHeader'];		
		},
		getTabBody : function(){
			var opt=this.configs;	
			return opt.views['body'];		
		},
		getTabItemHeader : function( tid ){
			var opt = this.configs;
			return $('#'+opt.id+'_'+tid+'_header');	
		},
		getTabItemBody : function( tid ){
			var opt = this.configs;
			return $('#'+opt.id+'_'+tid+'_body');			
		},
		/*
		*清空tab内容
		*/
		empytTabContent : function(tid){
			var self = this;
			var opt = self.C();		
			var tbody = self.getTabItemBody( tid );
			tbody.empty();
			Nex.gc();
			return self;
		},
		/*
		*向tab追加内容
		*/
		addTabContent : function(tid,items){
			var self = this,undef;
			var opt = self.C();
			if( items === undef ) return;
			var tbody = self.getTabItemBody( tid );
			if( tbody.length ) {
				self.addComponent( tbody,items );	
			}
			return self;
		},
		/*
		*更新指定tab的body大小
		*/
		_resizeTabItem : function( id ){
			var self = this,
				opt=this.configs,
				undef;
			var container = self.getContainer();	
			var header = self.getTabHeader();
			var body = self.getTabBody();
			var tbd = self.getTabItemBody( id );
			if( !self.isAutoWidth() ) {
				var cw = body._width();
				tbd._outerWidth( cw );
			} else {
				tbd._removeStyle( 'width' );
			}//nex-stab-header-item
			if( !self.isAutoHeight() ) {
				var th = body._height();
				tbd._outerHeight( th );
			} else {
				tbd._removeStyle( 'height' );			
			}	
			return self;
		},
		/*
		*创建指定的Tab内容
		*/
		_setTabBodyItem : function( tid ){
			var self = this,
				opt=this.configs;
			var data = self.getTabData( tid );
			if( !data ) return self;
			//var body = $('#'+opt.id+'_tab_body');	
			var body = self.getTabBody();		
			//self.getTabItemBody( tid )
			if( self.getTabItemBody( tid ).length ) {
				return self;	
			}
			
			var bd = $('<div class="'+['nex-stab-body-item',data.bcls].join(' ')+'" id="'+opt.id+'_'+data.id+'_body" tid="'+data.id+'"></div>');		
			body.append(bd);
			if( data.padding ) {
				bd.css( 'padding',data.padding );		
			}
			
			bd.css( data.style );
			
			if( data.autoScroll ) {
				bd.addClass('nex-stab-body-item-auto-scroll');	
			}
			
			self._resizeTabItem( tid );
			
			var items = data['html'];
			self.addComponent( bd,items );
			var items = data['items'];
			self.addComponent( bd,items );
			
			return self;
		},
		getCurrentTab : function(){
			var self = this,
				opt=this.configs;
			if( self._currentTab !== null ) {
				return 	self._currentTab;
			}
			var header = self.getTabHeader();//$('#'+opt.id+'_tab_header');
			
			var ls = $('.nex-stab-header-item-selected',header);
			if( ls.length ) {
				return ls.attr('tid');	
			}
			return null;
		},
		getActiveTab : function(){
			return this.getCurrentTab();	
		},
		getCurrentTabData : function(){
			return this.getTabData( this.getCurrentTab() );	
		},
		_isAfterActiveTab : function( tid,otid ){
			var self = this,
				opt=this.configs;
			//默认是在后面的 after = true	
			var after = true;	
			var curr = otid;
			if( curr === null ) return after;
			if( tid === curr ) return after;
			
			$.each( opt.items,function( i,d ){
				//如果d.id == curr 先找到， 那么 tid就是在 curr后面 跳出循环 直接返回after
				if( d.id === curr ) {
					after = true;
					return false;	
				}
				//如果id == tid 那么先找到tid ，那就实在curr前面 跳出循环
				if( d.id === tid ) {
					after = false;
					return false;	
				}	
			} );	
			return after;
		},
		_checkToCreateTab : function( tid ){
			if( !this.getTabItemBody( tid ).length ) {
				this._setTabBodyItem( tid );	
			}
			return this;	
		},
		_currentTab : null,
		__zIndex : 2,
		_showTab : function( tid,fn ){
			var self = this,
				opt=this.configs;
			//检测tab内容是否创建	
			self._checkToCreateTab( tid );
			
			var bd = self.getTabBody();
			
			//otid
			var otid = self._currentTab;
			self._currentTab = tid;
				
			var h = self.getTabItemHeader( tid );//
			var b = self.getTabItemBody( tid );
			
			opt.hideToNone && b.show();
			
			var w = bd.outerWidth();
			
			h.addClass('nex-stab-header-item-selected');	
			//动画执行后的回调
			var call = function(){
				if( $.isFunction( fn ) ) {
					fn();	
				}
				self._hideTab( otid );
				b.addClass( 'nex-stab-body-item-show' );	
				b.css( {
					left : 0,
					top : 0	
				} );	
				self.fireEvent('onShowTab',[ tid,opt ]);
			};
			
			var left = parseFloat(bd.css('paddingLeft'),10) || 0;
			var top = parseFloat(bd.css('paddingTop'),10) || 0;
			//检测当前tid和值钱的tid的位置 影响动画效果
			var isAfter = self._isAfterActiveTab( tid,otid );
			
			if( opt.animSwitch ) {
				b.css({
					zIndex : self.__zIndex++,
					top : top,
					opacity : 0,
					left : isAfter ? w : -w
				});		
				b.stop(true,true).animate( {
					left : left,
					opacity : 1
				},opt.switchDuration,opt.switchEasing,function(){
					call();	
				} );
			} else {
				b.css({
					zIndex : self.__zIndex++,
					left : 0,
					top : 0
				});	
				call();	
			}	
			
			return self;
		},
		_hideTab : function( tid,fn ){
			var self = this,
				opt=this.configs;
			var h = self.getTabItemHeader( tid );
			var b = self.getTabItemBody( tid );	
			h.removeClass('nex-stab-header-item-selected');	
			
			b.removeClass('nex-stab-body-item-show')._removeStyle('left')._removeStyle('top')._removeStyle('z-index');
			
			opt.hideToNone && b.hide();
			
			if( $.isFunction( fn ) ) {
				fn();	
			}
			
			self.fireEvent('onHideTab',[ tid,opt ]);
			
			return self;		
		},
		_getTabItemsWrap : function(){
			var opt = this.configs;	
			return $('#'+opt.id+'_items_wraper');
		},
		/*动态添加Tab*/
		_addTab : function( d,after ){
			var self = this,
				opt=this.configs;
			var d = self._parseTabData( d );
			var after = self._undef( after,true );		
			
			var wrap = self._getTabItemsWrap();
			
			var item = $( self._getTabHeaderInner( d ) );
			if( after ) {
				opt.items.push( d );
				wrap.append( item );
			} else {
				opt.items.splice( 0,0,d );	
				wrap.prepend( item );
			}
			return d.id;
		},
		addTab : function( d,after ){
			var self = this,
				opt=this.configs;
			var html = after;
			var _d = {};
			if( !$.isPlainObject(d) ) {
				_d.title = String(d);	
				if( $.type(html) !== 'boolean' ) {
					_d.html = html;		
				}
			} else {
				_d = d;	
			}
			after = $.type(after) === 'boolean' ? after : true;
			
			var d = self._parseTabData( _d );		
				
			var r = self.fireEvent('onBeforeAddTab',[ d.id,d,opt ]);
			if( r === false ) return self;		
			
			self._addTab( d,after );
			
			if( d.autoShow ) {
				self.switchTab( d.id );	
			}
			
			self.fireEvent('onAddTab',[ d.id,d,opt ]);	
			
			return d.id;	
		},
		/*
		*移除指定tab
		*/
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
			
			th.parent().remove();
			tb.remove();
			
			delete self._tabItems[tid];
			
			tabs.splice(i,1); 	
			
			return self;	
		},
		removeTab : function( tid ){
			var self = this,
				opt=this.configs;
			var d = self.getTabData( tid );
			
			if( !d ) return self;
		
			var r = self.fireEvent('onBeforeRemoveTab',[ tid,d,opt ]);
			if( r === false ) return self;		
			
			self._removeTab( tid );
			
			self.fireEvent('onRemoveTab',[ tid,d,opt ]);
			
			return self;
		},
		//删除多个Tab
		removeTabs : function( iarr ){
			var self = this,
				opt=this.configs;
			var tids = $.isArray(iarr) ? iarr : [iarr];
			var len = tids.length;
			if( !len ) {
				return self;	
			} 
			var curr = self.getCurrentTab();
			var lastId = null;
			for( var i=0;i<len;i++ ) {
				var tid = tids[i];
				if( tid == curr ) {
					lastId = tid;
					continue;	
				}	
				self.removeTab( tid );
			}
			if( lastId ) {
				self.removeTab( lastId );	
			}
			return self;				
		},
		closeTab : function( tid ){
			return this.removeTab( tid );	
		},
		/*
		*关闭所有标签
		*/
		removeAllTab : function(){
			var self = this,
				opt=this.configs;
			var tids = [];	
			$.each( opt.items,function(i,d){
				tids.push( d.id );
			} );	
			self.removeTabs( tids );
			return self;		
		},
		/*
		*关闭所有无效的tab
		*/
		removeAllDisabledTab : function(){
			var self = this,
				opt=this.configs;
			var tids = [];	
			$.each( opt.items,function(i,d){
				if( d.disabled ) {
					tids.push( d.id );
				}	
			} );	
			self.removeTabs( tids );
			return self;	
		},
		/*
		*关闭所有可关闭的标签
		*/
		removeAllCloseableTab : function(){
			var self = this,
				opt=this.configs;
			var tids = [];	
			$.each( opt.items,function(i,d){
				if( d.closable ) {
					tids.push( d.id );
				}	
			} );	
			self.removeTabs( tids );
			return self;
		},
		switchTab : function(tid){
			var self = this,
				opt=this.configs;
				
			var ctid = self.getCurrentTab();
			if( ctid == tid ) {
				return true;	
			}
			
			var d = self.getTabData( tid );
			
			var r = self.fireEvent('onBeforeSwitchTab',[ tid, d ,opt ]);
			if( r === false ) return false;
			
			self._showTab( tid );
			
			self.fireEvent('onSwitchTab',[ tid, d ,opt ]);
			
			self.fireEvent('onTabChange',[ tid, d ,opt ]);
			
			return true;
		},
		_initTab : function(){
			var self = this,
				opt=this.configs;
			var items = opt.items;	
			var len = items.length;
			if( !opt.lazyLoad ) {
				for( var i=0;i<len;i++ ) {
					self._setTabBodyItem(items[i]['id']);	
				}
			}	
			self._showDefaultTab();
			return self;
		},
		switchFirstTab : function(){
			var self = this,
				opt=this.configs;
			var tabs = opt.items;
			
			if( !tabs.length ) return self;
			
			var tab = tabs[0];
			
			self.switchTab(tab['id']);
			
			return self;
		},
		switchLastTab : function(){
			var self = this,
				opt=this.configs;
			var tabs = opt.items;
			
			if( !tabs.length ) return self;
			
			var tab = tabs[tabs.length-1];
			
			self.switchTab(tab['id']);
			
			return self;
		},
		_showDefaultTab : function(){
			var self = this,
				opt=this.configs;
			var tabs = opt.items;
			if( !tabs.length ) return self;
 			var tid = opt.defaultShowTab;	
			
			$.each( tabs,function(i,d){
				if( d.disabled ) return;
				if( tid === null ) {
					tid = d.id;	
				}
				if( d.autoShow ) {
					tid = d.id;	
				}	
			} );
			var _anim = opt.animSwitch;
			if( !opt.firstShowAnim ) {
				opt.animSwitch = false;	
			}
			self._showTab(tid);
			opt.animSwitch = _anim;
			return self;
		}
	});
}));