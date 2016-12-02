
require(['Nex/layout/Layout','Nex/panel/Panel'], function(grid){
	Nex.Create('layout',{
		renderTo : render,
				center : {
					padding : 5,
					items : {
						xtype : 'panel',
						html : 'Hello World!'	
					}	
				}
			})
});