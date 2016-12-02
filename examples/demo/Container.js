
require(['Nex/container/Container'], function(ct){
  ct.create({
    renderTo : render,
    cssText : 'border : 1px solid #ccc;',
    padding : 10,
    html : 'Hello Nex!',
    width : 200,
    height : 200
  });
});