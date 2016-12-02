/*
Nex.Container组件说明：
组件名称       : Nex.Container 可通过 new Nex.Container() 或者 Nex.Create('NexContainer') 来创建
组件别名xtype  : container  可通过Nex.Create('container')
加载名称       : Nex.Container 组件存放目录结构 {{nex目录}}/Container.js
*/
define(function(require){	
	require('Nex');
	return Nex.define('Nex.container.AbstractContainer',{
		extend : 'Nex.Component',
		alias : 'Nex.AbstractContainer',
		xtype : 'abstractcontainer',
		configs : function(opt){
			return {
				prefix : 'abscontainer',
				autoResize : true,
				containerCls : opt.containerCls+' nex-abscontainer'
			};	
		}
	});
});