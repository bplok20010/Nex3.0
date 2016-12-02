/*

*/
(function( factory ) {
	if ( typeof $define === "function" ) {
		
		$define([
			'Nex.container.Container',
			'Nex.form.Select'	
		], function(){
			factory( jQuery );	
		} );
	} else {

		factory( jQuery );
	}
}(function( $ ) {
	var pager = Nex.define('Nex.pager.Pager',{
		extend : 'Nex.container.Container',
		alias : 'Nex.Pager',
		xtype : 'pager',
		configs : function(opt, t){
			return {
			prefix : 'nexpager-',
			autoDestroy : true,
			autoResize : true,
			border : true,
			borderCls : [opt.borderCls,'nex-pager-border'].join(' '),
			containerCls : [opt.containerCls,'clearfix nex-pager'].join(' '),
			autoScroll : false,
			tabIndex : -1,
			
			renderTo : document.body,
			
			width : 'auto',
			height : 'auto',
			itemLimit : 2,
			enableChangeSize : false,
			changeSizeMsg : '每页显示{0}条',
			pageSize : 10,
			pageNumber : 1,
			total : 0,
			sizeList : [10,20,50,100],
			refreshBtn : false,//显示刷新按钮
			refreshText : '刷新',
			displayInfo : true,
			displayMsg : '当前显示第{0}-{1}条, 共{2}条',
			emptyMsg : '暂无数据',
			pageCountText : '页',
			prevText : '上一页',
			nextText : '下一页',
			firstText: '首页',
			lastText : '尾页',
			showTips : true,
			tipsTag : 'title',
			tipsRenderer : null,
			//自定义页码显示
			pageRenderer : null,
			tpl : {
				layout : '<div id="<%=id%>_view" class="nex-pager-view"></div><div id="<%=id%>_info" class="clearfix nex-pager-info"><table border="0" cellpadding="0" cellspacing="0"><tr><td id="<%=id%>_size" class="nex-pager-size"></td><td id="<%=id%>_msg" class="nex-pager-msg"></td></tr></table></div>'		
			}
		};
		}		
	});
	pager.override({
		initComponent : function(){
			this.callParent( arguments );
			this.initPagination();
		},
		initPagination : function(){
			var self = this;
			var opt = this.configs;
			var tpl = self.tpl( 'layout', { id : opt.id } );
			self.el.html( tpl );
			opt.views['msg'] = $('#'+opt.id+'_msg');
			opt.views['pageSize'] = $('#'+opt.id+'_size');
			opt.views['view'] = $('#'+opt.id+'_view');
			
			if( opt.enableChangeSize ) {
				self._setPageSize();	
			}
			self.setDisplayMsg();
			self.setPager();
			self.setPagerEvent();
		},
		_setPageSize : function(){
			var self = this;
			var opt = this.configs;		
			
			var msg = opt.changeSizeMsg;
			
			var $view = opt.views['pageSize'];
			
			var msgs = msg.split('{0}');
			
			if( msgs[0] ) {
				$view.append('<span class="nex-pager-text">'+msgs[0]+'</span>');
			}
			
			Nex.Create('selectfield',{
				id : opt.id + '_pagesize',
				cls : 'nex-pager-sizelist',
				display : 'inline',
				renderTo : $view,
				items : opt.sizeList,
				width : 'auto',
				onChange : function(){
					opt.pageSize = parseInt(this.val()) || 10;
					if( self.fireEvent('onPageSizeChange',[ opt.pageSize ]) !== false ) {
						self.toPage(1,true);
						//self.toPage(opt.pageNumber, true);
					}
				},
				value : opt.pageSize
			});
			
			if( msgs[1] ) {
				$view.append('<span class="nex-pager-text">'+msgs[1]+'</span>');
			}
		},
		setPagerSize : function( size ){
			var opt = this.configs;
			var size = parseInt( size );
			var sel = Nex.get( opt.id + '_pagesize' );
			if( sel ) {
				var items = opt.sizeList;
				items.push( size );
				items.sort( function(a,b){
					return parseInt(a) > parseInt(b);	
				} );	
				items = Nex.distArr( items );
				sel.setItems( items );
				sel.val( size );
			}	
			return this;
		},
		setDisplayMsg : function( msg ){
			var self = this;
			var opt = this.configs;
			
			if( !Nex.isDefined( msg ) ) {
				if( opt.total<=0 ) {
					msg = opt.emptyMsg;
				} else {
					msg = opt.displayMsg;
				}
			}
			
			var format = function(str){
				if (arguments.length === 0)
					return null;
				var str = arguments[0];
				for ( var i = 1; i < arguments.length; i++) {
					var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
					str = str.replace(re, arguments[i]);
				}
				return str;	
			}
			var $msg = opt.views['msg'];
			$msg.html( format( msg, self.getPagerStart() + 1, self.getPagerEnd(), opt.total ) );
			return self;
		},
		refreshMsg : function(){
			return this.setDisplayMsg();
		},
		getPagerStart : function(){
			var opt = this.configs;
			return (opt.pageNumber - 1) * opt.pageSize;
		},
		getPagerEnd : function(){
			var opt = this.configs;
			return this.getPagerStart() + opt.pageSize;	
		},
		setPager : function(){
			var self = this;
			var opt = this.configs;	
			var html = self.getPagerHtml();
			var $view = opt.views['view'];
			$view.html( html );	
		},
		refreshPager : function(){
			return this.setPager();	
		},
		validPageData : function(){ //进行当前页数和总页数的验证
			var opt = this.configs;
			var pageNumber = opt.pageNumber;
			var total = opt.total;
			if (isNaN(parseInt(pageNumber))) pageNumber = 1;
			if (isNaN(parseInt(total))) total = 0;
			if (pageNumber < 1) pageNumber = 1;
			if (total < 1) total = 1;
			pageNumber = parseInt(pageNumber);
			total = parseInt(total);
			opt.pageNumber = pageNumber;
			opt.total = total;
		},
		getPageCount : function(){
			var opt = this.configs;	
			return 	Math.max(Math.ceil( opt.total/opt.pageSize ), 1);
		},
		getPagerHtml : function(){
			var self = this;
			var opt = this.configs;	
			self.validPageData();
			var pageNumber = opt.pageNumber;
			var pageSize = opt.pageSize;
			var total = opt.total;
			var pageCount = self.getPageCount();
			
			pageNumber = Math.min( pageNumber,pageCount );
			
			var prevPage = pageNumber - 1;
			var nextPage = pageNumber + 1;
			
			strHtml = '<ul class="nex-pager-items">';
			
			var renderTips = function( n ){
				if( !opt.showTips ) return '';
				return opt.tipsTag + '="'+ (Nex.isFunction(opt.tipsRenderer) ? opt.tipsRenderer.call( self, n ) : '') +'"';
			};
			
			var renderPage = function( n ){
				if( Nex.isFunction( opt.pageRenderer ) ) {
					return opt.pageRenderer.call( self, n );
				}
				return n;	
			};
			
			if (prevPage < 1) {
				strHtml += '<li><a class="nex-pager-item nex-pager-prev nex-pager-disabled">'+opt.prevText+'</a></li>';
			} else {
				strHtml += '<li><a page="'+prevPage+'" class="nex-pager-item nex-pager-prev" href="javascript:void(0);" '+renderTips('prev')+'>'+opt.prevText+'</a></li>';
			}
			if (pageNumber != 1) strHtml += '<li><a page="1" class="nex-pager-item nex-pager-first" href="javascript:void(0);" '+renderTips(1)+'>'+renderPage(1)+'</a></li>';
			if (pageNumber >= 5) strHtml += '<li>...</li>';
			var limit = opt.itemLimit;
			if (pageCount > pageNumber + limit) {
				var endPage = pageNumber + limit;
			} else {
				var endPage = pageCount;
			}
			
			for (var i = pageNumber - limit; i <= endPage; i++) {
				if (i > 0) {
					if (i == pageNumber) {
						strHtml += '<li><a href="javascript:void(0);" class="nex-pager-item nex-pager-item-active nex-pager-item-disabled" '+renderTips(i)+'>' + renderPage(i) + '</a></li>';
					} else {
						if (i != 1 && i != pageCount) {
							strHtml += '<li><a  page='+i+' href="javascript:void(0);" class="nex-pager-item" '+renderTips(i)+'">' + renderPage(i) + '</a></li>';
						}
					}
				}
			}
			if (pageNumber + 3 < pageCount) strHtml += '<li>...</li>';
			if (pageNumber != pageCount) strHtml += '<li><a class="nex-pager-item nex-pager-last" page='+pageCount+' href="javascript:void(0);" '+renderTips(pageCount)+'>' + renderPage(pageCount) + '</a></li>';
			
			strHtml += '<li><label class="nex-pager-forward"><input type="text" class="nex-pager-topage" size="2" value="'+pageNumber+'" ><span> / '+pageCount+' '+opt.pageCountText+'</span></label></li>';
			
			if (nextPage > pageCount) {
				strHtml += '<li><a class="nex-pager-item nex-pager-next nex-pager-item-disabled">'+opt.nextText+'</a></li>';
			} else {
				strHtml += '<li><a class="nex-pager-item nex-pager-next" page="'+nextPage+'" href="javascript:void(0);" '+renderTips('next')+'>'+opt.nextText+'</a></li>';
			}
			if( opt.refreshBtn ) {
				strHtml += '<li><a class="nex-pager-item nex-pager-refresh" href="javascript:void(0);" '+renderTips('refresh')+'>'+opt.refreshText+'</a></li>';
			}
			strHtml += '</ul>';
			return strHtml;
		},
		'refresh' : function( cfg ){
			var opt = this.configs;
			Nex.apply( opt, cfg || {} );
			this.refreshPager();
			this.refreshMsg();
			return this;	
		},
		//显示指定到页数
		toPage : function( num, m ){
			var self = this,
				opt = this.configs;
			var num = parseInt(num);
			if( !num ) {
				return self;	
			}
			num = Math.min( num, self.getPageCount() );
			if( !m && opt.pageNumber == num ) {
				return self;	
			}
			opt.pageNumber = num;
			self.refresh();
			self.fireEvent('onPageChange',[ opt.pageNumber, opt.pageSize, opt.total ]);
			return self;
		},
		setPagerEvent : function(){
			var self = this;
			var opt = this.configs;
			var el = self.el;
			//nex-pager-topage
			el.undelegate('.nex-pager-item')
				.delegate('.nex-pager-item','click',function(e){
					var page = $(this).attr( 'page' );
					if( !page ) return;
					if( $(this).hasClass('nex-pager-item-disabled') ) return;
					self.toPage( page )
				})
				.delegate('.nex-pager-topage','keydown',function(e){
					if( e.keyCode === 13 ) {
						var v = $(this).val();
						self.toPage( v );
					}
				})
				.delegate('.nex-pager-refresh','click',function(e){
					self.toPage( opt.pageNumber, true );
				});	
		}
	});
}));