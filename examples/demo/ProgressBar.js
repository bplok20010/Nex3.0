
require(['Nex/ProgressBar'], function(){
	Nex.create('progressbar',{
				width : 400,
				value : 60,
			//	text : '<%=value%>%',
			//	height : '50%',
				renderTo : render
			});
});