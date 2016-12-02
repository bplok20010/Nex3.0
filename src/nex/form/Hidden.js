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