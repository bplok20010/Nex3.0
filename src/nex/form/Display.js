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