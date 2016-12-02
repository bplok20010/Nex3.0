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