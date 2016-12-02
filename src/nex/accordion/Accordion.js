/*
Nex.accordion.Accordion
*/
define(function(require){
	require('Nex/panel/Panel');
	var accordion = Nex.define('Nex.accordion.Accordion',{
		extend : 'Nex.panel.Panel',
		alias : 'Nex.Accordion',
		xtype : 'accordion',
		configs : function(opt){
			return {
				prefix : 'nexaccordion-',
				autoResize : true,
				containerCls : [opt.containerCls,'nex-accordion'].join(' '),
				autoScrollCls : [opt.autoScrollCls,'nex-accordion-auto-scroll'].join(' '),
				borderCls : [opt.borderCls,'nex-accordion-border'].join(' '),
				autoScroll : false,
				border : false,
				expandOnEvent : 'click',//mouseover click dblclick
				//初始展开时才渲染内容
				lazyLoad : true,
				items : [],
				disabledItems : true,
				renderTo : document.body,
				width : 'auto',
				height : 'auto',
				singleExpand : true
			};
		}	
	});
	accordion.override({
		initComponent : function(opt) {
			var self = this;
			
			self.callParent(arguments);
			
			self.accordions = [];
			
			self.setAccordionItems();
		},
		accordionRendered : false,
		accordions : [],
		setAccordionItems : function(){
			var self = this,
				undef,
				opt = self.configs,
				bd = self.getBody();
				
			if( self.accordionRendered ) {
				return;	
			}	
			
			self.accordionRendered = true;
			
			var items = Nex.isArray( opt.items ) ? opt.items : [ opt.items ];
		
			$.each( items , function(index,item){
				
				item.id = Nex.unDefined( item.id, Nex.uuid() );
				
				var cfg = $.extend({
						cls : '',
						collapsible : true,
						showHeader  : true
					}, opt.defaluts, item);
				
				
				cfg.bodyPadding = cfg.padding;
				cfg.collapsed = true;
				cfg.cls = 'nex-accordion-item '+ cfg.cls;
				
				if( !opt.lazyLoad ) {
					cfg.html = item.html;
					cfg.items = item.items;	
				} else {
					cfg.html = '';
					cfg.items = [];	
				}
				
				
				cfg.border = false;
				cfg.padding = 0;
				cfg.renderTo = bd;
				
				var it = Nex.Create('panel', cfg);
				
				it.on('@onHeaderClick._sys', function(){
					if( opt.expandOnEvent == 'click' ) {
						this.toggleCollapse();	
					}	
				});
				
				it.on('@onHeaderDblClick._sys', function(){
					if( opt.expandOnEvent == 'dblclick' ) {
						this.toggleCollapse();	
					}	
				});
				
				var cid = it.on('@onHeaderMouseOver._sys', function(){
					if( opt.expandOnEvent == 'mouseover' ) {
						this.expand();	
					}	
				});
				
				var id = it.one('@onExpand', function(){
					var ibd = this.getBody();
					if( !opt.lazyLoad ) {
						return;	
					}
					self.addComponent( ibd, item.html, true, opt.defaluts  );
					self.addComponent( ibd, item.items, true, opt.defaluts  );
				});
			
				it.on('@onExpanding', function(){
					var me = this;
					if( opt.singleExpand ) {
						$.each( self.accordions, function(i, accord){
							if( me.configs.id == accord.configs.id ) {
								return;	
							}	
							if( !accord.collapsed ) {
								accord.collapse();
							} 
						} );	
					}
				});
				
				self.accordions.push(it);
				
				self.fireEvent('onAccordionItemCreate',[it, opt]);
			} );
			
			self.fireEvent('onAccordionsCreate',[self.accordions, opt]);
			
			return self;	
		},
		doSetViewSize : function(){
			var self = this;
			var opt = this.configs;
			var bd = self.getBody();	
			var accordions = self.accordions;
			
			self.callParent(arguments);	
			
			if( !self.isAutoWidth() ) {
				$.each(accordions, function(i, accord){
					accord.width( bd._width() );
				});
			}
			
			if( !self.isAutoHeight() ) {
				var allHeaderHeight = 0;
				var bodyHeight = bd._height();
				var accordionHeight = 0;
				$.each(accordions, function(i, accord){
					var h = accord.getHeader();
					allHeaderHeight += h._outerHeight();
				});
				accordionHeight = bodyHeight - (allHeaderHeight-allHeaderHeight/accordions.length);
				$.each(accordions, function(i, accord){
					accord.height( accordionHeight );
				});
			}
		},
		getItemData : function(id){
			var self = this;
			var opt = this.configs;
			var items = Nex.isArray( opt.items ) ? opt.items : [opt.items];
			for( var i=0;i<items.length; i++ ) {
				if( items[i].id == id ) {
					return items[i];	
				}	
			}
			return null;
		},
		getItemPanel : function(id){
			var self = this;
			var panels = this.accordions;
			for( var i=0;i<panels.length; i++ ) {
				if( panels[i].configs.id == id ) {
					return panels[i];
				}	
			}
			return null;
		}
	});
	
	return accordion;
});