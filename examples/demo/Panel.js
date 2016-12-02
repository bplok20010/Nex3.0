
require(['Nex/panel/Panel'], function(panel){
  panel.create({
    renderTo : render,
    bodyPadding : 10,
    title : 'Panel',
    html : 'Hello Nex!',
    width : 200,
    closable : true,
    height : 200
  });
});