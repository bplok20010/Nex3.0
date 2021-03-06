/*
draggable - jQuery Nex
nobo
zere.nobo@gmail.com
qq : 505931977
var drag = new Nex.draggable({helper:$('#drag')});
*/
;(function($){
	var drag = Nex.define('Nex.drag.Drag',{
		extend : 'Nex.AbstractComponent',
		alias : 'Nex.Drag',
		xtype : 'drag draggable',
		configs : function(){
			return {
				prefix : 'drag-',
				denyManager : true,
				cursor:'move',
				_cursor : '',
				appendTo : null,//document.body
				clone : false,
				cloneFn : null,//自定义返回一个克隆对象
				helper:null,//用于触发移动的元素 必须
				cancel : null,
				target: null,//最终需要移动的元素
				disabled: false,
				axis:null,	// v or h
				parent : null,
				afterDrag : null,//停止移动后可自定义函数实现
				delay : 0, //当鼠标点下后，延迟指定时间后才开始激活拖拽动作（单位：毫秒）。
				distance : 0, //当鼠标点下后，只有移动指定像素后才开始激活拖拽动作。
				opacity : false,//当元素开始拖拽时，改变元素的透明度。
				_opacity : '',
				_revertConf : {},//还原信息
				revert :　false,//当元素拖拽结束后，元素回到原来的位置。   
				revertDuration : 500,//当元素拖拽结束后，元素回到原来的位置的时间。（单位：毫秒）
				revertEasing : 'easeOutCubic',
				moveHelper : null,//移动中的元素
				dragCls : '',
				left : 0,//moveHelper移动后的位置 
				top : 0,
				_sLeft : 0,//moveHelper初始位置
				_sTop : 0,
				_ssLeft : 0,//moveHelper滚动条初始位置
				_ssTop : 0,
				_sX : 0, //初始坐标
				_sY : 0,
				offsetX : 0,
				offsetY : 0,
				_sPosition : '',
				edge : 0,//无效边缘
				events : {}
			};
		}		
	});
	$.dragable = $.nexDragable = drag;
	
	drag.override({
		initComponent : function(opt) {
			var self = this;
			var opt = this.configs;
			
			self.callParent(arguments);
			
			if( !opt.helper && !opt.target ) return;
			if( !opt.helper ) {
				opt.helper = opt.target;	
			}
			var target = null;
            if (typeof opt.target == 'undefined' || opt.target == null){
                target = opt.helper;
            } else {
                target = (typeof opt.target == 'string' ? $(opt.target) : opt.target);
            }
			
			//opt.parent = $(target).offsetParent();
			opt.target = target;
			
			$(opt.helper).data('nex.draggable', self);
			
			opt.helper.bind('mousedown.draggable', $.proxy( self,'mouseDown' ));
			//opt.helper.bind('mousemove.draggable', $.proxy( self,'mouseMove' ));
			//opt.helper.bind('mouseleave.draggable', $.proxy( self,'mouseLeave' ));
			
			//self.fireEvent('onCreate',[opt]);
		},
		//系统事件
		/*sysEvents : function(){
			var self = this;
			var opt = self.configs;
			//self.bind("onStart",self.onStart);	
		},*/
		mouseDown : function(e){
			var self = this;
			var opt = self.configs;
			
			if( self.checkDisabledEdge(e) ) {
				//opt.helper.css('cursor', '');
				return;
			}
			
			opt._sX = e.pageX;
			opt._sY = e.pageY;
			
			var st = 0;
			if( opt.delay>0 ) {
				st = setTimeout( function(){
					st = 0;
					$(document).bind('mousedown.draggable', $.proxy( self,'_doDown' ));
					$(document).bind('mousemove.draggable', $.proxy( self,'_doMove' ));	
					$(document).bind('mouseup.draggable', $.proxy( self,'_doUp' ));		
				},opt.delay );	
				$(document).one('mouseup.draggable', function(){
					if( st ) {
						clearTimeout( st );	
					}											   
				});
			} else {
				$(document).bind('mousedown.draggable', $.proxy( self,'_doDown' ));
				$(document).bind('mousemove.draggable', $.proxy( self,'_doMove' ));	
				$(document).bind('mouseup.draggable', $.proxy( self,'_doUp' ));	
			}
			
		},
		beginDrag : false,
		isDragging : false,
		_doDown : function(e){
			var self = this;
			var opt = self.configs;
			
			$(document).disableSelection();
			
			self.beginDrag = false;
			//cancel
			if( opt.cancel ) {
				var target = $(e.target || e.srcElement); 
				if( target.closest( opt.cancel ).length ) {
					this._doUp();
					return;	
				}
			}
			
			var r = self.fireEvent('onBeforeDrag',[e,opt]);
			if( r === false) return;
			
			self.beginDrag = true;
			
			//$('body').css('cursor', opt.cursor);
		},
		_doMove : function(e){
			var self = this;
			var opt = self.configs;
			
			if( opt.disabled || !self.beginDrag ) return;
			
			var offsetX = e.pageX - opt._sX;
			var offsetY = e.pageY - opt._sY;
			
			opt.offsetX = offsetX;
			opt.offsetY = offsetY;
			
			if( opt.distance && !self.isDragging ) {
				
				var dist = Math.max( Math.abs( offsetX ),Math.abs( offsetY ) );
				if( dist<opt.distance ) {
					return;	
				}
				
			}
			if( !self.isDragging ) {
				
				var helper = self.getMoveHelper();
				//startDrag 不应该阻止
				//var r = self.fireEvent('onStartDrag',[helper,e,opt]);
				//if( r === false) return;
				
				self.fireEvent('onStartDrag',[helper,e,opt]);
				
				self._startMove();
				
				if( opt.dragCls ) {
					helper.addClass( opt.dragCls );	
				}
				
				self.isDragging = true;
			}
			
			//var parent = $(opt.moveHelper).parent();
			var cLeft = 0;//parent.scrollLeft();
			var cTop = 0;//parent.scrollTop();
			
			var left = opt._sLeft + offsetX + cLeft - opt._ssLeft;
			var top = opt._sTop + offsetY + cTop - opt._ssTop;
			
			if (opt.axis == 'h') {
				opt.left = left;
				opt.top = opt._sTop;
			} else if (opt.axis == 'v') {
				opt.left = opt._sLeft;
				opt.top = top;
			} else {
				opt.left = left;
				opt.top = top;
			}
			
			var pos = {
				left : opt.left,
				top : opt.top	
			}
			
			var r = self.fireEvent('onDrag',[opt.moveHelper,pos,e,opt]);
			if( r === false) return;
			
			self.moveToPosition(pos.left,pos.top,e);	
			
		},
		_doUp : function(e){
			var self = this;
			var opt = self.configs;
			$(document).unbind('.draggable');	
			$(document).enableSelection();	
			/*setTimeout(function(){
				$('body').css('cursor','');
			},100);*/
			if( opt.disabled || !self.beginDrag ) return;
			if( !self.isDragging ) {
				return;	
			}
			self.isDragging = false;
			$('body').css('cursor',opt._cursor);
			/*var endDrag = function(){
				self.isDragging = false;	
			};*/
			$(opt.moveHelper).removeClass( opt.dragCls );	
			
			var pos = {
				left : opt.left,
				top  : opt.top	
			};
			
			var r = self.fireEvent('onStopDrag',[opt.moveHelper,pos,e,opt]);
			
			opt.left = pos.left;
			opt.top = pos.top;
			
			if( r === false ) {//easeOutCubic
				self._revertEl();
			} else {
				//self.moveToPosition(opt.left,opt.top,e);	
				var afterDrag = function(){
					if( opt.revert === true ) {
						self._revertEl();	
					} else if( opt.revert === false ) {
						self._endMove();
					}	
				};
				if( $.isFunction( opt.afterDrag ) ) {
					afterDrag = opt.afterDrag;	
				}
				afterDrag.call(self);
			}
			//因为onStopDrag后会继续设置target的坐标实际上onStopDrag并不是最终触发的事件，onAfterDrag才是最终触发的事件
			self.fireEvent('onAfterDrag',[pos,e,opt]);
		},
		_revertEl : function(){
			var self = this;
			var opt = self.configs;
			var call = function(){
				if( opt.opacity !== false ) {
					$(opt.moveHelper).css( 'opacity',opt._opacity );
				}
				if( opt.clone ) {
					$(opt.moveHelper).remove();	
				}	
				if( opt.appendTo ) {
					opt._revertConf.revert();
					opt._revertConf.target[0].style.cssText = opt._revertConf.cssText;
					opt._revertConf.parent.scrollTop( opt._revertConf.sTop );
					opt._revertConf.parent.scrollLeft( opt._revertConf.sLeft );
				}
			};
			if( opt.revertDuration>0 ) {
				$(opt.moveHelper).animate({
					left:opt._sLeft,
					top:opt._sTop
				}, opt.revertDuration, opt.revertEasing ,function(){
					call();
				});	
			} else {
				$(opt.moveHelper).css({
					left:opt._sLeft,
					top:opt._sTop
				});	
				call();
			}
		},
		_getFixPositionSize : function( op ){
			
			var _c = parseFloat(op.css('borderLeftWidth')) || 0,
			_e = parseFloat(op.css('paddingLeft')) || 0,
			_c1 = parseFloat(op.css('borderTopWidth')) || 0,
			_e1 = parseFloat(op.css('paddingTop')) || 0;
			/*_c = isNaN( _c ) ? 0 : _c;
			_e = isNaN( _e ) ? 0 : _e;
			_c1 = isNaN( _c1 ) ? 0 : _c1;
			_e1 = isNaN( _e1 ) ? 0 : _e1;*/
			return {
				left : _c + _e,
				top : _c1 + _e1
			};		
		},
		getMoveHelper : function(){
			var self = this;
			var opt = self.configs;
			var target = $(opt.target);	
			opt.moveHelper = target;	
			if( opt.clone ) {
				opt.moveHelper = $.isFunction( opt.cloneFn ) ? opt.cloneFn.call( self,target,opt ) : target.clone();
				opt.moveHelper = opt.moveHelper ? $(opt.moveHelper) : target.clone();
			}
			
			//opt._opacity = opt.moveHelper.css('opacity');
			
			return opt.moveHelper;	
		},
		_startMove : function(){
			var self = this;
			var opt = self.configs;
			
			opt._cursor = $('body').css('cursor');
			$('body').css('cursor',opt.cursor);
			
			var target = $(opt.target);	
			
			//opt.moveHelper = target;	
			var _rv = target;
			var _rvp = target.parent();
			if( opt.appendTo ) {
				//记录初始位置和信息
				opt._revertConf = {
					target : target,
					parent : _rvp,
					sLeft : _rvp.scrollLeft(),
					sTop : _rvp.scrollTop()
				};
				var prev = _rv.prev();
				var next = _rv.next();
				if( prev.size() ) {
					opt._revertConf.revert = function(){
						prev.after( _rv );
					}	
				} else if( next.size() ) {
					opt._revertConf.revert = function(){
						prev.before( _rv );
					}	
				} else {
					opt._revertConf.revert = function(){
						_rvp.prepend( _rv );
					}	
				}
				opt._revertConf.cssText = _rv[0].style.cssText;
			}
			/*
			if( opt.clone ) {
				opt.moveHelper = $.isFunction( opt.cloneFn ) ? opt.cloneFn.call( self,$(opt.target),opt ) : $(opt.target).clone();
				opt.moveHelper = opt.moveHelper ? $(opt.moveHelper) : $(opt.target).clone();
			}
			*/
			if( opt.appendTo ) {
				var append = $(opt.appendTo);
				var offset1 = target.offset();
				var offset2 = append.offsetParent().offset();
				append.append( opt.moveHelper );
				if( opt.clone ) {
					append.append( target );	
				}
				var offset2 = target.offsetParent().offset(),
					_s = self._getFixPositionSize( append.offsetParent() );
				target.css({
					position : 'absolute',
					left : offset1.left - offset2.left - _s.left,
					top : offset1.top - offset2.top - _s.top
				});
			} else {
				if( opt.clone ) {
					target.parent().append( opt.moveHelper );	
				}
			}
			
			//var parent = $(opt.target).parent();
			opt._ssLeft = 0;//parent.scrollLeft();
			opt._ssTop = 0;//parent.scrollTop();
			var position = target._position();
			opt.left = position.left;
			opt.top = position.top;
			
			var target = opt.moveHelper;
			opt._sLeft = opt.left + opt._ssLeft;
			opt._sTop = opt.top + opt._ssTop;
			
			target.css('position','absolute');
			if( opt.clone ) {
				target.css({		   
					left : 	opt._sLeft,
					top : opt._sTop
				});
			}
			
			if( opt.opacity !== false ) {
				target.css( 'opacity',opt.opacity );
			}
			
			return self;
		},
		_endMove : function(){
			var self = this;
			var opt = self.configs;
			
			//self.moveToPosition( opt.left,opt.top );
			$(opt.target).css( {
				position : 'absolute',
				left : opt.left,
				top : opt.top
			} );
			if( opt.opacity !== false ) {
				$(opt.moveHelper).css( 'opacity',opt._opacity );
			}
			if( opt.clone ) {
				$(opt.moveHelper).remove();
			}
		},
		moveToPosition : function(left,top,e){
			var self = this;
			var opt = self.configs;
			
			var target = $(opt.moveHelper);
			//var parent = target.parent();
			opt.left = left;
			opt.top = top;
			target.css({
				left : left,
				top : top
				//position : 'absolute'
			});
		},
		mouseMove : function(e){
			var self = this;
			var opt = self.configs;
			
			if( self.isDragging ) return;
			
			if( self.checkDisabledEdge(e) ) {
				//opt.helper.css('cursor', '');
				return;
			}
			
			//opt.helper.css('cursor', opt.cursor);
		},
		mouseLeave : function(e){
			var self = this;
			var opt = self.configs;
			
			if( self.isDragging ) return;
			
			if( self.checkDisabledEdge(e) ) {
				//opt.helper.css('cursor', '');
				return;
			}
			
			//opt.helper.css('cursor', '');	
		},
		//移除可拖拽
		removeDragable : function(){
			var self = this;
			var opt = self.configs;
			
			$(opt.helper).data('nex.draggable', null);
			
			opt.helper.unbind('.draggable');
			//opt.helper.unbind('mousedown.draggable');
			//opt.helper.unbind('mousemove.draggable');
			//opt.helper.unbind('mouseleave.draggable');
			return true;
		},
		checkDisabledEdge : function(e){
			var self = this;
			var opt = self.configs;
			var offset = $(opt.helper).offset();
			var width = $(opt.helper).outerWidth();
			var height = $(opt.helper).outerHeight();
			var t = e.pageY - offset.top;
			var r = offset.left + width - e.pageX;
			var b = offset.top + height - e.pageY;
			var l = e.pageX - offset.left;
			return Math.min(t,r,b,l) < opt.edge;
		}
	});
	$.fn.draggable = function(options, param){
		var options = options || {};
		if (typeof options == 'string'){
			switch(options) {
				case 'options':
					return $(this[0]).data('nex.draggable').C();
				case 'disabled':
					return this.each(function(){
								$(this).data('nex.draggable').C('disabled',true);
							});
				case 'enable':
					return this.each(function(){
								$(this).data('nex.draggable').C('disabled',false);
							});
				default : 
					return this.each(function(){
						if( param ) {
							$(this).data('nex.draggable').C(options,param);
						}
					}); 
			}
		}
		
		return this.each(function(){
			var opt;
			var self = $(this).data('nex.draggable');
			if (self) {
				opt = self.configs;
				$.extend(opt, options);
				return;
			}
			options.helper = $(this);
			new Nex.Drag(options);
		});
	};
})(jQuery);