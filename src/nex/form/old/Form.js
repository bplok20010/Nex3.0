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
			'Nex.util.Validate',
			'Nex.Html',
			'Nex.mixins.DropDown',
			'Nex.showat.ShowAt'
		], function(){
			
			factory( jQuery );	
		} );
	} else {

		factory( jQuery );
	}
}(function( $ ) {
	"use strict";
	var form = Nex.define('Nex.form.Form','Nex.Html',{
		alias : 'Nex.Form',
		xtype : 'form',
		mixins : [ 'DropDown' ]	
	});
	
	Nex.form = form;//兼容以前版本
	Nex.form.Form = form;
	
	form.extend({
		version : '1.0',
		dropdownzIndex : 999999+Nex.zIndex,
		//list : {},
		fieldList : {},
		isExists : function(id){
			if( !$( "#"+id ).length ) {
				return false;
			}	
			return true;
		},
		/*
		*根据name , group 获取输入框对象
		*@param {string} 输入框name
		*@param {string} 输入框分组
		*@return {array}
		*/
		get : function(name,group){
			var self = this,
				undef;
			if( name === undef ) return [];
			
			var group = self._undef( group , 'default' );
			
			var ls = [];
			
			var list = self.fieldList;
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
			return ls.length ? ls[0] : null;
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
			var m = self._undef( m,false );
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
						this.val(self._undef(value[i],''));	
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
			var self = this;
			var group = self._undef( group , 'default' );	
			var m = self._undef( m , false );	
			var t = self._undef( t , false );	
			var list = self.fieldList;
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
			var group = self._undef( group , 'default' );	
			var m = self._undef( m , false );	
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
			var group = self._undef( group , 'default' );	
			var m = self._undef( m , false );	
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
			var group = self._undef( group , 'default' );	
			var m = self._undef( m , false );	
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
	form.setOptions( function( opt ){
		return {
			prefix : 'nexform-',
			renderTo : document.body,
			//当DOM不存在是允许回收当前对象
			autoDestroy : true,
			//表单默认设置的是固定宽度，关闭了大小只适应
			autoResize : false,
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
				inputTpl : '<div <%=attrs%> id="<%=id%>-input" type="<%=type%>" name="<%=name%>" autocomplete="<%=autocomplete%>" tabindex=<%=tabIndex%> value="" style="/*width:0px;*/" class="nex-form-field nex-form-field-<%=type%>"></div>',
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
			events : {
				onStart : $.noop,
				onCreate : $.noop,
				onSizeChange : $.noop,
				onClick : $.noop,
				onFocus : $.noop,
				onBlur : $.noop,
				onKeyDown : $.noop,
				onKeyUp : $.noop,
				onKeyPress : $.noop,
				onMouseOver : $.noop,
				onMouseOut : $.noop,
				onPaste : $.noop,
				onSpinnerUp : $.noop,
				onSpinnerDown : $.noop,
				onMouseDown : $.noop,
				onMouseUp : $.noop,
				onBeforeGet : $.noop,
				onAfterGet : $.noop,
				onChange : $.noop,
				onValidError : $.noop,
				onValidSuccess : $.noop,
				onDestroy : $.noop
			}
		};	
	} );
	form.fn.extend({
		_triggerID : 1,
		_init : function(opt) {
			var self = this;
			//检查参数
			self._checkOptions( opt ).
				 setContainer().
				 _setFormView().
				 initComponent();
		},
		_checkOptions : function( opt ){
			opt.cls += ' nex-form-group-'+opt.group;
			opt.cls += ' nex-form-display-'+opt.display;
			if( $.isArray( opt.items ) ) {
				opt.items = opt.items.concat([]);	
			}
			return this;
		},
		_sysEvents : function(){
			var self = this;
			var opt = self.configs;
			
			Nex.Html.fn._sysEvents.apply( self,arguments );
			
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
		_setViewSize : function(){
			var self = this,
				opt = self.configs,
				container = opt.views['container'],
				vbody = opt.views['body'],
				input = self.getInput();
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
			
			Nex.Html.fn._setViewSize.apply(self,arguments);//_setViewSize
			
			//self.fireEvent("onSetViewSize",[opt]);	
		},
		_addToList : function(){
			var self = this;
			var opt = self.configs;
			var list = Nex.Form.fieldList;
			
			list[opt.id] = true;
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
		initComponent : function(){
			var self = this,
				opt = this.configs;
				
			self.checkLabelSet();	
			
			Nex.Html.fn.initComponent.apply( self,arguments );
			
			self._addToList();
			
			self._afterCreate();
			
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
				tpl.push('<span class="nex-form-trigger-icon '+d.iconCls+'" style="'+(d.icon?('background-image:url('+d.icon+')'):'')+'"></span>');	
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
			
			if( Nex.isXtype( d ) || Nex.isNexConstructor( d ) ) {
				self.renderComponent( d.text,$tpl );	
			} else if( Nex.isNex( d ) ) {
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