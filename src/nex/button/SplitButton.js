/*
SplitButton组件继承 Button
http://www.extgrid.com/button
author:nobo
zere.nobo@gmail.com
qq : 505931977
*/
(function( factory ) {
	if ( typeof $define === "function" ) {
		
		$define([
			'Nex.button.Button'
		], function(){
			
			factory( jQuery );	
		} );
	} else {

		factory( jQuery );
	}
}(function( $ ) {
	//"use strict";
	var button = Nex.define('Nex.button.SplitButton','Nex.button.Button',{
		alias : 'Nex.SplitButton',
		xtype : 'splitbutton'		
	});
	
	button.override({
		sysEvents : function(){
			var self = this;
			var opt = self.configs;
			
			self.callParent(arguments);
			
			self.bind("onSplitBtnClick.menu",self._showSplitMenu,self);
			
			return self;
		},
		disabled : function( m ){
			var self = this,
				opt=this.configs,
				file = opt.views['file'],
				undef;
			var m = m === undef ? true : m;
			
			var r = self.callParent(arguments);
			
			if( file ) {
				if( m ) {
					file.attr('disabled',true);	
				} else {
					file.attr('disabled',false);		
				}
			}
			
			return r;
		}
		
	});
}));