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
			'Nex.Ajax',
			'Nex.panel.Panel',
			'Nex.pager.Pager'
		], function(){
			
			factory( jQuery );	
		} );
	} else {

		factory( jQuery );
	}
}(function( $ ) {
	var table = Nex.define('Nex.grid.AbstractGrid',{
		extend : 'Nex.panel.Panel',
		xtype : 'abstractgrid',
		alias : 'Nex.AbstractGrid',
		configs : function(opt){
			return {
				prefix : 'grid-',
				/*开启组件大小自动设置*/
				autoResize : true,
				/*禁止doRenderCotent设置items*/
				disabledItems : true,
				/*开启后会设置borderCls*/
				border : false,
				containerCls : [opt.containerCls,'nex-absgrid'].join(' '),
				borderCls : [opt.borderCls,'nex-grid-border'].join(' '),
				autoScrollCls : [opt.autoScrollCls,'nex-grid-auto-scroll'].join(' '),
				autoWidthCls : [opt.autoWidthCls,'nex-grid-auto-width'].join(' '),
				autoHeightCls : [opt.autoHeightCls,'nex-grid-auto-height'].join(' '),
				/*设置body的overflow:auto grid不需要*/
				autoScroll : false,
				//cls : '',//自定义CSS
				/*表头文本是否换行*/
				headerNowrap : true, //表头文本不换行
				/*单元格文本是否换行*/
				nowrap : true,//单元格文本不换行
				/*无效参数*/
				rowTpl : '',//grid 自定义行模板
				/*初始时是否显示表头*/
				showGridHeader : true,//显示gridheader
				/*是否显示表尾*/
				showGridFooter : false,
				/*开启鼠标经过效果*/
				trackMouseOverRow : true,
				/*自定义mouseover 样式*/
				overRowCls : '',
				/*开启隔行变色*/
				stripeRows : false,//开启隔行变色
				//clsSingleRow : 'datagrid-row-single',
				//clsDoubleRow : 'datagrid-row-double',
				/*自定义单行样式*/
				oddRowCls : '',
				/*自定义双行样式*/
				evenRowCls : '',
				/*如果表格数据为空是否显示emptyText*/
				showEmptyText : true,
				emptyText : '',
				/*设置表格的Table布局样式 如果不太理解不建议修改*/
				tableLayout : 'fixed',
				
				/**
				 * @cfg {String/Boolean} scroll
				 * Scrollers configuration. Valid values are 'both', 'horizontal' or 'vertical'.
				 * True implies 'both'. False implies 'none'.
				 */
				scroll : true,//--
				
				enableColumnMove : true,
				/*允许改变列的宽度*/
				enableColumnResize : true,
				/*允许对列排序*/
				enableSort : true,
				/*改变列宽时 是否实时更新宽度*/
				resizeColumnReal : true,
				/*改变列宽时,是否显示标记边框*/
				showColumnResizeBorder : false,
				
				//排序配置
				/*
				* 设置排序规则
				* 如果开启 则数据只在本地排序,否则根据是否设置了url而进行服务端排序
				*/
				localSort : false,//本地排序
				/*默认排序列*/
				sortField : null,//排序字段
				/*排序方式*/
				sortOrder : 'asc',
				/*远程数据时请求参数*/
				sortFieldField : 'sortField',
				sortOrderField : 'sortOrder',
				/*显示竖向表格线条*/
				showRowLineV : true,
				/*显示横向表格线条*/
				showRowLineH : true,
				
				//multiColumns : false,
				//mulitEngine : 1,//第一种方法 可设置 1 2
				/*
				* 开启支持以字符串形式多列方式实现
				* eg: columns : [
				*		{ field : 'china_beijing', title : '北京' },
				*		{ field : 'china_shanghai', title : '上海' }
				*	]
				*/
				multiColumnFromStr : false,
				multiColumnsAlign : 'center',
				multiColumnSplitStr : '_',
				/*
				* 以上示例中china自定信息不存在 我们可以在这里设置:eg
				*  multiColumnFromStrData : { china : { title:'中国' },china_shanghai : { title:'上海',width : 100 } }
				*/
				multiColumnFromStrData : {},//multiColumnFromStr 字符串开启后 可以为不同层数的单元格设置配置信息
				/*
				* 表格列信息 参考_columnMetaData
				*/
				columns : [],//
				/*
				* 列信息Map
				*/
				_columnsHash : {},//field=>column 这里包含所有的 会通过getColumns填充
				_colid : 1,//col 自增 参数 --
				moveColumnTm : 500,//按下多少秒后开始移动列
				moveColumns : true,
				/*
				* 各列自适应宽度
				*/
				forceFit:false,//自动设置列宽
				forceFitVisible : true,//列是否始终保持可见
				_defRowCls : 'nex-grid-absgrid',
				//columnResizable : true,//--
				/*
				* 行样式 可以是Function
				*/
				rowCls : '',
				/*
				* 单元格文本 可以是Function
				*/
				rowCssText : '',
				/*
				* 列信息
				*/
				_columnMetaData : {//默认列信息
					field : '',
					dataIndex : '',//数据索引，默认==field
					//title : '',// 不要定义 会自动检查
					width : '',//默认的列宽,
					tips : '',//tip提示信息
					tipsTag : 'title',
					_fieldWidth : 0,//如果width是百分比 那么这个就是计算百分比后的宽度
					minWidth : 20,//默认最小宽度
					maxWidth : null,
					headerAlign : 'left',
					align : 'left',
					valign : 'middle',//body里的垂直居中
					_expand : false,//自定义列内容
					callBack : $.noop,
					hcls : '',//header cell自定义css
					headerCls : '',
					headerCssText : '',
					cellCls : '',
					cellCssText : '',
					bcls : '',//body cell自定义css
					fcls : '',//footer cell自定义css
					_icon : '',
					iconCls : '',
					icon : '',
					resizable : true,
					sortable : false, 
					/*
					*examples : 
						function sortFn( a, b, asc ){ 
							var isAsc = asc === 'asc';
							var v1 = parseInt(a.dept_name);
							var v2 = parseInt(b.dept_name);
							if( v1 > v2 ) {
								return isAsc ? 1 : -1;
							} if( v1 === v2 ){
								return 0;
							} else {
								return isAsc ? -1 : 1;
							}
						}
					*/
					sortFn : null,//自定义排序函数
					sortField : null,//排序字段 如果为空则默认使用dataIndex
					headerAfterRender : null,
					cellAfterRender : null,
					//textLimit : false,//当处理大数据的时候 性能消耗比较厉害， 不建议开启了
					fitColumn : true,//改变列大小
					//casePerChange : true,//如果当前列设置的是百分比大小，手动修改列大小后 设置为true:grid刷新会失去百分比作用,false:grid刷新时不会失去百分比作用，而是失去手动修改后的宽度
					//reader : {},//映射 可直接使用Function 效果同formatter
					renderer : null,
					dataType : 'string',//string|int|float|date|boolean|currency
					dateFormat : 'YYYY-MM-DD',
					//dateFormat numberFormat currencyUnit ...
					forceFit : true,//接受forceFit开启时自动设置列大小 checkbox edit 列会设置为false
					disabled : false//当前列不可用
				},
				columnDefaults : {},
				//用户可针对某一列设置默认信息
				customColumnData : {},
				readerDef : '_default_',
				autoScrollToField : true,
				autoScrollToRow : true,
				fitColumns : true,//移动列总开关
				data : [],//列表数据 含有_expand的将作为扩展列 如果有 _openExpand=true 则会自动展开
				emptyGridMsg : '',//grid数据为空是的显示数据 可以是模板 opt 作为参数
				showEmptyGridMsg : true,
				pk : '_pk',//主键名称
				hideColumns : [],//已经隐藏的列
				selectRows : [],//设置默认选中的行
				_selectRows : {},//选择的行//--
				isCreate : false,//废弃
				isShow : false,
				views : {},
				/*显示也分工具栏*/
				showPager : false,//不显示分页工具栏
				pagerClass : 'pager',//
				fixPageNumber : true, //在showGrid时矫正pageNumber 
				total : 0,
				//method : 'post',
				//url : '',
				loadMsg : '加载中,请稍后...',
				loadErrorMsg : '数据加载错误！',
				showErrorTime : 2000,
				_lmt : 0,//loadMsg 计时器id
				_colWidthExt : 0,//列宽精确位数
				//cache : true,//缓存,
				pageNumber : 1,
				pageSize : 10,
				loadOnce : false,//开启后如果设置了url 那么抓取数据后 会把url删除
				url : '',
				//_ajaxOptions : {},
				///ajaxOptions : {},
				/*
				* 表格数据异步请求设置
				*/
				ajaxClass : 'Nex.Ajax',//定义Nex.Ajax组件来发送请求
				ajaxCache : true,
				ajaxPageNumberField : 'pageNumber',
				ajaxPageSizeField : 'pageSize',
				ajaxOptions : {},
				ajaxMethod : 'GET',
				ajaxDataType : 'json',
				ajaxDataFilter : null,
				ajaxData : {},
				ajaxSend : null,//自定义ajax发送函数
				asyncDataMaps : {
					total : 'total',
					pageSize : 'pageSize',
					pageNumber : 'pageNumber',
					data : 'data'
					//columns : 'columns',//--尚未实现
					//url : 'url'	
				},
				_gridViewViews : {},
				//dataType : 'json',
				//queryParams : {},
				//鼠标点击时是否可选择行
				enableSelectRow : true,
				singleSelect : false,//是否可以多选
				enableUnselect : false,//如果是单选模式 enableUnselect = true时，如果选择的是自己 则会取消选择
				selectedRowCls : '',
				rowStyler : "",//行style 字符串作为 class function(rowid,rowdata)
				rowCallBack : $.noop,
				methodCall : {},//内部函数的回调函数
				denyRowEvents : false,//禁止触发的事件
				tpl : {
					//'stylesheet' : '<style id="<%=id%>_stylesheet" type="text/css"></style>',
					'view' : '<div id="<%=id%>_view" class="nex-grid-view"><div id="<%=id%>_dataview" class="nex-grid-dataview"><table class="nex-grid-table" cellpadding="0" cellspacing="0" border="0"><thead id="<%=id%>_dataview_header" class="nex-grid-header nex-grid-dataview-header"></thead><tbody id="<%=id%>_dataview_body" class="nex-grid-dataview-body"></tbody></table></div></div>'
				}
			};	
		}	
	});
	table.override({
		dataSource : [],
		selection : {},
		//当前grid显示的数据 //--
		currentPageData : [],
		initComponent : function(){
			this.callParent(arguments);
			this.currentPageData = [];
			this.selection = {};
			this.dataSource = [];
			this.initGrid();	
		},
		sysEvents : function(){
			var self = this;
			var opt = this.configs;
			self.callParent( arguments );
		},
		initGrid : function(){
			var self = this;
			//self.initGridStyleSheet();
			self.initGridCss();
			self.initGridLayout();
			//事件委托
			self.initGridEvents();
		},	
		/*initGridStyleSheet : function(){
			var self = this;
			var el = self.el;
			var opt = this.configs;	
			if( opt.views['stylesheet'] ) return self;
			var $sheet = $(self.tpl('stylesheet', {id:opt.id}));
			opt.views['stylesheet'] = $sheet;
			el.prepend($sheet);
			return self;
		},*/
		initGridCss : function(){
			var self = this;
			var opt = this.configs;		
			//hideGridHLines
			if( !opt.showRowLineV ) {
				self.hideGridVLines();	
			}
			if( !opt.showRowLineH ) {
				self.hideGridHLines();	
			}
			self.fireEvent('onSetGridCss');
		},
		initGridLayout : function(){
			var self = this;
			var opt = this.configs;
			var bd = self.getBody();
			var d = {
				id : opt.id	
			};
			//bd.addClass('nex-grid-view');
			//创建一个style样式表
			var $view = $(self.tpl('view', d));
			bd.append($view);
			opt.views['gridView'] = $view;
			opt.views['gridDataView'] = $('#'+opt.id+'_dataview');
			opt.views['gridHeader'] = $('#'+opt.id+'_dataview_header');
			opt.views['gridBody'] = $('#'+opt.id+'_dataview_body');
			
			if( !opt.showGridHeader ) {	
				self.hideGridHeader();
			}
			
			self.setGridViewScrollAble();
			
			if( opt.showPager ) {
				self.initPager();	
			}
			
			self.fireEvent('onGridViewCreate',[ $view, opt ]);
			
			return self;
		},
		initGridEvents : function(){
			var self = this;
			var opt = this.configs;	
			self.setGridHeaderEvents();
			self.setGridRowsEvents();
			self.setGridCellsEvents();
		},
		setGridViewScrollAble : function(){
			var self = this;
			var opt = this.configs;	
			var $view = self.getScrollView();
			if( opt.scroll === false ) {
				$view.css('overflow','hidden');
			} else {
				$view.css('overflow','auto');	
			}	
			if( opt.scroll === 'horizontal' ) {
				$view.css('overflow-x','auto');
				$view.css('overflow-y','hidden');
			}	
			if( opt.scroll === 'vertical' ) {
				$view.css('overflow-x','hidden');
				$view.css('overflow-y','auto');
			}	
		},
		/*
		*布局大小设置
		*/
		doSetViewSize : function(){
			var self = this;
			var opt = this.configs;
			var bd = self.getBody();	
			
			self.callParent(arguments);
			
			self.setGridViewSize();
			/*
			var $dataTable = $( '>.nex-grid-table', self.getGridDataView() );
			
			if( !self.isAutoWidth() ) {
				$dataTable.css('width','100%');	
			} else {
				$dataTable._removeStyle('width');	
			}*/
		},
		//_gridViewViews
		setGridViewSize : function(){
			var self = this;
			var opt = this.configs;
			
			var gridViewViews = opt._gridViewViews;
			
			var $body = self.getBody();
			var $view = self.getGridView();
			
			var bw = $body._width();
			var bh = $body._height();
			
			for( var otherView in gridViewViews ) {
				bh -= $( gridViewViews[otherView] )._outerHeight();	
			}
			
			if( !self.isAutoWidth() ) {
				$view._outerWidth( bw );
			} else {
				$view._removeStyle('width');	
			}
			
			if( !self.isAutoHeight() ) {
				$view._outerHeight( bh );
			} else {
				$view._removeStyle('height');	
			}
			
			self.setGridDataViewSize();
		},
		setGridDataViewSize : function(){
			var self = this;
			var opt = this.configs;
			var $view = self.getGridView();
			var $dataView = self.getGridDataView();	
			var $dataTable = $( '>.nex-grid-table', $dataView );	
			if( !self.isAutoWidth() ) {
				$dataView._outerWidth( $view._width() );
				$dataTable.css('width','100%');	
			} else {
				$dataView._removeStyle('width');	
				$dataTable._removeStyle('width');	
			}
			if( !self.isAutoHeight() ) {
				$dataView._outerHeight( $view._height() );
			} else {
				$dataView._removeStyle('height');	
			}
		},
		addViewToGridView : function( name, el ){
			var opt = this.configs;	
			opt.views[ name ] = el;
			opt._gridViewViews[ name ] = el;
			return this;
		},
		removeViewFromGridView : function( name ){
			var opt = this.configs;	
			delete opt.views[ name ];
			delete opt._gridViewViews[ name ];
			return this;
		},
		dataViewRendered : false,
		//设置GRID视图数据 如 表头...
		doRenderContent : function(){
			var self = this;
			var opt = this.configs;
			
			if( self.dataViewRendered ) {
				return self;	
			}
			//console.time(3);
			self._setGridLayoutCss();
			
			self.dataViewRendered = true;
			//处理columns数据
			self.initGridColumns();
			//设置grid的列宽
			self.initColumnsWidth();
			//设置grid数据表头
			self.setGridHeader();
			//初始化dataSource
			self.setData( opt.data );
			self.setGridBody();
			//console.timeEnd(3);
		},
		setGridHeaderEvents : function(){
			var self = this;
			var opt = this.configs;		
			var bd = this.getBody();
			var callEvent = function( evt, e ){
				var $col = $(this);
				var field = $(this).attr("field");
				var column = self.getColumnData( field );
				
				e.helper = $col;
				
				if( self[ evt ] && Nex.isFunction( self[ evt ] ) ) {
					self[ evt ].call( self, field, column, e );	
				}
				if( self.fireEvent(evt,[field, column, e]) === false ) {
					return false;	
				}	
			}
			//绑定单元格事件 	
			bd.undelegate('.htd')
			  .delegate(".nex-grid-dataview-header", {
				  "contextmenu.htd" : function( e ){
					  	e.helper = $(this);
					 	if( self.fireEvent('onGridViewHeaderContextMenu',[ e ]) === false ) {
							return false;	
						} 
				   }
			   })
			  .delegate(".nex-grid-dataview-header td[id^="+opt.id+"]", [
			  	'click.htd',
				'dblclick.htd',
				'mouseenter.htd',
				'mouseleave.htd',
				'contextmenu.htd',
				'mousedown.htd',
				'mouseup.htd'
			  ].join(' '), function(e){
				    var ev = "";
					  switch( e.type ) {
						case 'click' : ev = 'onColumnClick'; break;
						case 'dblclick' : ev = 'onColumnDblClick'; break;
						case 'contextmenu' : ev = 'onColumnContextMenu'; break;
						case 'mousedown' : ev = 'onColumnMouseDown'; break;
						case 'mouseup' : ev = 'onColumnMouseUp'; break;
						case 'mouseenter' : ev = 'onColumnMouseOver'; break;
						case 'mouseleave' : ev = 'onColumnMouseOut'; break;
					  }
					  if( !ev ) return;
					  if( callEvent.call(this, ev, e) === false ) {
						  return false;	
					  } 
			  }).delegate('.nex-grid-resizable', {
				'mousedown.htd' : function( e ){
					self._startResize( this, e );	
				}, 
				'click.htd' : function( e ){
					e.preventDefault();
					e.stopPropagation();	
				}
			  });//列移动
		},
		setGridRowsEvents : function(){
			var self = this;
			var opt = this.configs;		
			var bd = this.getBody();
			var callEvent = function( evt, e ){
				var $tr = $(this);
				
				e.helper = $tr;
				
				var rid = $tr.attr('rid');
				var ridx = $tr.attr('ridx');
				var data = self.getRowIndexData( ridx );
				if( self[ evt ] && Nex.isFunction( self[ evt ] ) ) {
					self[ evt ].call( self, rid, data, e );	
				}
				if( self.fireEvent(evt,[rid, data, e]) === false ) {
					return false;	
				}	
			}
			//绑定单元格事件 	
			bd.undelegate('.btr')
			  .delegate(".nex-grid-dataview-body tr[id^="+opt.id+"]", [
			  	'click.btr',
				'dblclick.btr',
				'contextmenu.btr',
				'mousedown.btr',
				'mouseup.btr',
				'mouseenter.btr',
				'mouseleave.btr'
			  ].join(' '),function( e ){
				  var ev = "";
				  switch( e.type ) {
					case 'click' : ev = 'onRowClick'; break;
					case 'dblclick' : ev = 'onRowDblClick'; break;
					case 'contextmenu' : ev = 'onRowContextMenu'; break;
					case 'mousedown' : ev = 'onRowMouseDown'; break;
					case 'mouseup' : ev = 'onRowMouseUp'; break;
					case 'mouseenter' : ev = 'onRowMouseOver'; break;
					case 'mouseleave' : ev = 'onRowMouseOut'; break;
				  }
				  if( !ev ) return;
				  if( callEvent.call(this, ev, e) === false ) {
					  return false;	
				  }
			  });	
		},
		setGridCellsEvents : function(){
			var self = this;
			var opt = this.configs;		
			var bd = this.getBody();
			var callEvent = function( evt, e ){
				var $td = $(this);
				var $tr = $td.parent();
				
				e.helper = $td;
				
				var field = $(this).attr("field");
				var ridx = $tr.attr('ridx');
				var rid = $tr.attr('rid');
				var column = self.getColumnData( field ) || {};
				var data = self.getRowIndexData( ridx );
				var value = data[ column.dataIndex ];
				if( self[ evt ] && Nex.isFunction( self[ evt ] ) ) {
					self[ evt ].call( self, rid, field, value, data, e );	
				}
				if( self.fireEvent(evt,[rid, field, value, data, e]) === false ) {
					return false;	
				}	
			}
			//绑定单元格事件 	
			bd.undelegate('.btd')
			  .delegate(".nex-grid-dataview-body td[id^="+opt.id+"]", [
			  	'click.btd',
				'dblclick.btd',
				'contextmenu.btd',
				'mousedown.btd',
				'mouseup.btd',
				'mouseenter.btd',
				'mouseleave.btd'
			  ].join(' '),function( e ){
				  var ev = "";
				  switch( e.type ) {
					case 'click' : ev = 'onCellClick'; break;
					case 'dblclick' : ev = 'onCellDblClick'; break;
					case 'contextmenu' : ev = 'onCellContextMenu'; break;
					case 'mousedown' : ev = 'onCellMouseDown'; break;
					case 'mouseup' : ev = 'onCellMouseUp'; break;
					case 'mouseenter' : ev = 'onCellMouseOver'; break;
					case 'mouseleave' : ev = 'onCellMouseOut'; break;
				  }
				  if( !ev ) return;
				  if( callEvent.call(this, ev, e) === false ) {
					  return false;	
				  }
			  });		
		},
		ridToIndex : function( rid ){
			var self = this;
			var opt = this.configs;		
			return self.isAjaxAsync() ? parseInt(rid) : ( (opt.pageNumber - 1) * opt.pageSize ) + parseInt(rid);	
		},
		indexToRid : function( ridx ){
			var self = this;
			var opt = this.configs;	
			return self.isAjaxAsync() ? parseInt(ridx) : parseInt(ridx) - ( (opt.pageNumber - 1) * opt.pageSize );			
		},
		getRowData :　function( rid, clone ){
			var self = this;
			var opt = this.configs;	
			var dataset = self.getData();
			var clone = Nex.unDefined( clone, true );
			var rowData = dataset[ self.ridToIndex( rid ) ];	
			return clone ? Nex.clone( rowData ) : rowData;
		},
		setRowData : function( rid, field, data ){
			var rowData = this.getRowData( rid, false );
			if( Nex.isPlainObject( field ) ) {
				Nex.apply( rowData, field );
			} else {
				rowData[ field ] = data;
			}
			return this;
		},
		getRowIndexData : function( ridx, clone ){
			var opt = this.configs;	
			var dataset = this.getData();
			var clone = Nex.unDefined( clone, true );
			var rowData = dataset[ ridx ];	
			return clone ? Nex.clone( rowData ) : rowData;
		},
		_setGridLayoutCss : function(){
			var self = this;
			var opt = this.configs;	
			self.addGridCssRules(
				'.nex-grid-table',
				'table-layout: ' + (opt.forceFit ? 'auto' : opt.tableLayout)
			);
			return self;
		},
		addGridCssRules : function(selector,cssText){
			return this.addCssRules.apply(this, arguments);
		},
		getGridView : function(){
			return this.configs.views['gridView'];	
		},
		getScrollView : function(){
			return this.getGridDataView();	
		},
		/*getGridScrollView : function(){
			return this.configs.views['gridView'];	
		},*/
		getGridDataView : function(){
			return this.configs.views['gridDataView'];	
		},
		getGridHeader : function(){
			return this.configs.views['gridHeader'];	
		},
		getGridDataHeader : function(){
			return this.configs.views['gridHeader'];	
		},
		getGridBody : function(){
			return this.configs.views['gridBody'];		
		},
		getGridDataBody : function(){
			return this.configs.views['gridBody'];		
		},
		_toFirstUpperCase : function(str){
				return str.replace(/\s[a-z]/g,function($1){return $1.toUpperCase()}).replace(/^[a-z]/,function($1){return $1.toUpperCase()});	
		},
		/*
		*解析columns数据
		*/
		initGridColumns : function(){
			var self = this;
			var opt = this.configs;
			var columns = self._parseColumns(opt.columns);	
			var column;
			var i = 0,
				len = columns.length;
			for(;i<len;i++) {
				column = columns[i];
				if( column['disabled'] === true ) continue;
				
				column['field'] = Nex.isEmpty(column['field']) ?  i : column['field'];
				
				if( column['field'] in opt.customColumnData ) {
					$.extend( column,opt.customColumnData[column['field']] );
				}
				
				column['title'] = Nex.unDefined( column['title'], column['field'] );//Nex.isEmpty(column['title']) ?  column['field'] : column['title'];
				//column['index'] = Nex.isEmpty(column['index']) ?  column['field'] : column['index'];
				column['dataIndex'] = Nex.isEmpty(column['dataIndex']) ?  column['field'] : column['dataIndex'];
				column['_colid'] = Nex.isEmpty(column['_colid']) ? 'col'+(Nex.aid++) : column['_colid'];
			}
			opt.columns = columns;
			self.onInitColumns(columns);
			self.fireEvent( 'onInitColumns',[columns] );
			return self;
		},
		onInitColumns : function(){},
		initColumnsWidth : function(){
			var self = this;
			var opt = this.configs;	
			var columns = self.getLeafColumns();
			$.each(columns, function(i, column){
				self._setColumnWidth( column.field, column.width );
				/*self.addGridCssRules(
					'.nex-column-width-'+column._colid,
					'width:'+(Nex.isNumeric(column.width) ? (column.width+"px") : column.width)
				);*/
			});
		},
		_parseColumns : function(columns){
			var self = this;
			var opt = this.configs;
			var undef;
			var columns = columns || opt.columns;
			var listMap = function(column, pid){
				
				var type = column.type;
				if( type ) {
					type = (type+"").toLowerCase();
					var method = '_get'+self._toFirstUpperCase( type )+'Column';
					if( Nex.isFunction(self[ method ]) ) {
						column = self[ '_get'+self._toFirstUpperCase( type )+'Column' ]( column );
					} else {
						delete column.type;	
					}
				}
				
				if( Nex.isEmpty(column.field) ) {
					column.field = ['field',++Nex.aid].join('');	
				}
				
				if( Nex.isEmpty(pid) ) {
					  pid = null;	
				} else {
					pid = $.isPlainObject( pid ) && !Nex.isEmpty(pid.field) ? pid.field : null;
				}
				
				if( /*opt.multiColumns && */opt.multiColumnFromStr && opt.multiColumnSplitStr != '' ) {
					//对列名有"_"的进行处理
					var _sp = opt.multiColumnSplitStr;
					var _md = opt.multiColumnFromStrData;
					var _field = column.field + '';
					column._ofield =  column._ofield===undef ? _field : column._ofield;
					
					var sl = column._hasSet?[]:_field.split(_sp);
					if( sl.length>1 ) {
						 column._hasSet = true;
						 column.field = sl[0];
						 var of = column._ofield.split(_sp);
						 var index = Nex.inArray( column.field,of );
						 column.field = of.slice(0,index+1).join(_sp); 
						 var tls = column.field.split(_sp);
						 var _realField = tls.pop();
						// column.title = column.title||_realField;
						 //eg:field=year_month_day
						 var orig_col = $.extend({},column);
						 if( _realField in _md ) {
							$.extend( column,_md[ _realField ] ); 
						 }
						 //eg:经过上一步处理后可能是field=maxDay
						 if( column.field in _md ) {
							$.extend( column,_md[ column.field ] ); 
						 }
						 sl.splice(0,1);//删除第一个
						 column.columns = column.columns === undef ? [] : column.columns;
						 var cc = { field : sl.join(_sp),_ofield:column._ofield };
						 cc = $.extend({}, orig_col, cc);
						
						 delete cc.columns;
						/* if( column.width !== undef ) {
							 cc.width = column.width;
						 }*/
						 column.columns.push(cc);
					} else {
						if( !column._hasSet && sl.length ) {
							   column._hasSet = true;
							   var of = column._ofield.split(_sp);
							   var index = Nex.inArray(column.field, of);
							   column.field = of.slice(0,index+1).join(_sp); 
							   var tls = column.field.split(_sp);
							   var _realField = tls.pop();
							  // column.title = column.title||_realField;
							   if( _realField in _md ) {
									$.extend( column,_md[ _realField ] ); 
							   }
							   if( column.field in _md ) {
									$.extend( column,_md[ column.field ] ); 
							   }
						}
					}
				}
				
				//设置默认值
				column = $.extend({},opt._columnMetaData,opt.columnDefaults,column);
				column['_colid'] = Nex.isEmpty(column['_colid']) ? 'col'+(Nex.aid++) : column['_colid'];
				//_fieldWidth ??
				if( column.disabled===true  ) return;
				
				opt._columnsHash['nsort'+column.field] = column;
				column.__pid = column.__pid===undef ?  pid : column.__pid;
				
				self.setCustomColumnCss( column );
				
				if( ('columns' in column) && Nex.isArray( column.columns ) && column.columns.length ) {
					var ls = column.columns;
					var len = ls.length;
					for( var i=0;i<len;i++ ) {
						listMap( ls[i],column );	
					}
				} else {
					//list.push( column );	
				}
			}	
			var i = 0,
				len = columns.length;
			for(;i<len;i++) {
				listMap( columns[i],null );
			}	
			return self._getLeafColumns();
		},
		setCustomColumnCss : function( column ){
			var self = this;
			if( column.headerCssText ) {
				self.addGridCssRules( '.nex-grid-dataview-body .nex-grid-header-'+column._colid, column.headerCssText );
			}
			if( column.cellCssText ) {
				self.addGridCssRules( '.nex-grid-dataview-body .nex-grid-cell-'+column._colid, column.cellCssText );
			}
			return self;	
		},
		getColumnEl : function( field ){
			var self = this;
			var opt = this.configs;
			var colid = self.getColumnColId( field );	
			if( !colid ) return null;
			return $('#'+opt.id+'_cols_'+colid);
		},
		getColumnTextEl : function( field ){
			var self = this;
			var opt = this.configs;
			var colid = self.getColumnColId( field );	
			return $('#'+opt.id+'_cols_'+colid+'_text');
		},
		/*获取列宽度*/
		getColumnWidth : function( field ){
			var el = this.getColumnEl( field );
			return el ? el._outerWidth() : 0;	
		},
		getColumnData : function( field ){
			var self = this
				,opt = self.configs;	
			var columns = opt._columnsHash;	
			return columns['nsort'+field] || null;
		},
		getColumnColId : function(field){
			return (this.getColumnData(field) || {})['_colid'] || null;	
		},
		getColumnProp : function( field, prop ){
			var column = this.getColumnData( field );
			return column ? column[prop] : null;
		},
		getLeafColumns : function(){
			return this._getLeafColumns.apply(this,arguments);	
		},
		//获取grid显示的列
		getColumns : function(){
			//应该去除锁定的列
			return this.configs.columns;	
		},
		getLockColumns : function(){
			return this.configs.lockColumns;	
		},
		_getColumnChildrens : function( name ){
			var self = this
				,undef
				,opt = self.configs;	
			var list = [];
			if( Nex.isEmpty(name) ) {
				return self._getRootColumns();	
			}
			var columns = opt._columnsHash;	
			for( var key in columns ) {
				var field = columns[key];	
				if( field.__pid === name ) {
					list.push( field );
				}		
			}		
			return list;	
		},
		_getColumnAllChildrens : function( name ){
			var self = this
				,undef
				,opt = self.configs;	
			var list = [];
			var name = name;
			var _loop = function( n ){
				var childs = self._getColumnChildrens(n);
				for( var i=0,len=childs.length;i<len;i++ ) {
					list.push( childs[i] );	
					_loop( childs[i]['field'] );
				}
			};
			_loop(name);
			return list;	
		},
		/*获取当前单元格下 还有多少层次*/
		_getColumnAllLevel : function( name ){
			var self = this
				,undef
				,opt = self.configs;	
			if( name === undef || name === null || name === '' ) {
				name = null;
			}	
			var columns = opt._columnsHash;	
			var childs = self._getLeafColumns( name );
			var level = 1;
			var getTop = function( n ){
				var n = 'nsort'+n;
				if( n in columns ) {
					var column = columns[n];
					if( column.__pid !== name ) {
						level++;
						return getTop( column.__pid );	
					} else {
						return level++;	
					}	
				}	
			};
			var _max = 0;
			$.each( childs,function(i,field){
				var i = getTop( field['field'] );
				_max = Math.max( _max,i );	
				level = 1;
			} );
			
			return _max;	
		},
		_isRootColumn : function( field ){
			var field = field || {};
			return Nex.isEmpty(field.__pid) ? true : false;	
		},
		_isLeafColumn : function(name){
			var list = this._getColumnChildrens( name );
			return list.length ? false : true;
		},
		/**
		*获取指定单元格下的叶子节点	
		*/
		_getLeafColumns : function( name ){
			var self = this
				,undef
				,opt = self.configs;
			var list = [];
			var columns = opt._columnsHash;	
			var childs = self._getColumnAllChildrens( name );
			for( var i=0,len=childs.length;i<len;i++ ) {
				if( self._isLeafColumn( childs[i]['field'] ) ) {
					list.push( childs[i] );	
				}
			}
			return list;	
		},
		//返回指定单元格的最顶层
		_getTopColumn : function(name){
			var self = this
				,undef
				,opt = self.configs;
			var columns = opt._columnsHash;	
			var name = 'nsort'+name;
			if( name in columns ) {
				var column = columns[name];
				if( column.__pid !== null && column.__pid !== undef ) {
					return self._getTopColumn( column.__pid );	
				} else {
					return column;	
				}	
			}	
		},
		//返回最顶层的单元格列表
		_getRootColumns : function(){
			var self = this
				,undef
				,opt = self.configs;
			var list = [];
			var columns = opt._columnsHash;
			for( var key in columns ) {
				var field = columns[key];	
				if( field.__pid === null || field.__pid===undef ) {
					list.push( field );
				}	
			}	
			return list;		
		},
		getAllColumns : function(){
			return this._getColumnAllChildrens();	
		},
		getColumnWidthTr : function(){
			var self = this;
			var firstRow = ['<tr class="nex-grid-rows-header">'];
			var _columns = self.getLeafColumns();
			$.each(_columns,function(i,col){
				firstRow.push('<td class="nex-grid-'+col._colid+' nex-column-width-'+col._colid+'"></td>');	
			});
			firstRow.push('</tr>');	
			return firstRow.join('');
		},
		getGridHeaderHtml : function(){
			var self = this
				,undef
				,opt = self.configs;
			var hlist = [];
			var hhash = {};
			
			var tdTpl = '<td rowspan="<%=rowSpan%>" colspan="<%=colSpan%>" id="<%=gridId%>_cols_<%=_colid%>" class="nex-grid-col nex-grid-header-col nex-grid-col-<%=gridId%> nex-grid-<%=_colid%> nex-grid-header-<%=_colid%> <%=$isroot ? "nex-grid-header-col-root":""%> <%=$isleaf ? "nex-grid-header-col-leaf":""%> <%=headerCls%>" field="<%=field%>" align="<%=headerAlign%>">'
							+'<div class="nex-grid-cell-wrap" field="<%=field%>"' 
								+'<% if( tips ) {%>'
								+' <%=tipsTag%>="<%=tips%>"'
								+'<%}%>'
								+'>'
								+'<div id="<%=gridId%>_cols_<%=_colid%>_inner" class="nex-grid-cell nex-grid-header-cell <%=headerNowrap?"nex-grid-cell-nowrap":""%>" >'
									+'<span id="<%=gridId%>_cols_<%=_colid%>_text" class="nex-grid-header-cell-text"><%=title%></span>'
								+'</div>'
								+'<div class="nex-grid-resizer <%=resizable ? "nex-grid-resizable" : ""%>"></div>'
							+'</div>'
						+'</td>';
			
			function getTD( field, level ){
				var level = level || 0;
				var name = field['field'];
				var colSpan = self._getLeafColumns( name );
				var rowSpan = 1;
				colSpan = colSpan.length;
				//rowSpan += 1;
				rowSpan = maxRow-level;
				var fieldText = field.title === undef ? field.field : field.title ;
				field.title = fieldText;
				var tplData = $.extend({},field,{
						field : Nex.htmlEncode(field.field),
						tips : Nex.htmlEncode(field.tips),
						headerNowrap : opt.headerNowrap,
						gridId:opt.id,
						$isleaf  : false,
						resizable : opt.enableColumnResize ? field.resizable : false,
						$isroot  : !field.__pid
					});
				if( self._isLeafColumn(name) ) {
					colSpan = 1;
					tplData.colSpan = colSpan;
					tplData.rowSpan = rowSpan;
					tplData.$isleaf = true;
					var tds = self.tpl(tdTpl, tplData);	
					trs[level].push( tds );
					return;
				} else {
					rowSpan = 1;
					tplData.colSpan = colSpan;
					tplData.rowSpan = rowSpan;
					tplData.align = opt.multiColumnsAlign; 
					tplData.resizable = false;
					tplData.sortable = false;
					var tds = self.tpl( tdTpl, tplData);	
					trs[level].push( tds );
					var childs = self._getColumnChildrens( name );
					$.each( childs,function(i,f){
						var _level = level;
						getTD(f, ++_level);
					} );
				}	
			}
			
			//更新_columnsHash
			var columns = opt._columnsHash;
			var maxRow = self._getColumnAllLevel();
			var cols = self._getRootColumns();
			
			var trs = [];//每层td内容
			//初始化内容
			for(var i=0;i<maxRow;i++) {
				trs[i] = [];	
			}
			$.each( cols,function(i,field){
				getTD(field, 0);	
			} );
			
			var html = [ self.getColumnWidthTr() ];
			$.each(trs,function(i,tr){
				var tds = ['<tr class="',opt._defRowCls,' nex-grid-header-row">'];
				tds.push(tr.join(''));
				tds.push('</tr>');
				html.push( tds.join('') );	
			});
			return html.join('');
		},
		setGridHeader : function(){
			var self = this
				,opt = self.configs;	
			var vheader = self.getGridHeader();
			vheader.html( self.getGridHeaderHtml() );	
			
			self.refreshGridColumnsCls();
			
			self.afterRenderGridHeader();
			
			self.onGridHeaderCreate();
			
			self.fireEvent('onGridHeaderCreate',[vheader,opt]);
		},
		onGridHeaderCreate : function(){},
		//refreshGridViewHeaderColumnsCls
		refreshGridColumnsCls : function(columns,vheader){
			var self = this
				,opt = self.configs;	
			var rootColumns = columns || self._getRootColumns();		
			
			if( !rootColumns.length ) {
				return self;	
			}
			
			var vheader = vheader || self.getGridHeader();
			$('.nex-grid-header-col',vheader).removeClass('nex-grid-col-first nex-grid-col-last');
			
			var first_column = rootColumns[0];
			var last_column = rootColumns.pop();
			
			function loop_first(column){
				var el = self.getColumnEl(column.field);
				el.addClass('nex-grid-col-first');
				var childs = self._getColumnChildrens(column.field);
				if( childs.length ) {
					loop_first(childs[0]);	
				}	
			}
			function loop_last(column){
				var el = self.getColumnEl(column.field);
				el.addClass('nex-grid-col-last');
				var childs = self._getColumnChildrens(column.field);
				if( childs.length ) {
					loop_last(childs.pop());	
				}	
			}
			loop_first(first_column);
			loop_last(last_column);
			return self;
		},
		afterRenderGridHeader : function(){
			var self = this
				,opt = self.configs;
			var columns = self.getAllColumns();
			$.each( columns, function(i, column){
				if( Nex.isFunction( column.headerAfterRender ) ) {
					column.headerAfterRender.call( self, self.getColumnTextEl( column.field ), column  );	
				}
			} );	
		},
		_setColumnWidth : function( field, width ){
			var self = this
				,opt = self.configs;	
			var column = self.getColumnData(field);
			if( !column ) return self;
			column.width = width;
			
			var maxWidth = column.maxWidth;
			var minWidth = column.minWidth;
			
			var cw = width;
			
			if( Nex.isNumeric(cw) ) {
				cw = parseFloat( cw );	
				if( maxWidth ) {
					cw = Math.min( cw, maxWidth );	
				}
				if( minWidth ) {
					cw = Math.max( cw, minWidth );		
				}
				cw += 'px'; 
			}
			
			self.addGridCssRules(
				'.nex-column-width-'+column._colid,
				'width:'+cw
			);
			return self;	
		},
		setColumnWidth : function(field,width){
			var self = this;
			self._setColumnWidth( field, width );
			//注意grid出现了滚动条再改变grid的列宽。这个时候应该会重新触发onScroll  但是在IE6下却没有触发这里做下兼容
			if( Nex.isIE6 ) {
				var scroll = self.getScrollView();		
				scroll.trigger( 'scroll' );
			}
			return self;
		},
		setGridBody : function(){
			var self = this
				,opt = self.configs;	
			var vbody = self.getGridBody();		
			//console.time(2);
			self.showGrid();
			//console.timeEnd(2);
		},
		/*
		*显示grid数据
		*/
		showGrid : function(/*pageNumber, pageSize*/){
			var self = this
				,opt = self.configs;	
			//set	pageNumber
			if( self.fireEvent('onBeforeShowGrid',[opt]) === false) {
				return self;	
			}	
			//矫正pageNumber
			opt.pageNumber = opt.fixPageNumber ? Math.min( opt.pageNumber, self.getPageCount() ) : opt.pageNumber;
			
			self.onShowGridStart();
			
			self.showLoading();
			self.loadPageData(function(data){
				if(self.isAjaxAsync()) {
					self.parseAsyncData(data);	
				}
				if( opt.loadOnce ) {
					opt.url = "";	
				}
				//注意 渲染gridRows时 grid数据过大时会导致初始渲染时页面空白现象，采用setTimeout方式，错开同时执行
				self.showLoading();
				setTimeout( function(){
					self.renderGridRows();
					self.hideLoading();	
				},0 );
			}, function(data){
				alert( data );
				//console.log(data);	
			}, function(data){
				self.hideLoading();	
			});	
			return self;			
		},
		'refresh' : function(){
			return this.showGrid();
		},
		refreshCache : function(){
			var self = this;
			self.showLoading();
			setTimeout( function(){
				self.renderGridRows();
				self.hideLoading();	
			},0 );	
			return self;
		},
		getPageCount : function(){
			var opt = this.configs;
			var total = this.getTotal();	
			var size = opt.pageSize || 1;
			return Math.ceil( total/size );
		},
		showPage : function( num ){
			var opt = this.configs;
			opt.pageNumber = num;
			return this.showGrid();
		},
		page : function(){
			return this.showPage.apply( self, arguments );	
		},
		renderGridRows : function(){
			var self = this;
			var opt = this.configs;
			
			self.createGridRows();
			
			self.onShowGridEnd();
			
			self.fireEvent('onShowGrid',[opt]);
			
			return self;
		},
		renderGridData : function(){
			return this.renderGridRows.apply( this, arguments );
		},
		onShowGridStart : function(){
			var self = this;
			//清空 选择行
			self.selection = {};
				
		},
		onShowGridEnd : function(){
			var self = this;
			self.afterRenderGridRows();
		},
		//创建GRID
		createGridRows : function(){
			var self = this
				,opt = self.configs;	
			var vbody = self.getGridBody();	
			var dataset = self.getCurrentPageData();
			//console.time(5)	
			vbody.html( self.getGridRowsHtml( dataset ) );	
			//console.timeEnd(5)
			return self;
		},
		getGridRowsHtml : function(datas){
			var self = this;
			var opt = this.configs;
			var trs = [ self.getColumnWidthTr() ];
			
			if( !datas.length && opt.showEmptyText ) {
				trs.push( self.getEmptyRowHtml() );	
			}
			//console.time(4)
			for(var i=0,len=datas.length;i<len;i++) {
				trs.push(self.getGridRowHtml(i,datas[i] || {}));	
			}	
			//console.timeEnd(4)
			return trs.join('');
		},
		getEmptyRowHtml : function( msg ){
			var self = this;
			var opt = this.configs;
			var msg = Nex.unDefined( msg, opt.emptyText );
			var columns = self.getColumns();	
			return '<tr class="nex-grid-empty-row"><td colspan="'+ Math.max(columns.length,1) +'">'+ (Nex.isEmpty(msg) ? '&nbsp;' : msg) +'</td></tr>';
		},
		getGridRowHtml : function( rid, data ){
			var self = this
				,opt = self.configs;	
			var data = self.parseRowData(data);	
			var columns = self.getColumns();
			var tds = [];
			var rowIndex = self.ridToIndex(rid);
			var rcls = [opt._defRowCls,'nex-grid-row'];
			if( opt.stripeRows ) {
				rcls.push( (rid+1)%2 ? 'nex-grid-row-odd '+opt.oddRowCls : 'nex-grid-row-even '+opt.evenRowCls );
			}
			var rowCls = Nex.isFunction( rowCls ) ? rowCls.call( self, rid, data ) : rowCls;
			var rowCssText = Nex.isFunction( rowCssText ) ? rowCssText.call( self, rid, data ) : rowCssText;
			var style = "";
			if( rowCssText ) {
				style = ['style="',rowCssText,'"'];
			}
			rcls.push( rowCls );
			var html = [
				'<tr id="',opt.id,'_row_',rid,'" class="',rcls.join(' '),'" ',style,' rid="',rid,'" ridx="',rowIndex,'">'
				];
					for(var i=0,len=columns.length;i<len;i++) {
						var column = columns[i];
						var field = column.field;
						//var dataType = column.dataType;
						//var value = self.getDataTypeValue( Nex.unDefined(data[column.dataIndex], ''), dataType, column );
						//var renderer = self.getCellRenderer( field );
						var value = self._getCellRendererValue( Nex.unDefined(data[column.dataIndex], ''), data, column, rid );//renderer( value, data, field, rid );
						//因为grid的border-collapse: separate;在ie6 7 下如果为空时单元格td不会显示，只有设置为collapse才会显示
						tds.push(
							'<td id="',opt.id,'_row_',rid,'_',column._colid,'" class="nex-grid-col nex-grid-col-',opt.id,' nex-grid-',column._colid,' nex-grid-cell-',column._colid,[i===0 ? ' nex-grid-col-first':'',i===(len-1) ? ' nex-grid-col-last':''].join(' '),' ',column.cellCls,'" field="',Nex.htmlEncode( field ),'" valign="',column.valign,'" align="',column.align,'">',
								'<div id="',opt.id,'_row_',rid,'_',column._colid,'_text" class="',['nex-grid-cell',opt.nowrap ? ' nex-grid-cell-nowrap' : ''].join(' '),'">',
								Nex.isEmpty( value ) ? '&nbsp;' : value,
								'</div>',
							'</td>'
						);	
					}
				html.push(tds.join(''),'</tr>');	
			return html.join('');
		},
		afterRenderGridRows : function(){
			var self = this
				,opt = self.configs;
			var columns = self.getAllColumns();
			var $view = self.getGridView();
			$.each( columns, function(i, column){
				var field = column.field;
				if( Nex.isFunction( column.cellAfterRender ) ) {
					$('.nex-grid-cell-'+column._colid, $view).each( function(){
						var $this = $(this);
						var rid = $this.parent().attr('rid');
						var value = self.getCellValue( rid, field );
						var $cell = self.getCellTextEl( rid, field );
						var data = self.getRowData( rid );
						column.cellAfterRender.call( self, $cell, value, rid , field , data, column  );		
					} );
				}
			} );		
		},
		parseRowData : function(data){
			var self = this
				,opt = self.configs;	
			var data = data || {};
			if( !data._uuid ) {
				data._uuid = Nex.uuid();	
			}	
			return data;		
		},
		_getCellRendererValue : function( value, data, column, rid ){
			var self = this;
			var field = column.field;
			var dataType = column.dataType;
			
			value = self.getDataTypeValue( value, dataType, column );
			
			var renderer = self.getCellRenderer( field ); 
			
			return renderer( value, data, field, rid );	
		},
		getDataTypes : function(){
			return {
				'string' : function( value ){
					return value + '';	
				},
				'int' : function( value ){
					return parseInt( value );	
				},	
				'float' : function( value ){
					return parseFloat( value );		
				},
				'date' : function( value, cfg ){
					return Nex.getUtil('Date').format(value, cfg.dateFormat);	
				},
				'boolean' : function( value ){
					if( Nex.isBoolean( value ) ) {
						return value ? 'True' : 'False';	
					}	
					return '';
				},
				'currency' : function( value, cfg ){
						
				}
			};		
		},
		//处理dataType
		//string|int|float|date|boolean|currency
		getDataTypeValue : function( value, dataType, cfg ){
			var self = this;
			var dataTypes = self.getDataTypes();
			
			if( Nex.isEmpty( value ) ) {
				return value;	
			}
			
			var renderer = Nex.isFunction( dataType ) ? dataType : dataTypes[ (dataType + '').toLowerCase() ];
			if( Nex.isFunction( renderer ) ) {
				return renderer.call( self, value, cfg );	
			}
			return value;
		},
		cellRendererCache : null,
		//renderer
		//获取单元格渲染器
		getCellRenderer : function( field ){
			var self = this
				,undef
				,opt = self.configs;
			var column = self.getColumnData( field );
			
			self.cellRendererCache = self.cellRendererCache || {};
			
			if( self.cellRendererCache[ field ] ) {
				return self.cellRendererCache[ field ];
			}
			
			var renderer = column.renderer;
			
			if( !column || Nex.isEmpty( renderer ) ) {
				renderer = function( str ){
					return str;	
				};
			} else if( Nex.isPlainObject( column.renderer ) ) {
				renderer = function( str, data, field, rid ){
					return column.renderer[ str ];	
				};
			} else if( Nex.isFunction( column.renderer ) ) {
				renderer = function(){
					return column.renderer.apply( self, arguments );
				};	
			} else {
				var fn = self.getTplFn( column.renderer + '', 'value, field, rid' );
				renderer = function( str, data, field, rid ){
					return fn.call( self, data, str , field, rid );	
				};		
			}
			
			self.cellRendererCache[ field ] = renderer;
			
			return renderer;	
		},
		getRowEl : function( rid ){
			var opt = this.configs;
			return $('#'+opt.id+'_row_'+rid);	
		},
		getCellEl : function( rid, field ){
			var opt = this.configs;
			var colid = this.getColumnColId( field );
			return $('#'+opt.id+'_row_'+rid+'_'+colid);
		},
		getCellTextEl : function( rid, field ){
			var opt = this.configs;
			var colid = this.getColumnColId( field );
			return $('#'+opt.id+'_row_'+rid+'_'+colid+'_text');
		},
		getCellValue : function( rid, field ){
			var data = this.getRowData( rid );	
			var dataIndex = this.getColumnProp( field, 'dataIndex' );
			return data[ field ];
		},
		getFieldValue : function(){
			return this.getCellValue.apply( this, arguments );	
		},
		getCellText : function( rid, field ){
			return this.getCellTextEl( rid, field ).html();
		},
		getFieldText : function(){
			return this.getCellText.apply( this, arguments );	
		},
		getCellDataType : function( field ){
			return this.getColumnProp( field, 'dataType' );	
		},
		setCellValue : function( rid, field, value ){
			var self = this;
			var opt = this.configs;
			
			var oldValue = self.getCellValue( rid, field );
			var newValue = value;
			
			if( oldValue === value ) {
				return self;	
			}
			
			self.setRowData( rid, field, value );
			
			var data = this.getRowData( rid );
			var column = this.getColumnData( field );
			var value = this._getCellRendererValue( value, data, column, rid );
			
			var $cellText = self.getCellTextEl( rid, field );
			
			$cellText.html( value );
			
			$cellText.addClass('nex-grid-cell-edit');
			
			//this.setCellText( rid, field, value );
			
			self.fireEvent('onCellValueChange',[ newValue, oldValue, rid, field, $cellText ]);
			
			return self;	
		},
		setFieldValue : function(){
			return this.setCellValue.apply( this, arguments );	
		},
		setCellText : function( rid, field, value ){
			this.getCellTextEl( rid, field ).html( value );
			return this;	
		},
		setFieldText : function(){
			return this.setCellText.apply( this, arguments );	
		},
		/*
		*更新行数据
		*/
		updateRow : function( rid, data ){},
		//解析服务器数据到本地
		parseAsyncData : function(data){
			var self = this
				,opt = self.configs;	
			if(Nex.isArray(data)) {
				self.setData( data );
			} else if( Nex.isObject(data) ) {
				var maps = opt.asyncDataMaps;
				$.each(maps, function(k,v){
					if(v in data) {//data.hasOwnProperty(k)
						if( 'data' === k ) {
							self.setData( data[v] );	
						} else {
							opt[k] = data[v];
						}
					}
				});	
			}
			return self;
		},
		isAjaxAsync : function(){
			return !!this.configs.url && !Nex.isEmpty(this.configs.url);	
		},
		getAjaxAsync : function(){
			return this.isAjaxAsync();	
		},
		emptyData : function(){
			this.setData([]);	
		},
		emptyGridData : function(){
			this.setGridData([]);	
			return this;	
		},
		/*
		*获取GRID所有数据
		*/
		getData : function(){
			return this.dataSource || [];	
		},
		setData : function( datas ){
			var self = this
				,opt = self.configs;
			self.dataSource = datas || [];	
			self.onDataChange( self.dataSource );
			self.fireEvent('onDataChange',[ self.dataSource ]);
			return this;	
		},
		getGridData : function(){
			return this.getData();	
		},
		setGridData : function( d ){
			this.setData( d );	
			this.refresh();
			return this;
		},
		onDataChange : function(){
			var self = this
				,opt = self.configs;
			if( opt.enableSort && ( !self.isAjaxAsync() || opt.localSort ) && opt.sortField  ) {
				self.sortData( opt.sortField, opt.sortOrder );	
				self.setSortIcon( opt.sortField, opt.sortOrder );
			}		
		},
		onColumnClick : function( field, column, e ){
			this._setColumnSortable( field, column, e );
		},
		_setColumnSortable : function( field, column, e ){
			var self = this
				,opt = self.configs;
			var helper = e.helper;	
			if( !self._isLeafColumn(field) ) return;
			if( !opt.enableSort ) return;
			if( !column.sortable ) return;
			if( helper.hasClass('nex-grid-sort-asc') ) {
				self.sortBy( column.field, 'desc' );
			} else {
				self.sortBy( column.field, 'asc' );	
			}
		},
		//排序元数据 datasource
		sortData : function( field, order ){
			var self = this
				,opt = self.configs;
			var column = self.getColumnData( field );
			if( !column ) {
				return self;	
			}	
			var fn = column.sortFn;
			var index = column.field;
			order = Nex.isEmpty( order ) ? 'asc' : order;	
			var isAsc = (order+'').toLowerCase() == "asc" ? true : false;	
			var dataset = self.getData();
			//sortFn
			if( Nex.isFunction( fn ) ) {
				dataset.sort( function(a,b){
					return fn(a, b, isAsc ? 'asc' : 'desc');
				} );	
			} else {
				dataset.sort(function(a,b){
					var a_t = self._undef(a[index],"");
					var b_t = self._undef(b[index],"");
					if( a_t > b_t ) {
						return isAsc ? 1 : -1;
					} if( a_t === b_t ){
						return 0;
					} else {
						return isAsc ? -1 : 1;
					}
				});
			}
			self.fireEvent("onSortData",[ dataset, field, order ]);		
			return self;	
		},
		//对grid排序
		sortBy : function( field, order ){
			var self = this
				,opt = self.configs; 
			
			if( self.fireEvent("onBeforeSort",[ field, order ]) === false ) {
				return self;	
			}		
			
			opt.sortField = field;
			opt.sortOrder = order;
			
			self.sortData( field, order );
			
			self.refresh();
			
			self.setSortIcon( field, order );
			
			return self;
		},
		setSortIcon : function( field, order ){
			var self = this
				,opt = self.configs;
			var header = self.getGridHeader();
			var el = self.getColumnEl( field );
			if( !el ) return self;
			order = Nex.isEmpty( order ) ? 'asc' : order;
			
			$( '.nex-grid-header-col', header ).removeClass('nex-grid-sort-asc nex-grid-sort-desc');
			$( '.nex-grid-sort-icon', header ).remove();								
			
			if( 'asc' === (order + '').toLowerCase() ) {
				el.addClass( 'nex-grid-sort-asc' );	
			} else {
				el.addClass( 'nex-grid-sort-desc' );		
			}
			var colText = self.getColumnTextEl( field );
			colText.after( $('<span class="nex-grid-sort-icon">&nbsp;</span>') );
			return self;
		},
		/*
		*获取当前页数据
		*/
		getCurrentPageData : function(){
			return this.getPageData();	
		},
		/*
		*加载当前页数据
		*/
		loadPageData : function(success,error,complete){
			var self = this
				,opt = self.configs;
			if( self.fireEvent('onBeforeLoadPageData',[success,error,complete]) === false) {
				return self;	
			}	
			var s = function(){
				self.fireEvent('onLoadPageDataSuccess',arguments);
				if( $.isFunction(success) ) {
					success.apply(self,arguments);	
				}	
			}
			var f = function(){
				self.fireEvent('onLoadPageDataError',arguments);
				if( $.isFunction(error) ) {
					error.apply(self,arguments);	
				}	
			}
			var c = function(){
				self.fireEvent('onLoadPageDataComplete',arguments);
				if( $.isFunction(complete) ) {
					complete.apply(self,arguments);	
				}	
			}
			if( self.isAjaxAsync() ) {
				self.loadAsyncPage(s,f,c);	
			} else {
				s(self.loadLocalPage());	
				c(self);	
			}
			return self;
		},
		//从本地data数据源中加载当前页数据
		loadLocalPage : function( num ){
			var self = this
				,opt = self.configs
				,data = this.getData();	
			//var pageNumber = opt.pageNumber;	
			var pageNumber = Nex.unDefined( num, opt.pageNumber );
			var pageSize = opt.pageSize;
			if( !data.length ) {
				return [];	
			}	
			var index = (pageNumber-1)*pageSize;
			return data.slice(index, pageNumber*pageSize);	
		},
		getPageData : function( num ){
			var self = this
				,opt = self.configs
				,data = this.getData();	
			var num = Nex.unDefined( num, opt.pageNumber );
			var size = opt.pageSize;
			if( self.isAjaxAsync() ) {
				return data.slice(0, size);	
			} else {
				return self.loadLocalPage( num );	
			}	
		},
		//从服务器中加载当前页数据
		loadAsyncPage : function(success, error, complete){
			var self = this,
				opt = self.configs;
			
			var ajaxData = opt.ajaxData || {};
			
			var ajaxOptions = $.extend({},{
					type 		: opt.ajaxMethod,
					cache 		: opt.ajaxCache,
					dataType	: opt.ajaxDataType,
					dataFilter	: opt.ajaxDataFilter
				});
				
			$.extend(ajaxOptions, opt.ajaxOptions);
			
			ajaxOptions.data = $.extend(ajaxOptions.data || {},ajaxData);
			ajaxOptions.$caller = self;
			ajaxOptions.url = opt.url;
			//排序
			//if( opt.enableSort && !opt.localSort && opt.sortField ) {
//				ajaxOptions.data[ opt.sortFieldField ] = opt.sortFieldField;
//				ajaxOptions.data[ opt.sortFieldOrder ] = opt.sortFieldOrder;
//			}
			
			ajaxOptions.success = function(data){
				if( $.isFunction(success) ) {
					success(data);	
				}
				self.fireEvent('onLoadAsyncDataSuccess',[data,opt]);
			};
			ajaxOptions.error = function(xmlHttp){
				if( $.isFunction(error) ) {
					error(xmlHttp);	
				}
				self.fireEvent('onLoadAsyncDataError',[xmlHttp,opt]);
			};
			
			ajaxOptions.complete = function(data){
				if( $.isFunction(complete) ) {
					complete(data);	
				}
				self.fireEvent('onLoadAsyncDataEnd',[opt]);
				self.fireEvent('onLoadAsyncDataComplete',[data,opt]);	
			};
			
			if( self.fireEvent('onBeforeLoadAsyncData',[ajaxOptions,opt]) === false ) {
				return;	
			}	
			self.onLoadAsyncDataStart( ajaxOptions, opt );
			self.fireEvent('onLoadAsyncDataStart',[ajaxOptions,opt]);
			
			self.ajaxSend(ajaxOptions);
			
			return self;
		},
		ajaxSend : function(ajaxOptions){
			var self = this;
			var opt = self.configs;
			if( $.isFunction( opt.ajaxSend ) ) {
				opt.ajaxSend.call(self, ajaxOptions);
			} else {
				Nex.Create(opt.ajaxClass, ajaxOptions);
			}
			return self;
		},
		onLoadAsyncDataStart : function(ajaxOptions, opt){
			ajaxOptions.data[opt.ajaxPageNumberField] = opt.pageNumber;
			ajaxOptions.data[opt.ajaxPageSizeField] = opt.pageSize;
			//排序
			if( opt.enableSort && !opt.localSort && opt.sortField ) {
				ajaxOptions.data[ opt.sortFieldField ] = opt.sortFieldField;
				ajaxOptions.data[ opt.sortFieldOrder ] = opt.sortFieldOrder;
			}	
		},
		setPageNumber : function(num){
			var opt = this.configs;
			opt.pageNumber = Math.max(parseInt(num) || opt.pageNumber,1);
			return this;	
		},
		setPageSize : function(num){
			var opt = this.configs;
			opt.pageSize = Math.max(parseInt(num) || opt.pageSize,1);
			return this;	
		},
		setTotal : function(num){
			var opt = this.configs;
			opt.total = parseInt(num) || opt.total;
			return this;		
		},
		getTotal : function(){
			var opt = this.configs;
			var data = this.getData();
			return this.isAjaxAsync() ? data.length : opt.total || data.length;	
		},
		showGridHLines : function(){
			var self = this;
			var opt = this.configs;	
			self.addGridCssRules(
				'.nex-grid-dataview-body .nex-grid-col-'+opt.id,
				'border-bottom-width:;border-top-width:'
			);
		},
		hideGridHLines : function(){
			var self = this;
			var opt = this.configs;	
			self.addGridCssRules(
				'.nex-grid-dataview-body .nex-grid-col-'+opt.id,
				'border-bottom-width:0;border-top-width:0'
			);
		},
		showGridVLines : function(){
			var self = this;
			var opt = this.configs;	
			self.addGridCssRules(
				'.nex-grid-dataview-body .nex-grid-col-'+opt.id,
				'border-left-width:;border-right-width:'
			);	
		},
		hideGridVLines : function(){
			var self = this;
			var opt = this.configs;	
			self.addGridCssRules(
				'.nex-grid-dataview-body .nex-grid-col-'+opt.id,
				'border-left-width:0;border-right-width:0'
			);	
		},
		//应该设置opt.showHeader = true
		showGridHeader : function(){
			var self = this;
		//	var opt = this.configs;		
			
			var header = self.getGridHeader();
			header.show();
			
			return self;
		},
		hideGridHeader : function(){
			var self = this;
		//	var opt = this.configs;			
			
			var header = self.getGridHeader();
			header.hide();
			
			return self;
		},
		_setRowOverCls : function( rid, data, e ){
			var opt = this.configs;	
			var $tr = e.helper;
			if( !opt.trackMouseOverRow ) return;
			$tr.addClass(['nex-grid-row-over',opt.overRowCls].join(' '));
		},
		_setRowOutCls : function( rid, data, e ){
			var opt = this.configs;	
			var $tr = e.helper;
			if( !opt.trackMouseOverRow ) return;
			$tr.removeClass(['nex-grid-row-over',opt.overRowCls].join(' '));
		},
		onRowMouseOver : function(){
			this._setRowOverCls.apply( this, arguments );	
		},
		onRowMouseOut : function(){
			this._setRowOutCls.apply( this, arguments );	
		},
		onRowClick : function( rid, data, e ){
			this._checkToToggleSelectRow.apply( this, arguments );	
		},
		_checkToToggleSelectRow : function( rid, data, e ){
			var self = this;
			var opt = this.configs;	
			var $tr = e.helper;
			var selectRow = self.selection;
			
			if( !opt.enableSelectRow ) return;
			
			var selection = self.selection;
			
			if( opt.singleSelect ) {
				//处理单选模式
				if( selection[ rid ] ) {
					opt.enableUnselect && self.unselectRow( rid );
					return;	
				}
				self.unselectAll();
				self.selectRow( rid );
			} else {
				self.toggleSelectRow( rid );	
			}
		},
		getGridRowEl : function( rid ){
			var opt = this.configs;
			return $('#'+opt.id+'_row_'+rid);	
		},
		/*
		* 选择指定行
		*/
		selectRow : function( rid ){
			var self = this,
				opt = self.configs;
			
			var $row = self.getGridRowEl( rid );
			
			if( !$row.length ) return self;

			var data = self.getRowData( rid );
			
			var selection = self.selection;
			
			//重复选择
			if( selection[rid] ) {
				return self;	
			}
			
			if( self.fireEvent('onBeforeSelectRow',[ rid, data ]) === false ) {
				return self;	
			}
			
			$row.addClass('nex-grid-row-selected '+opt.selectedRowCls);
			
			self.selection[rid] = true;	
			
			self.fireEvent('onSelectRow',[ rid, data ]);
			
			self.fireEvent('onSelectionChange',[]);
			
			return self;
		},
		/*
		* 取消选择指定行
		*/
		unselectRow : function( rid ){
			var self = this,
				opt = self.configs;
			
			var $row = self.getGridRowEl( rid );
			
			if( !$row.length ) return self;

			var data = self.getRowData( rid );
			
			var selection = self.selection;
			
			//重复取消
			if( !selection[rid] ) {
				return self;	
			}
			
			if( self.fireEvent('onBeforeUnSelectRow',[ rid, data ]) === false ) {
				return self;	
			}
			
			$row.removeClass('nex-grid-row-selected '+opt.selectedRowCls);
			
			self.selection[rid] = false;	
			delete self.selection[rid];
			
			self.fireEvent('onUnSelectRow',[ rid, data ]);
			
			self.fireEvent('onSelectionChange',[]);
			
			return self;
		},
		toggleSelectRow : function( rid ){ 
			var selection = this.selection;
			return selection[rid] ? this.unselectRow( rid ) : this.selectRow( rid );
		},
		//选择所有行
		selectAll : function(){
			var self = this;
			var opt = self.configs;
			var datas = self.getCurrentPageData();	
			
			for( var i=0,len=datas.length; i<len; i++ ) {
				self.selectRow( i );	
			}
			
			return self;
		},
		unselectAll : function(){
			var self = this;
			var selection = self.selection;	
			for( var rid in selection ) {
				if( selection[rid] ) {
					self.unselectRow( rid );		
				}	
			}
			return self;
		},
		selectRows : function( rows ){//行数组
			$.each( rows, function(i,rid){
				this.selectRow( rid );	
			} );
			return this;	
		},
		unselectRows : function( rows ){//行数组
			$.each( rows, function( i, rid ) {
				this.unselectRow( rid );	
			} );
			return this;	
		},
		selectFirstRow : function(){
			return this.selectRow(0);	
		},
		selectLastRow : function(){
			var datas = this.getCurrentPageData();	
			return this.selectRow( Math.max( datas.length - 1, 0 ) );	
		},
		selectRange : function( start, end ){
			var datas = this.getCurrentPageData();
			end = Math.min( end, Math.max( datas.length - 1, 0 )  );	
			var s = Math.min( start, end );
			var e = Math.max( start, end );
			for( ; s<=e; s++ ) {
				this.selectRow( s );	
			}
			return this;
		},
		unselectRange : function( start, end ){
			var datas = this.getCurrentPageData();
			end = Math.min( end, Math.max( datas.length - 1, 0 )  );	
			var s = Math.min( start, end );
			var e = Math.max( start, end );
			for( ; s<=e; s++ ) {
				this.unselectRow( s );	
			}
			return this;
		},
		setSingleSelect : function(){
			this.configs.singleSelect = true;	
			return this;
		},
		setMulitSelect : function(){
			this.configs.singleSelect = false;
			return this;	
		},
		//单选和多选 的问题 还需要再处理 shift 等支持问题。。。
		//resize 列
		__resizing : false,
		isResizing : function(){
			return this.__resizing;	
		},
		_startResize : function( el, e ){
			var self = this;
			var opt = this.configs;
			
			var resizer = $(el);
			var field = resizer.parent().attr("field");
			var column = self.getColumnData( field );
			var fw = self.getColumnWidth( field );
			
			var originCur = document.body.style.cursor;
			
			if( !field || !column ) return;
			
			var tmp = {};
			var $view = self.getGridView();
			//var $dataView = self.getGridDataView();
			var rtd = self.getColumnEl( field );
			
			function start(e,opt) {
			
				self.__resizing = true;
				
				$(document.body).css("cursor", "col-resize");
				$(document.body).disableSelection();
				
				var helper = $("<div class='nex-grid-resize-tmp "+( opt.showColumnResizeBorder ? 'nex-grid-resize-border' : '' )+"'></div>");
				$view.append(helper);
		
				var offset = rtd.offset();
				var left = offset.left - $view.offset().left + $view.scrollLeft();
				var height = $view.get(0).clientHeight;
				var width = rtd.width();
				helper.css({
					position: 'absolute',
					top		: $view.css('paddingTop'),
					zIndex	: 9999,
					left	: left
				});
				helper.outerHeight( parseFloat(height) );
				helper.outerWidth( parseFloat(width) );
				tmp.helper = helper;
				tmp.x1 = e.clientX;
				tmp.x2 = e.clientX;
				tmp.column = column;
				tmp.left = left;
				tmp.width = helper.width();
				tmp.originWidth = helper.width();
				tmp.originColumnWidth = fw;
				tmp.offsetX = 0;
				
				self.fireEvent('onColumnResizeStart',[tmp,e]);
				
				$(document).bind("mousemove._resize", function(e){
					tmp.x2 = e.clientX;
					tmp.offsetX = tmp.x2 - tmp.x1;
					if( self.fireEvent('onColumnResizing',[tmp,e]) === false ) {
						return;	
					}
					resize( e );
				});
				$(document).bind("mouseup._resize", function(e){
					setTimeout(function(){
						self.__resizing = false;						
					},0);
					stop( e );
				});
			}
			function resize(e){
				tmp.helper.width( Math.max(tmp.width + tmp.offsetX, 0) );
				if( opt.resizeColumnReal ) {
					self.setColumnWidth( field, tmp.originColumnWidth + tmp.offsetX );
				}
			}
			function stop(e){
				if( !opt.resizeColumnReal ) {
					self.setColumnWidth( field, tmp.originColumnWidth + tmp.offsetX );
				}
				$(document).unbind("mousemove._resize");
				$(document).unbind("mouseup._resize");
				document.body.style.cursor = originCur;
				$(document.body).enableSelection();
				$(tmp.helper).remove();
				self.fireEvent('onColumnResizeEnd',[ tmp, e]);
			}	
			
			if( self.fireEvent('onColumnResizeBefore',[ field, el, e]) === false ) {
				return;	
			}
			
			start.call(el, e, opt);
			e.preventDefault();
			e.stopPropagation();
		},
		/*column type */
		_getEmptyColumn : function( column ){
			return Nex.applyIf(column, {
				title : '&nbsp;',
				minWidth : null,
				maxWidth : null,
				resizable : false,
				sortable : false
			});	
		},
		_getIndexColumn : function( column ){
			return Nex.applyIf(column, {
				title : '&nbsp;',
				width : 40,
				resizable : false,
				sortable : false,
				headerAlign : 'center',
				align : 'center',
				renderer : function( v, d, f, rid ){
					return this.ridToIndex( rid )+1;	
				} 
			});	
		},
		_getRownumberColumn : function( column ){
			return this._getIndexColumn( column );	
		},
		_getCheckboxColumn : function( column ){
			return Nex.applyIf(column, {
				title : '<span class="nex-icon-checkbox nex-grid-cloumn-checkbox"></span>',
				width : 30,
				resizable : false,
				sortable : false,
				headerAlign : 'center',
				align : 'center',
				headerAfterRender : function( el, column ){
					var self = this;
					var opt = this.configs;
					$('.nex-icon-checkbox', el).click( function( e ){
						if( opt.singleSelect ) return;
						var $this = $(this);
						if( $this.hasClass('nex-icon-checkbox-chcked') ) {
							$this.removeClass('nex-icon-checkbox-chcked');
							self.unselectAll();
						} else {
							$this.addClass('nex-icon-checkbox-chcked');
							self.selectAll();
						}	
					} );
				},
				renderer : function( v, d, f, rid ){
					return '<span class="nex-icon-checkbox nex-grid-cell-checkbox"></span>';	
				} 
			});	
		},
		pager : null,
		pagerRendered : false,
		//显示分页工具
		initPager : function(){
			var self = this;
			var opt = this.configs;
			
			if( self.pagerRendered ) {
				return self;	
			}
			
			self.pagerRendered = true;
			
			var $view = self.getBody();
			var pager = Nex.Create(opt.pagerClass,{
				cls : 'nex-grid-pager',
				pageNumber : opt.pageNumber,
				pageSize : opt.pageSize,
				refreshBtn : true,
				total : self.getTotal(),
				renderTo : $view
			});
			
			if( pager ) {
				self.pager = pager;
				self.addViewToGridView( 'pager', pager.el );	
				
				pager.on('onPageChange', function( page, size, total ){
					
					opt.pageNumber = page;
					opt.pageSize = size;
					
					self.refresh();
						
				});
				
				self.on('onShowGrid', function( cfg ){
					pager.refresh( {
						pageNumber  : cfg.pageNumber,
						pageSize 	: cfg.pageSize,
						total 		: self.getTotal()
					} );	
				});
				
			}
			
			return self;
		},
		//camelCase
		/*css style管理*/
		test : function(){}
	});
}));