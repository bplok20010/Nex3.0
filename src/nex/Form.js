(function( factory ) {
	if ( typeof $define === "function" ) {
		
		$define([], function(){
			
			factory( jQuery );	
		} );
	} else {

		factory( jQuery );
	}
}(function( $ ) {
	var FormManager = Nex.define('Nex.form.Manager',{
		singleton : true,//单例模式
		extend : 'Nex.EventObject',
		alias : 'Nex.FormManager',
		configs : function(opt){
			return {
				fieldList : {}
			};
		},
		isExists : function(id){
			if( !$( "#"+id ).length ) {
				return false;
			}	
			return true;
		},
		add : function(cmp){
			var opt = this.configs;
			opt.fieldList[ Nex.isInstance(cmp) ? cmp.configs.id : cmp ] = true;		
		},
		remove : function(cmp){
			var opt = this.configs;
			opt.fieldList[ Nex.isInstance(cmp) ? cmp.configs.id : cmp ] = null;
			delete opt.fieldList[ Nex.isInstance(cmp) ? cmp.configs.id : cmp ];		
		},
		/*
		*根据name , group 获取输入框对象
		*@param {string} 输入框name
		*@param {string} 输入框分组
		*@return {array}
		*/
		get : function(name,group){
			var self = this,
				opt = this.configs,
				undef;
			if( name === undef ) return [];
			
			var group = Nex.unDefined( group , 'default' );
			
			var ls = [];
			
			var list = opt.fieldList;
			for( var id in list ) {
				var cmp = Nex.getCmp(id);
				//var fields = list[ group ];
				if( !cmp ) {
					delete list[id];
					continue;	
				}
				var _opt = cmp.configs;
				var _name = _opt.name;
				var _group = String( _opt.group ).split(/\s+|,/);
				if( String( _name ) === String( name ) && $.inArray( String( group ), _group ) !== -1 ) {
					ls.push(cmp);		
				}
			}
			return ls;//ls.length == 1 ? ls[0] : ls
		},
		/*
		*用法同get只是find只会取第一个并返回
		*/
		"find" : function(){
			var re = [];
			re = this.get.apply( this,arguments );	
			return re.length ? re[0] : null;
		},
		/*
		*@m 如果为true则多个数据不转换字符串
		*/
		getVal : function(name,group,m){
			var self = this;
			if( $.type( group ) !== 'string' || group === '' ) {
				group = 'default';	
			}
			var obj = self.get.apply(self,[ name,group ]);
			var val = [];
			var m = Nex.unDefined( m,false );
			if( $.isArray(obj) ) {
				$.each(obj,function(){
					var _val = this.val();
					if( _val !== '' ) {
						val.push( _val );	
					}
				});
				var _v = {};
				var _s = false;
				$.each( val,function(i,value){
					if( $._isPlainObject( value ) ) {
						_s = true;
						$.each( value,function(k,v){
							_v[k] = _v[k] || [];
							_v[k].push( v );					   
						} );	
					} else {
						_v[name] = _v[name] || [];
						_v[name].push( value );
					}			 
				} );
				if( !_s ) {
					_v[name] = _v[name] || [];
					val = !m ? _v[name].join(',') : _v[name];		
				} else {
					val = _v;	
					if( $._isPlainObject( val ) ) {
						$.each( val,function(x,d){
							d = d || [];
							d[x] = !m ? d.join(',') : d;	
						} );
					}
				}
				return val;	
			}
			return {};
		},
		getValue : function(){
			return this.getVal.apply( this,arguments );	
		},
		setVal : function(value,name,group){
			var self = this;
			var obj = self.get.apply(self,[arguments[1],arguments[2]]);
			var val = [];
			if( $.isArray(obj) ) {
				$.each(obj,function(i,f){
					if( $.isArray( value ) ) {
						this.val(Nex.unDefined(value[i],''));	
					} else {
						this.val(value);
					}
				});
				return true;
			}
			return null;
		},
		setValue : function(){
			return this.setValue.apply( this,arguments );		
		},
		/*
		*@param {string} 分组 默认default
		*@param {boolean} 默认 false 不获取disabled的输入框 如果为true则获取
		*@param {boolean} 默认 false 返回组件 否则返回name
		*/
		getGroup : function(group,m,t){
			var self = this,opt=this.configs;
			var group = Nex.unDefined( group , 'default' );	
			var m = Nex.unDefined( m , false );	
			var t = Nex.unDefined( t , false );	
			var list = opt.fieldList;
			var inputs = [];
			var names = {};
			var _fields = [];
			for( var id in list ) {
				var cmp = Nex.getCmp(id);
				if( !cmp ) {
					delete list[id];
					continue;	
				}
				var _opt = cmp.configs;
				var _name = _opt.name;
				var isDisabled = _opt.disabled;
				if( !m && isDisabled ) {
					continue;	
				}
				var _group = String( _opt.group ).split(/\s+|,/);
				if( $.inArray( String( group ), _group ) === -1 ) {
					continue;
				}
				_fields.push( cmp );
				if( !t ) {
					inputs.push( cmp );	
				} else {
					if( !names[ _name ] ) {
						inputs.push( _name );
					}
				}
				names[ _name ] = true;
			}
			
			inputs.call =function(){
				var argvs = [].slice.apply(arguments);
				if( !argvs.length ) return self;
				var method = argvs[0];
				argvs.splice(0,1);
				$.each( _fields,function(i,o){
					if( o[method] && $.isFunction( o[method] ) ) {
						o[method].apply( o,argvs );	
					}
				} );
				return self;	
			};
			return 	inputs;

		},
		getGroupName : function(group,m){
			return this.getGroup.apply( this,[ group,m,true ] );	
		},
		//获取某分组下的所有值
		/*
		*@m 是否获取disabled 字段 默认不获取 false
		*@t 如果为true如果多个数据不转换字符串
		*/
		getGroupVal : function(group,m,t){
			var self = this;
			var group = Nex.unDefined( group , 'default' );	
			var m = Nex.unDefined( m , false );	
			var groupNames = self.getGroupName(group,m);
			var data = {};
			$.each(groupNames,function(i,name){
				var value = self.getVal( name,group,t );
				if( $._isPlainObject( value ) ) {
					$.extend( data,value );	
				} else {
					data[ name ] = value;	
				}
			});
			return data;
		},
		getGroupValue : function(){
			return this.getGroupVal.apply( this,arguments );	
		},
		setGroupVal : function(data,group){
			var self = this;
			var data = data || {};
			if( $.isPlainObject( data ) && !$.isEmptyObject(data) ) {
				$.each( data,function(name,value){
					self.setVal( value,name,group );	
				} );	
			}
			return self;
		},
		setGroupValue : function(){
			return this.setGroupVal.apply( this,arguments );		
		},
		//验证是否通过，并返回错误的字段name
		/*
		*m 是否验证disabled 字段 默认不验证 false
		*/
		checkGroup : function(group,m) {
			var self = this;
			var group = Nex.unDefined( group , 'default' );	
			var m = Nex.unDefined( m , false );	
			var list = self.getGroup( group,m );
			var errorList = [];
			var r;
			for( var i=0;i<list.length;i++ ) {
				var field = list[i];
				r = field.checkVal();
				if( r === false ) {
					errorList.push(field.C('name'));	
				}
			}
			return errorList.length ? errorList : true;
		},
		//验证某分组是否通过
		/*
		*m 是否验证disabled 字段 默认不验证 false
		*/
		valid : function(group,m){
			var self = this;
			var r = self.checkGroup(group,m);
			return r === true ? true : false;
		},
		//验证某一元素
		checkField : function( name,group ){
			var self = this;
			var obj = self.get.apply( self,arguments );
			obj = $.isArray( obj ) ? obj : [obj];
			var re = true;
			$.each(obj,function(i,input){
				if( !input.checkVal() ) {
					re = false;
				}
			});
			return re;
		},
		resetGroup : function( group,m ){
			var self = this;
			var group = Nex.unDefined( group , 'default' );	
			var m = Nex.unDefined( m , false );	
			var list = self.getGroup( group,m );
			for( var i=0;i<list.length;i++ ) {
				var field = list[i];
				field.reset();
			}
			return self;	
		},
		"reset" : function(){
			return this.resetGroup.apply(this,arguments);	
		}
	});	
}));
/*
*Validate工具
*Nex.util.Validate
*验证时数据不能为空 ，eg 验证一个邮件 if( Validate.required( value ) && Validate.email( value ) ) {...}
*/
Nex.addUtil('Validate',{
	required: function( value, param ) {
		return $.trim(value).length > 0;
	},
	email: function( value, param ) {
		return $.trim(value).length==0 || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
	},
	url: function( value, param ) {
		return $.trim(value).length==0 || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);//'
	},
	ip : function( value, param ){
		return $.trim(value).length==0 || /^[\d\.]{7,15}$/.test(value);		
	},
	qq : function( value, param ){
		return $.trim(value).length==0 || /^[1-9]\d{4,12}$/.test(value);		
	},
	currency : function( value, param ){
		return $.trim(value).length==0 || /^\d+(\.\d+)?$/.test(value);		
	},
	mobile : function( value, param ){
		return $.trim(value).length==0 || /^((\(\d{3}\))|(\d{3}\-))?13[0-9]\d{8}?$|15[89]\d{8}?$/.test(value);	
	},
	phone : function( value, param ){
		return $.trim(value).length==0 || /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/.test(value);	
	},
	number: function( value, param ) {
		return $.trim(value).length==0 || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
	},
	digits: function( value, param ) {
		return $.trim(value).length==0 || /^\d+$/.test(value);
	},
	creditcard: function( value, param ) {
		
		if( $.trim(value).length==0 ) {
			return true;	
		}
		
		if ( /[^0-9 \-]+/.test(value) ) {
			return false;
		}
		var nCheck = 0,
			nDigit = 0,
			bEven = false;
	
		value = value.replace(/\D/g, "");
	
		for (var n = value.length - 1; n >= 0; n--) {
			var cDigit = value.charAt(n);
			nDigit = parseInt(cDigit, 10);
			if ( bEven ) {
				if ( (nDigit *= 2) > 9 ) {
					nDigit -= 9;
				}
			}
			nCheck += nDigit;
			bEven = !bEven;
		}
	
		return (nCheck % 10) === 0;
	},
	//checkLength 检验radio checkbox的选择数
	rangelength: function( value, param ) {
		if( $.trim(value).length==0 ) {
			return true;	
		}
		
		var length = value.split(",").length;
		//var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
		return ( length >= param[0] && length <= param[1] );
	},
	min: function( value, param ) {
		if( $.trim(value).length==0 ) {
			return true;	
		}
		return value >= param;
	},
	max: function( value, param ) {
		if( $.trim(value).length==0 ) {
			return true;	
		}
		return value <= param;
	},
	range: function( value, param ) {
		if( $.trim(value).length==0 ) {
			return true;	
		}
		return ( value >= param[0] && value <= param[1] );
	},
	equalTo: function( value, param ) {
		var target = $(param);
		return value === target.val();
	}
});
/*
*
*Nex.mixins.DropDown
*下拉列表框 或者 自定义下拉框 
*/
(function( factory ) {
	if ( typeof $define === "function" ) {
		
		$define([
			'Nex.showat.ShowAt'
		], function(){
			
			factory( jQuery );	
		} );
	} else {

		factory( jQuery );
	}
}(function( $ ) {
	Nex.define('Nex.mixins.DropDown', {
		dropdownzIndex : 999999+Nex.zIndex,
		configs : function( opt ){
			return {
				multiSplit : ',',
				textKey : 'text',
				valueKey : 'value',
				splitChr : ['-',',',';','|'],
				dropdownHideToRemove : false,//dropdown 关闭后销毁下拉框  --未实现
				dropdownItems : [],
				dropdownItemDefault : {},
				dropdownLoadMsg : '数据加载中...',
				//默认和Input一样长
				dropdownLoadWidth : 0,
				//加载提示显示参数设置
				dropdownLoadShowAt : {},
				//dropdown 结构 wrap(可能只有做动画效果才能用到)->body(内容)
				//dropdownMode = 1|2 如果是2 则items的内容都会当作组件来创建 如果是1 则会自动判断：如果是数组则创建下拉列表，其他（如xtype function..） 则当作组件创建
				dropdownAnim : false,//dropdownAnimate
				dropdownDuration : 200,
				dropdownEasing : 'easeOutQuad',//easeOutCirc linear easeOutSine
				dropdownMode : 1, // 1:列表下拉框 2:组件下拉框 
				dropdownBorder : true,//dropdown 是否有边框 
				dropdownPadding : 0,
				dropdownAutoScroll : false,//如果创建的是 组件下拉框（mode=2） 则该参数生效
				//'<div style="text-align:center;">暂无数据</div>'
				dropdownEmptyMsg : '',//&&dropdownMode=1 下拉列表为空时的提示内容
				dropdownCls : '',
				dropdownShowAt : {},
				//dropdown的宽高可以设置func 动态返回一个数字
				dropdownHeight : 'auto',//
				dropdownWidth : 'auto',//auto 表示自适应 组件下拉框中 0=inputWidth或者container.width
				dropdownMaxHeight : 0,//(不适应mode=2)0 代表auto 最大不能超过屏幕高度
				dropdownMinHeight : 0,//(不适应mode=2)0 代表auto
				dropdownMaxWidth : 0, // (不适应mode=2)0 标识最大不能超过屏幕宽
				dropdownMinWidth : 0,//(不适应mode=2)如果dropdownMinWidth=0 且是下拉列表(dropdownMode=1)时，dropdownMinWidth实际是和组件的大小宽度一致的，所以如果想控制下拉列表的宽度，应该控制dropdownMinWidth
				dropdownSelectionable : true,
				dropdownEdge : 5,//下拉框right bottom距离边缘的宽度 默认是5[px]
				dropdownItemsFilter : null,//下拉数据过滤器
				dropdownItemFilter : null,//下拉列表的数据过滤器
				dropdownItemFormat : null,//下拉列表参数
				dropdownItemNoWrap : true,//下拉列表不换行
				dropdownItemTips : false,//下拉列表是否这种tips字段
				dropdownItemTipsTag : 'title',
				dropdownItemTipsFilter : null,//function
				dropdownOtherHeight : 0,
				dropdownOtherWidth : 0,
				//下拉列表单选模式
				dropdownSingleSelect : true,
				//单击item或者其他区域后会关闭dropdown 默认true 如果为false则需要手动调用hideDropDown
				dropdownHideOnClick : true,
				//鼠标点击其他区域后隐藏dropdown
				dropdownHideOnBlur : true,
				dropdownShadowShow : true,
				dropdownResetPosDuration : 200,
				dropdownItemTpl : '<div id="<%=id%>" <%=tips%> value="<%=value%>" class="nex-form-dropdown-item <%=selected?"nex-form-dropdown-item-selected":""%> <%=disabled?"nex-form-dropdown-item-disabled":""%> <%=nowrap?"nex-form-dropdown-item-nowrap":""%> <%=cls%>"><%=text%></div>',
				dropdownItemSplitLineTpl : '<div class="nex-form-item-separator"><div class="nex-form-line-h"></div></div>',
				//绑定事件
				'@onDestroy._sysdp' : function(){
					this.destroyDropDown();	
				}
			};
		},
		_getElOffset : function(el){
			var self = this;
			var opt = self.configs;	
			var offset = $(el).offset();
			var sLeft = $(window).scrollLeft();
			var sTop = $(window).scrollTop();
			return !offset ? {left:sLeft,top:sTop} : offset;
		},
		//获取周围可显示空间
		_getShowAtSpace : function(el){
			var self = this;
			var opt = self.configs;
			var el = Nex.unDefined(el,self.getDropDownShowAt());
			//需要获取的对象
			var obj = $(el);
			
			//获取窗口显示区域大小
			var cw = $(window).width();
			var ch = $(window).height();
			
			var offset = $._isPlainObject(el) ? el : self._getElOffset(obj);
			
			//获取滚位置
			var sLeft = $(window).scrollLeft();
			var sTop = $(window).scrollTop();
			
			var space = {
				top : offset.top - sTop,
				left : offset.left - sLeft
			};
			space.bottom = ch - space.top - ( $._isPlainObject(el) ? 0 : obj._outerHeight() );
			space.right = cw - space.left - ( $._isPlainObject(el) ? 0 : obj._outerWidth() );
			return space;
		},
		getDropDownItems : function(){
			var opt = this.configs;
			return opt.dropdownItems || [];	
		},
		getDropDownItemDefault : function(){
			var opt = this.configs;
			return opt.dropdownItemDefault;	
		},
		/*
		*检测当前itemData是否包含__id text value 
		*/
		__itemId : 1,
		_parseItemData : function( data ){
			var self = this,
				undef,
				opt = self.configs;
			var value = opt.valueKey,
				text = opt.textKey;
			//如果data.__id已经存在说明已经处理过了，不需要重复处理
			if( Nex.isPlainObject( data ) && data.__id ) {
				return data;	
			}		
			var d = {};	
			if( Nex.isArray( data ) && data.length ) {
				d[ value ] = data[0];
				d[ text ] = Nex.unDefined(data[1], data[0]);	
			} else if( Nex.isPlainObject( data ) ) {
				d = $.extend({}, data);
				d[value] = Nex.unDefined(data[value], data[text]);
				d[text] = Nex.unDefined(data[text], d[value]);
				d[value] = Nex.unDefined(d[value], '');
				d[text] = Nex.unDefined(d[text], '');
				//d = data;
			} else {//string
				d[ value ] = data+'';
				d[ text ] = d[ value ];	
				if( Nex.inArray( d[ value ],opt.splitChr ) !== -1 ) {
					d[ '__splitLine' ] = true;	
				}
			}
			if( !('__id' in d) ) {
				d.__id = opt.id+'_item_'+self.__itemId++;	
			}
			//getDropDownItemDefault
			$.extend( d,self.getDropDownItemDefault(),d );//opt.itemDefault
			return d;
		},
		isSplitLine : function( data ){
			var data = data || {};
			if( data.__splitLine ) {
				return true;	
			}
			return false;
		},
		setDropDownItems : function( items ){
			var opt = this.configs;
			if( items ) {//dropdownItems
				opt.dropdownItems = $.isArray(items) ? items.concat([]) : items;
			}
			if( opt.dropdownMode == 1 && $.isArray(opt.dropdownItems) ) {
				$.each( opt.dropdownItems,function( i,d ){
					opt.dropdownItems[i] = self._parseItemData( d );	
				} );
			}
			//判断dropdown是否已经创建 如果创建则刷新内容
			var dropdown = self.getDropDown();
			if( dropdown.length && items ) {
				this.resetDropDownList( opt.dropdownItems );
			}
			
			return opt.dropdownItems;	
		},
		/*
		*获取DropDownItems数据
		*@param {String,Array}单个字符是返回当前对象，如果是数组或者以','分割的字符串时返回的是数组
		*@param {Boolean} true 默认 返回数据  false返回索引
		*return {Array,Object}
		*/
		getDropDownItemData : function( value,m ){
			var self = this,
				undef,
				opt = self.configs,
				m = m === undef ? true : m,
				items = self.getDropDownItems();	
			var _v = value;	
			if( value === undef ) return null;
			if( $.type( value ) === 'string' ) {
				value = value.split( opt.multiSplit );	
				if( value.length>1 ) {
					_v = value;	
				}
			} else if( $.type( value ) !== 'array' ) {
				value = [ value ];	
			}
			var d = {};
			$.each( value,function(i,v){
				d[v] = true;					   
			} );
			var list = [];
			$.each( items , function(i,v){
				if( !$.isPlainObject( v ) ) return;
				var value = v['value'];
				if( value in d ) {
					list.push( m?v:i );	
				}
			} );
			
			if( list.length === 1 && $.type( _v ) !== 'array' ) {
				return list[0];	
			} else {
				return list;	
			}
		},
		getDropDownItemIndex : function( value ){
			return this.getDropDownItemData( value,false );
		},
		getDropDownItemDataById : function(id){
			var self = this,
				undef,
				opt = self.configs;
			var d = {};
			var items = self.getDropDownItems();	
			if( id === undef ) {
				return d;	
			}
			$.each( items , function(i,v){
				if( !$.isPlainObject( v ) ) return;
				var value = v['__id'];
				if( value === id ) {
					d = v;
					return false;
				}
			} );	
			return d;
		},
		getDropDownShowAt : function(){
			return this.getContainer();	
		},
		showDropDownLoading : function( msg,callback ){
			var self = this,
				undef,
				opt = self.configs;
			var msg = msg || opt.dropdownLoadMsg;
			var at = self.getDropDownShowAt();
			var loader = $('#'+opt.id+'_dropdown_loading');	
			if( self.__ddt ) {
				clearTimeout( self.__ddt );	
			}
			if( loader.length ) {
				loader.html( opt.dropdownLoadMsg );
			} else {
				//创建dropdown
				loader = $('<div id="'+opt.id+'_dropdown_loading" class="nex-form-dropdown-loading">'+msg+'</div>');	
				$(document.body).append( loader );
				var w = at._outerWidth();
				var w1 = loader._outerWidth();
				var ldpw = $.isFunction(opt.dropdownLoadWidth) ? opt.dropdownLoadWidth.call( self,opt ) : opt.dropdownLoadWidth;
				if( ldpw>0 ) {
					loader._outerWidth( ldpw );		
				} else {
					if( w1<w ) {
						loader._outerWidth( w );	
					}
				}
			}
			loader.showAt(
				$.extend(
					{
						at:at
						,xAlign:'left'
						,yAlign:'bottom'
						,offsetY:-1 
					}
				,opt.dropdownLoadShowAt
				) 
			);
			
			if( $.isFunction( callback ) ) {
				callback.call( self,loader );
			}
			
			return loader;
		},
		__ddt : 0,
		hideDropDownLoading : function( callback ){
			var self = this,
				undef,
				opt = self.configs;	
			var loader = $('#'+opt.id+'_dropdown_loading');	
			if( loader.length ) {
				self.__ddt = setTimeout( function(){
					loader.hide(callback);
					self.__ddt = 0;
				},0 );
			}	
			return self;
		},
		getDropDown : function(){
			var self = this,
				opt = self.configs;	
			return $('#'+opt.id+'_dropdown');
		},
		getDropDownBody : function(){
			var self = this,
				opt = self.configs;	
			return $('#'+opt.id+'_dropdown_body');
		},
		getDropDownListItems : function(){
			var dpb = this.getDropDownBody();
			return $('>.nex-form-dropdown-item',dpb);	
		},
		getDropDownListSelectedItems : function(){
			var dpb = this.getDropDownBody();
			return $('>.nex-form-dropdown-item-selected',dpb);	
		},
		getDropDownListDisabledItems : function(){
			var dpb = this.getDropDownBody();
			return $('>.nex-form-dropdown-item-disabled',dpb);	
		},
		/*
		*创建下拉框 默认一个输入框只能同时存在一个下拉框
		*/
		createDropDown : function(){
			var self = this,
				undef,
				opt = self.configs;
			
			var r = self.fireEvent('onBeforeCreateDropDwon',[ opt ]);	
			if( r === false ) {
				return self;	
			}
			
			var dropdown = $('#'+opt.id+'_dropdown');
			if( dropdown.length ) {
				return dropdown;	
			}
			
			var html = [];	
			//创建dropdown
			html.push('<div id="'+opt.id+'_dropdown" class="nex-form-dropdown '+( opt.dropdownBorder ? "nex-form-dropdown-border" : "" )+' '+opt.dropdownCls+'" tabindex="-1">');
				html.push('<div id="'+opt.id+'_dropdown_body" class="nex-form-dropdown-body " tabindex="-1" >');
				html.push('</div>');
			html.push('</div>');
			
			dropdown = $( html.join('') ).appendTo( document.body );
			
			if( !opt.dropdownSelectionable ) {
				dropdown.disableSelection();		
			}
			
			if( opt.dropdownPadding>0 ) {
				$('#'+opt.id+'_dropdown_body').css('padding',opt.dropdownPadding);	
			}
			
			self._setDropDownEvent();
			
			self.fireEvent('onCreateDropDwon',[ dropdown,opt ]);
			
			return dropdown;
		},
		getDropDownSelectedValue : function(){
			return null;	
		},
		/*
		*创建dropdown内容
		*param {Array} 指定创建下拉框的显示内容 可选 不指定默认获取opt.items
		*/
		// __dropdownMode=1|2  1:列表下拉框 2:组件下拉框 
		__dropdownMode : 1,
		createDropDownList : function( list ){
			var self = this,
				undef,
				value = this.getDropDownSelectedValue(),
				opt = self.configs;
			var html = [];
			var valueKey = opt.valueKey,
				textKey = opt.textKey;
			var list = Nex.unDefined( list,self.getDropDownItems() );//opt.items
			/*if( !$.isArray( list ) ) {
				return self;
			}*/
			
			var dlist = {
				items : list	
			};
			var r = self.fireEvent('onBeforeCreateDropDwonList',[ dlist,opt ]);
			if( r === false ) {
				return self;
			}
			list = dlist.items;
			
			var dropdown = $('#'+opt.id+'_dropdown');
			if( !dropdown.length ) {
				dropdown = self.createDropDown();	
			}
			
			//如果items 不是数组 则使用addCompanet 创建自定义组件
			var dp = dropdown;
			var dpb = $('#'+opt.id+'_dropdown_body');
			
			dpb.removeClass('nex-form-dropdown-m1 nex-form-dropdown-m2 nex-form-dropdown-auto-scroll');
			
			if( $.isArray( list ) && opt.dropdownMode == 1 ) {
				self.__dropdownMode = 1;
				dpb.addClass('nex-form-dropdown-m1');
				var v_maps = {};
				if( value !== null ) {
					$.each( String(value).split( opt.multiSplit ),function(i,v){
						v_maps[v] = true;	
					} );
				}
				var len = list.length;
				for( var i=0;i<len;i++ ) {
					var _d = self._parseItemData( list[i] );
					if( v_maps[ _d[valueKey] ] ) {
						_d.selected = true;	
					} else {
						_d.selected = false;		
					}
					list[i] = _d;
					var d = $.extend( {
						id : list[i]['__id'],
						cls : '',
						selected : false,
						disabled : false,
						nowrap : opt.dropdownItemNoWrap,
						tips 	 : ''	
					},_d );
					//设置title
					//dropdownItemTips : false,//下拉列表是否这种tips字段
					//dropdownItemTipsTag : 'title',
					//dropdownItemTipsFilter : null,//function
					if( opt.dropdownItemTips ) {
						var attr_tips = [opt.dropdownItemTipsTag,'="',];
						var tips = Nex.unDefined(d['tips'],d[textKey]);
						if( $.isFunction( opt.dropdownItemTipsFilter ) ) {
							tips = 	opt.dropdownItemTipsFilter.call( self,tips,d );
						}
						if( tips ) {
							tips = Nex.htmlEncode( tips );	
						}
						d.tipsMsg = tips;
						d.tipsTag = opt.dropdownItemTipsTag;
						attr_tips.push(tips);
						attr_tips.push('"');
						
						d.tips = attr_tips.join('');
					}
					
					d.text = d[ textKey ];
					d.value = Nex.htmlEncode( d[ valueKey ] );
					
					if( opt.dropdownItemFilter && $.isFunction( opt.dropdownItemFilter ) ) {
						var r = opt.dropdownItemFilter.call( self,d );
						if( r === false ) continue;
						if( r !== undef ) {
							d = r;//$.extend(d,r);	
						}
					}
					
					if( opt.dropdownItemFormat && $.isFunction( opt.dropdownItemFormat ) ) {
						d.text = opt.dropdownItemFormat.call( self,d.text,d ) || d.text;
					}
					
					var r = self.fireEvent("onBeforeDropDownItemCreate",[d,opt]);
					if( r === false ) continue;
					
					var _itemTpl = '';
					if( self.isSplitLine( d ) ) {
						_itemTpl = self.tpl(opt.dropdownItemSplitLineTpl,d);	
					} else {
						_itemTpl = self.tpl(opt.dropdownItemTpl,d);
					}
					var et = {
						itemTpl : _itemTpl,
						itemData : d
					};
					self.fireEvent("onDropDownItemCreate",[et,opt]);
					html.push( et.itemTpl );	
				}	
				if( !len && opt.dropdownEmptyMsg != '' ) {
					html.push( opt.dropdownEmptyMsg );	
				}
				dpb.html( html.join('') );
			} else {
				self.__dropdownMode = 2;
				dpb.addClass('nex-form-dropdown-m2');
				if( opt.dropdownAutoScroll ) {
					dpb.addClass('nex-form-dropdown-auto-scroll');	
				}
				dpb.html( '' );
				Nex.gc();
				self.addComponent( dpb,list );
			}
			
			self.fireEvent('onCreateDropDwonList',[ dropdown,self.__dropdownMode,opt ]);
			
			return dropdown;
		},
		resetDropDownList : function(list){
			var self = this;
			var opt = this.configs;
			var list = this._undef( list,this.getDropDownItems() );
			
			if( $.isFunction( opt.dropdownItemsFilter ) ) {
				var _l = opt.dropdownItemsFilter.call( self,list );	
				if( _l === false ) return self;
				if( _l !== undef ) {
					list = _l;	
				}
			}
			
			var d = {
				items : list	
			};
			
			var r = self.fireEvent('onResetDropDownList',[ d,opt ]);
			if( r === false ) {
				return self;	
			}
			
			list = d.items;
			
			if( $.isArray( list ) ){
				self.__CItems = list;		
			} else {
				self.__CItems.length = 0;	
			}
			
			var dropdown = self.createDropDownList( list );
			
			self.setDropDownSize();
			
			//滚动到默认选中的列表
			//var dsel = $('#'+opt.id+'_dropdown_body').find('>.nex-form-dropdown-item-selected:last');
			//if( dsel.length ) {
			//	self.scrollToItemById( dsel.attr('id') );
			//}
			//刷新位置
			if( self.__DP_isShow ) {
				self.resetDropDownPos();
			}
			return self;	
		},
		__CItems : [],
		_bindCloseDropDownEvents : function(){
			var self = this,
				items = this.getDropDownItems(),//this.configs.items,
				opt = self.configs;		
			self.__unbindDropDown();
			if( opt.dropdownHideOnBlur ) {
				//移除下拉框事件
				$(document).bind('mousewheel.dropdown_'+opt.id+' contextmenu.dropdown_'+opt.id+' mousedown.dropdown_'+opt.id,function(e){
					var target = e.target || e.srcElement;
					//closest parents
					if( $(target).is( '#'+opt.id ) 
						|| $(target).is( '#'+opt.id+'_dropdown' ) 
						|| $(target).parents('#'+opt.id+'_dropdown,#'+opt.id).length
					) {
						//
					} else {
						self.hideDropDown();		
					} 
				});
				$(window).bind('resize.dropdown_'+opt.id,function(){
					self.hideDropDown();			
				});
			}
				//支持上下键选择
			$(document).bind("keydown.dropdown_"+opt.id,function(e){
				var sbody = $("#"+opt.id+"_dropdown_body");
				var cur = sbody.find(">.nex-form-dropdown-item-over:last");
				var isFirst = false;
				if( !cur.length ) {
					cur = sbody.find(">.nex-form-dropdown-item-selected:last");
					if( !cur.length ) {
						cur = sbody.find(">.nex-form-dropdown-item:first");	
						isFirst = true;
					}
				}
				
				if( !cur.length ) return;
				var it = cur;
				var _cur = cur;
				switch( e.keyCode ) {
					case 38 : //up
						sbody.find(">.nex-form-dropdown-item").removeClass("nex-form-dropdown-item-over");
						do {
							var prev = isFirst ? cur : cur.prev();
							if( prev.length ) {
								if( !prev.hasClass('nex-form-dropdown-item') ) {
									cur = prev;
									continue;	
								}
								if( prev.hasClass('nex-form-dropdown-item-disabled') ) {
									cur = prev;
									if( isFirst ) break;
									isFirst = false;
									continue;	
								} else {
									cur = prev;
									_cur = prev;	
								}
							} else {
								prev = _cur;
								if( !prev.hasClass('nex-form-dropdown-item') ) {
									cur = prev;
									isFirst = false;
									break;	
								}	
							}
							isFirst = false;
							
							var oitem = prev.length ? prev : _cur;
							var id = oitem.attr('id');
							var data = self.__getItemData(id);
							
							var r = self.fireEvent("onDropDownItemForward",[data,oitem[0],e,opt]);	
							if( r !== false ) {
								oitem.addClass('nex-form-dropdown-item-over');
							}
							//oitem.addClass("nex-form-dropdown-item-over");		
							if( data ) {
								self.scrollToItem( data );
							}
							break;
						} while(1);
						
						break;
					case 40 : //down
						sbody.find(">.nex-form-dropdown-item").removeClass("nex-form-dropdown-item-over");
						do {
							var next = isFirst ? cur : cur.next();
							isFirst = false;
							if( next.length ) {
								if( !next.hasClass('nex-form-dropdown-item') ) {
									cur = next;
									continue;	
								}
								if( next.hasClass('nex-form-dropdown-item-disabled') ) {
									cur = next;
									//如果需要滚动到disabled的话 需要在这里添加scrollToItem
									continue;	
								} else {
									cur = next;
									_cur = next;	
								}
							} else {
								next = _cur;
								if( !next.hasClass('nex-form-dropdown-item') ) {
									cur = next;
									isFirst = false;
									break;	
								}		
							}
							
							var oitem = next.length ? next : _cur;
							var id = oitem.attr('id');
							var data = self.__getItemData(id);
							
							var r = self.fireEvent("onDropDownItemForward",[data,oitem[0],e,opt]);	
							if( r !== false ) {
								oitem.addClass("nex-form-dropdown-item-over");	
							}
							if( data ) {
								self.scrollToItem( data );
							}
							break;
						} while(1);
						
						break;
					case 13:
						//sbody.find(">.nex-form-dropdown-item-over").trigger('click',[e]);//因为使用的是委托 模拟触发会出现问题
						self.__dp_click(sbody.find(">.nex-form-dropdown-item-over"),e);
						//键盘触发 并不会触发是输入框失去焦点
						//self.blur();
						break;
				}
				
			});	
		},
		setDropDownList : function( list ){
			this.__DP_isShow ? this.resetDropDownList( list ) : 0;	
			return this;	
		},
		resetDropDownSizeAndPos : function(){
			if( this.__DP_isShow ) {
				this.resetDropDownSize();		
				this.resetDropDownPos();
			}
		},
		/*
		*显示下拉框
		*/
		__DP_isShow : false,
		//重复调用showDropDown 并且传参 则会调用resetDropDownList
		showDropDown : function( list,callback ){//list = Nex xtype array func , callback 显示后的回调 
			var self = this,
				undef,
				_func,
				opt = self.configs;
			var _setList = list ? true : false;
			var list = this._undef( list,this.getDropDownItems() );
			
			//如果dropdown 已经是显示状态 则调用reset
			if( self.__DP_isShow && _setList ) {
				self.resetDropDownList( list );	
				return self;
			}
			//开始处理list数据
			
			if( $.isFunction( opt.dropdownItemsFilter ) ) {
				var _l = opt.dropdownItemsFilter.call( self,list );	
				if( _l === false ) return self;
				if( _l !== undef ) {
					list = _l;	
				}
			}
			
			var d = {
				items : list	
			};
			
			var r = self.fireEvent('onBeforeDropDownShow',[ d,opt ]);
			if( r === false ) {
				return self;	
			}
			
			if( !opt.dropdownHideToRemove ) {
				var dropdown = self.getDropDown();
				if( dropdown.length ) {
					//显示之前设置选择状态
					if( self.__dropdownMode == 1 ) {
						var ds = self.getDropDownSelectedValue();
						if( ds !== null ) {
							self.dropdownSelectItems( ds );
						}
					}
					self.setDropDownSize();	
					self._showDropDown(null,dropdown);
					return self;
				}	
			}
			
			list = d.items;
			
			self.__CItems = [];
			
			if( $.isArray( list ) ){//&& opt.dropdownMode == 1
				self.__CItems = list;		
			} else {
				self.__CItems.length = 0;	
			}
			//创建dropdown 容器
			var dropdown = $('#'+opt.id+'_dropdown');
			if( !dropdown.length ) {
				dropdown = self.createDropDown();	
			}
			
			//预判__dropdownMode
			if( $.isArray( list ) && opt.dropdownMode == 1 ) {
				self.__dropdownMode = 1;
			} else {
				self.__dropdownMode = 2;	
				//创建下拉组建时 先设置好宽高
				self._setDropDownSize2();
			}
			//创建下拉框内容
			var dropdown = self.createDropDownList( list );
			//设置下拉框大小
			if( self.__dropdownMode == 1 ) {
				self._setDropDownSize1();
			}
			
			self._showDropDown( callback,dropdown );
			
			return self;
		},
		_showDropDown : function(func,dp){
			var self = this,
				opt = self.configs;		
			var fn = function(){
				self.fireEvent("onDropDownShow",[opt]);
				if( $.isFunction( func ) ) {
					func.call( self );
				}
				if( opt.dropdownShadowShow ) {
					self.dropdownShadowShow();	
				}
				self.__DP_isShow = true;
				self._bindCloseDropDownEvents();
			}	
			//显示之前。。。
			if( self.__dropdownMode == 1 ) {
				//滚动到选中的列表
				var dsel = $('#'+opt.id+'_dropdown_body').find('>.nex-form-dropdown-item-selected:last');
				if( dsel.length ) {
					self.scrollToItemById( dsel.attr('id') );
				}
			}
			
			var dropdown = dp || self.getDropDown();
			self.__DP_isShow = true;
			//显示下拉框 
			var zIndex = Nex.mixins.DropDown.dropdownzIndex+2;
			self.dropdownzIndex = zIndex;
			dropdown.css('zIndex',zIndex);
			if( opt.dropdownAnim ) {
				self._animateDropDownShow(fn);	
			} else {
				self._defaultDropDownShow(fn);		
			}
			return self;
		},
		/*移除下拉框*/
		removeDropDown : function(){
			return this.hideDropDown.apply(this,arguments);	
		},
		hideDropDown : function( callback ){
			var self = this,
				undef,
				func,
				opt = self.configs;	
				
			var func = function(){
				if( opt.dropdownShadowShow ) {
					self.hideDropDownShadow();	
				}
				self.fireEvent("onDropDownHide",[opt]);
				if( $.isFunction( callback ) ) {
					callback.call( self );
				}
				self.__DP_isShow = false;
			}
			var r = self.fireEvent('onBeforeDropDownHide',[ opt ]);
			if( r === false ) {
				return self;	
			}
			self.__DP_isShow = false;
			self.unsetDropDownEvent();
			
			if( opt.dropdownAnim ) {
				self._animateDropDownHide(func);	
			} else {
				self._defaultDropDownHide(func);		
			}
			return self;
		},
		__unbindDropDown : function(){
			var opt = this.configs;
			$(document).unbind('.dropdown_'+opt.id);	
			$(window).unbind('.dropdown_'+opt.id);	
		},
		isDropDownCreate : function(){
			var opt = this.configs;
			var dp = $('#'+opt.id+'_dropdown');	
			return dp.length ? true : false;
		},
		//判断dropdown是显示中
		isDropDownShow : function(){
			return this.__DP_isShow;	
		},
		toggleDropDown : function( func ){
			var self = this,
				opt = self.configs;		
			if( self.__DP_isShow ) {
				self.hideDropDown( func );	
			} else {
				self.showDropDown( func );	
			}
			return self;
		},
		_getDropDownOtherHeight : function(){
			return this.configs.dropdownOtherHeight;	
		},
		_getDropDownOtherWidth : function(){
			return this.configs.dropdownOtherWidth;	
		},
		/*计算组件下拉框的大小*/
		__DP_autoWidth : false,
		__DP_autoHeight : false,
		_setDropDownSize1 : function(){
			var self = this,
				opt = self.configs;	
				
			var input = self.getDropDownShowAt();
			var space = self._getShowAtSpace( input );
			space.bottom -= opt.dropdownEdge;
			space.top 	 -= opt.dropdownEdge;
			space.left	 -= opt.dropdownEdge;
			space.right  -= opt.dropdownEdge;
			
			var dp = $('#'+opt.id+'_dropdown');
			var bd = $('#'+opt.id+'_dropdown_body');
			
			//移除之前 我们先获取dropdown的border padding占用空间
			var dph_s = (parseInt(dp.css('paddingTop')) || 0)
						+ (parseInt(dp.css('paddingBottomWidth')) || 0)
						+ (parseInt(dp.css('borderTop')) || 0 )
						+ (parseInt(dp.css('borderBottomWidth')) || 0);
			var dpw_s = (parseInt(dp.css('paddingLeft')) || 0)
						+ (parseInt(dp.css('paddingRight')) || 0)
						+ (parseInt(dp.css('borderLeftWidth')) || 0)
						+ (parseInt(dp.css('borderRightWidth')) || 0);
			
			//注意此处不应该移除dp的width height 因为移除后如果数据太多会突然撑大导致闪屏
			//dp._removeStyle('width height');
			bd._removeStyle('width height');
			
			var win_w = $(window).width() - opt.dropdownEdge;
			//var win_h = $(window).height();
			
			var dw = $.isFunction(opt.dropdownWidth) ? opt.dropdownWidth.call( self,opt ) : opt.dropdownWidth;
			var dh = $.isFunction(opt.dropdownHeight) ? opt.dropdownHeight.call( self,opt ) : opt.dropdownHeight;
			
			if( dw == 'auto' ) {
				dp._removeStyle('width');	
			}
			if( dh == 'auto' ) {
				dp._removeStyle('height');	
			}
			
			dw = dw == 'auto' ? 0 : dw;
			dh = dh == 'auto' ? 0 : dh;
			
			var isAutoHeight = false;
			var isAutoWidth = false;
			
			/*
			*setp1:先计算dropdown的高度
			*/
			var sh = bd.outerHeight() + dph_s;//作用等同于 dp.outerHeight 但是我们不能直接用这个 
			var h = dh > 0 ? dh : sh;
			var max_h = $.isFunction(opt.dropdownMaxHeight) ? opt.dropdownMaxHeight.call( self,opt ) : opt.dropdownMaxHeight;
			var min_h = $.isFunction(opt.dropdownMinHeight) ? opt.dropdownMinHeight.call( self,opt ) : opt.dropdownMinHeight;
			//var min_space = Math.min( space.bottom,space.top );
			//if( h > min_space ) {//这个判断可不要
			h = Math.min( h,Math.max(space.bottom,space.top) );
			//}
			if( min_h>0 ) {
				h = Math.max( h,min_h );
			}
			if( max_h>0 ) {
				h = Math.min( h,max_h );
			}
			isAutoHeight = true;
			if( dh != 0 || h != sh ) {
				isAutoHeight = false;
				dp._outerHeight( h );
				bd._outerHeight( dp.height()-self._getDropDownOtherHeight() );	
			} else {
				dp._removeStyle('height');	
			}
			//step2:再计算宽度 注意：必须要先设置高度后在获取宽度
			var sw = bd.outerWidth() + dpw_s;//作用等同于 dp.outerWidth
			var w = dw > 0 ? dw : sw;
			var max_w = $.isFunction(opt.dropdownMaxWidth) ? opt.dropdownMaxWidth.call( self,opt ) : opt.dropdownMaxWidth;
			var min_w = $.isFunction(opt.dropdownMinWidth) ? opt.dropdownMinWidth.call( self,opt ) : opt.dropdownMinWidth;
			min_w = min_w>0?min_w:input._outerWidth();
			w = Math.max( w,min_w );
			w = Math.min( w,win_w );
			if( max_w>0 ) {
				w = Math.min( w,max_w );	
			}
			
			isAutoWidth = true;
			if( dw != 0 || w != sw ) {
				isAutoWidth = false;
				dp._outerWidth( w );
				bd._outerWidth( dp.width()-self._getDropDownOtherWidth() );	
			} else {
				dp._removeStyle('width');	
				//做些微调整 如果出现了滚动条 应该加上滚动条的宽度
				var hasScroll = Nex.hasScroll( bd,'top' );
				if( hasScroll ) {
					isAutoWidth = false;
					var sbar = self.getScrollbarSize();
					w += (sbar.y + self._getDropDownOtherWidth());
					w = Math.min( w,win_w );
					dp._outerWidth( w );
					bd._outerWidth( dp.width() );	
				}
			}
			//记录状态
			self.__DP_autoWidth = isAutoWidth;
			self.__DP_autoHeight = isAutoHeight;
			
			self.fireEvent( 'onSetDropDownSize',[dp,1,opt] );
			
			return self;
		},
		_setDropDownSize2 : function(){
			var self = this,
				opt = self.configs;		
		
			var input = self.getDropDownShowAt();	
			
			var dp = $('#'+opt.id+'_dropdown');
			var bd = $('#'+opt.id+'_dropdown_body');
			
			//dropdownAutoScroll
			var win_w = $(window).width() - opt.dropdownEdge;
			var win_h = $(window).height() - opt.dropdownEdge;
			
			var w = $.isFunction(opt.dropdownWidth) ? opt.dropdownWidth.call( self,opt ) : opt.dropdownWidth,
				h = $.isFunction(opt.dropdownHeight) ? opt.dropdownHeight.call( self,opt ) : opt.dropdownHeight
				inputW = input._outerWidth();
			
			if( w == 0 ) {
				w = inputW;
			}
			h = parseInt( h,10 );
			h = isNaN(h) ? 0 : h;
			
			var isAutoHeight = false;
			var isAutoWidth = false;
			
			if( h == 0 || h == 'auto' ) {
				dp._removeStyle( 'height' );	
				bd._removeStyle( 'height' );
				isAutoHeight = true;	
				if( dp.outerHeight() > win_h ) {
					dp._outerHeight( win_h );	
					bd._outerHeight( dp.height() - self._getDropDownOtherHeight() );	
					isAutoHeight = false;		
				}
			} else {
				isAutoHeight = false;		
				dp._outerHeight( h );	
				bd._outerHeight( dp.height() - self._getDropDownOtherHeight() );		
			}
			
			if( w == 'auto' ) {
				isAutoWidth = true;
				dp._removeStyle( 'width' );	
				bd._removeStyle( 'width' );	
				if( dp.outerWidth() > win_w ) {
					isAutoWidth = false;
					dp._outerHeight( win_w );	
					bd._outerHeight( dp.width() - self._getDropDownOtherWidth() );			
				}
			} else {
				isAutoWidth = false;
				w = parseInt( w,10 );
				w = isNaN(w) ? inputW : w;
				dp._outerWidth( w );	
				bd._outerWidth( dp.width() - self._getDropDownOtherWidth() );	
			}
			//记录状态
			self.__DP_autoWidth = isAutoWidth;
			self.__DP_autoHeight = isAutoHeight;
			//应该计算最大最小
			self.fireEvent( 'onSetDropDownSize',[dp,2,opt] );
			
			return self;
		},
		setDropDownSize : function(){
			var self = this,
				opt = self.configs;	
			
			if( self.__dropdownMode == 2 ) {
				return 	self._setDropDownSize2();
			} else {
				return 	self._setDropDownSize1();	
			}
		},
		resetDropDownSize : function(){
			return this.setDropDownSize();
		},
		//@private
		__dp_click : function($this,e){
			var self = this;
			var opt = this.configs;
			var $$this = $($this);
			var id = $$this.attr('id');
			var data = self.__getItemData(id);
			
			if( data.disabled || $$this.hasClass('nex-form-dropdown-item-disabled') ) {
				return;	
			}
			
			var r = self.fireEvent("onDropDownItemClick",[data,$this,e,opt]);	
			if( r !== false ) {
				self._dropdownItemsSelect( data,$this,e );
			}
		},
		//设置选择状态
		dropdownSelectItems : function( value ){
			var self = this;
			var opt = this.configs;	
			var sep = opt.multiSplit;
			var dpb = $('#'+opt.id+'_dropdown_body');
			//self.unselectDropDownAll();
			var selected = String(value).split( sep );
			var _s = {};
			$.each(selected,function(i,v){
				_s[v] = true;	
			});	
			$('>.nex-form-dropdown-item',dpb).each( function(){
				var v = $(this).attr('value');
				if( v in _s ) {
					$(this).addClass('nex-form-dropdown-item-selected');	
				} else {
					$(this).removeClass('nex-form-dropdown-item-selected');	
				}
			} );
			return self;
		},
		_dropdownItemsSelect : function(data,el,e){
			var self = this;
			var opt = this.configs;	
			var $el = $(el);
			var isSelected = $el.hasClass('nex-form-dropdown-item-selected');
			if( opt.dropdownSingleSelect ) {
				if( isSelected ) {
					return;	
				}
				self.unselectDropDownAll();	
				$el.addClass('nex-form-dropdown-item-selected');
				//data.selected = true;
				if( opt.dropdownHideOnClick ) {
					self.hideDropDown();	
				}	
				self.fireEvent("onDropDownItemSelected",[data,el,e,opt]);
				self.fireEvent("onDropDownItemSelectedChange",[data[opt.valueKey],data[opt.textKey],data,el,e,opt]);
			} else {
				var sep = opt.multiSplit;
				var dpb = $('#'+opt.id+'_dropdown_body');
				var value = [];
				var text = [];
				if( isSelected ) {
					$el.removeClass('nex-form-dropdown-item-selected');
					self.fireEvent("onDropDownItemUnSelected",[data,el,e,opt]);
					//data.selected = false;
				} else {
					$el.addClass('nex-form-dropdown-item-selected');	
					self.fireEvent("onDropDownItemSelected",[data,el,e,opt]);
					//data.selected = true;
				}
				$('>.nex-form-dropdown-item-selected',dpb).each( function(){
					value.push( $(this).attr('value') );	
				} );
				$.each( value,function(i,v){
					var d = self.__getItemData( v,false );	
					if( d ) {
						text.push( d[ opt.textKey ] );		
					} else {
						text.push( v );	
					}
				} );
				self.fireEvent("onDropDownItemSelectedChange",[value.join(sep),text.join(sep),data,el,e,opt]);
			}
		},
		//@private
		__getItemData : function( id,isId ){
			var self = this,
				items = this.getDropDownItems(),
				opt = self.configs;	
			var isId = Nex.unDefined( isId, true );	
			var d = null;
			$.each( items.concat(self.__CItems) , function(i,v){
				if( !$.isPlainObject( v ) ) return;
				var value = isId ? v['__id'] : v[ opt.valueKey ];
				if( String(value) === String(id) ) {
					d = v;
					return false;
				}
			} );	
			return d;		
		},
		/*下拉框事件*/
		_setDropDownEvent : function(){
			var self = this,
				opt = self.configs;	
				
			var list = $('#'+opt.id+'_dropdown_body');
			
			var getItemData = function( id ){
				return self.__getItemData( id );
			};
			var _click = function(e){
				self.__dp_click(this,e);	
			};
			//下拉框列表事件
			list.undelegate('>.nex-form-dropdown-item')
				.delegate('>.nex-form-dropdown-item',{
				"mouseenter" : function(e){
					var $this = $(this);
					var id = $this.attr('id');
					var data = getItemData(id);
					
					if( data.disabled || $this.hasClass('nex-form-dropdown-item-disabled') ) {
						return;	
					}
					
					var r = self.fireEvent("onDropDownItemOver",[data,this,e,opt]);	
					if( r !== false ) {
						$this.addClass('nex-form-dropdown-item-over');
					}
				},
				"mouseleave" : function(e){
					var $this = $(this);
					var id = $this.attr('id');
					var data = getItemData(id);
					if( data.disabled || $this.hasClass('nex-form-dropdown-item-disabled') ) {
						return;	
					}
					
					var r = self.fireEvent("onDropDownItemOut",[data,this,e,opt]);	
					if( r !== false ) {
						$this.removeClass('nex-form-dropdown-item-over');
					}
				},
				"click" : _click
			});
			
			self.unsetDropDownEvent();
			
			self.fireEvent( 'onSetDropDownEvent',[opt] );
			
			return self;
		},
		/*
		*滚动到指定item
		*param value
		*/
		scrollToItem : function(val){
			var self = this;
			var opt = self.configs;	
			var items = self.getDropDownItems();//opt.items;
			var id = '';
			
			if( typeof val === 'object' ) {
				val = val[opt.valueKey];	
			}
			
			for( var i=0;i<items.length;i++ ) {
				if( items[i]['value']+'' === val+'' ) {
					id = items[i]['__id'];
					break;
				}	
			}
			
			if( !id ) {
				return self;	
			}
			
			var body = $("#"+opt.id+"_dropdown_body");
			
			if( !body.length ) {
				return self;	
			}
			
			var offset = body.offset();
			var h = body._outerHeight();
			
			var f = $("#"+id);
			if( !f.length ) {
				return self;	
			}
			
			var fo = f.offset();
			var fh = f._outerHeight();
			
			var outerHeight = 0;
			if( offset.top > fo.top ) {
				outerHeight = offset.top - fo.top;
			} else if( (offset.top+h) < (fo.top+fh) ) {
				outerHeight = (offset.top+h) - (fo.top+fh);
			}
			
			var sTop = 0;
			
			sTop = body.scrollTop() - outerHeight;
			
			body.scrollTop( sTop );
			
			return self;
		},
		scrollToItemById : function( id ){
			var self = this,
				opt = self.configs;	
			
			var d = self.__getItemData(id);
			if( d ) {
				self.scrollToItem( d );
			}
			return self;
		},
		unsetDropDownEvent : function(){
			var self = this,
				opt = self.configs;
			self.fireEvent('onUnsetDropDownEvent',[ opt ]);
			self.__unbindDropDown();
			return self;
		},
		//取消所有选中状态
		unselectDropDownAll : function(){
			var self = this,
				undef,
				opt = self.configs;
			var items = self.getDropDownItems();	
			$.each( items.concat(self.__CItems),function(i,d){
				if( typeof d === 'object' ) {
					d.selected = false;	
				}
			} );
			$('#'+opt.id+'_dropdown_body').find('>.nex-form-dropdown-item-selected').removeClass('nex-form-dropdown-item-selected');
			return self;
		},
		__DP_ShowAlign : 'bottom',
		/*默认动画显示下拉框*/
		_defaultDropDownShow : function( callback ){
			var self = this,
				undef,
				func,
				opt = self.configs;	
			var dropdown = $('#'+opt.id+'_dropdown');
			func = $.isFunction( callback ) ? callback : null;	
			
			dropdown._show();
			dropdown._visible(true);
			
			var at = self.getDropDownShowAt();
			dropdown.showAt(
				$.extend(
					{
						at:at
						,visibleEdge : opt.dropdownEdge
						,xAlign:'left'
						,yAlign:'bottom'
						,offsetY:0
						,autoShow : true
						,"onShow.dropdown" : function(pos,conf){
							self.__DP_ShowAlign = conf.yAlign;
							dropdown.removeClass('nex-form-dropdown-'+conf.yAlign);
							dropdown.addClass('nex-form-dropdown-'+conf.yAlign);
						} 
					}
				,opt.dropdownShowAt
				) 
			);
			
			if( $.isFunction( func ) ) {
				func.call( self,dropdown );
			}
			return self;
		},
		resetDropDownPos : function(){
			var self = this,
				undef,
				func,
				opt = self.configs;	
			var dropdown = $('#'+opt.id+'_dropdown');
			var at = self.getDropDownShowAt();
			
			var showat = Nex.Create('showAt',$.extend(
				  {
					  at:at
					  ,visibleEdge : opt.dropdownEdge
					  ,xAlign:'left'
					  ,yAlign:'bottom'
					  ,offsetY:0
				  }
				 ,opt.dropdownShowAt,{
					 el : dropdown
					 ,autoShow : false 
				 }
			  ));
			  
			  var pos = showat.getShowPos();
			  var yAlign = showat.C('yAlign');
			  
			  self.__DP_ShowAlign = yAlign;
			  
			  var shadow = null;
			  if( opt.dropdownShadowShow ) {
					shadow = self.getDropDownShadow();
					shadow.hide();
			  }
			  
			  dropdown.stop(true,true).animate(pos,opt.dropdownResetPosDuration,function(){
				  if( opt.dropdownShadowShow && shadow ) {
						shadow.show();
					}
				  self.resetDropDownShadow(); 
			  });
			
			return self;	
		},
		_defaultDropDownHide : function( callback ){
			var self = this,
				undef,
				opt = self.configs;	
			self.__DP_isShow = false;	
			var dp = $('#'+opt.id+'_dropdown');	
			//_visible(true|false)
			dp.stop(true,true)._visible( false )._hide();
			
			if( opt.dropdownHideToRemove ) {
				dp.remove();	
			}
			
			if( $.isFunction( callback ) ) {
				callback.call( self );
			}
			return self;
		},
		_animateDropDownShow : function( callback ){
			var self = this,
				undef,
				func,
				opt = self.configs;	
			var dropdown = $('#'+opt.id+'_dropdown');
			var db = $('#'+opt.id+'_dropdown_body');
			func = $.isFunction( callback ) ? callback : null;	
			
			//显示dropdown
			dropdown._show();
			dropdown._visible(true);
			
			var at = self.getDropDownShowAt();
			var showat = Nex.Create(
				'showAt',
				$.extend(
					{
						at:at
						,visibleEdge : opt.dropdownEdge
						,xAlign:'left'
						,yAlign:'bottom'
						,offsetY:0,
						"onShow.dropdown" : function(pos,conf){
							self.__DP_ShowAlign = conf.yAlign;
							dropdown.removeClass('nex-form-dropdown-'+conf.yAlign);
							dropdown.addClass('nex-form-dropdown-'+conf.yAlign);
						} 
					}
				,opt.dropdownShowAt
				,{ 
					el : dropdown
					,autoShow : false
				 }
				) 
			);
			
			var pos = showat.getShowPos();
			var yAlign = showat.C('yAlign');
			self.__DP_ShowAlign = yAlign;
			//----
			dropdown.removeClass('nex-form-dropdown-'+yAlign);
			dropdown.addClass('nex-form-dropdown-'+yAlign);
			var sh = dropdown.height();
			var _sh = dropdown.outerHeight();
			//如果dropdown是auto-width情况下设置宽度
			if( self.__DP_autoWidth ) {
				dropdown.width( dropdown.width() );
			}
			dropdown.height(0);
			
			db.addClass('nex-form-dropdown-anim-'+yAlign);
			
			var animBack = function(){
				self.__DP_ShowAlign = yAlign;
				dropdown.removeClass('nex-form-dropdown-'+yAlign);
				dropdown.addClass('nex-form-dropdown-'+yAlign);
				db.removeClass( 'nex-form-dropdown-anim-'+yAlign );
				if( self.__DP_autoWidth ) {
					dropdown._removeStyle( 'width' );
				}
				if( self.__DP_autoHeight ) {
					dropdown._removeStyle( 'height' );
				}
				//回调
				if( $.isFunction( func ) ) {
					func.call( self,dropdown );
				}		
			};
			
			if( yAlign === 'bottom' ) {
				dropdown.css( pos );
				dropdown.stop(true,true).animate({ height : sh },opt.dropdownDuration,opt.dropdownEasing,animBack);
			} else {
				var pos2 = {
						left : pos.left,
						top : pos.top+_sh
					}	
				dropdown.css( pos2 );	
				dropdown.stop(true,true).animate({ height : sh,top : pos.top },opt.dropdownDuration,opt.dropdownEasing,animBack);
			}
			return self;
		},
		_animateDropDownHide : function( callback ){
			return this._defaultDropDownHide.apply( this,arguments );
		},
		dropdownShadowShow : function(){
			var self = this,
				undef,
				opt = self.configs;
			var r = self.fireEvent('onBeforeDropDownShadowShow',[opt]);
			if( r === false ) {
				return self;	
			}	
			var shadow = $('#'+opt.id+'_dropdown_shadow');
			if( !shadow.length ) {
				shadow = $('<div id="'+opt.id+'_dropdown_shadow" class="nex-form-dropdown-shadow">'+(Nex.IEVer<=8?'<iframe style="width:99%;height:99%;"></iframe>':'')+'</div>').appendTo(document.body);
			}
			shadow.show();	
			var dropdown = self.getDropDown();
			shadow._width( dropdown.outerWidth() );
			shadow._height( dropdown.outerHeight() );
			shadow.css( dropdown.offset() )
				  .css( 'zIndex',self.dropdownzIndex-1 );
			self.fireEvent('onDropDownShadowShow',[opt]);
			shadow.removeClass('nex-form-dropdown-shadow-top nex-form-dropdown-shadow-bottom');
			shadow.addClass('nex-form-dropdown-shadow-'+self.__DP_ShowAlign);
			return self;
		},
		resetDropDownShadow : function(){
			var self = this,
				undef,
				opt = self.configs;
			var shadow = $('#'+opt.id+'_dropdown_shadow');
			var dropdown = self.getDropDown();
			shadow._width( dropdown.outerWidth() );
			shadow._height( dropdown.outerHeight() );
			
			shadow.css( dropdown.offset() );
			
			shadow.removeClass('nex-form-dropdown-shadow-top nex-form-dropdown-shadow-bottom');
			shadow.addClass('nex-form-dropdown-shadow-'+self.__DP_ShowAlign);
			return self;	
		},
		hideDropDownShadow : function(){
			var self = this,
				undef,
				opt = self.configs;
			var r = self.fireEvent('onBeforeDropDownShadowHide',[opt]);
			if( r === false ) {
				return self;	
			}		
			var shadow = $('#'+opt.id+'_dropdown_shadow');
			if( opt.dropdownHideToRemove ) {
				shadow.remove();
			} else {
				shadow.hide();	
			}
			self.fireEvent('onDropDownShadowHide',[opt]);
			return self;	
		},
		getDropDownShadow : function(){
			var self = this,
				opt = self.configs;	
			return $('#'+opt.id+'_dropdown_shadow');	
		},
		destroyDropDown : function(){
			if( this.isDropDownShow() ) {
				this.hideDropDown();
			}
			var dp = this.getDropDown();
			var dps = this.getDropDownShadow();
			dp.remove();
			dps.remove();
			this.__DP_isShow = false;
			this.__unbindDropDown();
			return this;
		}	
	});
}));
/*
Nex.Form  继承 Nex.Html
xtype form|textfield
author:nobo
qq:505931977
QQ交流群:13197510
email:zere.nobo@gmail.com or QQ邮箱
*/
(function( factory ) {
	if ( typeof $define === "function" ) {
		
		$define([
			'Nex.form.Manager',
			'Nex.util.Validate',
			'Nex.container.Container',
			'Nex.mixins.DropDown'
		], function(){
			
			factory( jQuery );	
		} );
	} else {

		factory( jQuery );
	}
}(function( $ ) {
	//"use strict";
	//var FormManager = Nex.Create('formmanager');
	//Nex.FormManager = FormManager;
	var form = Nex.define('Nex.form.AbstractForm','Nex.container.Container',{
		alias : 'Nex.Form Nex.form.AbstractForm',
		xtype : 'form abstractform',
		mixins : [ 'Nex.mixins.DropDown' ]	
	});
	//兼容以前版本
	//Nex.form = form;
	Nex.form.Form = form;
	
	form.addStatics({
		FormManager : Nex.FormManager,
		dropdownzIndex : 999999+Nex.zIndex
	});
	form.setOptions( function( opt ){
		return {
			prefix : 'nexform-',
			renderTo : document.body,
			disabledItems : true,
			//当DOM不存在是允许回收当前对象
			autoDestroy : true,
			//表单默认设置的是固定宽度，关闭了大小只适应
			autoResize : true,
			//From没有BodyView，虽然有但是大小不会改变
			_hasBodyView : false,
			_checkScrollBar : false,
			//不需要多余事件绑定
			denyEvents : true,
			autoWidthCls : [opt.autoWidthCls,'nex-form-auto-width'].join(' '),
			autoHeightCls : [opt.autoHeightCls,'nex-form-auto-height'].join(' '),
			borderCls : [opt.borderCls,'nex-form-border'].join(' '),
			containerCls : [opt.containerCls,'nex-form'].join(' '),
			//不是容器，不需要开启
			autoScroll : false,
			autoScrollCls : '',
			//是否创建后获得焦点
			autoFocus : false,
			//表单自带tabIndex,关闭系统自带的
			tabIndex : false,
			//多选控件时数据的分隔符
			multiSplit : ',',
			/*private*/
			__inputType : 'text',
			//是否显示Label
			showLabel : 'auto',//是否开启Label显示 atuo:如果存在labelText==''则不显示 否则显示， true:显示 false：不显示  
			labelCls : '',
			labelStyle : {},
			labelvAlign : 'top', // top middle bottom
			labelPosition : 'left',//left top bottom right
			labelAlign : 'left',
			labelText : '',
			labelWidth : 80,
			showPlaceholder : true,
			placeholder : '',
			autocomplete : 'off',
			//显示规则：inline block
			display : 'inline',
			//设置分组
			group : 'default',//分组
			//表单name
			name : '',
			//表单默认值
			value : '',
			_value : '',
			//默认情况下 如果inputText的文字改变是应该触发onChange
			//但是combobox 可选下拉框 就不需要触发onChange  
			//因为这些选择框的值都必须在items中选择
			inputTextChangeEvent : 'onChange',
			//inner或者outer
			triggerBtnsPosition : 'inner',
			triggerBtns : [],
			triggerBtnSelection : false,
			//点击triggerBtn输入框也会获得焦点 默认关闭
			triggerToFocus : false,
			//清空按钮
			cleanBtn : false,
			cleanDefault : '',//清除后的默认值
			inputAttrs : {},
			//数据设置时改变数据的值
			formater : null,
			//数据获取是可改变数据的值
			getFormater : null,
			//数据设置最终控制
			setFormater : null,
			//数据映射，单纯的数据显示时用 并不会实际改变输入框的值 eg : {1:'01'} 显示的时候是01 获取到的值是 1
			renderer : {},
			_renderer : {},//反renderer
			rendererDef : '_default_',
			validator : Nex.formValid || {},
			rules : [],
			showVaildMsg : true, //验证成功或者失败时 提示验证信息
			vaildMsgPosition : 'right', // top bottom left right
			validMsg : '',//验证提示信息，会一直存在
			validMsgOnFocus : '',//获得焦点时的提示信息
			validErrorMsg : '请填写正确信息！',
			validSuccessMsg : '通过信息验证！',
			//验证成功或者错误时提示信息
			//{ required : '当前数据不能为空！',email : '邮箱地址填写不正确',... } 不存在这使用validErrorMsg
			messages : {},
			validErrorCls : 'nex-form-valid-error',
			validSuccessCls : 'nex-form-valid-success',
			textKey : 'text',
			valueKey : 'value',
			items : [],//{cls:'',text:'年龄',value:'45',readOnly:false,disabled:false,selected:true,attrs:''} or '|' ',' ';'
			//_multiItems : [],//multi缓存数据
			splitChr : ['-',',',';','|'],
			_item :　{
				cls:'',
				text:'',
				value:'',
				readOnly:false,
				disabled:false,
				selected:false,
				title : '',//multiSelect
				display : 'inline-block'
			},
			itemDefault : {},
			//加载items时是否显示loading提示
			showItemsLoading : false,//暂时无效
			//加载items的ajax参数设置//暂时无效
			_ajaxOptions : {
				dataType : 'json',	
				type : 'GET'
			},//ajax自定义默认参数
			ajaxOptions : {},//ajax自定义参数 //暂时无效
			width : 150,
			height : 'auto',//textarea multselect
			autoValidDelay : 50,
			autoValidEvents : ['onChange','onBlur','onPaste'],//什么时候进行数据验证
			disabled : false,
			readOnly : false,
			cls : '',
			overCls : '',
			focusCls : '',
			disabledCls : '',
			readonlyCls : '',
			dropdownMinWidth : 0,//设置下拉列表的最小宽度和input宽度一样
			tpl : {
				inputTpl : '<div <%=attrs%> id="<%=id%>-input" type="<%=type%>" name="<%=name%>" autocomplete="<%=autocomplete%>" tabindex=<%=tabIndex%> value="" class="nex-form-field nex-form-field-<%=type%>"></div>',
				formTpl : '<table id="<%=id%>-inner" class="nex-field nex-form-inner" cellspacing="0" cellpadding="0" ><tbody>'
								+'<tr id="<%=id%>-inputRow">'
									+'<td class="nex-form-inner-body" id="<%=id%>-body-td">'
										+'<div id="<%=id%>-body" class="nex-form-body">'
											+'__inputTpl__'
											+'<label id="<%=id%>-placeholder" class="nex-form-placeholder"><%=placeholder%></label>'//for="<%=id%>-input"
											+'<div id="<%=id%>-trigger-body" class="nex-form-trigger-body"></div>'
										 +'</div>'
									+'</td>'
								+'</tr>'
							+'</tbody></table>'
			},
			events : {}
		};	
	} );
	form.override({
		_triggerID : 1,
		initComponent : function() {
			var self = this;
			var opt = this.configs
			self.callParent(arguments);
			//检查参数
			self._checkOptions( opt )
				 ._setFormView()
				 .initFormField();
		},
		
		initFormField : function(){
			var self = this,
				opt = this.configs;
				
			self.checkLabelSet();	
		},
		onCreate : function(){
			var self = this;	
			self.callParent(arguments);
			
			if( Nex.FormManager ) {
				Nex.FormManager.add(self);	
			}
			
			self._afterCreate();
		},
		_checkOptions : function( opt ){
			//opt.cls += ' nex-form-group-'+opt.group;
			//opt.cls += ' nex-form-display-'+opt.display;
			this.el.addClass( 'nex-form-display-'+opt.display );
			if( Nex.isArray( opt.items ) ) {
				opt.items = opt.items.concat([]);	
			}
			return this;
		},
		sysEvents : function(){
			var self = this;
			var opt = self.configs;
			
			self.callParent(arguments);
			
			self.bind("onMouseOver._sys",self._setOverCls,self);
			self.bind("onMouseOut._sys",self._unsetOverCls,self);
			
			self.bind("onFocus._sys",self._setFocusCls,self);
			self.bind("onBlur._sys",self._unsetFocusCls,self);
			
			self.bind("onChange._sys",self._triggerPlaceholder,self);
			self.bind("onBlur._sys",self.refreshFormater,self);//refreshFormater
			self.bind("onBlur._sys",self.refreshRenderer,self);
			
			self.bind("onValidError._sys",self.setValidError,self);
			self.bind("onValidSuccess._sys",self.setValidSuccess,self);
			for(var i=0;i<opt.autoValidEvents.length;i++ ) {
				var s = self.bind(opt.autoValidEvents[i],self._autoValid,self);	
			}
			
			self.bind('onDropDownItemSelectedChange._sys',self._setDropDownValue,self);
			
			return self;
		},
		/*
		*作为备份用，如果用户没有定义tpl.formTpl 那么会使用当前函数
		*/
		formTpl : function(d){
			var text = [];
			/*
			text.push('<table id="'+d.id+'-inner" class="nex-field nex-form-inner" cellspacing="0" cellpadding="0" ><tbody>');//style="table-layout:fixed;" 不建议设置 IE 67 下会有问题
			text.push('<tr id="'+d.id+'-inputRow">');
				text.push('<td class="nex-form-inner-body" id="'+d.id+'-body-td">');	
				text.push('<div id="'+d.id+'-body" class="nex-form-body">');	
					text.push('<div '+d.attrs+' id="'+d.id+'-input" name="'+d.name+'" tabindex='+d.tabIndex+' value="" style="width:0px;" class="nex-form-field"></div>');
				text.push('</div></td>');
			text.push('</tr>');
			text.push('</tbody></table>');
			*/
			return text.join("");	
		},
		/*
		*获取表单模版
		*/
		_getFormTpl : function(){
			var self = this,
				opt = self.configs;
			var d = $.extend({},opt);
			var attrs = [];	
			if( $.isPlainObject( d.inputAttrs ) ) {
				$.each( d.inputAttrs,function(k,v){
					attrs.push(k+'='+v);
				} );
			}
			attrs.join(' ');
			d.attrs = attrs;
			d.tabIndex = ++Nex.tabIndex;
			d.placeholder = opt.placeholder;
			d.type = opt.__inputType;
			//__inputTpl__
			var inputTpl = opt.tpl.inputTpl || '';
			var formTpl = opt.tpl.formTpl || '';
			formTpl = formTpl.replace( /__inputTpl__/ig,inputTpl );
			return self.tpl( formTpl,d );
		},
		getBody : function(){
			var self = this,
				opt = self.configs;
			return $('#'+opt.id+'-body');
		},
		/*
		*设置组件HTML
		*/
		_setFormView : function(){
			var self = this,
				opt = self.configs,
				container = opt.views['container'];
			container.html( self._getFormTpl() );
			opt.views['body'] = $('#'+opt.id+'_body');
			
			self._setSysTriggerBtns();
			self._setTriggerBtns();
			self._bindEvent();
			
			self.fireEvent("onSetFormView",[opt]);	
			
			return self;
		},
		/*重载设置系统的trigger btn*/
		_setSysTriggerBtns : function(){
			var self = this,
				opt = self.configs;
			if( opt.cleanBtn ) {
				var cdf = opt.cleanDefault;
				self.addInnerTriggerBtn({
					cls : 'nex-form-clear-trigger',
					iconCls : 'nex-form-clear-icon',
					callBack : function(){
						var oldValue = self.getInputText();
						self.val(cdf);	
						var newValue = self.getInputText();
						if( opt.inputTextChangeEvent ) {
							self.fireEvent(opt.inputTextChangeEvent,[ newValue,oldValue ]);
						}
						self.fireEvent('onTextChange',[ newValue,oldValue ]);
						self.fireEvent('onClean',[ newValue,oldValue ]);
						//triggerToFocus 如果这个关闭状态下 我们需要手动设置focus , 如果是开启状态下则会自动设置focus
						if( !opt.triggerToFocus ) {
							self.focus();
						}
					}	
				});
			}
			//cleanBtn	
			return self;
		},
		/*设置触发按钮*/
		_setTriggerBtns : function(){
			var self = this,
				opt = self.configs;
			var html = [];	
			var method = opt.triggerBtnsPosition === 'inner' ? 'addInnerTriggerBtn' : 'addOuterTriggerBtn';
			$.each( opt.triggerBtns,function(i,d){
				if( $.isArray( d ) && d.length>1 ) {
					self[method].call(self,d[0],d[1]);		
				} else {
					self[method].call(self,d);		
				}
			} );	
		},
		doSetViewSize : function(){
			var self = this,
				opt = self.configs,
				container = opt.views['container'],
				vbody = opt.views['body'],
				input = self.getInput();
			
			self.callParent(arguments);
				
			if( !self.isAutoWidth() ) {	
				input.width(0);
				var inputRow = $("#"+opt.id+"-inputRow");
				var w = 0;
				$('>td',inputRow).not('.nex-form-inner-body').each( function(){
					w += $(this)._outerWidth();	
				} );
				input._outerWidth( container.width()-w );
			}
			if( !self.isAutoHeight() ) {
				vbody._outerHeight( container.height() );	
			}
		},
		/*
		*设置Lable
		*/
		_setLabel : function(){
			var self = this,
				td = [],
				opt = self.configs;
			var ltd = $('#'+opt.id+'-label-td');
			if( ltd.size() ) {
				ltd.remove();	
			}
			td.push('<td valign="'+opt.labelvAlign+'" align="'+opt.labelAlign+'" id="'+opt.id+'-label-td" class="nex-form-inner-label nex-form-inner-label-'+opt.labelvAlign+'">');	
				td.push('<label id="'+opt.id+'-label" class="nex-form-label '+opt.labelCls+'"></label>');//for="'+opt.id+'-input" 
			td.push('</td>');
			
			var $td = $(td.join(''));
			
			$("#"+opt.id+"-body-td").before($td);
			
			$('#'+opt.id+'-label').css( opt.labelStyle );
			
			return self;	
		},
		setLabel : function(){
			return this._setLabel();	
		},
		/*
		*设置Label位置
		*/
		_setLabelPosition : function( pos ){
			var self = this,
				undef,
				opt = self.configs,
				pos = pos === undef ? 'left' : pos;	
			var _pos = {
				left : true,
				top : true,
				bottom : true,
				right : true	
			};	
			pos = _pos[pos] ? pos : 'left';
			
			opt.labelPosition = pos;
			
			//td-label
			var td = $("#"+opt.id+"-label-td");
			var inputRow = $("#"+opt.id+"-inputRow");
			$('#'+opt.id+'-label-tb').remove();
			var tr = null;
			if( $.inArray( pos,['top','bottom'] ) !== -1 ) {
				tr = $('<tr id="'+opt.id+'-label-tb"></tr>');	
			}
			
			if( pos === 'left' ) {
				$("#"+opt.id+"-body-td").before(td);
			} else if( pos === 'right' ) {
				$(">td:last",inputRow).after(td);
			} else if( pos === 'top' ) {
				if( tr ) {
					inputRow.before(tr);
					tr.append( td );
				}
			} else {
				if( tr ) {
					inputRow.after(tr);	
					tr.append( td );
				}
			}
			
			$('#'+opt.id+'-label').removeClass('nex-form-label-left nex-form-label-right nex-form-label-top nex-form-label-bottom')
								  .addClass('nex-form-label-'+pos);
			
			return self;
		},
		setLabelPosition : function(pos){
			this._setLabelPosition(pos);
			this._setLabelWidth( this.configs.labelWidth );
			this.resetViewSize();
			return this;		
		},
		/*
		*设置Label内容
		*/
		_setLabelText : function( text ){
			var opt = this.configs;
			var label = $('#'+opt.id+'-label');
			label.empty();
			this.renderComponent( text || opt.labelText,label );
			return this;	
		},
		setLabelText : function( text ){
			this._setLabelText(text);
			return this;	
		},
		/*
		*设置Lable宽度
		*/
		_setLabelWidth : function( w ){
			var opt = this.configs;
			//opt.labelPosition
			var label = $('#'+opt.id+'-label');
			if( opt.labelPosition == 'left' || opt.labelPosition == 'right' ) {
				label._outerWidth( w || opt.labelWidth );
			} else {
				label._removeStyle('width');	
			}
			return this;	
		},
		setLabelWidth : function( w ){
			this._setLabelWidth(w);
			this.resetViewSize();
			return this;	
		},
		checkLabelSet : function(){
			var self = this,
				opt = this.configs;	
			var showLabel = opt.showLabel;
			if( showLabel === 'auto' ) {
				showLabel = opt.labelText === '' ? false : true;
			}	
			
			if( !showLabel ) return self;	
			self._setLabel()
				._setLabelPosition( opt.labelPosition )
				._setLabelWidth( opt.labelWidth )
				._setLabelText( opt.labelText );
			return self;		
		},
		_afterCreate : function(){
			var self = this,
				opt = self.configs;
			if( opt.disabled ) {
				self._disabled();
			}
			if( opt.readOnly ) {
				self._readOnly( true );
			}
			if( opt.autoFocus ) {
				self.focus();	
			}
			
			opt._value = opt.value;
			if( opt.value !== '' ) {
				self.lockEvent('onChange');
				//初始值设置
				self.setValue( opt.value );	
				self.unLockEvent('onChange');
				//初始化设置值时会触发onInitChange
				self.fireEvent('onInitChange',[opt.value,'']);
				if( opt.showPlaceholder ) {
					self.hidePlaceholder();
				}
			} else {
				if( opt.showPlaceholder ) {
					self.showPlaceholder();
				}
			}
		},
		//无效
		_appendContent : function(){},
		__placeholderShow : false,
		_triggerPlaceholder : function( value ){
			if( !this.configs.showPlaceholder ) {
				return;	
			}
			if( value === '' ) {
				this.showPlaceholder();	
			} else {
				this.hidePlaceholder();		
			}
		},
		/*
		*获取placeholder
		*/
		getPlaceholder : function(){
			var opt = this.configs;
			var ph = $("#"+opt.id+"-placeholder");
			return ph;	
		},
		getPlaceholderText : function(){
			return this.configs.placeholder;	
		},
		setPlaceholder : function( text ){
			var text = this._undef( text,'' );
			if( text !== '' ) {
				this.configs.placeholder = text;
				this.getPlaceholder().html( text );
			}
			return this;
		},
		showPlaceholder : function(){
			if( !this.__placeholderShow ) {
				this.getPlaceholder().addClass('nex-form-placeholder-show');
			}
			this.__placeholderShow = true;	
			this.el.addClass('nex-form-empty');
			return this;
		},
		hidePlaceholder : function(){
			if( this.__placeholderShow ) {
				this.getPlaceholder().removeClass('nex-form-placeholder-show');
			}
			this.__placeholderShow = false;
			this.el.removeClass('nex-form-empty');
			return this;
		},
		/*
		*获取显示的input
		*/
		__input : null,
		getInput : function(){
			var self = this;
			var opt = self.configs;
			self.__input = self.__input ? self.__input : $("#"+opt.id+"-input");
			return self.__input;
		},
		/*
		*获取实际中的input 一般和input相同
		*/
		__inputreal : null,
		getInputReal : function(){
			var self = this;
			var opt = self.configs;
			self.__inputreal = self.__inputreal ? self.__inputreal : $("#"+opt.id+"-input");
			return self.__inputreal;
		},
		//判断元素是否属于input, textarea, select 和 button 元素
		_isInput : function( el ){
			return $(el).is(':input');	
		},
		/*
		*获取输入框的值
		*/
		getInputValue : function(){
			var self = this;
			var opt = self.configs;
			var input = self.getInputReal();
			
			var value = self._isInput( input ) ? input.val() : input.html();
			
			return value;	
		},
		setInputValue : function( value ){
			var self = this;
			var opt = self.configs;
			var input = self.getInputReal();
			self._isInput( input ) ? input.val( value ) : input.html( value );
			
			self.currentValue = value;
			
			return self;
		},
		/*
		*private
		*/
		getInputWidth : function(){
			return this.getInput()._outerWidth();		
		},
		/*
		*获取输入框的显示值 一般和getInputValue相同
		*/
		getInputText : function(){
			var self = this;
			var opt = self.configs;
			var input = self.getInput();
			
			var value = self._isInput( input ) ? input.val() : input.html();
			
			return $.trim( value );	
		},
		setInputText : function( value ){
			var self = this;
			var opt = self.configs;
			var input = self.getInput();
			self._isInput( input ) ? input.val( value ) : input.html( value );
			return self;
		},
		//过渡用 目前已经没用
		currentValue : '',
		/*
		*获取当前组件值
		*/
		getValue : function(){
			var self = this,undef;
			var opt = self.configs;
			
			var value = $.trim( self.rendererDecode( self.getInputValue() ) );
			
			if( $.isFunction( opt.getFormater ) ) {
				var val = opt.getFormater.call( self,value );
				value = val === undef ? value : val;
			}
			
			var _d = {
				value : value	
			};
			
			self.fireEvent('onGetValue',[ _d ]);
			self.currentValue = _d.value;
			
			return _d.value;
		},
		_oldValue : null,
		setValue : function(){
			var self = this,
				opt = this.configs,
				undef;
			var argvs = [].slice.apply(arguments);
			//记录表单改变之前的值
			var oldValue = self._oldValue === null ? self.getValue() : self._oldValue;
			self._oldValue = oldValue;
			
			self.fireEvent('onSetValue',[argvs]);
			
			if( $.isFunction( opt.setFormater ) ) {
				var val = opt.setFormater.apply( self,argvs );
				if( val !== undef ) {
					if( !$.isArray( val ) ) {
						argvs = [ val ];	
					}
				}
			}
			//formater 一般不建议使用 只对设置时有效
			if( $.isFunction( opt.formater ) ) {
				var val = opt.formater.apply( self,argvs );
				if( val !== undef ) {
					if( !$.isArray( val ) ) {
						argvs = [ val ];	
					}
				}
			}
			
			if( !argvs.length ) {
				return self;	
			}
			
			var v = argvs[0]+'';
			//显示映射
			argvs[0] = self.rendererEncode(argvs[0]);
			
			self.setInputValue.apply(self, argvs );
			
			var newValue = v;
			
			if( oldValue !== newValue && self._oldValue!==null ) {
				self._oldValue = null;
				opt.value = newValue;
				self.fireEvent('onChange',[newValue,oldValue]);	
			}
			
			return self;
		},
		val : function(){
			var self = this,undef;
			var opt = self.configs;
			//设置当前值
			if( arguments.length ) {
				return self.setValue.apply( self,arguments );	
			} else {
				return self.getValue();	
			};
		},
		__isFocus : false,//focus 状态
		_focusValue : null,
		_bindInputEvent : function(){
			var self = this;
			var opt = self.configs;	
			var input = $("#"+opt.id+"-input");
			
			var i19t = opt.inputTextChangeEvent;
			
			var events = {
				'click' : function(e) {
					if( opt.disabled || opt.readOnly ) {
						return;	
					}
					var r = self.fireEvent('onClick',[ this,e ]);	
					if( r === false ) return false;
				},
				'focus' : function(e) {
					if( opt.disabled || opt.readOnly ) {
						return;	
					}
					
					self._focusValue = self.getInputText();//
					
					//var input = $('#'+opt.id+"-input");
					input.addClass('nex-form-field-focus');
					$('#'+opt.id).addClass('nex-form-focus');
					if( !self.__isFocus ) {
						var r = self.fireEvent('onFocus',[ this,e ]);	
						self.__isFocus = true;
						if( r === false ) return false;
					}
					
				},
				'blur' : function(e) {
					self.__isFocus = false;
					if( opt.disabled || opt.readOnly ) {
						return;	
					}
					
					var oldValue = self._focusValue;
					var newValue = self.getInputText();
					
					//var input = $('#'+opt.id+"-input");
					input.removeClass('nex-form-field-focus');
					
					$('#'+opt.id).removeClass('nex-form-focus');
					
					if( oldValue !== newValue ) {
						opt.value = newValue;
						if( i19t ) {
							self.fireEvent(i19t,[ newValue,oldValue ]);
						}
						self.fireEvent('onTextChange',[ newValue,oldValue ]);
					}
					
					var r = self.fireEvent('onBlur',[ this,e ]);	
					if( r === false ) return false;
				},
				'keydown' : function(e) {
					if( opt.disabled || opt.readOnly ) {
						return;	
					}
					self._oldValue = self._oldValue === null ? self.getInputText() : self._oldValue;
					var r = self.fireEvent('onKeyDown',[ this,e ]);	
					if( r === false ) return false;
					
				},
				'keyup' : function(e) {
					if( opt.disabled || opt.readOnly ) {
						return;	
					}
					var oldValue = self._oldValue;
					var newValue = self.getInputText();
					if( oldValue !== newValue && self._oldValue!==null ) {
						opt.value = newValue;
						self._focusValue = newValue;
						if( i19t ) {
							self.fireEvent(i19t,[ newValue,oldValue ]);	
						}
						self.fireEvent('onTextChange',[ newValue,oldValue ]);
						self._oldValue =null;
					}
					var r = self.fireEvent('onKeyUp',[ this,e ]);	
					if( r === false ) return false;
				},
				'keypress' : function(e){
					if( opt.disabled || opt.readOnly ) {
						return;		
					}
					var r = self.fireEvent('onKeyPress',[ this,e ]);	
					if( r === false ) return false;
				},
				'mouseenter' : function(e){
					if( opt.disabled || opt.readOnly ) {
						return;		
					}
					var r = self.fireEvent('onMouseOver',[ this,e ]);	
					if( r === false ) return false;
				},
				'mouseleave' : function(e){
					if( opt.disabled || opt.readOnly ) {
						return;	
					}
					var r = self.fireEvent('onMouseOut',[ this,e ]);	
					if( r === false ) return false;
				},
				'paste' : function(e){
					if( opt.disabled || opt.readOnly ) {
						return;	
					}
					var r = self.fireEvent('onPaste',[ this,e ]);	
					if( r === false ) return false;
				},
				'mousedown' : function(e) {
					if( opt.disabled || opt.readOnly ) {
						return;	
					}
					var r = self.fireEvent('onMouseDown',[ this,e ]);	
					if( r === false ) return false;
				},
				'mouseup' : function(e) {
					if( opt.disabled || opt.readOnly ) {
						return;	
					}
					var r = self.fireEvent('onMouseUp',[ this,e ]);	
					if( r === false ) return false;
				}
			};
			
			input.bind(events);
		},
		_bindEvent : function(){
			var self = this;
			var opt = self.configs;
			
			var dom = self.el;
			var inputRow = $("#"+opt.id+"-inputRow");
			var input = $("#"+opt.id+"-input");
			var bd = $("#"+opt.id+"-body");
			var trigger = $("#"+opt.id+"-trigger-body");
			
			var __t = 0;
			var triggerEvns = {
				'click' : function(e) {
					if( opt.disabled || opt.readOnly ) {
						return;	
					}
					var $this = $(this);
					var tid = parseInt($this.attr('tid'))-1;
					var data = self.__TriBtns[tid];
					var r = self.fireEvent('onTriggerBtnClick',[ data,this,e ]);	
					if( r === false ) return false;
					
					//input.trigger('click',[e]);
				},
				'dblclick' : function(e) {
					if( opt.disabled || opt.readOnly ) {
						return;	
					}
					var $this = $(this);
					var tid = parseInt($this.attr('tid'))-1;
					var data = self.__TriBtns[tid];
					var r = self.fireEvent('onTriggerBtnDblClick',[ data,this,e ]);	
					if( r === false ) return false;
					
					//input.trigger('dblclick',[e]);
				},
				'mouseenter' : function(e){
					if( opt.disabled || opt.readOnly ) {
						return;		
					}
					var $this = $(this);
					var tid = parseInt($this.attr('tid'))-1;
					var data = self.__TriBtns[tid];
					var r = self.fireEvent('onTriggerBtnOver',[ data,this,e ]);	
					if( r === false ) return false;
					
					$this.addClass('nex-form-trigger-btn-over');
					//input.trigger('mouseenter',[e]);
				},
				'mouseleave' : function(e){
					if( opt.disabled || opt.readOnly ) {
						return;	
					}
					var $this = $(this);
					var tid = parseInt($this.attr('tid'))-1;
					var data = self.__TriBtns[tid];
					var r = self.fireEvent('onTriggerBtnOut',[ data,this,e ]);	
					if( r === false ) return false;
					
					$this.removeClass('nex-form-trigger-btn-over');
					//input.trigger('mouseleave',[e]);
				}, 
				'mousedown' : function(e) {
					if( opt.disabled || opt.readOnly ) {
						return;	
					}
					var $this = $(this);
					var tid = parseInt($this.attr('tid'))-1;
					var data = self.__TriBtns[tid];
					var r = self.fireEvent('onTriggerBtnDown',[ data,this,e ]);	
					if( r === false ) return false;
					
					$this.addClass('nex-form-trigger-btn-down');
					__t = setTimeout(function(){
						__t = 0;
						$(document).one('mouseup',function(){
							$this.removeClass('nex-form-trigger-btn-down');	
						});	
					},0);
					
					//input.trigger('mousedown',[e]);
				},
				'mouseup' : function(e) {
					if( opt.disabled || opt.readOnly ) {
						return;	
					}
					var $this = $(this);
					var tid = parseInt($this.attr('tid'))-1;
					var data = self.__TriBtns[tid];
					var r = self.fireEvent('onTriggerBtnUp',[ data,this,e ]);	
					if( r === false ) return false;
					
					$this.removeClass('nex-form-trigger-btn-down');
					if( __t ) {
						clearTimeout( __t );	
						__t = 0;
					}
					//input.trigger('mouseup',[e]);
				}
			};
			var placeholderEvns = {
				'click' : function(e) {
					e.stopPropagation();
					e.preventDefault();
					if( opt.disabled || opt.readOnly ) {
						return;	
					}
					input.trigger('click',[e]);
				},
				'mouseenter' : function(e) {
					if( opt.disabled || opt.readOnly ) {
						return;	
					}
					input.trigger('mouseenter',[e]);
				},
				'mouseleave' : function(e) {
					if( opt.disabled || opt.readOnly ) {
						return;	
					}
					input.trigger('mouseleave',[e]);
				},
				'mousedown' : function(e) {
					if( opt.disabled || opt.readOnly ) {
						return;	
					}
					
					input.trigger('mousedown',[e]);
					
					if( $(this).hasClass('nex-form-placeholder') || $(this).hasClass('nex-form-inner-label') ) {
						input.trigger('focus',[e]);	
						
					} else {
						if( opt.triggerToFocus ) {
							input.trigger('focus',[e]);
						}
					}
					e.stopPropagation();
					e.preventDefault();
				},
				'mouseup' : function(e) {
					e.stopPropagation();
					e.preventDefault();
					if( opt.disabled || opt.readOnly ) {
						return;	
					}
					input.trigger('mouseup',[e]);
				}
			};
			
			self._bindInputEvent();
			
			bd.undelegate('>.nex-form-placeholder')
			  .delegate('>.nex-form-placeholder',placeholderEvns);
					   
			trigger.undelegate('>.nex-form-trigger-btn')
				   .delegate('>.nex-form-trigger-btn',triggerEvns);
				   
			trigger.bind( placeholderEvns );	
			
			dom.undelegate('[id="'+opt.id+'-label-td"]')
			   .delegate('[id="'+opt.id+'-label-td"]',placeholderEvns);
			//nex-form-label nexform-10-label-td   
				   
			inputRow.undelegate('>.nex-form-outer-trigger-td >.nex-form-outer-trigger-body >.nex-form-trigger-btn')
					.delegate('>.nex-form-outer-trigger-td >.nex-form-outer-trigger-body >.nex-form-trigger-btn',triggerEvns);
			
		},
		__TriBtns : [],
		/*
		*添加触发按钮
		*@param 任意文字,对象或者Nex组件
		*@param 触发按钮按下后调用的回调 可选
		*@param private
		*/
		addInnerTriggerBtn : function( d,callback,_tb ){
			var self = this,
				opt = self.configs;
			var trigger = _tb ? $(_tb) : $("#"+opt.id+"-trigger-body");
			var tid = self.__TriBtns.push( d );
			var _d = {
				text : '',
				icon : '',
				cls : '',
				iconCls : '',
				callBack : null,//兼容以前的用法
				callback : null,
				handler : null	
			};
			
			if( $.type( d ) === 'string' || $.type( d ) === 'number' ) {
				var text = d+'';	
				d = $.extend( {},_d,{
					text : text	
				} );
			} else {
				for( var k in _d ) {
					if( k in d ) {
						continue;
					}	
					d[k] = _d[k];
				}
			}
			
			var tpl = ['<div id="'+opt.id+'-inner-trigger-'+tid+'" tid="'+tid+'" class="nex-form-trigger-btn '+( d.icon || d.iconCls ? 'nex-form-trigger-has-icon':'' )+' '+d.cls+'">'];
			if( d.icon || d.iconCls ) {
				var _cs = d.icon ? 'style="background-image:url('+d.icon+')"' : '';
				tpl.push('<span class="nex-form-trigger-icon '+d.iconCls+'" '+_cs+'></span>');	
			}
			
			//tpl.push( d.text );
			
			tpl.push( '</div>' );
			var $tpl = $(tpl.join(''));
			$tpl.prependTo( trigger )
			    .bind('click',function(e){
					if( opt.disabled || opt.readOnly ) {
						return;	
					}
					if( $.isFunction( callback ) ) {
						return callback.call( self,d,e );	
					}	
					if( $.isFunction( d.callBack ) ) {
						return d.callBack.call( self,d,e );	
					}
					if( $.isFunction( d.callback ) ) {
						return d.callback.call( self,d,e );	
					}
					if( $.isFunction( d.handler ) ) {
						return d.handler.call( self,d,e );	
					}	   
			    });
			
			if( !opt.triggerBtnSelection ) {	
				$tpl.disableSelection();
			}
			
			if( Nex.isXtype( d ) || Nex.isClass( d ) ) {
				self.renderComponent( d.text,$tpl );	
			} else if( Nex.isInstance( d ) ) {
				$tpl.append( d.getDom() );	
			} else {
				self.renderComponent( d.text,$tpl );
			}
			return tid;
		},
		removeInnerTriggerBtn : function( tid ){
			var self = this,
				opt = self.configs;
			if( typeof tid === 'undefined' ) {
				return self;	
			}
			tid = parseInt(tid) - 1;
			self.__TriBtns[tid] = null;
			$('#'+opt.id+'-inner-trigger-'+tid).remove();
			
			Nex.gc();
			
			return self;
		},
		/*
		*添加触发按钮
		*@param 任意文字或者Nex组件
		*@param 触发按钮按下后调用的回调 可选
		*/
		addOuterTriggerBtn : function( msg,callback ){
			var self = this,
				opt = self.configs;	
			
			var bid = opt.id+'-outer-trigger-body';
			var $td = $('#'+bid+'-td');
			if( !$td.length ) {
				var td = [];
				td.push('<td valign="'+opt.labelvAlign+'" id="'+bid+'-td" align="'+opt.labelAlign+'" class="nex-form-outer-trigger-td">');	
						td.push('<div id="'+bid+'" class="nex-form-outer-trigger-body"></div>');
				td.push('</td>');	
				var td = $(td.join(""));
				
				var triggerBtnTd = $("#"+opt.id+"-inputRow td:last");
				triggerBtnTd.after(td);
			} else {
				var td = $td;	
			}
			/*var itemBtn = td.find(">div");
			if( $.isFunction(callback) ) {
				itemBtn.bind('click',function(e){
					callback.call( self,itemBtn,e );	
				});
			}
			
			self.renderComponent( msg,itemBtn );*/
			
			var tid = self.addInnerTriggerBtn( msg,callback,$('#'+opt.id+'-outer-trigger-body') );
			
			td.attr(opt.id+'-outer-trigger-td-'+tid);
				
			self.resetViewSize();
			
			return tid;
		},
		removeOuterTriggerBtn : function( tid ){
			var self = this,
				opt = self.configs;	
				
			self.removeInnerTriggerBtn( tid );
			$('#'+opt.id+'-outer-trigger-td-'+tid).remove();
				
			self.resetViewSize();
					
			return self;
		},
		_disabled : function(){
			var self = this,
				opt = self.configs,
				input = self.getInput(),
				field = self.getDom();
			
			opt.disabled = true;
			input.attr('disabled',true);	 
			
			field.addClass('nex-form-disabled');
			if( opt.disabledCls ) {
				field.addClass(opt.disabledCls);	
			}
			
			return self;	
		},
		disabled : function(){
			var self = this;
			var opt = self.configs;
			
			self._disabled();
			
			self.fireEvent("onDisabled",[opt]);	
			return self;
		},
		_enable : function(){
			var self = this,
				opt = self.configs,
				input = self.getInput(),
				field = self.getDom();
				
			opt.disabled = false;	
			
			input.attr('disabled',false);	
			
			field.removeClass('nex-form-disabled');
			if( opt.disabledCls ) {
				field.removeClass(opt.disabledCls);	
			}
			
			return self;	
		},
		enable : function(){
			var self = this,
				opt = self.configs;
			
			self._enable();	
				
			self.fireEvent("onEnable",[opt]);	
			return self;
		},
		_readOnly : function( flag ){
			var self = this,
				undef,
				input = self.getInput(),
				field = self.getDom(),
				opt = self.configs;
			var flag = flag === undef ? true : flag;
			opt.readOnly = flag;
			input.attr('readonly',flag);	
			
			if( flag ) {
				self.fireEvent("onReadOnly",[opt]);	
				field.addClass('nex-form-readonly');
				if( opt.readonlyCls ) {
					field.addClass(opt.readonlyCls);	
				}
			} else {
				self.fireEvent("onUnReadOnly",[opt]);		
				field.removeClass('nex-form-readonly');
				if( opt.readonlyCls ) {
					field.removeClass(opt.readonlyCls);	
				}
			}
			return self;	
		},
		readOnly : function( flag ){
			var self = this,
				undef,
				opt = self.configs;
			
			var flag = flag === undef ? true : flag;
			
			self._readOnly( flag );
			
			if( flag ) {
				self.fireEvent("onReadOnly",[opt]);			
			} else {
				self.fireEvent("onUnReadOnly",[opt]);		
			}
			return self;
		},
		setValidError : function(){
			var self = this;
			var opt = self.configs;
			var el = $("#"+opt.id);
			self.resetVaildCss();
			el.addClass(opt.validErrorCls);
		},
		setValidSuccess : function(){
			var self = this;
			var opt = self.configs;
			var el = $("#"+opt.id);
			self.resetVaildCss();
			el.addClass(opt.validSuccessCls);
		},
		resetVaildCss : function(){
			var self = this;
			var opt = self.configs;
			var el = $("#"+opt.id);
			el.removeClass(opt.validErrorCls);	
			el.removeClass(opt.validSuccessCls);	
		},
		_setFocusCls : function(t,e){
			var self = this;
			var opt = self.configs;
			if( opt.disabled || opt.readOnly ) {
				return;	
			}
			var field = self.el;
			field.addClass('nex-form-focus');
			if( opt.focusCls ) {
				field.addClass(opt.focusCls);	
			}	
		},
		_unsetFocusCls : function(t,e){
			var self = this;
			var opt = self.configs;
			if( opt.disabled || opt.readOnly ) {
				return;	
			}
			var field = self.el;
			field.removeClass('nex-form-focus');
			if( opt.focusCls ) {
				field.removeClass(opt.focusCls);	
			}	
		},
		_setOverCls : function(t,e){
			var self = this;
			var opt = self.configs;
			if( opt.disabled || opt.readOnly ) {
				return;	
			}
			var field = self.el;
			field.addClass('nex-form-over');
			$('>.nex-form-inner',field).addClass('nex-form-inner-over');
			if( opt.overCls ) {
				field.addClass(opt.overCls);	
			}
		},
		_unsetOverCls : function(t,e){
			var self = this;
			var opt = self.configs;
			if( opt.disabled || opt.readOnly ) {
				return;	
			}
			var field = self.el;
			field.removeClass('nex-form-over');
			$('>.nex-form-inner',field).removeClass('nex-form-inner-over');
			if( opt.overCls ) {
				field.removeClass(opt.overCls);	
			}
		},
		_autoValid :　function(){
			var self = this;
			var opt = self.configs;
			if( opt._ct ) {
				clearTimeout( opt._ct )
			}
			opt._ct = setTimeout(function(){
				self.checkVal();
				opt._ct = 0;	
			},opt.autoValidDelay);
		},
		hidden : function(){
			return this.hide();
		},
		"focus" : function(){
			var self = this;
			try{
				self.getInput().focus();
			}catch(e){};
		},
		"select" : function(){
			var self = this;
			try{
				self.getInput().select();
			}catch(e){};
		},
		selectText : function(start, end){
			var self = this,
				opt = self.configs,
				v = self.val(),
				undef,
				el = self.getInput().get(0),
				range;
	
			if (v.length > 0) {
				start = start === undef ? 0 : start;
				end = end === undef ? v.length : end;
				if (el.setSelectionRange) {
					el.setSelectionRange(start, end);
				}
				else if(el.createTextRange) {
					range = el.createTextRange();
					range.moveStart('character', start);
					range.moveEnd('character', end - v.length);
					range.select();
				}
				
			}
			self.focus();
		},
		"blur" : function(){
			var self = this;
			try{
				self.getInput().blur();
			} catch(e){}
		},
		checkVal : function(){
			var self = this;
			var opt = self.configs;
			var r = true;
			var rules = $.isArray(opt.rules) ? opt.rules : [ opt.rules ];
			//var validator = opt.validator;
			//Validate
			var validator = Nex.getUtil('Validate');
			var rule;
			var value = self.val();
			//var value = $.nexForm.getVal( opt.name,opt.group );
			var checkList = [];//验证函数
		
			for( var x=0;x<rules.length;x++ ) {
				rule = rules[x];
				if( $.isFunction(rule) ) {
					checkList.push( { method : rule, rule : null, params : null } );
				} else if( $.isPlainObject(rule) ){
					for(var i in rule ) {
						if( $.isFunction(rule[i]) ) {
							checkList.push( { method : rule[i] , rule : i, params : null } );
						} else if( (i in validator) && $.isFunction( validator[i] ) ){
							checkList.push( { method : validator[i], rule : i, params : rule[i] } );
						}
					}
				} else if( typeof rule === 'string' 
							&& ( rule in validator ) 
							&& $.isFunction( validator[rule] ) 
				) {
					checkList.push( { method : validator[rule], rule : rule, params : null } );
				}
			}
			
			var error_r = null;
			for( var t=0,len=checkList.length;t<len;t++ ) {
				var d = checkList[t];
				var args = [ value ];
				if( d.params !== null ) {
					args.push( d.params );	
				}
				r = d.method.apply( validator, args );
				if( r === false ) {
					error_r = d.rule === null ? null : d.rule;
					break;	
				}	
			}
			
			if( r === false ) {
				
				var errorMsg = opt.messages[error_r] || opt.validErrorMsg;
				
				self.fireEvent("onValidError",[errorMsg,error_r]);	
			} else {
				self.fireEvent("onValidSuccess",[opt.validSuccessMsg]);		
			}
			
			return r;
		},
		isValid : function(){
			return this.checkVal();	
		},
		valid : function(){
			return this.checkVal();		
		},
		"reset" : function(){
			var self = this;
			var opt = self.configs;
			opt.value = opt._value;
			
			//初始值设置
			self.setValue( opt.value );	
			
			self.blur();
			clearTimeout( opt._ct );//取消验证
			self.resetVaildCss();	
		},
		//获取数据 ,一般作为内部使用
		
		//一般作为外部使用 又val 区别在于可做最终数据处理
		refreshFormater : function(){
			var self = this,undef;
			var opt = self.C();	
			if( $.isFunction( opt.formater ) ) {
				var value = self.val();
				var _value = opt.formater.call( self,value );
				value = _value === undef ? value : _value;
				self.val( value );
			}	
		},
		/*
		*映射 只有使用api val() 才有效
		*/
		refreshRenderer : function( input,e ){
			var self = this;
			var opt = self.C();	
			if( $.isPlainObject( opt.renderer ) && $.isEmptyObject( opt.renderer ) ) {
				return ;	
			}
			var value = self.val();
			self.val( value );
		},
		/*
		* 映射
		*/
		rendererEncode : function(str){
			var self = this,
				opt = this.configs,
				undef;
			var renderer = opt.renderer;
			var value = '';
			
			if( $.isPlainObject( renderer ) && $.isEmptyObject( renderer ) ) {
				return str;	
			}
			
			if( $.isFunction( renderer ) ) {
				value = self.tpl( renderer , str );	
				if( value === undef ) {
					value = str;	
				}
			} else if( $._isPlainObject( renderer ) ) {
				if( str in renderer ) {
					value = self.tpl( renderer[str] , str );		
				} else if( opt.rendererDef in renderer ) {
					value = self.tpl( renderer[opt.rendererDef] , str );			
				} else {
					value = str;	
				}
			} else {
				value = str;	
			}
			opt._renderer[ value ] = str;
			return value;
		},
		/*
		*反映射
		*/
		rendererDecode : function(str){
			var self = this;
			var opt = self.C();	
			
			if( $.isPlainObject( opt.renderer ) && $.isEmptyObject( opt.renderer ) ) {
				return str;	
			}
			
			var value = '';
			if( str in opt._renderer ) {
				value = opt._renderer[str];	
			}else {
				value = str;	
			}
			return value;
		},
		validTipEl : null,
		/*验证提示信息*/
		_showValidTip : function( position ){
			var self = this;
			var opt = this.configs;
			var bd = this.getBody();
			var position = this._undef( position,opt.position );
			if( !self.validTipEl ) {
				self.validTipEl = $('<div id="'+opt.id+'_tooltip" class=""nex-form-tooltip></div>');		
			}	
			switch( position ) {
				case 'right' :
					break
				case 'left' :
					break;
				case 'top' : 
					break;
				case 'bottom' :
					break;	
			}
		},
		/*
		*下拉框处理流程，由于实现单选 多选 autocomplete下拉框
		*/
		getDropDownItems : function(){
			var opt = this.configs;
			return opt.items || [];	
		},
		getDropDownItemDefault : function(){
			var opt = this.configs;
			return $.extend( {},opt.itemDefault,opt.dropdownItemDefault );	
		},
		/*
		*设置表单的Items
		*/
		setItems : function( items ){
			return this.setDropDownItems.apply( this,arguments );
		},
		setDropDownItems : function( items ){
			var self = this;
			var opt = this.configs;
			if( items ) {//dropdownItems
				opt.items = $.isArray(items) ? [].concat(items) : items;
			}
			if( opt.dropdownMode == 1  && $.isArray(opt.items) ) {
				$.each( opt.items,function( i,d ){
					opt.items[i] = self._parseItemData( d );	
				} );
			}
			//判断dropdown是否已经创建 如果创建则刷新内容
			var dropdown = this.getDropDown();
			if( dropdown.length && items ) {
				this.resetDropDownList( opt.items );
			}
			return opt.items;	
		},
		/*
		*获取items数据
		*@param {String,Array}单个字符是返回当前对象，如果是数组或者以','分割的字符串时返回的是数组
		*@param {Boolean} true 默认 返回数据  false返回索引
		*return {Array,Object}
		*/
		getItemData : function(value,m){
			return this.getDropDownItemData( value,m );	
		},
		getItemIndex : function(value){
			return this.getDropDownItemData( value,false );
		},
		getItemDataById : function( id ){
			return this.getDropDownItemDataById(id);	
		},
		getDropDownShowAt : function(){
			return this.getInput();	
		},
		getDropDownSelectedValue : function(){
			return this.val();	
		},
		_setDropDownValue : function( value,text,data ){
			var self = this,
				undef,
				opt = self.configs;
				
			data.selected = true;
			
			var d = $.extend({},data);	
			
			//self.fireEvent('onSetDropDownValue',[ d,opt ]);	
			
			self.val( value,text,d );
			
			return self;
		}
	});
}));
;$define([
	'Nex.form.AbstractForm'
],function(){
	//"use strict";
	var display = Nex.define('Nex.form.Display','Nex.form.AbstractForm',{
		alias : 'Nex.DisplayField',
		xtype : 'displayfield'
	});	
	//参数重载
	display.setOptions( function(opt){
		return {
			__inputType  : 'display',
			containerCls : [opt.containerCls,'nex-form-display'].join(' '),
			cleanBtn	 : false
		};	
	} );
});
;$define([
	'Nex.form.AbstractForm'
],function(){
	//"use strict";
	var textfield = Nex.define('Nex.form.Text','Nex.form.AbstractForm',{
		alias : 'Nex.TextField',
		xtype : 'textfield'
	});	
	//参数重载
	textfield.setOptions( function(opt){
		var tpl = opt.tpl;
		tpl.inputTpl = '<input <%=attrs%> id="<%=id%>-input" type="<%=type%>" name="<%=name%>" autocomplete="<%=autocomplete%>" tabindex=<%=tabIndex%> value="" class="nex-form-field nex-form-field-<%=type%>" />';
		return {
			__inputType  : 'text',
			containerCls : [opt.containerCls,'nex-form-text'].join(' '),
			cleanBtn 	 : true,
			tpl			 : tpl
		};	
	} );
});
;$import([
	'Nex.form.Text'
],function(){
	//"use strict";
	var trigger = Nex.define('Nex.form.Trigger','Nex.form.Text',{
		alias : 'Nex.TriggerField',
		xtype : 'triggerfield',
		configs : function(opt){
			return {
				__inputType  : 'text',
				containerCls : [opt.containerCls,'nex-form-trigger'].join(' '),
				_inputCls    : [],
				cleanBtn 	 : false,
				triggerToFocus : false,
				triggerCls	 : '',
				triggerIconCls	 : ''
			};	
		},
		sysEvents : function(){
			var self = this,
				opt = self.configs;	
			self.bind('onSetFormView._sys',self._setInputCls,self);	
			self.callParent(arguments);
			//Nex.form.Form.fn._sysEvents.apply( self,arguments );
			return self;	
		},
		/*重载设置系统的trigger btn*/
		_setSysTriggerBtns : function(){
			var self = this,
				opt = self.configs;
			self._setTriggerBtn();
			//Nex.form.Form.fn._setSysTriggerBtns.apply( self,arguments );
			self.callParent(arguments);
			//cleanBtn	
			return self;
		},
		_setTriggerBtn : function(){
			var self = this,
				opt = self.configs;
			//var input = self.getInput();	
			self.addInnerTriggerBtn({
				name : 'trigger',
				cls : ['nex-form-triggerfield-trigger',opt.triggerCls].join(' '),
				iconCls : ['nex-form-triggerfield-icon',opt.triggerIconCls].join(' '),
				callBack : function( d,e ){
					var r = self.fireEvent('onTriggerClick',[ opt ]);
					if( r === false ) return;
				}	
			});	
		},
		_setInputCls : function(){
			var self = this,
				opt = self.configs;
			var ccls = $.isArray(opt._inputCls) ? opt._inputCls : [ opt._inputCls ];
			var cls = ['nex-form-field-trigger'].concat( ccls );	
			$('#'+opt.id+'-input').addClass( cls.join(' ') );
		}
	});	
});
;$define([
	'Nex.form.Trigger'
],function(){
	//"use strict";
	var selectfield = Nex.define('Nex.form.Select','Nex.form.Trigger',{
		alias : 'Nex.SelectField',
		xtype : 'selectfield',
		configs : function(opt){
			var tpl = opt.tpl;
			tpl.inputTpl = '<div <%=attrs%> id="<%=id%>-input" type="<%=type%>" tabindex=<%=tabIndex%> autocomplete="<%=autocomplete%>" value="" class="nex-form-field nex-form-field-<%=type%>"></div>'
							+'<input id="<%=id%>-input-real" type="hidden" value="" name="<%=name%>" />';
			return {
				__inputType  : 'select',
				containerCls : [opt.containerCls,'nex-form-select'].join(' '),
				cleanBtn 	 : false,
				triggerToFocus : true,
				tpl			 : tpl,
				dropdownSingleSelect : true  //单选下拉框
			};	
		},
		sysEvents : function(){
			var self = this,
				opt = self.configs;	
			self.callParent(arguments);
			self.bind( 'onClick._sys',self._showDropDownClick,self );
			self.bind( 'onCreateDropDwon._sys',self._setDropDownCls,self );
			return self;	
		},
		/*重载设置系统的trigger btn*/
		/*_setSysTriggerBtns : function(){
			var self = this,
				opt = self.configs;
			var input = self.getInput();	
			self.addInnerTriggerBtn({
				cls : 'nex-form-select-trigger',
				iconCls : 'nex-form-select-icon',
				callBack : function( d,e ){
					if( !opt.triggerToFocus ) {
						input.trigger('focus',[e]);//self.focus();
					}
				}	
			});
			Nex.form.Form.fn._setSysTriggerBtns.apply( self,arguments );
			//cleanBtn	
			return self;
		},*/
		_setTriggerBtn : function(){
			var self = this,
				opt = self.configs;
			var input = self.getInput();	
			self.addInnerTriggerBtn({
				name : 'trigger',
				cls : ['nex-form-triggerfield-trigger','nex-form-select-trigger',opt.triggerCls].join(' '),
				iconCls : ['nex-form-triggerfield-icon','nex-form-select-icon',opt.triggerIconCls].join(' '),
				callBack : function( d,e ){
					var r = self.fireEvent('onTriggerClick',[ opt ]);
					if( r === false ) return;
					if( !opt.triggerToFocus ) {//必须要foucs
						input.trigger('focus',[e]);//self.focus();
					}
				}	
			});	
		},
		_showDropDownClick : function(){
			var self = this,
				opt = self.configs;
			self.toggleDropDown();	
		},
		_setDropDownCls : function( dropdown ){
			var self = this,
				opt = self.configs;
			var el = self.el;
			if( el.hasClass('nex-form-focus') ) {	
				dropdown.addClass('nex-form-select-dropdown-focus');
			} else {
				dropdown.removeClass('nex-form-select-dropdown-focus');		
			}
		},
		_getItemData2 : function( value ){
			var self = this;
			var opt = self.configs;
			var items = opt.items;
			var d = null;
			$.each( items.concat(self.__CItems) , function(i,v){
				if( !$.isPlainObject( v ) ) return;
				var vs = v[opt.valueKey];
				if( String(vs) === String(value) ) {
					d = v;
					return false;
				}
			} );		
			return d;
		},
		/*
		*获取实际中的input 一般和input相同
		*/
		__inputreal : null,
		getInputReal : function(){
			var self = this;
			var opt = self.configs;
			self.__inputreal = self.__inputreal ? self.__inputreal : $("#"+opt.id+"-input-real");
			return self.__inputreal;
		},
		/*
		*设置下拉框的值
		*param value
		*param text 可选 如果没设置会从items里查找
		*/
		setInputValue : function( value,text ){
			var self = this;
			var opt = self.configs;
			var text = self._undef( text, null );
			var sep = opt.multiSplit;
			
			//Nex.form.Form.fn.setInputValue.apply( self,arguments );
			self.callParent(arguments);
			
			if( text === null ) {	
				var txt = [];
				value = (value+'').split(sep);
				$.each( value,function(i,v){
					var d = self._getItemData2( v );
					txt.push(d ? d[ opt.textKey ] : value);	
				} );
				text = txt.join(sep);
			}
			
			self.setInputText( text );
			
			return self;
		},
		/*
		*设置表单的Items
		*如果初始化后 需要重新设置items 最好使用setItems(list) 而不要直接使用obj.C('items',list);
		*m 默认true 会根据items自动刷新text显示框的文本
		*/
		setDropDownItems : function( items,m ){
			var self = this;
			var opt = this.configs;
			
			//Nex.form.Form.fn.setDropDownItems.apply( self,arguments );
			self.callParent(arguments);
			
			if( opt.dropdownMode == 2 ) {
				return opt.items;
			}
			
			var sep = opt.multiSplit;
			var value = this.getInputValue();	
			value = value.split(sep);
			var text = [];
			
			if( $.isArray( opt.items ) ) {
				$.each( value,function(i,v){
					var txt = v;
					$.each( opt.items,function( i,d ){
						var _v = d[opt.valueKey];
						if( String(_v) === String(v) ) {
							txt = d[opt.textKey];
							return false;
						}
					} );
					text.push( txt );	
				} );
			}
			var m = this._undef( m,true );
			if( m ) {
				this.setInputText( text.join( sep ) );	
			}
			
			return opt.items;	
		}
	});	
});
;$define([
	'Nex.form.AbstractForm'
],function(){
	//"use strict";
	var textarea = Nex.define('Nex.form.Textarea','Nex.form.AbstractForm',{
		alias : 'Nex.TextareaField',
		xtype : 'textareafield',
		sysEvents : function(){
			var self = this;
			var opt = self.configs;
			self.callParent(arguments);
			self.bind("onSetViewSize._sys",self._setTextareaHeight,self);	
		},
		_setTextareaHeight : function(){
			var self = this;
			var opt = self.configs;
			var container = opt.views['container'];
			var input = self.getInput();
			input._outerHeight( container.height() );
			return self;
		}
	});	
	//参数重载
	textarea.setOptions( function(opt){
		var tpl = opt.tpl;
		tpl.inputTpl = '<textarea <%=attrs%> id="<%=id%>-input" type="<%=type%>" name="<%=name%>" autocomplete="<%=autocomplete%>" tabindex=<%=tabIndex%> class="nex-form-field nex-form-field-<%=type%>"></textarea>';
		return {
			__inputType  : 'textarea',//当前组件中该参数没有作用
			containerCls : [opt.containerCls,'nex-form-textarea'].join(' '),
			cleanBtn 	 : true,
			height 		 : 60,
			labelvAlign  : 'top',
			tpl			 : tpl
		};	
	} );
});
;$define([
	'Nex.form.Text'
],function(){
	//"use strict";
	var hidden = Nex.define('Nex.form.Hidden','Nex.form.Text',{
		alias : 'Nex.HiddenField',
		xtype : 'hiddenfield'
	});	
	//参数重载
	hidden.setOptions( function(opt){
		return {
			__inputType  : 'hidden',
			containerCls : [opt.containerCls,'nex-form-hidden'].join(' '),
			width 		 : 'auto',
			height 		 : 'auto',
			showLabel	 : false,
			cleanBtn	 : false
		};	
	} );
});
;$define([
	'Nex.form.Text'
],function(){
	//"use strict";
	var password = Nex.define('Nex.form.Password','Nex.form.Text',{
		alias : 'Nex.PasswordField',
		xtype : 'passwordfield'
	});	
	//参数重载
	password.setOptions( function(opt){
		return {
			__inputType  : 'password',//设置input的type值
			containerCls : [opt.containerCls,'nex-form-password'].join(' '),
			cleanBtn 	 : true
		};	
	} );
});
/*
*需要修改 应该继承Trigger
*/
;$import([
	'Nex.form.Text'
],function(){
	"use strict";
	var combobox = Nex.define('Nex.form.ComboBox','Nex.form.Text',{
		alias : 'Nex.ComboBox Nex.ComboBoxField',
		xtype : 'combobox comboboxfield',
		configs : function(opt){
			return {
				__inputType  : 'text',
				containerCls : [opt.containerCls,'nex-form-combobox'].join(' '),
				_inputCls    : [],
				//cleanBtn 	 : true,
				triggerToFocus : true,
				triggerCls	 : '',
				triggerIconCls	 : ''
			};	
		},
		sysEvents : function(){
			var self = this,
				opt = self.configs;	
			self.bind('onSetFormView._sys',self._setInputCls,self);	
			//Nex.form.Form.fn._sysEvents.apply( self,arguments );
			self.callParent(arguments);
			return self;	
		},
		/*重载设置系统的trigger btn*/
		_setSysTriggerBtns : function(){
			var self = this,
				opt = self.configs;
			var input = self.getInput();	
			self.addInnerTriggerBtn({
				cls : ['nex-form-combobox-trigger',opt.triggerCls].join(' '),
				iconCls : ['nex-form-combobox-icon',opt.triggerIconCls].join(' '),
				callBack : function( d,e ){
					if( !opt.triggerToFocus ) {
						input.trigger('focus',[e]);
					}
				}	
			});
			//Nex.form.Form.fn._setSysTriggerBtns.apply( self,arguments );
			self.callParent(arguments);
			//cleanBtn	
			return self;
		},
		_setInputCls : function(){
			var self = this,
				opt = self.configs;
			var ccls = $.isArray(opt._inputCls) ? opt._inputCls : [ opt._inputCls ];
			var cls = ['nex-form-field-combobox'].concat( ccls );	
			$('#'+opt.id+'-input').addClass( cls.join(' ') );
		}
	});	
});
;$define([
	'Nex.form.Display'
],function(){
	//"use strict";
	var textfield = Nex.define('Nex.form.Radio','Nex.form.Display',{
		alias : 'Nex.RadioField',
		xtype : 'radiofield',
		configs : function(opt){
			var tpl = opt.tpl;
			return {
				__inputType  		: 'radio',
				containerCls 		: [opt.containerCls,'nex-form-radio'].join(' '),
				showPlaceholder 	: false,
				triggerBtnsPosition : 'outer',
				radioLabelSelection : false,
				labelvAlign 		: 'top',
				width 				: 'auto',
				/*
				item = {
					cls : '',
					text : '',
					value : '',
					readOnly : false,
					disabled : false,
					display : 'inline',
					width : auto
				}
				或
				item = '-'
				*/
				itemDefault			: {},
				items 				: []
			};	
		},
		initFormField : function(){
			var self = this;
			var opt = this.configs;	
			
			self.initBoxItems();
			
			self.callParent(arguments);	
			
			/*if( !opt.radioLabelSelection ) {	
				var input = self.getInput();
				input.disableSelection();
			}*/
		},
		initBoxItems : function(){
			var self = this;
			var opt = this.configs;	
			
			self._setRadios( opt.items );
			
			self._setRadioEvents();	
			
			if( !opt.radioLabelSelection ) {	
				var input = self.getInput();
				input.disableSelection();
			}
			
		},
		_bindEvent : function(){
			var self = this;
			var opt = this.configs;	
			
			//调用父级函数
			//Nex.form.Display.fn._bindEvent.apply( self,arguments );
			self.callParent(arguments);		
			//if( !Nex.isIE ) return self;
			var input = $("#"+opt.id+"-input");
			var _t = 0;
			input.unbind('focus blur')
				 .bind({
					'focus2' : function(e) {
						if( opt.disabled || opt.readOnly ) {
							return;	
						}
						
						if( input.hasClass('nex-form-field-focus') ) {
							return;	
						}
						
						self._focusValue = $(this).val();
						
					//	var input = $('#'+opt.id+"-input");
						
						input.addClass('nex-form-field-focus');
						$('#'+opt.id).addClass('nex-form-focus');
						
						var r = self.fireEvent('onFocus',[ this,e ]);	
						if( r === false ) return false;
					},
					'blur2' : function(e) {
						if( opt.disabled || opt.readOnly ) {
							return;	
						}
						var oldValue = self._focusValue;
						var newValue = $(this).val();
						//var input = $('#'+opt.id+"-input");
						input.removeClass('nex-form-field-focus');
						
						$('#'+opt.id).removeClass('nex-form-focus');
						
						if( oldValue !== newValue ) {
							opt.value = newValue;
							self.fireEvent('onChange',[ newValue,oldValue ]);		
						}
						
						var r = self.fireEvent('onBlur',[ this,e ]);	
						if( r === false ) return false;	
					}
				});
		},
		/*private*/
		_setRadios : function( items ){
			var self = this;
			var opt = this.configs;	
			var input = self.getInput();
			var html = [];
			var valueKey = opt.valueKey,
				textKey = opt.textKey;
			var items = self._undef( items,opt.items );
			if( !$.isArray( items ) ) {
				return self;
			}
			var len = items.length;
			for( var i=0;i<len;i++ ) {
				var _d = self._parseItemData( items[i] );
				items[i] = _d;
				var d = $.extend( {
					//id 		 : items[i]['__id'],
					cls 	 : '',
					readOnly : false,
					disabled : false,
					display  : 'inline',
					width 	 : 'auto'
				}, opt.itemDefault ,_d );
				d.id = items[i]['__id'];
				if( !self.isSplitLine( d ) ) {
					html.push('<span id="'+d.id+'" tabindex="'+(++Nex.tabIndex)+'" class="nex-form-radio-item nex-form-radio-item-d-'+d.display+' '+ (d.readOnly?'nex-form-radio-item-readonly':'') +' '+ (d.disabled?'nex-form-radio-item-disabled':'') +' '+d.cls+'" value="'+encodeURIComponent(d[valueKey])+'" style="'+( isNaN(parseInt( d.width )) ? '' : 'width:'+parseInt( d.width )+'px' )+'"><span id="'+opt.id+'-radio-icon" class="nex-form-radio-icon"></span><span class="nex-form-radio-text">'+d[textKey]+'</span></span>');				 
				} else {
					html.push( self.tpl(opt.dropdownItemSplitLineTpl,d) );
				}
			}
			
			input.html( html.join('') );
			
			return self;
		},
		resetRadios : function( items ){
			var self = this;
			var opt = this.configs;	
			var value = self.getValue();	
			if( !$.isArray( items ) ) {
				return self;	
			}
			opt.items = items;
			self._setRadios( items );
			
			self.checked( value, false );
			
			return self;
		},
		setItems : function( items ){
			return this.resetRadios.apply( this,arguments );
		},
		/*private*/
		_setRadioEvents : function(){
			var self = this;
			var opt = this.configs;	
			var input = self.getInput();
			
			var fn = function( evt1,evt2,e,func ){
				if( opt.disabled || opt.readOnly ) {
					return;	
				}
				var $this = $(this);
				var id = $this.attr('id');
				var d = self.getItemDataById( id );
				if( d.disabled || d.readOnly ) {
					return;
				}	
				var r;
				if( $.isFunction( d[evt2] ) ) {
					r = d[evt2].call( self,d );	
					if( r === false ) return false;	
				}	
				
				r = self.fireEvent(evt1,[ d[ opt.valueKey ],d,this,e ]);	
				if( r === false ) return false;	
				
				if( $.isFunction( func ) ) {
					func.call( this,d );	
				}
				
			};
			var __t = 0;
			var __t2 = 0;
			input.undelegate('>.nex-form-radio-item')
				 .delegate('>.nex-form-radio-item',{
					"click" : function(e){
						if( opt.disabled || opt.readOnly ) {
							return;	
						}
						
						var $this = $(this);
						var id = $this.attr('id');
						var d = self.getItemDataById( id );
						var r;
						if( d.disabled || d.readOnly ) {
							return;
						}	
						if( $.isFunction( d.callBack ) ) {
							r = d.callBack.call( self,d,e );	
						}
						if( $.isFunction( d.callback ) && r !== false ) {
							r = d.callback.call( self,d,e );	
						}
						if( $.isFunction( d.handler ) && r !== false ) {
							r = d.handler.call( self,d,e );	
						}
						if( r !== false ) {
							r = fn.call( this,'onRaidoClick','click',e );
						}
						
						if( r === false ) return false;
						if( !$this.hasClass('nex-form-radio-item-checked') ) {
							self.setValue( d[ opt.valueKey ] );
							//$this.addClass('nex-form-radio-item-checked');
						}
						
					},
					"dblclick" : function(e){
						return fn.call( this,'onRaidoDblClick','dblclick',e );
					},
					"mouseenter" : function(e){
						var r = fn.call( this,'onRaidoOver','mouseover',e,function( d ){
							if( d.disabled || d.readOnly ) {
								return;
							}	
							$(this).addClass('nex-form-radio-item-over');
						} );
						if( r === false ) return false;
					},
					"mouseleave" : function(e){
						var r = fn.call( this,'onRaidoOut','mouseout',e,function( d ){
							if( d.disabled || d.readOnly ) {
								return;
							}	
							$(this).removeClass('nex-form-radio-item-over');
						} );	
						if( r === false ) return false;
					},
					"mousedown" : function(e){
						if( opt.disabled || opt.readOnly ) {
							return;	
						}
						//input.trigger('focus',[e]);
						
						var r = fn.call( this,'onRaidoMouseDown','mousedown',e,function( d ){
							if( d.disabled || d.readOnly ) {
								return;
							}	
							$(this).addClass('nex-form-radio-item-down');
							var $this = $(this);
							__t = setTimeout( function(){
								__t = 0;
								$(document).one('mouseup',function(){
									$this.removeClass('nex-form-radio-item-down');							 
								});					 
							},0 );
						} );	
						if( r === false ) return false;
					},
					"mouseup" : function(e){
						var r = fn.call( this,'onRaidoMouseUp','mouseup',e,function( d ){
							if( d.disabled || d.readOnly ) {
								return;
							}	
							$(this).removeClass('nex-form-radio-item-down');
							if( __t ) {
								clearTimeout( __t );	
								__t = 0;
							}
						} );	
						if( r === false ) return false;
					},
					"focus" : function(e){
						input.trigger('focus2',[e]);
						if( __t2 ) {
							clearTimeout( __t2 );
							__t2 = 0;
						}	
					},
					"blur"  : function(e){
						__t2 = setTimeout(function(){
							__t2 = 0;
							input.trigger('blur2',[e]);		
						},0);	
					}
				 });
		},
		getCheckedLength : function(){
			var self = this;
			var opt = this.configs;	
			var input = self.getInput();	
			return $('>.nex-form-radio-item-checked',input).length;		
		},
		_unchecked : function(){
			var self = this;
			var opt = this.configs;	
			var input = self.getInput();	
			$('>.nex-form-radio-item',input).removeClass('nex-form-radio-item-checked');
			return self;
		},
		_uncheckedAll : function(){
			var self = this;
			var opt = this.configs;	
			//var input = self.getInput();
			var radios = Nex.FormManager.get( opt.name, opt.group );
			$.each( radios,function(i,radio){
				radio._unchecked && radio._unchecked();
				if( radio.configs.id === opt.id ) {
					return;	
				}
				var v = radio.getValue();
				if( radio.getCheckedLength && radio.getCheckedLength() ) {
					radio.fireEvent( 'onChange',[ '',v ] );	
				}
			} );
			//$('>.nex-form-radio-item',input).removeClass('nex-form-radio-item-checked');
			return self;
		},
		unchecked : function(){
			this.setValue('');
			return this;
		},
		//设置选中
		checked : function( value,m ){
			var self = this;
			var opt = this.configs;	
			var input = self.getInput();
			var m = self._undef( m,true );
			var d = self.getItemData( value );
			d = $.isArray( d ) ? d[0] : d;
			if( d ) {
				if( m ) {
					self._uncheckedAll();
				}
				$('#'+d.__id).addClass('nex-form-radio-item-checked');
			}
		},
		/*
		*对单个radio设置disabled
		*@param value
		*param m private 默认true 设置disabled , false unsetDisabled
		*param css private 默认disabled , readonly
		*/
		setRadioDisabled : function( value,m,css ){
			var self = this;
			var opt = this.configs;	
			var m = self._undef( m,true );
			var css = self._undef( css,'disabled' );
			var d = self.getItemData( value );
			d = $.isArray( d ) ? d[0] : d;
			if( d ) {
				if( m ) {
					$('#'+d.__id).addClass('nex-form-radio-item-'+css);
					if( css === 'disabled' ) {
						d.disabled = true;	
					} else if( css === 'readonly' ) {
						d.readOnly = true;		
					} else {
						d[css] = true;	
					}
				} else {
					$('#'+d.__id).removeClass('nex-form-radio-item-'+css);
					if( css === 'disabled' ) {
						d.disabled = false;	
					} else if( css === 'readonly' ) {
						d.readOnly = false;		
					} else {
						d[css] = false;	
					}
				}
			}
			return self;		
		},
		unsetRadioDisabled : function( value ){
			return this.setRadioDisabled.apply( this,[ value,false ] );		
		},
		setRadioReadOnly : function(){
			return this.setRadioDisabled.apply( this,[ value,true,'readonly' ] );			
		},
		unsetRadioReadOnly : function(){
			return this.setRadioDisabled.apply( this,[ value,false,'readonly' ] );			
		},
		//重载
		getInputValue : function(){
			var self = this,undef;
			var opt = this.configs;	
			var input = self.getInput();
			var checked = $('>.nex-form-radio-item-checked',input);
			var value = '';
			if( checked.length  ) {
				value = decodeURIComponent( checked.attr('value') ) || '';
			}
			return value;
		},
		setInputValue : function( value ){
			var self = this;
			var opt = this.configs;
			
			self.checked( value );
			
			return self;
		},
		getInputText : function(){
			var self = this;
			var opt = this.configs;
			var value = self.getInputValue();
			var d = self.getItemData( value );
			d = $.isArray( d ) ? d[0] : d;
			if( d ) {
				return d[opt.textKey];	
			}
			return '';
		},
		setInputText : function( text ){
			var self = this;
			var opt = this.configs;
			var value = '';
			$.each( opt.items,function( i,d ){
				if( d[ opt.textKey ] === text ) {
					value = d[ opt.valueKey ];	
					return false;
				}	
			} );	
			self.setValue( value );
			return self;
		}
	});	
});
;$define([
	'Nex.form.Radio'
],function(){
	//"use strict";
	var Checkbox = Nex.define('Nex.form.Checkbox','Nex.form.Radio',{
		alias : 'Nex.CheckboxField',
		xtype : 'checkboxfield',
		configs : function(opt){
			return {
				__inputType  : 'checkbox',
				containerCls : [opt.containerCls,'nex-form-checkbox'].join(' '),
				checkboxLabelSelection : false
			};	
		},
		initBoxItems : function(){
			var self = this;
			var opt = this.configs;	
			
			self._setCheckboxs( opt.items );
			
			self._setCheckboxEvents();	
			
			if( !opt.radioLabelSelection ) {	
				var input = self.getInput();
				input.disableSelection();
			}
			
		},
		/*private*/
		_setCheckboxs : function( items ){
			var self = this;
			var opt = this.configs;	
			var input = self.getInput();
			var html = [];
			var valueKey = opt.valueKey,
				textKey = opt.textKey;
			var items = self._undef( items,opt.items );
			if( !$.isArray( items ) ) {
				return self;
			}
			var len = items.length;
			for( var i=0;i<len;i++ ) {
				var _d = self._parseItemData( items[i] );
				items[i] = _d;
				var d = $.extend( {
					//id 		 : items[i]['__id'],
					cls 	 : '',
					readOnly : false,
					disabled : false,
					display  : 'inline',
					width 	 : 'auto'
				}, opt.itemDefault ,_d );
				d.id = items[i]['__id'];
				if( !self.isSplitLine( d ) ) {
					html.push('<span id="'+d.id+'" tabindex="'+(++Nex.tabIndex)+'" class="nex-form-checkbox-item nex-form-checkbox-item-d-'+d.display+' '+ (d.readOnly?'nex-form-checkbox-item-readonly':'') +' '+ (d.disabled?'nex-form-checkbox-item-disabled':'') +' '+d.cls+'" value="'+encodeURIComponent(d[valueKey])+'" style="'+( isNaN(parseInt( d.width )) ? '' : 'width:'+parseInt( d.width )+'px' )+'"><span id="'+opt.id+'-checkbox-icon" class="nex-form-checkbox-icon"></span><span class="nex-form-checkbox-text">'+d[textKey]+'</span></span>');				 
				} else {
					html.push( self.tpl(opt.dropdownItemSplitLineTpl,d) );
				}
			}
			
			input.html( html.join('') );
			
			return self;
		},
		resetCheckboxs : function( items ){
			var self = this;
			var opt = this.configs;	
			var value = self.getValue();	
			if( !$.isArray( items ) ) {
				return self;	
			}
			opt.items = items;
			self._setCheckboxs( items );
			
			self.setInputValue( value );
			
			return self;
		},
		setItems : function( items ){
			return this.resetCheckboxs.apply( this,arguments );
		},
		/*private*/
		_setCheckboxEvents : function(){
			var self = this;
			var opt = this.configs;	
			var input = self.getInput();
			
			var fn = function( evt1,evt2,e,func ){
				if( opt.disabled || opt.readOnly ) {
					return;	
				}
				var $this = $(this);
				var id = $this.attr('id');
				var d = self.getItemDataById( id );
				if( d.disabled || d.readOnly ) {
					return;
				}	
				var r;
				if( $.isFunction( d[evt2] ) ) {
					r = d[evt2].call( self,d );	
					if( r === false ) return false;	
				}	
				
				r = self.fireEvent(evt1,[ d[ opt.valueKey ],d,this,e ]);	
				if( r === false ) return false;	
				
				if( $.isFunction( func ) ) {
					func.call( this,d );	
				}
				
			};
			var __t = 0;
			var __t2 = 0;
			input.undelegate('>.nex-form-checkbox-item')
				 .delegate('>.nex-form-checkbox-item',{
					"click" : function(e){
						if( opt.disabled || opt.readOnly ) {
							return;	
						}
						var $this = $(this);
						var id = $this.attr('id');
						var d = self.getItemDataById( id );
						var r;
						if( d.disabled || d.readOnly ) {
							return;
						}	
						if( $.isFunction( d.callBack ) ) {
							r = d.callBack.call( self,d,e );	
						}
						if( $.isFunction( d.callback ) && r !== false ) {
							r = d.callback.call( self,d,e );	
						}
						if( $.isFunction( d.handler ) && r !== false ) {
							r = d.handler.call( self,d,e );	
						}
						if( r !== false ) {
							r = fn.call( this,'onCheckboxClick','click',e );
						}
						
						if( r === false ) return false;
						if( !$this.hasClass('nex-form-checkbox-item-checked') ) {
							self.setChecked( d[ opt.valueKey ] );
							//$this.toggleClass('nex-form-checkbox-item-checked');
						} else {
							self.unsetChecked( d[ opt.valueKey ] );	
						}
						
					},
					"dblclick" : function(e){
						return fn.call( this,'onRaidoDblClick','dblclick',e );
					},
					"mouseenter" : function(e){
						var r = fn.call( this,'onRaidoOver','mouseover',e,function( d ){
							if( d.disabled || d.readOnly ) {
								return;
							}	
							$(this).addClass('nex-form-checkbox-item-over');
						} );
						if( r === false ) return false;
					},
					"mouseleave" : function(e){
						var r = fn.call( this,'onRaidoOut','mouseout',e,function( d ){
							if( d.disabled || d.readOnly ) {
								return;
							}	
							$(this).removeClass('nex-form-checkbox-item-over');
						} );	
						if( r === false ) return false;
					},
					"mousedown" : function(e){
						var r = fn.call( this,'onRaidoMouseDown','mousedown',e,function( d ){
							if( d.disabled || d.readOnly ) {
								return;
							}	
							$(this).addClass('nex-form-checkbox-item-down');
							var $this = $(this);
							__t = setTimeout( function(){
								__t = 0;	
								$(document).one('mouseup',function(){
									$this.removeClass('nex-form-checkbox-item-down');							 
								});					 
							},0 );
						} );	
						if( r === false ) return false;
					},
					"mouseup" : function(e){
						var r = fn.call( this,'onRaidoMouseUp','mouseup',e,function( d ){
							if( d.disabled || d.readOnly ) {
								return;
							}	
							$(this).removeClass('nex-form-checkbox-item-down');
							if( __t ) {
								clearTimeout( __t );
								__t = 0;	
							}
						} );	
						if( r === false ) return false;
					},
					"focus" : function(e){
						input.trigger('focus2',[e]);
						if( __t2 ) {
							clearTimeout( __t2 );
							__t2 = 0;
						}	
					},
					"blur"  : function(e){
						__t2 = setTimeout(function(){
							__t2 = 0;
							input.trigger('blur2',[e]);		
						},0);	
					}
				 });
		},
		getCheckedLength : function(){
			var self = this;
			var opt = this.configs;	
			var input = self.getInput();	
			return $('>.nex-form-checkbox-item-checked',input).length;		
		},
		_uncheckedAll : function(){
			var self = this;
			var opt = this.configs;	
			var input = self.getInput();	
			$('>.nex-form-checkbox-item',input).removeClass('nex-form-checkbox-item-checked');
			$.each( opt.items , function(i,d){
				d.checked = false;	
			} );
			return self;
		},
		uncheckedAll : function(){
			this.setValue('');
			return this;
		},
		//选择所有
		checkedAll : function(  ){
			var self = this;
			var opt = this.configs;	
			var value = [];
			$.each( opt.items, function(i,d){
				value.push( d[ opt.valueKey ] );	
			} );
			self.setValue( value.join( opt.multiSplit ) );
			return self;
		},
		//反选
		reverseChecked : function(){
			var self = this;
			var opt = this.configs;	
			var selected = self.getValue();
			selected = selected.split( opt.multiSplit );
			var value = [];
			$.each( opt.items, function(i,d){
				if( $.inArray( d[opt.valueKey],selected ) === -1 ) {
					value.push( d[opt.valueKey] );
				}	
			} );
			self.setValue( value.join( opt.multiSplit ) );
			return self;
		},
		/*
		*对单个checkbox设置disabled
		*@param value
		*param m private 默认true 设置disabled , false unsetDisabled
		*param css private 默认disabled , readonly
		*/
		setCheckboxDisabled : function( value,m,css ){
			var self = this;
			var opt = this.configs;	
			var m = self._undef( m,true );
			var css = self._undef( css,'disabled' );
			var d = self.getItemData( value );
			d = $.isArray( d ) ? d[0] : d;
			if( d ) {
				if( m ) {
					$('#'+d.__id).addClass('nex-form-checkbox-item-'+css);
					if( css === 'disabled' ) {
						d.disabled = true;	
					} else if( css === 'readonly' ) {
						d.readOnly = true;		
					} else {
						d[css] = true;	
					}
				} else {
					$('#'+d.__id).removeClass('nex-form-checkbox-item-'+css);
					if( css === 'disabled' ) {
						d.disabled = false;	
					} else if( css === 'readonly' ) {
						d.readOnly = false;		
					} else {
						d[css] = false;	
					}
				}
			}
			return self;		
		},
		unsetCheckboxDisabled : function( value ){
			return this.setCheckboxDisabled.apply( this,[ value,false ] );		
		},
		setCheckboxReadOnly : function( value ){
			return this.setCheckboxDisabled.apply( this,[ value,true,'readonly' ] );			
		},
		unsetCheckboxReadOnly : function( value ){
			return this.setCheckboxDisabled.apply( this,[ value,false,'readonly' ] );			
		},
		_setChecked : function( value ){
			this.setCheckboxDisabled.apply( this,[ value,true,'checked' ] );	
		},
		setChecked : function( value ){
			var v1 = this.getInputValue();
			this._setChecked( value );	
			var v2 = this.getInputValue();
			if( v1 !== v2 ) {
				this.fireEvent('onChange',[v2,v1]);	
			}
			return this;		
		},
		_unsetChecked : function( value ){
			this.setCheckboxDisabled.apply( this,[ value,false,'checked' ] );
		},
		unsetChecked : function( value ){
			var v1 = this.getInputValue();
			this._unsetChecked( value );	
			var v2 = this.getInputValue();
			if( v1 !== v2 ) {
				this.fireEvent('onChange',[v2,v1]);	
			}
			return this;			
		},
		//重载
		getInputValue : function(){
			var self = this,undef;
			var opt = this.configs;	
			var input = self.getInput();
			var checked = $('>.nex-form-checkbox-item-checked',input);
			var value = [];
			if( checked.length  ) {
				checked.each( function(){
					value.push( decodeURIComponent( $(this).attr('value') ) );	
				} );
			}
			return value.join( opt.multiSplit );
		},
		setInputValue : function( value ){
			var self = this;
			var opt = this.configs;
			self._uncheckedAll();
			$.each( (value+'').split(opt.multiSplit),function(i,d){
				self._setChecked( d );	
			} );
			return self;
		},
		getInputText : function(){
			var self = this;
			var opt = this.configs;
			var value = self.getInputValue();
			var d = self.getItemData( value );
			d = $.isArray( d ) ? d : [d];
			var text = [];
			$.each( d,function(i,d){
				text.push( d[opt.textKey] );	
			} );
			return text.join( opt.multiSplit );
		},
		setInputText : function( text ){
			var self = this;
			var opt = this.configs;
			var value = [];
			var text = text.split( opt.multiSplit );
			$.each( opt.items,function( i,d ){
				if( $.inArray(d[ opt.textKey ],text) !== -1 ) {
					value.push( d[ opt.valueKey ] );
				}	
			} );	
			self.setValue( value.join( opt.multiSplit ) );
			return self;
		}
	});	
});
;$define([
	'Nex.form.Checkbox'
],function(){
	//"use strict";
	var textfield = Nex.define('Nex.form.SingleCheckbox','Nex.form.Checkbox',{
		alias : 'Nex.SingleCheckboxField',
		xtype : 'singlecheckboxfield',
		configs : function(opt){
			return {
				__inputType  : 'singlecheckbox',
				containerCls : [opt.containerCls,'nex-form-singlecheckbox'].join(' '),
				cleanBtn 	 : false,
				on 			 : '1',
				off 		 : '0',
				text  	     : '',
				//无效参数
				value 		 : ''
			};	
		},
		_checkOptions : function(){
			var opt = this.configs;
			this.callParent(arguments);
			var data = [{
				text : opt.text,
				value : opt.on	
			}];
			opt.items = data;	
			return this;
		},
		/*private*/
		_setCheckboxs : function( ){
			var self = this;
			var opt = this.configs;	
			self.callParent(arguments);
			return self;
		},
		unchecked : function(){
			var self = this;
			var opt = this.configs;	
			self.setValue( opt.off );
			return this;
		},
		checked : function( value,m ){
			var self = this;
			var opt = this.configs;	
			self.setValue( opt.on );
			return self;
		},
		getInputValue : function(){
			var self = this,undef;
			var opt = this.configs;	
			
			var value = self.callParent(arguments);//Nex.form.Checkbox.fn.getInputValue.apply( self,arguments );
			
			return value === (opt.on+'') ? opt.on : opt.off;
		}
	});	
});