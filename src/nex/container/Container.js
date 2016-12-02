/*
Nex.Container组件说明：
组件名称       : Nex.Container 可通过 new Nex.Container() 或者 Nex.Create('NexContainer') 来创建
组件别名xtype  : container  可通过Nex.Create('container')
加载名称       : Nex.Container 组件存放目录结构 {{nex目录}}/Container.js
*/
define(function(require){	
	require('Nex/effects/Effects');
	require('Nex/container/AbstractContainer');
	
	var container = Nex.define('Nex.container.Container',{
		extend : 'Nex.container.AbstractContainer',
		alias  : 'Nex.Container',
		xtype  : 'container',
		configs : function( opt ){
			return {
				prefix : 'nexcontainer-',
				//tag : 'div',
				autoScroll : false,
				_checkScrollBar : false,//检查是否出现滚动条 如果出现会触发onViewSizeChange
				_hasBodyView : false,//是否有view部分 html 没有这部分 应该关闭 提高效率 关闭后不会触发onViewSizeChange
				_initSetSize : false,//容器刚创建时会设置容器宽度
				tabIndex : -1,
				hideMode : 'offsets',//display visibility offsets(IE6下会使用display+offsets)
				animate : false,//开启动画显示 开启后可设置effect等参数
				animDuration : 200,
				animEasing   : Nex.easingDef,
				//effect duration easing complete  queue .....
				_effect : {},//effect可参考jquery ui effects部分
				effect : {},
				showEffect : {},
				hideEffect : {},
				showFn : null,//自定义显示函数
				hideFn : null,//自定义关闭函数
				showMethod : 'fadeIn',
				hideMethod : 'fadeOut',
				overCls : '',
				width : 'auto',// 设为auto后 大小将不会设置 宽度 高度都是auto 或者css控制的,设为0 相当于100% 
				height : 'auto',
				border : false,//boolean 如果是String则动态设置样式
				borderCls : 'nex-container-border',
				borderStyle : '',
				containerCls : [opt.containerCls,'nex-container'].join(' '),
				autoScrollCls : 'nex-container-auto-scroll',
				autoWidthCls : 'nex-container-auto-width',
				autoHeightCls : 'nex-container-auto-height',
				_initMethod : [],//初始时扩展调用
				padding : null,
				margin  : null,
				overflow : '',
				_vviews : {},//竖
				_hviews : {},//横
				loadMsg : 'Loading...',
				//自定义loading显示容器
				loadContainer : null,//跟一个函数 返回一个dom元素
				//禁止绑定事件 或者指定那些事件不需要绑定 eg [ 'click',dblclick,scroll ]
				denyEvents : false
			};
		}	
	});
	//兼容以前版本
	Nex.Html = container;
	container.override({
		initComponent : function() {
			var self = this;
			var opt = this.configs;
			var methods = opt._initMethod;
			self.callParent(arguments);
			/*调用扩展api*/
			if( methods.length ) {
				var i=0,len = methods.length;
				for( ;i<len;i++ ) {
					var m = methods[i];
					if( !m ) continue;
					if( $.isFunction( m ) ) {
						m.call( self );	
					} else if( ($.type( m ) === 'string') && $.isFunction( self[m] ) ) {
						self[m].call( self );	
					}
				}	
			}
			
		},
		initRenderContent : function(){
			var self = this;
			
			self.callParent(arguments);
			
			//检查最大最小宽度
			self._checkAutoSize();
			
			return this;	
		},
		sysEvents : function(){
			var self = this;
			var opt = self.configs;
			self.callParent( arguments );
			self.bind("onStart._sys",function(){
				if( opt.autoSize ) {
					opt.width = 'auto';
					opt.height = 'auto';
				}
			},self);
			self.bind("onCreate._sys",function(){
				//opt._isInit = false;	
				self._setAutoScrollCls();
				self._setScrollEvent();
			},self);
			self.bind("onMouseEnter._sys",self._setOverCls,self);
			self.bind("onMouseLeave._sys",self._unsetOverCls,self);
			return self;
		},
		onContainerCreate : function(el, opt){
			var self = this;	
			self.callParent(arguments);
			
			self._setBorder();
			self._setPadding();
			self._setMargin();
			self._setOverflow();
			
			if( opt._initSetSize ) {
				self._initSetContainerSize();
			}
			
			self.setContainerEvent();	 
		},
		_setHeightAuto : function(){
			var self = this;
			var opt = self.configs;	
			var views = opt.views;	
			var bd = self.getBody();
			var container = self.el;
			//container._removeStyle('height',true);
			container.css('height','');
			if( bd ) {
				//bd._removeStyle('height',true);	
				bd.css('height','');
			}
		},
		_setWidthAuto : function(){
			var self = this;
			var opt = self.configs;	
			var views = opt.views;	
			var bd = self.getBody();
			var container = self.el;
			//container._removeStyle('width',true);
			container.css('width','');
			if( bd ) {
				//bd._removeStyle('width',true);	
				bd.css('width','');
			}
		},
		/*如果width height 设置的是百分比那么将返回百分比值，只对resize和初始创建时有效*/
		getResizeWH : function(){
			var self = this;
			var opt = self.configs;	
			var views = opt.views;
			var container = self.el;
			var renderTo = $(opt.renderTo);
			var width =  renderTo._width();
			var height =  renderTo._height();
			//这里应该触发一个事件 可以修改 width height 
			var size = {
				width : width,
				height : height	
			};
			self.fireEvent('onGetRenderToSize',[ size,opt ]);
			
			width = size.width;
			height = size.height;
			
			var isChange = true;
			if( opt.pWidth === width && opt.pHeight === height && opt._isResize ) {//resize 时才判断 setWH 都会执行
				isChange = false;	
			}
			if( !isChange ) {
				return {
					width:opt._width,
					height:opt._height,
					isChange : isChange
				};	
			}
			
			opt.pWidth = width;
			opt.pHeight = height;
			//opt.width opt.height 等于0是 默认就是 100%
			var w = parseFloat(opt.width) === 0 ? width : opt.width
				,h = parseFloat(opt.height) === 0 ? height : opt.height;

			if( opt.width.toString().indexOf("%") != -1 ) {
				w = parseFloat(opt.width)*width/100;
			}
			if( opt.height.toString().indexOf("%") != -1 ) {
				h = parseFloat(opt.height)*height/100;
			}
			//如果opt.width 设置的是 auto时。
			var bd = self.getBody();
			if( w === 'auto' || isNaN(parseFloat(w)) ) {
				/*$.each( views , function(key,_item){
					_item._removeStyle('width',true);	
				} );*/
				if( !self.__containerCreate ) {
					self._setWidthAuto();
				}
				w = container._outerWidth();	
			}
			//如果opt.height 设置的是 auto时。
			if( h === 'auto' || isNaN(parseFloat(h)) ) {
				if( !self.__containerCreate ) {
					self._setHeightAuto();
				}
				/*$.each( views , function(key,_item){
					_item._removeStyle('height',true);	
				} );*/
				h = container._outerHeight();	
			}
			//因为浏览器会对像素进行 四舍五入 处理 所以应该用parseInt对像素取整 
			return {
				width:parseInt(w),
				height:parseInt(h),
				isChange : isChange
			};
		},
		checkSize : function(width,height){
			var self = this;
			var opt = self.configs;	
			//var renderTo = $(opt.renderTo);
			var cutHeight = self._getCutHeight(opt.cutHeight);
			var cutWidth = self._getCutWidth(opt.cutWidth);
			height -= isNaN(parseFloat(opt.cutHeight)) ? 0 : opt.cutHeight;
			width -= isNaN(parseFloat(opt.cutWidth)) ? 0 : opt.cutWidth;
			
			var minWidth = self._getMinWidth();
			var minHeight = self._getMinHeight();
			var maxHeight = self._getMaxHeight();
			var maxWidth = self._getMaxWidth();
			
			if( maxWidth>0 ) {
				width = Math.min(width,maxWidth);
			}
			if( maxHeight>0 ) {
				height = Math.min(height,maxHeight);
			}
			if( minWidth>0 ) {
				width = Math.max(width,minWidth);
			}
			if( minHeight>0 ) {
				height = Math.max(height,minHeight);
			}
			
			return {
					//width : isNaN(width)?'auto':width,
					//height : isNaN(height)?'auto':height
					width : parseInt(isNaN(width)?opt.pWidth:width),//实际上 width,height 一直不会是NaN
					height : parseInt(isNaN(height)?opt.pHeight:height)
				};
		},
		clearContainerSizeCache : function(){
			var self = this;
			self._containerWidth = null;
			self._containerHeight = null;	
		},
		setContainerSize : function(w,h){
			var self = this,
				undef,
				opt = self.configs,	
				//render = $(opt.renderTo),
				container = self.el
				;
			
			opt.width = w === undef || w === null ? opt.width : w;	
			opt.height = h === undef || h === null ? opt.height : h;
			
			var size = self.getResizeWH();
			//注：如果width,height 为auto是 size 和 wh 的 width height 应该是一样的 除非设置了 max/min/cut width height 
			var wh = self.checkSize( size.width,size.height );
			
			self.fireEvent('onSetContainerSize',[wh,opt]);
			//判断宽高大小是否有变更
			if( !size.isChange ) {
				return false;	
			}
			
			var _w = String(opt.width).toLowerCase(),
				_h = String(opt.height).toLowerCase();
			
			//缓存
			if( _h !== 'auto' && _w !== 'auto' && self._containerWidth && self._containerHeight ) {
				if( self._containerWidth === wh.width && self._containerHeight === wh.height ) {
					return false;	
				}	
			}
			
			opt._width = wh.width;
			opt._height = wh.height;
				
			//判断是否设置了 max/min/cut width height 
			if( _w === 'auto' && size.width !== wh.width ) {
				_w = wh.width;	
			}	
			if( _h === 'auto' && size.height !== wh.height ) {
				_h = wh.height;	
			}
			
			opt.realWidth = _w;
			opt.realHeight = _h;	
			
			container.removeClass(opt.autoHeightCls+' '+opt.autoWidthCls);
			
			//最终判断 如果 _w _h 已然是auto 那么参数  max/min/cut width height  根本没有设置 width heigth 可以设为auto 否则就设为对应的数
			if( _w !== 'auto') {
				container._outerWidth(opt._width);	
			} else {
				//container._removeStyle('width',true);
				container.css('width','');
				container.addClass(opt.autoWidthCls);
			}
			if( _h !== 'auto') {
				container._outerHeight(opt._height);	
			} else {
				//container._removeStyle('height',true);
				container.css('height','');
				container.addClass(opt.autoHeightCls);
			}
			//缓存
			self._containerWidth = wh.width;
			self._containerHeight = wh.height;
			
			return true;
		},
		/*
		*判断当前是否自适应高度
		*/
		isAutoHeight : function(){
			var self = this,
				opt = this.configs;
			return 	opt.realHeight === 'auto' || opt.realHeight === '' ? true : false;
		},
		/*
		*判断当前是否自适应宽度
		*/
		isAutoWidth : function(){
			var self = this,
				opt = this.configs;
			return 	opt.realWidth === 'auto' || opt.realWidth === '' ? true : false;
		},
		__resizeTimer : 0,
		/*
		*设置容器大小  @w 宽度 @h 高度 如果传的是func 则作为回调 并且只作为刷新用 @m如果为false 则触发onResize让子组件改变大小
		* resize(callback)->setContainerSize ->是/否->resetViewSize->onViewSizeChange->是/否->_setViewSize->callback
		*/
		setSize : function(w,h,m){
			var self = this,
				undef,
				container = self.el,
				opt = self.configs;
				
				
			if( Nex.isObject(w) ) {
				m = h;
				h = w.height;
				w = w.width;	
			}	
			
			m = m === undef ? true : m;	
			
			//如果不需要设置会返回false
			var r = self.setContainerSize(w,h);
			
			if( r ) {
				self.setViewSize();
				if( !self.isInit() ) {
					self.onSizeChange();
					self.fireEvent("onSizeChange",[container,opt]);	
				}
				if( Nex.ComponentManager && !self.isInit() && m ) {
					if( self.__resizeTimer ) {
						clearTimeout( self.__resizeTimer );	
					}
					self.__resizeTimer = setTimeout(function(){
						Nex.ComponentManager.fireEvent("onResize",[opt.id]);		
					},0);
				}	
			}
			if( !self.isInit() ) {
				self.fireEvent('onResize',[ opt ]);
			}
			return r;	
		},
		setViewSize : function(){
			var self = this,
				undef,
				opt = self.configs,
				vbody = self.getBody();
			
			self.methodInvoke('doSetViewSize');	
			self.onSetViewSize();
			self.fireEvent("onSetViewSize",[opt]);	
			
			var r = true;	
			
			if( !opt._hasBodyView ) {
				r = false;//return false;	
			}
			if( r ) {	
				//事件检查滚动条 滚动条出现也会触发viewSize事件
				if( opt._checkScrollBar ) {
					//缓存机制
					//因为grid特殊 所以应该判断是否出现滚动条
					var hasScrollLeft = self.hasScroll( vbody,'left' );
					var hasScrollTop = self.hasScroll( vbody,'top' );
					var barSize = self.getScrollbarSize();
					
					var _vbodyWidth = vbody._width() - ( hasScrollTop ? barSize.y : 0 );
					var _vbodyHeight = vbody._height() - ( hasScrollLeft ? barSize.x : 0 );
				} else {
					var _vbodyWidth = vbody._width();
					var _vbodyHeight = vbody._height();
				}
				
				if( opt._vbodyWidth && opt._vbodyHeight ) {
					if( (opt._vbodyWidth == _vbodyWidth) && (opt._vbodyHeight == _vbodyHeight) ) {
						r = false;//return false;
					}
				} 
			}	
			if( r ) {
				//设置缓存
				opt._vbodyWidth = _vbodyWidth;
				opt._vbodyHeight = _vbodyHeight;
				if( !self.isInit() ) {
					self.onViewSizeChange();
					self.fireEvent("onViewSizeChange",[opt]);
				}
			}
			return r;
		},
		doSetViewSize : function(){},
		//m : true 默认改变子组件的大小
		resize : function(m){
			var self = this,
				opt = self.configs,
				undef;
			
			self.__rt = self.__rt || 0;
			
			if( self.__rt ) {
				clearTimeout( self.__rt );	
			}
			
			self.__rt = setTimeout(function(){
				opt._isResize = true;
				self.setSize(undef,undef,m);
				opt._isResize = false;
			},0);
		},
		refreshViewSize : function(){
			return this.setViewSize.apply(this,arguments);
		},
		resetSize : function(w,h,m){
			return this.setSize(w,h,m);
		},
		onSizeChange : function(w,h){},
		onSetViewSize : function(){},
		onViewSizeChange : function(){},
		_loadCounter : 0,
		showLoading : function(msg){
			var self = this,
				opt = self.configs;
			var msg = self._undef( msg,opt.loadMsg );//typeof msg === 'undefined' ? opt.loadMsg : msg;
			var render = null;
			if( $.isFunction(opt.loadContainer) ) {
				render = opt.loadContainer.call( self );	
			}
			render = render || self.getBody();
			
			self._loadCounter++;
			
			var isExists = $("#"+opt.id+"-laoding-mask-wraper");
			if( isExists.length ) {
				var maskMsg = $("#"+opt.id+"-laoding-mask-msg");
				maskMsg.html( msg );
				self.resizeLoadMask();
				return self;
			}
			var maskWraper = $('<div id="'+opt.id+'-laoding-mask-wraper" class="nex-loading-mask-wraper"><div id="'+opt.id+'-mask" class="nex-loading-mask"></div><div id="'+opt.id+'-laoding-mask-msg" class="nex-loading-mask-msg">'+msg+'</div><div>');
			$(render).append(maskWraper);
			
			maskWraper.click(function(e){
				e.stopPropagation();
				e.preventDefault();											 
			});
			
			self.resizeLoadMask();
			
			return self;
		},
		resizeLoadMask : function(){
			var self = this,
				opt = self.configs;	
			if( self.isAutoWidth() && Nex.isIE6 ) {
				var maskWraper = $("#"+opt.id+"-laoding-mask-wraper");	
				maskWraper._outerHeight( maskWraper.outerHeight() );
			}
			var maskMsg = $("#"+opt.id+"-laoding-mask-msg");
			var w = maskMsg.outerWidth();
			maskMsg.css("marginLeft",-w/2+"px");
			return self;
		},
		hideLoading : function(render){
			var self = this,
				opt = self.configs;
			self._loadCounter--;
			self._loadCounter = self._loadCounter<0?0:self._loadCounter;
			if( self._loadCounter<=0 ) {
				$("#"+opt.id+"-laoding-mask-wraper").remove();	
			}
			return self;
		},
		setWidth : function( w ){
			this.setSize(w);	
			return this;
		},
		setHeight : function( h ){
			var undef;
			this.setSize(undef,h);	
			return this;
		},
		getWidth : function(){
			//最好用 this.C('_width')
			return this.el.outerWidth() || 0;	
		},
		getHeight : function(){
			//最好用 this.C('_height')
			return this.el.outerHeight() || 0;	
		},
		width : function( w ){
			var undef;
			if( w === undef ) {
				return this.getWidth();	
			} else {
				var ft = String(w).charAt(0);
				if( ft === '+' || ft === '-' ) {
					w = w.slice(1);
					var _w = this.getWidth();
					w = ft == '+' ? _w + parseInt(w) : _w - parseInt(w);
				}
				this.setWidth(w);	
			}
		},
		height : function( w ){
			var undef;
			if( w === undef ) {
				return this.getHeight();	
			} else {
				var ft = String(w).charAt(0);
				if( ft === '+' || ft === '-' ) {
					w = w.slice(1);
					var _w = this.getHeight();
					w = ft == '+' ? _w + parseInt(w) : _w - parseInt(w);
				}
				this.setHeight(w);	
			}
		},
		_getDiffHeight : function(){
			return this.el._outerHeight() - this.getBody()._height();	
		},
		_getDiffWidth : function(){
			return this.el._outerWidth() - this.getBody()._width();	
		},
		/*
		* 不太适合panel计算
		*/
		_getAutoSize : function(){
			var bd = this.getBody();
			
			$.effects.save( bd,['overflow','width','height','position'] );
			
			var dh = this._getDiffHeight();
			var dw = this._getDiffWidth();
			
			bd.css({
				overflow : 'hidden'
				,width : ''
				,height : ''
				,position : 'absolute'
			});
			if( Nex.isIE6 ) {
				bd._removeStyle( 'width height' );
			}
			var size = {
				height : dh + bd._height(),
				width : dw + bd._width()	
			};
		
			$.effects.restore( bd,['width','height','position'] );
			return 	size;	
		},
		autoSetHeight : function(){
			this.height( (this._getAutoSize()).height );
			$.effects.restore( this.getBody(),['overflow'] );
			return this;
		},
		autoSetWidth : function(){
			this.width( (this._getAutoSize()).width );
			$.effects.restore( this.getBody(),['overflow'] );
			return this;	
		},
		autoSetSize : function(){
			this.setSize( this._getAutoSize() );
			$.effects.restore( this.getBody(),['overflow'] );
			return this;	
		},
		getSize : function(){
			return {
				width : this.getWidth(),
				height : this.getHeight()
			};
		},
		autoSize : function(){
			this.setSize('auto','auto');	
			return this;
		},
		autoHeight : function(){
			var undef;
			this.setSize(undef,'auto');	
			return this;	
		},
		autoWidth : function(){
			var undef;
			this.setSize('auto',undef);	
			return this;	
		},
		getScrollView : function(){
			return this.getBody();	
		},
		onScroll : function(){},
		onScrollLeft : function(){},
		onScrollTop : function(){},
		_setScrollEvent : function(){
			var self = this;
			var opt = self.configs;
			var bd = self.getScrollView();	
			var callBack = function(type,e){
				var pos = {
					left : $(this).scrollLeft(),
					top : $(this).scrollTop()	
				}
				self.onScroll( pos, this, e, opt );
				self.onScrollLeft( pos.left, this, e, opt );
				self.onScrollTop( pos.top, this, e, opt );
				var r = self.fireEvent(type,[ pos, this, e, opt ]);
				if( r === false ) {
					e.stopPropagation();
					e.preventDefault();
				}
			};
			if( opt.denyEvents === true ) {
				return;
			}
			var events = {
				'scroll.html' : function(e){
					callBack.call(this,'onScroll',e);
					var $this = $(this);
					if( $this.scrollTop()<=0 ) {
						self.fireEvent('onScrollTopStart',[ this,e,opt ]);		
					} else if( $this.scrollLeft()<=0 ) {
						self.fireEvent('onScrollLeftStart',[ this,e,opt ])
					}
					if( self.isScrollEnd( this,'top' ) ) {
						self.fireEvent('onScrollTopEnd',[ this,e,opt ]);	
					}
					if( self.isScrollEnd( this,'left' ) ) {
						self.fireEvent('onScrollLeftEnd',[ this,e,opt ]);	
					}
				}
			};
			bd.unbind('scroll.html');
			bd.bind(events);
		},
		setContainerEvent : function(){
			var self = this;
			var opt = self.configs;
			var container = self.getContainer();
			//事件绑定
			if( opt.denyEvents === true ) {
				return false;
			} else if( $.isFunction(opt.denyEvents) ) {
				opt.denyEvents.call(self);	
				return false;
			}
			
			var callBack = function(type,e){
				var r = self.fireEvent(type,[ this,e,opt ]);
				if( r === false ) {
					e.stopPropagation();
					e.preventDefault();
				}
			};
			var events = {
				'focusin.html' : function(e) {
					callBack.call(this,'onFocusin',e);
				},
				'focusout.html' : function(e) {
					callBack.call(this,'onFocusout',e);
				},
				'focus.html' : function(e) {
					callBack.call(this,'onFocus',e);
				},
				'blur.html' : function(e) {
					callBack.call(this,'onBlur',e);
				},
				'click.html' : function(e) {
					callBack.call(this,'onClick',e);
				},
				'dblclick.html' : function(e) {
					callBack.call(this,'onDblClick',e);
				},
				'keydown.html' : function(e) {
					callBack.call(this,'onKeyDown',e);
				},
				'keyup.html' : function(e) {
					callBack.call(this,'onKeyUp',e);
				},
				'keypress.html' : function(e){
					callBack.call(this,'onKeyPress',e);
				},
				'mousewheel.html' : function(e){
					callBack.call(this,'onMouseWheel',e);	
				},
				'mouseenter.html' : function(e){
					callBack.call(this,'onMouseEnter',e);
				},
				'mouseleave.html' : function(e){
					callBack.call(this,'onMouseLeave',e);
				},
				'mouseover.html' : function(e){
					callBack.call(this,'onMouseOver',e);
				},
				'mouseout.html' : function(e){
					callBack.call(this,'onMouseOut',e);
				},
				'mousedown.html' : function(e) {
					callBack.call(this,'onMouseDown',e);
				},
				'mouseup.html' : function(e) {
					callBack.call(this,'onMouseUp',e);
				},
				'contextmenu.html' : function(e){	
					callBack.call(this,'onContextMenu',e);
				}
			};
			
			if( $.isArray( opt.denyEvents ) ) {
				$.each( opt.denyEvents,function(i,e){
					delete events[e];
				} );	
			}
			container.unbind('.html');
			container.bind(events);
			self.fireEvent("onSetContainerEvent",[container,opt]);
			return true;
		},
		__containerCreate : false,
		_containerWidth : null,
		_containerHeight : null,
		//容器创建时就应该立刻设置宽度
		_initSetContainerSize : function(){
			var self = this;
			var opt = self.configs;	
			
			self.__containerCreate = true;
			
			self.setContainerSize();
			
			self.__containerCreate = false;
			//清除缓存
			self._containerWidth = null;
			self._containerHeight = null;
		},
		_checkAutoSize : function(){
			var self = this;
			var opt = self.configs;	
			
			if( !self.rendered ) return false;
			
			if( opt.width === 'auto' || opt.height==='auto' ) {
				var r = self.setSize();
				if( r ) {
					return true;	
				}
			}
			
			return false;
		},
		//检测 width height auto时的maxWidth or maxHeight
		_autoSize : function(){
			var self = this;
			var opt = self.configs;	
			
			if( !self.rendered ) return this;
			
			var r = self._checkAutoSize();
			if( !r && opt._checkScrollBar ) {
				self.methodInvoke('resetViewSize');		
			}	
			return this;	
		},
		addChild : function( items,after ){
			var bd = this.getBody();
			var opt = this.configs;
			this._checkToRender();
			this.addComponent( bd,items,after,opt.defaluts );	
			return this;
		},
		_add : function( item , after ){
			return this._insert.apply(this,arguments );	
		},
		add : function( item , after ){
			return this.insert.apply(this,arguments );	
		},
		append : function( item ){
			return this.insert( item,true );	
		},
		prepend : function( item ){
			return this.insert( item,false );	
		},
		_insert : function( item , after ){
			var self = this;
			var opt = self.C();	
			var lbody = self.getBody();
			
			self._checkToRender();
			
			var list = self.addComponent( lbody,item,after,opt.defaluts  );
			
			if( opt.__insertVt ) {
				clearTimeout(opt.__insertVt);	
			}
			opt.__insertVt = setTimeout( function(){
				self._autoSize();						 
			},0 );
			
			return list;
		},
		insert : function(item , after ){
			var self = this;
			var opt = self.configs;	
			var list = self._insert.apply(self,arguments );	
			self.fireEvent('onAddComponent',[ list,opt ]);
			return list;
		},
		_empty : function(){
			var self = this;
			var opt = self.configs;	
			var lbody = self.getBody();	
			
			lbody.empty();
			
			//self.removeCmp( false );
			Nex.gc();
			
			if( opt.__insertVt ) {
				clearTimeout(opt.__insertVt);	
			}
			opt.__insertVt = setTimeout( function(){
				self._autoSize();					 
			},0 );
			
			return self;
		},
		empty : function(){
			var self = this;
			var opt = self.configs;	
			var x = self._empty.apply(self,arguments );	
			self.fireEvent('onClearComponent',[ opt ]);
			return x;
		},
		_html : function( item , after ){
			this._empty();
			this._insert( item,after );
		},
		html : function( item , after ){
			this.empty();
			this.insert( item,after );
			return this;
		},
		update : function(){
			return this.html.apply( this,arguments );
		},
		removeAll : function(){
			return this.empty.apply(this,arguments );		
		},
		_setOverCls : function(){
			var self = this,
				opt = self.configs,
				container = this.el;
			if( opt.overCls ) {
				container.addClass( opt.overCls );	
			}
		},
		_unsetOverCls : function(){
			var self = this,
				opt = self.configs,
				container = this.el;
			if( opt.overCls ) {
				container.removeClass( opt.overCls );	
			}
		},
		_setBorder : function(){
			var opt = this.configs;
			var el = this.el;
			if( opt.border && $.type( opt.border ) === 'string' ) {
				el.css('border',opt.border);	
			}
			if( opt.borderStyle && typeof opt.borderStyle === 'object' ) {
				el.css( opt.borderStyle );	
			}
		},
		_setPadding : function(){
			var self = this,
				opt = self.configs;
			var ct = self.el;
			if( opt.padding !== null ) {
				ct.css('padding',opt.padding);
			}
		},
		_setMargin : function(){
			var self = this,
				opt = self.configs;
			var ct = self.el;
			if( opt.margin !== null ) {
				ct.css('margin',opt.margin);
			}
		},
		_setOverflow : function(){
			var self = this,
				opt = self.configs;
			var ct = self.el;
			if( opt.overflow ) {
				ct.css('overflow',opt.overflow);
			}	
		},
		_setAutoScrollCls : function(){
			var self = this,
				opt = self.configs;
			var ct = self.getBody();
			if( opt.autoScroll ) {
				ct.addClass(opt.autoScrollCls);
			}
		},
		focus : function(){
			var self = this,
				opt = this.configs,
				el;
			if( el = self.getBody() ) {
				if( opt.tabIndex === false || opt.tabIndex===null ) {
					el.attr({
						tabIndex : -1   
					});	
				}	
				el.focus();
			}	
			return self;
		},
		scrollLeft : function( sLeft ){
			var self = this,
				undef;
			self.scrollBy( sLeft,undef );	
			return self;
		},
		scrollToLeftEnd : function(){
			var self = this;
			var bd = $(self.getBody())[0];
			if( !bd ) {
				return self;	
			}
			var ch = bd.clientWidth;
			var sh = bd.scrollWidth;
			if( sh <= ch ){
				return self;	
			}
			
			var sTop = sh - ch;
			self.scrollLeft( sTop );
			return self;
		},
		scrollTop : function( sTop ){
			var self = this,
				undef;
			self.scrollBy( undef,sTop );	
			return self;	
		},
		scrollToTopEnd : function(){
			var self = this;
			var bd = $(self.getBody())[0];
			if( !bd ) {
				return self;	
			}
			var ch = bd.clientHeight;
			var sh = bd.scrollHeight;
			
			if( sh <= ch ){
				return self;	
			}
			
			var sTop = sh - ch;
			self.scrollTop( sTop );
			return self;
		},
		scrollBy : function(x,y,ani,func){
			var self = this,
				opt = this.configs,
				undef,
				func = func || $.noop,
				el = self.getBody();
			var pos = {};
			if( x !== undef ) {
				pos['scrollLeft'] = x;	
			}
			if( y !== undef ) {
				pos['scrollTop'] = y;	
			}
			
			if( !$.isEmptyObject( pos ) ) {
				if( ani === undef || ani <= 0 || !ani ) {
					/*el.animate( pos , 1 , function(){	
						func.call( self,el );
					});		*/
					for( var ac in pos ) {
						el[ac]( pos[ac] );
					}
					func.call( self,el );
				} else {
					el.animate( pos , Math.abs(ani) , function(){
						func.call( self,el );
					} );	
				}
			}
			return self;
		},
		setStyle : function( style ){
			this.el.css(style || {});
			return this;		
		},
		setBorder : function( str ){
			this.el.css('border',str);	
			return this;
		},
		addCls : function( s ){
			this.el.addClass( s );
			return this;	
		},
		addClass : function( s ){
			this.addCls( s );	
			return this;
		},
		removeCls : function( s ){
			this.el.removeClass( s );
			return this;		
		},
		removeClass : function( s ){
			this.removeCls( s );
			return this;		
		},
		_normalizeArguments : function( effect, options, speed, callback ){

			// allow passing all options as the first parameter
			if ( $.isPlainObject( effect ) ) {
				options = effect;
				effect = effect.effect;
			}
		
			// convert to an object
			effect = { effect: effect };
		
			// catch (effect, null, ...)
			if ( options == null ) {
				options = {};
			}
		
			// catch (effect, callback)
			if ( $.isFunction( options ) ) {
				callback = options;
				speed = null;
				options = {};
			}
		
			// catch (effect, speed, ?)
			if ( typeof options === "number" || $.fx.speeds[ options ] ) {
				callback = speed;
				speed = options;
				options = {};
			}
		
			// catch (effect, options, callback)
			if ( $.isFunction( speed ) ) {
				callback = speed;
				speed = null;
			}
		
			// add options to effect
			if ( options ) {
				$.extend( effect, options );
			}
		
			speed = speed || options.duration;
			effect.duration = $.fx.off ? 0 :
				typeof speed === "number" ? speed :
				speed in $.fx.speeds ? $.fx.speeds[ speed ] :
				$.fx.speeds._default;
		
			effect.complete = callback || options.complete;
		
			return effect;	
		},
		_standardAnimationOption : function( option ){
			// Valid standard speeds (nothing, number, named speed)
			if ( !option || typeof option === "number" || $.fx.speeds[ option ] ) {
				return true;
			}
		
			// Invalid strings - treat as "normal" speed
			if ( typeof option === "string" && !$.effects.effect[ option ] ) {
				return true;
			}
		
			// Complete callback
			if ( $.isFunction( option ) ) {
				return true;
			}
		
			// Options hash (but not naming an effect)
			if ( typeof option === "object" && !option.effect ) {
				return true;
			}
		
			// Didn't match any standard API
			return false;	
		},
		_getStandardAnimationOption : function ( option,easing,callback ) {
			var data = {};
			
			// Options hash (but not naming an effect)
			if ( typeof option === "object" && !option.effect ) {
				data = option;
			}
			
			// Valid standard speeds (nothing, number, named speed)
			if ( typeof option === "number" || $.fx.speeds[ option ] ) {
				data.duration = option;
			}
			
			// Invalid strings - treat as "normal" speed
			if ( typeof option === "string" && !$.effects.effect[ option ] ) {
				data.duration = option in $.fx.speeds ? $.fx.speeds[ speed ] : $.fx.speeds._default;
			}
			
			//option,easing,callback
			if( typeof easing === "string" && !$.isFunction( easing ) ) {
				data.easing = easing in $.easing ? easing : 
								'def' in $.easing ? $.easing.def : 'swing';	
			}
			
			//option,callback
			if( $.isFunction( easing ) ) {
				data.complete = easing;	
			}
		
			// Complete callback
			if ( $.isFunction( callback ) ) {
				data.complete = callback;
			}
			// Didn't match any standard API
			return data;
		}, 
		hidden : false, 
		isVisible : function(){
			return !this.hidden;	
		},
		isHidden : function(){
			return this.hidden;	
		},
		_defaultShow : function( fn ){
			var self = this;
			var opt = this.configs;
			var container = self.el;
			
			var show_display = function(){
				container.show();	
			}
			var show_offsets = function(){
				container._show();		
			}
			var show_visibility = function(){
				container._visible(true);	
			}
			switch( opt.hideMode ) {
				case 'display' :
					show_display();
					break;
				case 'offsets' : 
					show_offsets();
					break
				case 'visibility' :
					show_visibility();
					break;
				default :
				show_display();			
			}
			
			container.show();
			
			if( $.isFunction( fn ) ) {
				fn();	
			}
			
			return self;		
		},
		_defaultHide : function( fn ){
			var self = this;
			var opt = this.configs;
			var container = self.el;
			
			var hide_display = function(){
				container.hide();	
			}
			var hide_offsets = function(){
				container._hide();		
			}
			var hide_visibility = function(){
				container._visible(false);	
			}
			switch( opt.hideMode ) {
				case 'display' :
					hide_display();
					break;
				case 'offsets' : 
					hide_offsets();
					break
				case 'visibility' :
					hide_visibility();
					break;
				default :
				hide_display();			
			}
			
			self.setAcceptResize( false );
			
			if( $.isFunction( fn ) ) {
				fn();	
			}
			
			return self;	
		},
		_animShow : function( fn,data,args ){
			var self = this;
			var opt = this.configs;
			var container = self.el;
			
			var data = data || {};	
				
			var isEffect = 'effect' in data;
			if( isEffect ) {
				data.mode = 'show'	
			}
			if( $.isFunction(fn) ) {
				data.complete = fn;
			}
			container.stop( true,true );
			
			isEffect ? container.effect( data ) : container[opt.showMethod].call( container,data );
			return self;
		},
		_animHide : function( fn,data,args ){
			var self = this;
			var opt = this.configs;
			var container = self.el;
			
			var data = data || {};	
				
			var isEffect = 'effect' in data;
			if( isEffect ) {
				data.mode = 'hide'	
			}
			if( $.isFunction(fn) ) {
				data.complete = fn;
			}
			container.stop( true,true );
			isEffect ? container.effect( data ) : container[opt.hideMethod].call( container,data );
			return self;
		},
		_getAnimateOptions : function(){
			var self = this;
			var args = [].slice.apply( arguments );
			if( typeof args[0] === 'boolean' ) {
				args.shift();
			}
			var data = self._standardAnimationOption.apply( self,args ) ? 
						self._getStandardAnimationOption.apply( self,args ) : 
						self._normalizeArguments.apply( self,args );	
			return data;			
		},
		_showBeforeEffect : function(){
			var el = this.el;	
			el._show();
			el.hide();
		},
		isShowing : false,
		onBeforeShow : function(){},
		//effect, speed, easing, callback
		show : function( option ){
			var self = this;
			var opt = this.configs;
			var container = self.el;
			var args = [].slice.apply( arguments );
			var data;
			
			var animate = typeof args[0] === 'boolean' ? args[0] : opt.animate;
			if( typeof args[0] === 'boolean' ) {
				args.shift();
			}
			
			if( self.isVisible() ) {//,arguments
				return self;	
			}
			
			if( self.fireEvent('onBeforeShow',[ opt ]) === false ) {//,arguments
				return self;	
			}
			
			self.onBeforeShow(opt);
			self.fireEvent('onStartShow',[ opt ]);
			
			self.hidden = false;
			self.isShowing = true;
			
			self._checkToRender();
			
			var complete = function(){
				self.isShowing = false;
				self.setAcceptResize( true );
				if( opt.autoResize ) {
					self.resetSize();
				}
				self.fireEvent('onShow',[ opt ]);	
			};
			data = self._getAnimateOptions.apply(self,args);
			
			data = $.extend( { duration : opt.animDuration,easing : opt.animEasing },opt._effect,opt.effect,opt.showEffect,data );
			var cb = data.complete;	
			data.complete = function(){
				complete();	
				if( $.isFunction( cb ) ) {
					cb.call( self );
				}
			}	
			//showFn
			var showFn = $.isFunction( opt.showFn ) ? opt.showFn : 
							animate ? self._animShow : self._defaultShow;
		
			self._showBeforeEffect();	

			showFn.call( self, data.complete, data, args );		
			
			return self;	
		},
		onBeforeHide : function(){},
		_hideBeforeEffect : function(){},
		//effect, speed, easing, callback
		hide : function( option ){
			var self = this;
			var opt = this.configs;
			var container = self.el;
			var args = [].slice.apply( arguments );
			var data;
			
			var animate = typeof args[0] === 'boolean' ? args[0] : opt.animate;
			if( typeof args[0] === 'boolean' ) {
				args.shift();
			}
			
			if( self.rendered && self.isHidden() ) {//,arguments
				return self;	
			}
			
			if( self.fireEvent('onBeforeHide',[ opt ]) === false ) {//,arguments
				return self;	
			}
			
			if( !self.rendered ) return self;
			
			self.onBeforeHide(opt);
			self.fireEvent('onStartHide',[ opt ]);
			
			self.hidden = true;
			
			self.setAcceptResize( false );
			
			//$.effects.save( container, ['display'] );
			
			var complete = function(){
				self.fireEvent('onHide',[ opt ]);		
				//if( animate ) {
				//	self._defaultHide( function(){
				//		$.effects.restore( container, ['display'] );
				//	} );
				//}
			};
			data = self._getAnimateOptions.apply(self,args);
			
			data = $.extend( { duration : opt.animDuration,easing : opt.animEasing },opt._effect,opt.effect,opt.hideEffect,data );
			var cb = data.complete;	
			data.complete = function(){
				
				complete();	
				if( $.isFunction( cb ) ) {
					cb.call( self );
				}
			}	
			//hideFn
			var hideFn = $.isFunction( opt.hideFn ) ? opt.hideFn : 
							animate ? self._animHide : self._defaultHide;
			//如果是自定义显示函数或者开启animate则需要调用	effect_before
			//if( animate || $.isFunction( opt.hideFn ) ) {
				self._hideBeforeEffect();		
			//}	
			hideFn.call( self, data.complete, data, args );		
			return self;		
		},
		effect : function(){
			this.el.effect.apply( this.el,arguments );
			return this;	
		}
	});
	
	return container;
});