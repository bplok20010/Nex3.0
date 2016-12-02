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