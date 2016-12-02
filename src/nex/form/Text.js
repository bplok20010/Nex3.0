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