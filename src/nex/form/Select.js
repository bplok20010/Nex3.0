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