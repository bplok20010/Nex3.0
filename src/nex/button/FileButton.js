/*
FileButton组件继承 Button
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
	var button = Nex.define('Nex.button.FileButton','Nex.button.Button',{
		alias : 'Nex.FileButton',
		xtype : 'filebutton'	
	});
	button.setOptions( function( opt ){
		return {
			name : 'file'//file时使用
		};						
	} );
	
	button.override({
		sysEvents : function(){
			var self = this;
			var opt = self.configs;
			self.bind("onCreate._sys_",self._setFile,self);
			self.bind("onSizeChange._sys_",self.resetFileSize,self);
			
			self.callParent(arguments);
			
			return self;
		},
		disabled : function( m ){
			var self = this,
				opt=this.configs,
				file = opt.views['file'],
				undef;
			var m = m === undef ? true : m;
			
			var r = self.callParent(arguments);;
			
			if( file ) {
				if( m ) {
					file.attr('disabled',true);	
				} else {
					file.attr('disabled',false);		
				}
			}
			
			return r;
		},
		_isIE67 : function(){
			if(navigator.userAgent.indexOf("MSIE 6.0")>0) 
			{ 
				return true;
			} 
			else if(navigator.userAgent.indexOf("MSIE 7.0")>0)  
			{ 
				return true;
			} 
			return false;
		},
		resetFileSize : function(){
			var self = this;
			var opt = self.C();	
			var file = opt.views['file'];
			if( !file ) return self;
			file.height( self.getHeight() );	
			return self;
		},
		getFileName : function(){
			var self = this;
			var opt = self.C();	
			return opt.views['file'] ? opt.views['file'].val() : '';
		},
		_setFile : function(){
			var self = this;
			var opt = self.C();	
			
			var btn = self.getDom();
			var name = opt.name == '' ? opt.id+'_file' : opt.name;
			$('#'+opt.id+'_bf').remove();
			var file = $('<input id="'+opt.id+'_bf" hideFocus=true class="nex-btn-file-input" type="file" size="1" name="'+name+'" />');
			opt.views['file'] = file;
			
			var isIE67 = function(){
				if(navigator.userAgent.indexOf("MSIE 6.0")>0) 
				{ 
					return true;
				} 
				else if(navigator.userAgent.indexOf("MSIE 7.0")>0)  
				{ 
					return true;
				} 
				return false;
			}
			var h =  btn._height();
			if( isIE67() ) {
				btn.height( h );
			}
			btn.append( file );
			file.height( h );
			file.bind( 'change',function(e){
				self.fireEvent('onFileChange',[ this,$(this).val(),e ]);	
			} );
			return self;
		},
		resetFile : function(){
			return this._setFile();		
		}
	});
}));