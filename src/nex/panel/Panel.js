/*
jquery.nexPanel.js
http://www.extgrid.com/panel
author:nobo
qq:505931977
QQ交流群:13197510
email:zere.nobo@gmail.com or QQ邮箱

*/
(function( factory ) {
	if ( typeof $define === "function" ) {
		
		$define([
			'Nex.container.Container'		
		], function(){
			factory( jQuery );	
		} );
	} else {

		factory( jQuery );
	}
}(function( $ ) {
	//var panel = Nex.define('Nex.Panel','Nex.Html').setXType('panel');
	var panel = Nex.define('Nex.panel.Panel',{
		extend : 'Nex.container.Container',
		alias : 'Nex.Panel',
		xtype : 'panel',
		configs : function(opt, t){
			return {
			prefix : 'nexpanel-',
			autoDestroy : true,
			autoResize : true,
			_hasBodyView : true,
			_checkScrollBar : false,
			border : true,
			borderCls : [opt.borderCls,'nex-panel-border'].join(' '),
			containerCls : [opt.containerCls,'nex-panel'].join(' '),
			autoScrollCls : [opt.autoScrollCls,'nex-panel-auto-scroll'].join(' '),
			autoWidthCls : [opt.autoWidthCls,'nex-panel-auto-width'].join(' '),
			autoHeightCls : [opt.autoHeightCls,'nex-panel-auto-height'].join(' '),
			autoScroll : false,
			tabIndex : -1,
			showShadow : false,
			shadowCls : 'nex-panel-shadow',
			toolbarCls : '',
			tbar : null,//top bar
			bbar : null,//bottom bar
			rbar : null,//未实现
			lbar : null,//未实现
			tools: [],//小工具 { icon:'',iconCls:'',tips:'',disabled:false,handler:null,attrs:null }
			toolsItems : null,//更自由的自定义tools组件
			toolTipsTag : 'title',
			closable 	: false,
			closeToRemove : true,//关闭销毁 使用closeAction来代替 true=destroy  false=hide
			closeFn : null,//自定义关闭函数
			animCollapse : true,//动画形式折叠
			durationCollapse : 200,//动画形式折叠
			easingCollapse : 'easeOutQuad',
			collapsible : false,//折叠icon
			collapsed   : false,//默认显示是是否折叠
			collapsedCls: '',
			title : '',
			
			showHeader : 'auto', //自动判断 如果title内容为空 则不显示
			
			headerSelectionable : true,
			bodySelectionable : true,
			footerCls : '',
			footerItems : null,
			
			items : [],
			renderTo : document.body,//window
		
			views : {},
			
			headerCls : '',
			icon : '',
			iconCls : '',
	
			iconTag : 'span',
			
			minWidth : function(){
				var header = this.getHeader();
				if( !header ) return 0;
				var w = 0;
				$('.nex-window-tools,.nex-panel-title-icon,.nex-panel-title-text',header).each( function(){
					w += $(this).width() || 0;
				} );
				return w;
			},
			
			bodyPadding : null,
			bodyCls : '',
			bodyStyle : {},
			autoSize : false,
			width : 'auto',
			height : 'auto'
			//denyEvents : ['scroll'],
			//events : {}
		};
		}		
	});
	panel.override({
		initComponent : function(){
			
			this.callParent(arguments);
			
			this.initPanel();
			
		}, 
		initPanel : function(){
			var self = this,
				opt=this.configs;
			/*初始化样式表*/
			self.initStyleSheet();	
			
			self.initCss();	
				
			self.setHeader();
			
			self.setBody();
			
			self.setToolbars();
			
			self.setFooter();
			
			return self;
		},
		onCreate : function(){
			this.callParent(arguments);
			this._afterCreate();	
		},
		//sysEvents : function(){
//			var self = this;
//			var opt = self.configs;
//			
//			self.callParent( arguments );
//			
//			return self;
//		},
		onContainerCreate :　function(el, opt){
			var self =this;
			
			self.callParent( arguments );
			
			self._setShadow(el, opt);
				
		},
		_afterCreate : function(){
			var self = this;
			var opt = self.configs;
			if( opt.collapsed ) {
				self.collapse( false );
			}	
		},
		_setShadow : function( el,opt ){
			if( opt.showShadow ) {
				el.addClass( opt.shadowCls );	
			}	
		},
		_getIconTpl : function(_icon){
			var opt = this.configs;
			return '<'+opt.iconTag+' class="nex-panel-icon nex-panel-title-icon '+opt.iconCls+'" style="'+_icon+'"></'+opt.iconTag+'>';		
		},
		initStyleSheet : function(){
			var self = this;
			var el = self.el;
			var opt = this.configs;	
			if( opt.views['stylesheet'] ) return self;
			var $sheet = $('<style id="'+opt.id+'_stylesheet" type="text/css"></style>');
			opt.views['stylesheet'] = $sheet;
			el.append($sheet);
			return self;	
		},
		getStyleSheet : function(){
			return this.configs.views['stylesheet'];	
		},
		addCssRules : function(selector,cssText){
			var self = this;
			var opt = this.configs;
			var style = self.getStyleSheet().get(0);
			var args = [].slice.apply(arguments);
			var noSelector = args.length == 1;
			var cssText = noSelector ? selector : cssText;
			if( style ) {
				if( noSelector ) {
					selector = ['#'+opt.id];
				} else {
					selector = selector.split(',');
					$.each(selector, function(i, s){
						selector[i] = '#'+opt.id+' '+s;	
					});
				}
				Nex.addCssRules(
					style,
					selector.join(','),
					cssText
				);
			}	
			return self;	
		},
		initCss : function(){},
		renderedHeader : false,
		setHeader : function(){
			var self = this,
				opt=this.configs;
			var container = opt.views['container'];
			
			var showHeader = opt.showHeader;
			
			opt.tools = $.isArray(opt.tools) ? opt.tools : [ opt.tools ];
			
			if( showHeader == 'auto' ) {
				if( opt.toolsItems || 
					opt.tools.length ||
					opt.title ||
					opt.icon || 
					opt.iconCls ) {
					showHeader = true;
				} else {
					showHeader = false;	
				}
			}
			
			if( showHeader === false ) return self;
			
			if( this.renderedHeader ) return self;
			var icon = '';
			if( opt.icon || opt.iconCls ) {
				var _icon = '';
				if( opt.icon ) {
					_icon = 'background-image:url('+opt.icon+')';	
				}
				icon = self._getIconTpl(_icon);	
			}
			
			var header = $('<div class="nex-panel-header '+opt.headerCls+'" id="'+opt.id+'_header"><div class="nex-panel-tools"></div><div class="nex-panel-header-title">'+icon+'<span class="nex-panel-title-text"></span></div></div>');
			
			opt.views['header'] = header;
			opt._vviews['header'] = header;
			
			container.prepend(header);
			
			this.renderedHeader = true;
			
			if( !opt.headerSelectionable ) {
				header.disableSelection();
			}
			if( opt.title ) {
				self.addComponent( $('.nex-panel-title-text',header),opt.title );
			}
			var hasTools = self._setTools();
			
			self.onHeaderCreate(header, opt);
			
			self.fireEvent("onHeaderCreate",[header,opt]);
			/*
			if( opt.showHeader == 'auto' ) {
				if( !hasTools && !opt.title && !opt.icon && !opt.iconCls ) {
					showHeader = false;
				}
			}*/
			if( !showHeader ) {
				self._hideHeader();
			}
			
			self.setHeaderEvent(header, opt);
			
			return self;
		},
		onHeaderCreate : function(){},
		setHeaderEvent : function(header, opt){
			var self =this;
			
			var callBack = function(type,e){
				var r = self.fireEvent(type,[ this,e,opt ]);
				if( r === false ) {
					e.stopPropagation();
					e.preventDefault();
				}
			};
			
			header.unbind('.ph');
			header.bind({
				'click.ph' : function(e){
					callBack.call(this, 'onHeaderClick', e);	
				},	
				'dblclick.ph' : function(e){
					callBack.call(this, 'onHeaderDblClick', e);	
				},
				'mouseover.html' : function(e){
					callBack.call(this,'onHeaderMouseOver',e);
				},
				'mouseout.html' : function(e){
					callBack.call(this,'onHeaderMouseOut',e);
				},
				'mousedown.html' : function(e) {
					callBack.call(this,'onHeaderMouseDown',e);
				},
				'mouseup.html' : function(e) {
					callBack.call(this,'onHeaderMouseUp',e);
				},
				'contextmenu.ph' : function(e){
					callBack.call(this, 'onHeaderContextMenu', e);		
				}
			});	
			
			$('>.nex-panel-tools', header).bind({
				click : function(e){
					e.stopPropagation();
					e.preventDefault();
					$(document).trigger('click', [e]);
				}	
			});
			
			self.fireEvent('onSetHeaderEvent',[ header, opt ]);
			
		},
		_setSysTools : function( tools ){
			var self = this,
				opt=this.configs;
			var header = opt.views['header'];			
			var $tools = $('>.nex-panel-tools',header);
			if( opt.collapsible ) {
				tools.push( {
					iconCls : 'tools-collapse-icon',
					handler : function(){
						self.toggleCollapse();	
					}
				} );	
				self.unbind('.collapse');
				self.bind('onCollapse.collapse',function(){
					$('>.tools-collapse-icon',$tools).addClass('tools-expand-icon');	
				},self);
				self.bind('onExpand.collapse',function(){
					$('>.tools-collapse-icon',$tools).removeClass('tools-expand-icon');	
				},self);
			}
			
			if( opt.closable ) {
				tools.push( {
					iconCls : 'tools-close-icon',
					handler : function(){
						self.close();	
					}
				} );	
			}
			
			return tools;
		},
		/*
		*private
		*/
		_setTools : function(){
			var self = this,
				opt=this.configs;
			var header = opt.views['header'];	
			var tools = $('>.nex-panel-tools',header);
			//var hasTools = false;
			//更自由的设置tools
			if( opt.toolsItems ) {
				//hasTools = true;
				self.addComponent( tools,opt.toolsItems );
			}
			var _tools = opt.tools;
			_tools = self._setSysTools(_tools);
			//tools图标按钮  toolTipsTag
			for( var i=0;i<_tools.length;i++ ) {
				var _d = {
					icon : '',
					iconCls : '',
					tips : '',
					attrs : null,
					disabled : false,
					handler : null,
					callback : null,//兼容
					callBack : null //兼容
				};
				var iconData = 	opt.tools[i];
				
				if( typeof iconData !== 'object' ) {
					continue;	
				}
				
				//hasTools = true;
				
				iconData = $.extend( _d,iconData );
				
				var _icon = '';
				if( iconData.icon ) {
					_icon = 'background-image:url('+iconData.icon+')';	
				}
			
				var $icon = $('<a class="nex-panel-icon '+iconData.iconCls+'" hideFocus=true href="javascript:void(0)" style="'+_icon+'"></a>');
				
				tools.append( $icon );
				
				if( iconData.disabled ) {
					$icon.addClass('nex-panel-icon-disabled');	
				}
				
				if( iconData.tips ) {
					$icon.attr( opt.toolTipsTag, Nex.htmlEncode(iconData.tips) );	
				}
				if( iconData.attrs ) {
					$icon.attr( iconData.attrs );
				}
				
				(function(icd,el){
					el.click(function(e){
						if( el.hasClass('nex-panel-icon-disabled') ) return;
						var _r;
						if( $.isFunction( icd.handler ) ) {
							var r = icd.handler.call( self,el,e );
							if( r === false ) _r = r; 	
						}	
						if( $.isFunction( icd.callBack ) ) {
							var r = icd.callBack.call( self,el,e );
							if( r === false ) _r = r;
						}	
						if( $.isFunction( icd.callback ) ) {
							var r = icd.callback.call( self,el,e );
							if( r === false ) _r = r;
						}
						if( _r === false ) {
							e.stopPropagation();
							e.preventDefault();	
						}					 
					});	
				})(iconData,$icon);
			}
			return self;
		},
		_headerHasShow : true,
		_showHeader : function(){//renderedHeader
			var self = this,
				opt=this.configs,
				header = opt.views['header'];
				
			if( !self.rendered ) {
				opt.showHeader = true;	
				return self;	
			}	
			
			if( !self.renderedHeader ) {
				opt.showHeader = true;	
				self.setHeader();
				return self;
			}
				
			header._show()
				  .show();
			this._headerHasShow = true;	  
			opt._vviews['header'] = header;
			return this;	  
		},
		_hideHeader : function(){
			var self = this,
				opt = this.configs,
				header = opt.views['header'];	
			if( !self.renderedHeader ) {
				return self;
			}	
			header._hide()
				  .hide();
			this._headerHasShow = false;	 	  
			opt._vviews['header'] = null;	
			return this; 
		},
		showHeader : function(){
			this._showHeader()
				.methodInvoke('resetViewSize');	
			return this;	
		},
		hideHeader : function(){
			this._hideHeader()
				.methodInvoke('resetViewSize');	
			return this;	
		},
		renderedBody : false,
		setBody : function(){
			var self = this;
			var opt = self.configs;	
			
			if( this.renderedBody ) {
				return self;	
			}
			
			var container = opt.views['container'];
			var bd = $( '<div class="nex-panel-body '+opt.bodyCls+'" id="'+opt.id+'_body"></div>' );
			opt.views['body'] = bd;
			container.append(bd);
			
			this.renderedBody = true;
			
			bd.css(opt.bodyStyle);
			bd.css('padding',opt.bodyPadding);
			//bodySelectionable
			if( !opt.bodySelectionable ) {
				bd.disableSelection();
			}
			self.bindBodyEvents();	 
			self.onBodyCreate( bd,opt );
			self.fireEvent("onBodyCreate",[bd,opt]);
			return self;
		},
		onBodyCreate : function(){},
		renderedToolbars : false,
		setToolbars : function(){
			var self = this;
			var opt = self.configs;	
			
			if( this.renderedToolbars ) {
				return self;	
			}
			
			if( opt.tbar ) {
				var tbar = $.isArray( opt.tbar ) ? opt.tbar : [opt.tbar];
				self._setToolbar(tbar,'top');
			}
			if( opt.bbar ) {
				var bbar = $.isArray( opt.bbar ) ? opt.bbar : [opt.bbar];
				self._setToolbar(bbar,'bottom');
			}
			if( opt.lbar ) {
				var lbar = $.isArray( opt.lbar ) ? opt.lbar : [opt.lbar];
				self._setToolbar(lbar,'left');
			}
			if( opt.rbar ) {
				var rbar = $.isArray( opt.rbar ) ? opt.rbar : [opt.rbar];
				self._setToolbar(rbar,'right');
			}
			
			this.renderedToolbars = true;
			
			self.fireEvent("onToolbarCreate",[opt]);
			
			return self;	
		},
		//pos=top bottom left right
		_setToolbar : function( items,pos ){
			var self = this;
			var opt = self.configs;	
			var in_pos = ['top','bottom','left','right'];
			var bd = opt.views['body'];
			pos = $.inArray( pos,in_pos ) === -1 ? 'top' : pos;
			var tid = opt.id+'_toolbar_'+pos;
			var  tb = $('#'+tid);
			if( !tb.length ) {
				tb = $( '<div class="nex-panel-toolbar nex-panel-toolbar-'+pos+' '+opt.toolbarCls+'" id="'+tid+'"></div>' );
				if( pos === 'top' ) {
					bd.before( tb );	
				} else {
					bd.after( tb );	
				}
				switch( pos ) {
					case 'top' :
						opt.views['tbar'] = tb;
						opt._vviews['tbar'] = tb;
						break;	
					case 'bottom' :
						opt.views['bbar'] = tb;
						opt._vviews['bbar'] = tb;
						break;	
					case 'left' :
						opt.views['lbar'] = tb;
						opt._hviews['lbar'] = tb;
						break;	
					case 'right' :
						opt.views['rbar'] = tb;
						opt._hviews['rbar'] = tb;
						break;		
				}
			}
			var cmps = self.addComponent( tb,items );
			$.each( cmps,function(i,cmp){
				if( Nex.isInstance( cmp ) ) {
					cmp.C('parent',opt.id);	
				}	
			} );
			return self;
		},
		/*
		*设置一个基于横向的视图 
		*/
		_setHorizontalView : function( name,el ){
			var opt=this.configs;
			//opt.views[ name ] = el;
			opt._hviews[ name ] = el;
			return self;
		},
		/*
		*设置一个基于竖向的视图
		*/
		_setVerticalView : function( name,el ){
			var opt=this.configs;
			//opt.views[ name ] = el;
			opt._vviews[ name ] = el;
			return self;	
		},
		_removeHorizontalView : function( name ){
			var opt=this.configs;
			//opt.views[ name ] = null;
			opt._hviews[ name ] = null;
			//delete opt.views[ name ];
			delete opt._hviews[ name ];
			return self;
		},
		_removeVerticalView : function( name ){
			var opt=this.configs;
			//opt.views[ name ] = null;
			opt._vviews[ name ] = null;
			//delete opt.views[ name ];
			delete opt._vviews[ name ];
			return self;	
		},
		setHorizontalView : function( a,b ){
			this._setHorizontalView( a,b );	
			this.resetViewSize();
			return this;
		},
		setVerticalView : function( a,b ){
			this._setHorizontalView( a,b );	
			this.resetViewSize();
			return this;
		},
		removeHorizontalView : function( a ){
			this._removeHorizontalView( a );	
			this.resetViewSize();
			return this;
		},
		removeVerticalView : function( a ){
			this._removeVerticalView( a );	
			this.resetViewSize();
			return this;
		},
		_getDiffWidth : function(){
			var opt=this.configs;
			var dw = this.callParent(arguments);
			return dw + (opt.views['rbar'] ? opt.views['rbar']._outerWidth() : 0);	
		},
		doSetViewSize : function(){
			var self = this,
				opt=this.configs,
				undef;
			var container = self.el;	
			var bd = self.getBody();	
			
			self.callParent(arguments);
			
			if( !self.isAutoWidth() ) {
				var w = 0;
				$.each( opt._hviews,function(k,el){
					if( !el ) return;	
					w += el._outerWidth();
				} );
				
				bd._outerWidth( container._width() - w );
			} else {
				bd._removeStyle('width');
			}
			if( !self.isAutoHeight() ) {
				var h = 0;
				$.each( opt._vviews,function(k,el){
					if( !el ) return;	
					h += el._outerHeight();
				} );
				bd._outerHeight( container._height()-h );
			} else {
				bd._removeStyle('height');	
			}
			/*设置 左右工具栏位置*/
			var offset = bd._position();
			if( opt.views['lbar'] ) {
				var tb = opt.views['lbar'];
				bd.css('marginLeft',tb._outerWidth());	
				tb._outerHeight( bd._outerHeight() );
				tb.css({
					left : parseFloat(container.css('paddingLeft')) || 0,
					top : offset.top	
				});
			}
			if( opt.views['rbar'] ) {
				var tb = opt.views['rbar'];
				tb._outerHeight( bd._outerHeight() );
				tb.css({
					right : parseFloat(container.css('paddingRight')) || 0,
					top : offset.top	
				});	
			}
		},
		bindBodyEvents : function(){
		},
		renderedFooter : false,
		setFooter : function(){
			var self = this,undef;
			var opt = self.C();	
			var container = opt.views['container'];
			
			if( this.renderedFooter ) return self;
			
			if( !opt.footerItems ) return self;
			
			var footerItems = opt.footerItems;
			
			var footer = $('<div class="nex-panel-footer '+opt.footerCls+'" id="'+opt.id+'_footer"></div>');
			opt.views['footer'] = footer;
			opt._vviews['footer'] = footer;
			container.append(footer);	
			
			this.renderedFooter = true;
			
			self.addComponent( footer,footerItems );
			
			self.onFooterCreate(footer, opt);
			
			self.fireEvent("onFooterCreate",[footer,opt]);
			
			return self;
		},
		onFooterCreate : function(){},
		setTitle : function( s,m ){
			var self = this;
			var opt = this.configs;
			var o = opt.title;
			if( !self.rendered || !self.renderedHeader ) {
				opt.title = s;
				return self;	
			}
			var header = self.getHeader();	
			var inner = $('.nex-panel-title-text',header);
			
			opt.title = s;
			
			inner.empty();
			if( m ) {
				Nex.gc();
			}
			
			self.addComponent( inner,s );
			
			self.fireEvent('onTitleChange',[ s,o,opt ]);
			
			return self;
		},
		setIcon : function( s ){
			var self = this;
			var opt = this.configs;
			var o = opt.icon;
			if( !self.rendered || !self.renderedHeader ) {
				opt.icon = s;
				return self;	
			}
			var header = self.getHeader();	//nex-panel-title-icon
			var inner = $('.nex-panel-title-icon',header);
			if( !inner.length ) {
				inner = $( self._getIconTpl() );	
				$('.nex-panel-header-title',header).prepend( inner );
			}
			
			opt.icon = s;
			
			inner.css('backgroundImage','url('+s+')');
			
			self.fireEvent('onIconChange',[ s,o,opt ]);
			
			return self;
		},
		setIconCls : function( s ){
			var self = this;
			var opt = this.configs;
			var o = opt.iconCls;
			if( !self.rendered || !self.renderedHeader ) {
				opt.iconCls = s;
				return self;	
			}
			var header = self.getHeader();	//nex-panel-title-icon
			var inner = $('.nex-panel-title-icon',header);
			if( !inner.length ) {
				inner = $( self._getIconTpl() );	
				$('.nex-panel-header-title',header).prepend( inner );
			}
			
			inner.removeClass( o );
			
			opt.iconCls = s;
			
			inner.addClass(s);
			
			self.fireEvent('onIconClsChange',[ s,o,opt ]);
			
			return self;
		},
		getHeader : function(){
			var opt = this.configs;
			return opt.views['header'] || null;	
		},
		getBody : function(){
			var opt = this.configs;
			return opt.views['body'];
		},
		getFooter : function(){
			var opt = this.configs;
			return opt.views['footer'];	
		},
		getToolbar : function( pos ){
			var opt = this.configs;
			var maps = {
				'top' 	 : 'tbar',
				'bottom' : 'bbar',
				'left'	 : 'lbar',
				'right'  : 'rbar'
			};
			return opt.views[maps[ pos ]];		
		},
		_close : function( fn,data ){
			this.hide( data );
		},
		"close" : function(){
			var self = this;
			var opt = this.configs;
			
			var data = self._getAnimateOptions.apply(self,arguments);
			
			var call = function(){
					self.fireEvent('onClose',[ self.el,opt ]);		
					if( opt.closeToRemove ) {
						self.destroy();	
					}	
				};
				
			var cb = data.complete;
			data.complete = function(){
				if( $.isFunction(cb) ) {
					cb.call( self );
				}
				call();	
			};	
			
			if( this.fireEvent('onBeforeClose',[ opt ]) !== false ) {
				$.isFunction( opt.closeFn ) ? 
					opt.closeFn( data.complete,data,arguments ) : 
					this._close( data.complete,data,arguments );	
			}	
			return self;
		},
		/*移除*/
		remove : function(){
			this.configs.closeToRemove = true;
			return this.close();
		},
		onSizeChange : function(){
			this.callParent(arguments);
			var container = this.el;	
			if( this.collapsed/* || this.isCollapsingOrExpanding*/ ) {
				var resetHeight = container.height();
				container.data('__resetHeight__',resetHeight);	
			}
			if( this.collapsed ) {
				this.collapsed = false;
				this.collapse(false);	
			}
		},
		//无效。。。
		isCollapsingOrExpanding : false,
		collapsed : false,
		/*
		*展开
		*/
		expand : function( anim ){
			var self = this;
			var opt = this.configs;
			
			if( !self.collapsed/* || self.isCollapsingOrExpanding*/ ) {
				return self;	
			}
			
			if( self.fireEvent('onBeforeExpand',[ opt ]) === false ) {
				return self;	
			}
			
			self.fireEvent('onExpanding',[ opt ]);
			
			anim = self._undef( anim,opt.animCollapse );
			
			var container = self.el;	
			var header = self.getHeader();	
			
			container.stop(true,true);
			
			self.collapsed = false;
			
			//self.isCollapsingOrExpanding = true;
			
			var hh = self._headerHasShow && header ? header.outerHeight() : 0;
			
			var fn = function(){
				//self.isCollapsingOrExpanding = false;
				self.resetSize();
				self.setAcceptResize( true );	
				container.removeClass( 'nex-panel-collapsed '+opt.collapsedCls );
				self.fireEvent('onExpand',[ opt ]);	
			};
			if( anim ) {			
				container.animate({
					height : container.data('__resetHeight__') || hh
				},opt.durationCollapse,opt.easingCollapse,function(){
					fn();
				});
			} else {
				container.height( container.data('__resetHeight__') || hh );
				fn();
			}
			return self;
		},
		/*
		*折叠
		*/
		collapse : function( anim ){
			var self = this;
			var opt = this.configs;
			
			if( self.collapsed/* || self.isCollapsingOrExpanding*/ ) {
				return self;	
			}
			
			if( self.fireEvent('onBeforeCollapse',[ opt ]) === false ) {
				return self;	
			}
			
			self.fireEvent('onCollapsing',[ opt ]);
			
			anim = self._undef( anim,opt.animCollapse );
			
			var container = self.el;	
			var header = self.getHeader();	
			
			container.stop(true,true);
			
			self.collapsed = true;	
			
			var resetHeight = container.height();
			container.data('__resetHeight__',resetHeight);
			
			self.setAcceptResize( false );
			
			var hh = self._headerHasShow && header ? header.outerHeight() : 0;
			
			//self.isCollapsingOrExpanding = true;
			
			var fn = function(){
				//self.collapsed = true;	
				//self.isCollapsingOrExpanding = false;
				self.fireEvent('onCollapse',[ opt ]);	
			};
			container.addClass( 'nex-panel-collapsed '+opt.collapsedCls );
			if( anim ) {	
				container.animate({
					height : hh
				},opt.durationCollapse,opt.easingCollapse,function(){
					fn();
				});
			} else {
				container.height( hh );
				fn();
			}
			return self;
		},
		toggleCollapse: function( anim ) {
			var self = this;
			var opt = this.configs;
			/*if (self.isCollapsingOrExpanding) {
				return self;
			}*/
			if (self.collapsed) {
				self.expand(anim);
			} else {
				self.collapse(anim);
			}
			return self;
		}
	});
}));