/*
*如果需要打包必须用Nex/grid/Grid
*/
require(['Nex/grid/Table'], function(grid){
	grid.create({
		renderTo : render,
		width : '100%',
		height : '100%',
		border : true,
      	//内容不可选
      	bodySelectionable : false,
        cutHeight : 100,
      	cutWidth : 100,
      forceFit : true,
      	showPager : true,
		columns : [{
			field : 'name',
          width : 300,
          	sortable : true,
			title : '名称'	
		}, {
			field : 'desc',
          width : 300,
			title : '描述'	
        }, {
          type : 'empty'
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