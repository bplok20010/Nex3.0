;$import([
	'Nex.form.Text'
],function(){
	//"use strict";
	var trigger = Nex.define('Nex.form.Trigger','Nex.form.Text',{
		alias : 'Nex.TriggerField',
		xtype : 'triggerfield',
		configs : function(opt){
			return {
				__inputType  : 'text',
				containerCls : [opt.containerCls,'nex-form-trigger'].join(' '),
				_inputCls    : [],
				cleanBtn 	 : false,
				triggerToFocus : false,
				triggerCls	 : '',
				triggerIconCls	 : ''
			};	
		},
		sysEvents : function(){
			var self = this,
				opt = self.configs;	
			self.bind('onSetFormView._sys',self._setInputCls,self);	
			self.callParent(arguments);
			//Nex.form.Form.fn._sysEvents.apply( self,arguments );
			return self;	
		},
		/*重载设置系统的trigger btn*/
		_setSysTriggerBtns : function(){
			var self = this,
				opt = self.configs;
			self._setTriggerBtn();
			//Nex.form.Form.fn._setSysTriggerBtns.apply( self,arguments );
			self.callParent(arguments);
			//cleanBtn	
			return self;
		},
		_setTriggerBtn : function(){
			var self = this,
				opt = self.configs;
			//var input = self.getInput();	
			self.addInnerTriggerBtn({
				name : 'trigger',
				cls : ['nex-form-triggerfield-trigger',opt.triggerCls].join(' '),
				iconCls : ['nex-form-triggerfield-icon',opt.triggerIconCls].join(' '),
				callBack : function( d,e ){
					var r = self.fireEvent('onTriggerClick',[ opt ]);
					if( r === false ) return;
				}	
			});	
		},
		_setInputCls : function(){
			var self = this,
				opt = self.configs;
			var ccls = $.isArray(opt._inputCls) ? opt._inputCls : [ opt._inputCls ];
			var cls = ['nex-form-field-trigger'].concat( ccls );	
			$('#'+opt.id+'-input').addClass( cls.join(' ') );
		}
	});	
});