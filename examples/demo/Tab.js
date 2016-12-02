
require(['Nex/tab/Tab'], function(grid){
	Nex.Create('tab',{
		renderTo : render,
		height : '400',
		width : '500',
		tabLayout : 'top',
		border : '5px solid green',
		lazyLoad : true,
		animSwitch : true,
		showOnType : 1,
		//tabHeaderWidth : '80%',
		title : '',
		firstShowAnim : true,
		//showHeader : true,
		forceFit : true,
		defaults : {
			closable : true	
		},
		bodyPadding : 10,
		items : [
			{
				title : '1111111',
				icon : 'http://127.0.0.1/ext-4.1.0-beta-1/examples/toolbar/images/add16.gif',
				iconCls : 'd',
				closable : false,
				//disabled : true,
				html : 'Hello World!11'
			},
			{
				title : '123',
				html : 'Hello World!22',
				items : {
					xtype : 'container',
					width : 400,
					height : 400,
					id : 'html',
					padding : 10,
					onCreate : function(){
						this.showLoading();	
					}	
				}
			},
			{
				title : '2222222',
				html : (function(){
					var s = [];
					for( var i=0;i<2000;i++ ) {
						s.push( '<div><span>a'+i+' ,</span></div>' );	
					}	
					return s.join('');
				})()
			},
			{
				title : '2222222',
				html : (function(){
					var s = [];
					for( var i=0;i<2000;i++ ) {
						s.push( '<div><span>b'+i+' ,</span></div>' );	
					}	
					return s.join('');
				})()
			},
			{
				title : '2222222',
				html : (function(){
					var s = [];
					for( var i=0;i<2000;i++ ) {
						s.push( '<div><span>c'+i+' ,</span></div>' );	
					}	
					return s.join('');
				})()
			},
			{
				title : '2222222',
				html : (function(){
					var s = [];
					for( var i=0;i<10000;i++ ) {
						s.push( '<div><span>d'+i+' ,</span></div>' );	
					}	
					return s.join('');
				})()
			},
			{
				title : '2222222',
				html : (function(){
					var s = [];
					for( var i=0;i<2000;i++ ) {
						s.push( '<div><span>e'+i+' ,</span></div>' );	
					}	
					return s.join('');
				})()
			},
			{
				title : '2222222',
				html : 'Hello World!221e11'
			},
			{
				title : '2222222',
				html : 'Hello World!221d11'
			},
			{
				title : '2222222',
				html : 'Hello World!22c111'
			},
			{
				title : '2222222',
				html : 'Hello World!221b11'
			},
			{
				title : '2222222',
				html : 'Hello World!22a111'
			},
			{
				title : '2222222',
				html : 'Hello World!22111'
			},
			{
				title : '2222222',
				html : 'Hello World!22111'
			},
			{
				title : '2222222',
				html : 'Hello World!222223222'
			},
			{
				title : '2222222',
				html : 'Hello World!223333'
			}
		]
	});
  Nex.Create('stab',{
		renderTo : render,
		height : '400',
		width : '500',
		tabLayout : 'top',
		border : '5px solid green',
		lazyLoad : true,
		animSwitch : true,
		showOnType : 1,
		//tabHeaderWidth : '80%',
		title : '',
		firstShowAnim : true,
		//showHeader : true,
		forceFit : true,
		defaults : {
			closable : true	
		},
		bodyPadding : 10,
		items : [
			{
				title : '1111111',
				icon : 'http://127.0.0.1/ext-4.1.0-beta-1/examples/toolbar/images/add16.gif',
				iconCls : 'd',
				closable : false,
				//disabled : true,
				html : 'Hello World!11'
			},
			{
				title : '123',
				html : 'Hello World!22',
				items : {
					xtype : 'container',
					width : 400,
					height : 400,
					id : 'html',
					padding : 10,
					onCreate : function(){
						this.showLoading();	
					}	
				}
			},
			{
				title : '2222222',
				html : (function(){
					var s = [];
					for( var i=0;i<2000;i++ ) {
						s.push( '<div><span>a'+i+' ,</span></div>' );	
					}	
					return s.join('');
				})()
			},
			{
				title : '2222222',
				html : (function(){
					var s = [];
					for( var i=0;i<2000;i++ ) {
						s.push( '<div><span>b'+i+' ,</span></div>' );	
					}	
					return s.join('');
				})()
			},
			{
				title : '2222222',
				html : (function(){
					var s = [];
					for( var i=0;i<2000;i++ ) {
						s.push( '<div><span>c'+i+' ,</span></div>' );	
					}	
					return s.join('');
				})()
			},
			{
				title : '2222222',
				html : (function(){
					var s = [];
					for( var i=0;i<10000;i++ ) {
						s.push( '<div><span>d'+i+' ,</span></div>' );	
					}	
					return s.join('');
				})()
			},
			{
				title : '2222222',
				html : (function(){
					var s = [];
					for( var i=0;i<2000;i++ ) {
						s.push( '<div><span>e'+i+' ,</span></div>' );	
					}	
					return s.join('');
				})()
			},
			{
				title : '2222222',
				html : 'Hello World!221e11'
			},
			{
				title : '2222222',
				html : 'Hello World!221d11'
			},
			{
				title : '2222222',
				html : 'Hello World!22c111'
			},
			{
				title : '2222222',
				html : 'Hello World!221b11'
			},
			{
				title : '2222222',
				html : 'Hello World!22a111'
			},
			{
				title : '2222222',
				html : 'Hello World!22111'
			},
			{
				title : '2222222',
				html : 'Hello World!22111'
			},
			{
				title : '2222222',
				html : 'Hello World!222223222'
			},
			{
				title : '2222222',
				html : 'Hello World!223333'
			}
		]
	});
});