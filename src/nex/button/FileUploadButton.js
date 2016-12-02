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
			'Nex.button.FileButton',
			'Nex.util.SubmitForm'
		], function(){
			
			factory( jQuery );	
		} );
	} else {

		factory( jQuery );
	}
}(function( $ ) {
	//"use strict";
	var button = Nex.define('Nex.button.FileUploadButton','Nex.button.FileButton',{
		xtype : 'fileuploadbutton',
		alias : 'Nex.FileUploadButton'	
	});
	button.setOptions( function( opt ){
		return {
			name : 'file',//$_FILES
			url : '', //提交地址
			data : {}
		};						
	} );
	
	button.override({
		_setFile : function(){
			var self = this;
			var opt = self.C();	
			
			var btn = self.getDom();
			var name = opt.name == '' ? opt.id+'_file' : opt.name;
			$('#'+opt.id+'_bf').remove();
			var _form = $('<form class="nex-btn-file-form" id="'+opt.id+'_btn_upload_form" action="'+opt.url+'" method="post" enctype="multipart/form-data"><input id="'+opt.id+'_bf" hideFocus=true class="nex-btn-file-input" type="file" size="1" name="'+name+'" /><div class="nex-btn-file-data" id="'+opt.id+'_file_data"></div></form>');
			opt.views['_form'] = _form;
			
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
			btn.append( _form );
			
			opt.views['file'] = $('#'+opt.id+'_bf');
			var file = opt.views['file']; 
			
			file.height( h );
			file.bind( 'change',function(e){
				self.fireEvent('onFileChange',[ this,$(this).val(),e ]);
				self.fireEvent('onSelect',[ $(this).val(),e ]);	
			} );
			return self;
		},
		setUploadUrl : function( url ){
			var self = this;
			var opt = self.C();	
			opt.url = url;
			$('#'+opt.id+'_btn_upload_form').attr('action',url);	
			
		},
		upload : function(){
			var self = this;
			var opt = self.C();	
			var fileData = $('#'+opt.id+'_file_data');
			
			var r = self.fireEvent('onUploadStart',[ opt.data ]);
			
			if( r === false ) return false;
			
			fileData.empty();
			
			var str = [];
			$.each( opt.data,function(k,v){
				str.push('<input type="hidden" name="'+k+'" value="'+v+'" />');	
			} );
			
			fileData.html( str.join('') );
			
			var uploader = Nex.getUtil('SubmitForm');
			
			uploader.submit( document.getElementById(opt.id+'_btn_upload_form'),function(s){
					self.fireEvent('onUploadComplete',[ s ]);
					fileData.empty();	
				} );
				
		}
	});
}));