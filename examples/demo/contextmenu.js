/*
$.fn.contextMenu( [ delegate ],opts );
1.$(div).contextMenu( opts );
2.$(document).contextMenu( 'tr',opts );
*/
require(['Nex/menu/ContextMenu'], function(date){
  var ct = Nex.Create({
    renderTo : render,
    xtype : 'container',
    width : 200,
    height : 200,
    cls : 'ctx',
    html : '鼠标右键这里',
    cssText : "border : 1px solid red; line-height : 200px; text-align:center"
  });
  
  ct.el.contextMenu({
    items : [
      {text : 'H1'},'-',
      {text : 'H2',items : [{text : 'h3'}]}
    ],
    delay:0,
	hideToRemove : false,
	border : true,
	itemTips : true,
	autoShow : false,
	which : 2
  });
  
});