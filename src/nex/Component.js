(function(){
	Nex.define('Nex.Component',{
		extend : 'Nex.AbstractComponent',
		xtype : 'component',
		_isInit : false,
		configs : function(){
			return {
				prefix : 'component-',
				tag : 'div',
				renderTo : document.body,
				renderAfter : true,
				autoDestroy : true,//自动回收 ，如果el 不存在时会触发
				autoResize : false,//如果你的组件大小都是一个固定值应该设置为false 如果可以是百分比或者auto 则应该设置true
				selectionable : true, 
				autoSize : false,
				width : '', 
				height : '',
				realWidth : null,//实际 ,width=auto时 如果max min width height 没起作用那么realWidth = auto
				realHeight : null,//同上
				_width : null,//和realWidth 不同的是 _width是一个数值
				_height : null,
				__width : 0,
				__height : 0,
				maxWidth : 0,
				maxHeight : 0,
				minHeight : 0,
				minWidth : 0,
				disabledItems : false,
				focusable : true,
				tabIndex : false,
				attrs : {},
				style : {},
				'class' : '',
				containerCls : 'nex-component',
				borderCls    : '',
				uiPrefix  : 'nex-ui',
				ui : 'defalut',//default = nex-ui-default
				uiCls : [],//icon = nex-ui-default-icon
				cls : '',
				cssText : ''
			}	
		},
		onStart : function( opt ){
			this.callParent(arguments);
			opt.__width = opt.width;
			opt.__height = opt.height;
		},
		renderedContainer : false,
		initContainer : function(){
			var self = this;
			var opt = self.configs;	
			
			self.callParent(arguments);
			
			if( self.renderedContainer ) {
				return self;	
			}
			
			var render = $( $.isWindow(opt.renderTo) ? document.body : opt.renderTo );
			var container;
			
			var cls = [
				opt.containerCls,
				'nex-component-item'
			];
			
			if( opt.border === true ) {
				cls.push( opt.borderCls );	
			}
			
			if( opt.ui ) {
				var ui = [opt.uiPrefix,opt.ui].join('-')
				cls.push(ui);	
				var uiCls = $.isArray(opt.uiCls) ? opt.uiCls : [ opt.uiCls ];
				$.each( uiCls,function(i,uc){
					if( !uc ) return;
					cls.push( [ui,uc].join('-') );	
				} );
			}
			if( opt['cls'] ) {
				cls.push( opt['cls'] );	
			}
			if( opt['class'] ) {
				cls.push( opt['class'] );	
			}
			var tag = opt.tag || 'div';
			
			container = $( document.createElement( tag ) );
			container.attr({
				id : opt.id,
				"class" : cls.join(' ')	
			});
		
			if( opt.renderAfter ) {
				render.append(container);
			} else {
				render.prepend(container);
			}
			opt.views['container'] = container;
			
			self.el = container;
			
			if( opt.cssText ) {
				container[0].style.cssText = opt.cssText;
			}
			container.attr( opt.attrs )
				     .css( opt.style );
			if( !opt.selectionable ) {
				self._disableSelection();	
			}
			
			if( opt.focusable && opt.tabIndex !== false ) {
				//设置tabIndex=-1 
				container.attr( {
					tabIndex : opt.tabIndex	   
				} );
			}
			
			self.renderedContainer = true;
			
			return self;
		},
		onContainerCreate : function(){},
		initRenderTpl : function(){
			var self = this;
			var opt = self.configs;	
			
			self.callParent(arguments);
			
			var el = self.el;
			
			var renderData = Nex.apply( {}, opt.renderData, opt );
			
			var tpl = opt.renderTpl;
			if( Nex.isFunction(tpl) ) {
				tpl = tpl.call(self,renderData);	
			} else if( Nex.isArray(opt.renderTpl) ) {
				tpl = self.tpl( tpl.join(''), renderData );	
			} else {
				tpl = self.tpl( tpl + "", renderData );		
			}
			
			el.html(tpl);
			
			$.each( opt.renderSelectors, function(k,s){
				opt.views[k] = $(s,el);	
				self[k] = opt.views[k];
			} );
			
			self.onContainerCreate(el, opt);
			
			self.fireEvent("onContainerCreate",[el,opt]);
			
			return self;	
		},
		initRenderContent : function(){
			this.doRenderContent();
			return this;	
		},
		//_appendContent
		doRenderContent : function(){
			var self = this;
			var opt = self.configs;	
			var lbody = self.getBody();
			if( opt.disabledItems ) return lbody;
			var items = opt['html'];
			self.addComponent( lbody,items,null,opt.defaults );
			var items = opt['items'];
			self.addComponent( lbody,items,null,opt.defaults );
			return lbody;
		},
		setSize : function(){
			return this.setContainerSize.apply(this,arguments);	
		},
		setContainerSize : function(width, height){
			var self = this,
				opt = self.configs;
			opt.width = Nex.unDefined(width, opt.width);
			opt.height = Nex.unDefined(height, opt.height);	
			var wh ={
				width : opt.width,
				height : opt.height	
			};
			self.fireEvent('onSetContainerSize',[wh,opt]);
			self.el.css({
				width : wh.width,
				height : wh.height	
			});
			return this;	
		},
		getContainer : function(){
			var self = this,
				opt = self.configs;
			return opt.views['container'];	
		},
		getBody : function(){
			var self = this,
				opt = self.configs;
			return opt.views['container'];
		},
		_disableSelection : function(){
			this.el.disableSelection();	
		},
		//判断当前对象是否还存在
		isExists : function(){
			var self = this,
				opt = self.configs,
				dom = self.getDom();
			if( !self.isRendering() ) {
				return true;	
			}	
			if( dom.length ) {
				return true;	
			} else {
				if( opt.autoDestroy ) {
					self.removeCmp(opt.id);	
				}	
			}
			return false;
		},
		/*
		*解析xtype 到容器
		*@param {String,Dom} 容器
		*@param {Array,Nex,Xtype} 组件列表 
		*@param {Boolean}  true:append(默认) false:prepend,
		*@param {Object} defaults
		*/
		parseItems : function(renderTo,items,after,def){
			var self = this,
				opt = self.configs,
				undef;
			var after = (after === undef) || (after === null) ? true : after;
			
			var def = $.extend({ xtype : opt.defalutxType }, def || {});
			
			var ac = after ? 'append' : 'prepend';
			if( $.isFunction( items ) && !Nex.isClass( items ) ) {
				items = items.call( self,renderTo );
			}
			var components = [];
			var items = Nex.isArray( items ) ? items : [items];
			if( renderTo && items.length ) {
				for( var i=0;i<items.length;i++ ) {
					var _item = items[i];
					if( _item === '' || _item === undef ) continue;
					if( Nex.isFunction( _item ) && !Nex.isClass( _item ) ) {
						_item = _item.call(self,renderTo,opt);	
						if( _item === '' 
							|| $.type( _item ) === 'boolean' 
							|| $.type( _item ) === 'null' 
							|| $.type( _item ) === 'undefined' 
						) {
							continue;	
						}
					}
					if( Nex.isPlainObject( _item ) && !Nex.isInstance( _item ) ) {
						_item = $.extend( {}, def, _item );	
					}
					if( Nex.isInstance( _item ) ) {
						//$( renderTo )[ac]( _item.getDom() );
						_item.render( renderTo,ac );
						components.push( _item );
						//self.addChildCmpList( _item );
					} else if( Nex.isClass( _item ) || Nex.isXtype( _item ) ){
						if( !Nex.Create ) continue;
						var cmp;
						if( Nex.isXtype( _item ) ) {
							cmp = Nex.Create( $.extend( { parent : opt.id }, _item, {renderTo:renderTo,autoRender:true} ) );	
						} else {
							cmp = Nex.Create( _item,$.extend({},def,{renderTo:renderTo,parent : opt.id,autoRender:true}) );		
						}
						components.push( cmp );
						//self.addChildCmpList( cmp );
						//这里可以改成设置参数 renderAfter : after
						if( !after ) {
							$( renderTo )[ac]( cmp.getDom() );	
						}
					} else if( Nex.isjQuery( _item ) || Nex.isElement( _item ) ) {
						$( renderTo )[ac]( _item );	
						components.push( _item );
					} else {
						_item = _item + '';
						var html = $._parseHTML( _item );//修正相同字符 不创建bug
						html = $(html).clone();
						components.push( html );
						$( renderTo )[ac]( html );				
					}	
				}
			}
			return components;
		},
		addComponent :　function( renderTo,items,after ){
			return this.parseItems.apply(this,arguments);
		},
		addCmp :　function( renderTo,items,after ){
			return this.parseItems.apply(this,arguments);
		},
		/*
		*解析xtype 到容器
		*@param {Array,Nex,Xtype} 组件列表 
		*@param {String,Dom} 容器
		*@param {Boolean} 内部插入 默认是 后 
		*/
		renderComponent : function( items,renderTo,after,def ){
			return this.parseItems( renderTo,items,after,def );	
		},
		//应该放到Html组件 因为有部分组件没有继承Html 所以先放在这里
		renderTo : function( obj,after ){
			var self = this;
			var opt = this.configs;
			var undef;
			var after = after === undef ? true : after;
			var ac = after ? 'append' : 'prepend';
			if( !obj ) return self;
			if( !self.isExists() ) return self;
			var _st = false;
			if( Nex.isInstance( obj ) && obj.isExists() ) {
				var bd = obj.getBody();
				bd[ac]( self.getEl() );
				_st = true;
			} else {
				var el = $(obj);
				if( el.length ) {
					el[ac]( self.getEl() );	
					_st = true;
				}	
			}
			if( opt.autoResize && _st ) {
				self.resize();
				//if( Nex.ComponentManager ) {
					Nex.ComponentManager.cmpChange();	
				//}
			}
			return self;
		},
		getDom : function(){
			var self = this,
				opt = self.configs;
			return $('#'+opt.id);
		},
		getEl : function(){
			return this.el || this.getDom();	
		},
		getChildrens : function(){
			var opt = this.configs;
			return Nex.ComponentManager.getChildrens( opt.id );	
		},
		getAllChildrens : function(){
			var opt = this.configs;
			return Nex.ComponentManager.getAllChildrens( opt.id );	
		},
		//获取组件的父级组件
		getParent : function(){
			var el = this.getDom(),
				opt = this.configs,
				cmp = null;
			if( !el.length ) return cmp;
			if( opt.parent !== null ) {
				if( Nex.isInstance( opt.parent ) ) {
					return opt.parent;	
				}
				var _p = Nex.get(opt.parent);
				if( _p ) return _p;
			}
			var p = el.parent('.nex-component-item'),
				_id = p.attr('id');
			cmp = _id ? Nex.get(id) : null;
			return cmp ? cmp : null;
		},
		
		/*
		*判断元素垂直滚动条是否滚动到底 @dom
		*/
		_checkYScrollEnd : function( el ){
			return Nex._checkYScrollEnd( el );
		},
		/*
		*判断元素水平滚动条是否滚动到底 @dom
		*/
		_checkXScrollEnd : function( el ){
			return Nex._checkXScrollEnd( el );	
		},
		/*
		*验证是否滚动到低 @el dom @a left/top
		*/
		isScrollEnd : function( el,a ){
			return Nex.isScrollEnd( el,a );	
		},
		//应该放到html
		//计算 max/min/cut width height 
		__getCalcSize : function( size,t ){
			var self = this,
				undef,
				opt = this.configs;	
			if( $.isFunction( size ) ) {
				size = size.call( self );	
			}
			if( size === undef ) size = 0;
			//暂不提供百分比支持
			size = parseInt(size);
			return 	isNaN(size)?0:size;	
		},
		_getCutWidth : function(){
			var self = this,
				opt = this.configs;	
			//var pw = opt.pWidth;
			var size = opt.cutWidth;
			return 	self.__getCalcSize(size,0);
		},
		_getCutHeight : function(){
			var self = this,
				opt = this.configs;	
			var size = opt.cutHeight;
			return 	self.__getCalcSize(size,1);
		},
		_getMinWidth : function(){
			var self = this,
				opt = this.configs;	
			var size = opt.minWidth;
			return 	self.__getCalcSize(size,0);
		},
		_getMaxWidth : function(){
			var self = this,
				opt = this.configs;	
			var size = opt.maxWidth;
			return 	self.__getCalcSize(size,0);	
		},
		_getMinHeight : function(){
			var self = this,
				opt = this.configs;	
			var size = opt.minHeight;
			return 	self.__getCalcSize(size,1);		
		},
		_getMaxHeight : function(){
			var self = this,
				opt = this.configs;	
			var size = opt.maxHeight;
			return 	self.__getCalcSize(size,1);			
		},
		/*
		* 把自己从管理从删除 会触发onDestroy 
		*/
		removeCmp :  function(){
			this.callParent(arguments);
			Nex.gc();
		},
		destroy : function(){
			this.el.remove();
			this.callParent();
			return this;
		}
	});	
})();