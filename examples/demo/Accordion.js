
require(['Nex/accordion/Accordion'], function(grid){
	Nex.create('accordion',{
				singleSelect : false,
				border : true,
				height : '50%',
				width : 200,
      			renderTo : render,
				items : [
					{ 
						title : '1',
						html : 'dddddddddddddddddddddd'	
					},
					{ title : '2', items : {
						html : 'Hello World!!'	
					}},
					{ title : '3' }
				]
			});
});