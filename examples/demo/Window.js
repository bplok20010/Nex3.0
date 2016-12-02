require(['Nex/window/Window'], function(ct){
  ct.create({
    renderTo : render,
    constrain : true,
    title : 'Windows',
    modal : true,
    bodyPadding : 10,
    html : 'Hello Nex!',
    width : 200,
    height : 200
  });
});