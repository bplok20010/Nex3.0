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