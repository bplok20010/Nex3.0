/*
*如果需要打包必须用Nex/grid/Grid
*/
require(['Nex/grid/Grid'], function(grid){
	g = grid.create({
		renderTo : render,
		width : '100%',
		height : '100%',
		border : true,
     // scroll : false,
      	//内容不可选
      	bodySelectionable : false,
        //cutHeight : 100,
      	cutWidth : 100,
      	pageSize : 30,
      	showPager : true,
		columns : [{
          field : 'a',
          type : 'index'	
		},{
			field : 'name',
          	width : '50%',
          	sortable : true,
			title : '名称'	
		}, {
			field : 'desc',
          	width : '50%',
			title : '描述'	
		}],
		data : [{
			name : '1Nex.Ajax',
			desc : 'Ajax类'	
		}, {
			name : '2Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : '3Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'xNex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}, {
			name : 'Nex.grid.Grid',
			desc : 'Grid类'	
		}]
	});	
  
  
});