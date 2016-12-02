/*
Nex.Separator
*/
(function( factory ) {
	if ( typeof $define === "function" ) {
		
		$define([
			'Nex.container.AbstractContainer'
		], function(){
			
			factory( jQuery );	
		} );
	} else {

		factory( jQuery );
	}
}(function( $ ) {
	//"use strict";
	var separator = Nex.define('Nex.Separator','Nex.container.AbstractContainer',{
		xtype : 'separator',
		configs : function(opt){
			return 	{
				autoResize : false,
				tabIndex : false,
				disabledItems : true,
				denyEvents : true,
				cls : opt.containerCls+' nex-separator',
				width : 'atuo',
				height : 'auto'
			};
		}
	});
}));