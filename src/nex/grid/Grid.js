/*
Tips:
	尽量不要写内联样式,会倒置渲染变得非常卡，特别是IE超级卡！！
------
1.dateFormat。。货币类型。。 
2.分页。。。
3.单选/多选。。。
4.
*/
(function( factory ) {
	if ( typeof $define === "function" ) {
		
		$define([
			'Nex.grid.AbstractGrid'
		], function(){
			
			factory( jQuery );	
		} );
	} else {

		factory( jQuery );
	}
}(function( $ ) {
	var grid = Nex.define('Nex.grid.Grid',{
		extend : 'Nex.grid.AbstractGrid',
		xtype : 'grid gridpanel',
		alias : 'Nex.Grid',
		configs : function(opt){
			return {
				resizeColumnReal : false,
				containerCls : [opt.containerCls,'nex-grid'].join(' '),
				_defRowCls : 'nex-grid-grid',
				_columnMetaData : Nex.apply( opt._columnMetaData, {
					width : 120	
				} ),
				tpl : Nex.apply( opt.tpl, {
					'view' : '<div id="<%=id%>_view" class="nex-grid-view"><div id="<%=id%>_dataview" class="nex-grid-dataview"><div id="<%=id%>_dataview_headerCt" class="nex-grid-dataview-headerct"><div id="<%=id%>_dataview_header" class="nex-grid-header nex-grid-dataview-header"></div></div><div id="<%=id%>_dataview_body" class="nex-grid-dataview-body"></div></div></div>'
				} )
			};	
		}	
	});
	grid.override({
		_setGridLayoutCss : function(){
			var self = this;
			var opt = this.configs;	
			self.addGridCssRules(
				'.nex-grid-table',
				'table-layout: fixed;width: 0px;'
			);
			return self;
		},
		getScrollView : function(){
			return this.configs.views['gridBody'];	
		},
		getGridHeaderHtml : function(){
			return [
				'<table class="nex-grid-table nex-grid-header-table" cellpadding="0" cellspacing="0" border="0">',
					'<tbody>',
						this.callParent( arguments ),
					'<tbody>',
				'</table>'
			].join('');	
		},
		getGridRowsHtml : function(){
			return [
				'<table class="nex-grid-table nex-grid-body-table" cellpadding="0" cellspacing="0" border="0">',
					'<tbody>',
						this.callParent( arguments ),
					'<tbody>',
				'</table>'
			].join('');		
		},
		setGridDataViewSize : function(){
			var self = this;
			var opt = this.configs;
			self.callParent( arguments );
			var $view = self.getGridView();
			var $dataView = self.getGridDataView();	
			var $gridBody = self.getGridDataBody();	
			var $gridHeader = self.getGridDataHeader();
			if( !self.isAutoWidth() ) {
				$dataView._outerWidth( $view._width() );
				$gridBody._outerWidth( $dataView._width() );
			} else {
				$dataView._removeStyle('width');	
				$gridBody._removeStyle('width');	
			}
			if( !self.isAutoHeight() ) {
				$dataView._outerHeight( $view._height() );
				$gridBody._outerHeight( $dataView._height() - $gridHeader._outerHeight() );
			} else {
				$dataView._removeStyle('height');	
				$gridBody._removeStyle('height');	
			}
		},
		doRenderContent : function(){
			this.callParent( arguments );
			this.setGridViewSize();	
		},
		onScrollLeft : function( left, el, e, opt ){
			var self = this;
			var header = self.getGridDataHeader();
			header.css({
				marginLeft : -left
			});	
		}
	});
}));