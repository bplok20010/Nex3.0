require(['Nex/tree/Tree'], function(tree){
  var trees = [
	
	{text:'node3',id:3,leaf:false},
	{text:'node4',id:4},
	{text:'node52',id:5,order:-2},
	{text:'node6',id:6},
	{text:'node7',id:7,icon:'cc'},
	{text:'node8',id:8},
	{text:'node2',id:2,children:[{text:'node2',id:9}]},
	
	{text:'node56',id:1,children : [
		{text:'node2',id:10,open:true,children:[{text:'node2',id:13},{text:'node2',open:true,id:25,children:[{text:'node2',id:49}]},{text:'node2',id:12}]}
	]}
];
	new Nex.Tree({
      renderTo : render,
      	title : 'Tree',
		width : 200,
		bodyPadding : 5,
		//selectionable : false,
		//headerSelectionable : true,
		draggable : true,
		droppable : true,
		nodesSort:1,
		simpleSelect:true,
		animate : true,
		expandOnLoad:0,
		root : '-1',
		showParentCheckBoxButton:false,
		/*,url:getData*/
		data:trees,
		expandOnEvent : 2,
		showTreeLines : true,
		onNodeExpanderClick : function(){
			//console.log( 'onNodeExpanderClick' );	
		},
		onResetOrder : function(s,d){
			console.log( s, d );	
		},
		onMoveNode : function(s,d,p){
			console.log( s, d, p );	
		},
		onCreateNodeSpacers:function( tid, lis){
			lis.push( this.createSpacer('cc') );
		}
	});
});