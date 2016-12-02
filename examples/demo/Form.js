
require(['Nex/form/Text','Nex/form/Select','Nex/grid/Grid','Nex/button/Button','Nex/form/Trigger'], function(grid){
	Nex.Create( {
				renderTo : render,
				xtype : 'button',
				text : '123',
				width : 50	
			} );
			Nex.Create( {
				renderTo : render,
				xtype : 'button',
				text : '123',
				width : 50	
			} );
			Nex.Create( {
				renderTo : render,
				xtype : 'button',
				text : '123',
				width : 50	
			} );
			b4 = Nex.Create( {
				renderTo : render,
				xtype : 'button',
				text : '123',
				width : 50,
				mixins : 'DropDown',
				callBack : function(){
					this.toggleDropDown([1,2,3,4,5,6])	
				}
			} );
			f1 = Nex.Create('textfield',{
				width : 300,
				labelWidth : 40,
				renderTo : render,
				//showLabel : false,
				labelPosition : 'right',
				rules : 'required',
				labelText : '',
				name : 'test',
				group : 'test',
				value : 1,
				placeholder : 'testtest',
				//dropdownWidth : 400,
				//dropdownItemVisible : false,
				dropdownAnimate : true,
				dropdownWidth : function(){
							var at = this.getDropDownShowAt();
							return at.outerWidth();	
						},
				items : function(){
					return {
						xtype : 'grid',
						columns : [ { field : 'ID' },{ field:'Name' } ],
						data : [
							{ID : 1,Name : 'test'},
							{ID : 1,Name : 'test'},
							{ID : 1,Name : 'test'},
							{ID : 1,Name : 'test'},
							{ID : 1,Name : 'test'},
							{ID : 1,Name : 'test'},
							{ID : 1,Name : 'test'},
							{ID : 1,Name : 'test'},
							{ID : 1,Name : 'test'},
							{ID : 1,Name : 'test'},
							{ID : 1,Name : 'test'}
						],
						height : 200,
						width : '100%'	
					};
				},
				onBlur : function(){
					console.log(11)	
					//this.hideDropDown();	
				},
				onFocus : function(){
					console.log(1122);
					var f= this;
					//setTimeout( function(){
						f.toggleDropDown();	
					//},0 );
				}
			});	
			f2 = Nex.Create({
						xtype : 'selectfield',
						width : '30%',
						autoResize : true,
						labelText : '年龄',
						//dropdownAnimate : true,
						onDropDownItemClick : function(){
							console.log(1);	
						},
						renderTo : render,
						dropdownOtherHeight : 26,
						dropdownSingleSelect : false,
						dropdownMaxWidth1 : function(){
							var at = this.getDropDownShowAt();
							return at.outerWidth();	
						},
						onCreateDropDwon : function( dropdown ){
							var sch = $('<div class="nex-search"></div>');
							
							dropdown.prepend(sch);
							var self = this;
							
							Nex.Create('textfield',{
								renderTo : sch,
								showLabel : false,
								labelText : '',
								width : 390,
								onMouseOut : function(){
									//this.blur();
								},
								
								onBlur : function(){
									console.log(32);	
								},
								onTextChange : function(){
									//搜索建议 隐藏item 而不是重新设置item
									var items = self.configs.items;
									var list = [];
									var v = this.val();
									var list = self.getDropDownListItems();
									list.each( function(){
										var text = $(this).text();
										if( text.indexOf( v ) !== -1 ) {
											$(this).show();
										} else {
											$(this).hide();	
										}
									} );
									self.resetDropDownSizeAndPos();	
									//or setDropDownList( list ) //来处理 单选建议用这个，多选建议用上面的
								}
							});
						},
						onSetDropDownSize11 : function(d){
							//d.height -= 26;	
						},
						dropdownEmptyMsg : '<div style="text-align:center;">暂无数据</div>',
						//dropdownWidth : 300,
						//dropdownHeight : 200,
						items : [
								{ value : '1"1',text : '一"星' },
								{ value : '2',text : '二星12' },
								{ value : '3',text : '三星11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111123456789' },
								{ value : '114',text : '四星31' },
								{ value : '24',text : '四星41' },
								{ value : '43',text : '四星51' },
								{ value : '44',text : '四星61' },
								{ value : '54',text : '四星71' },
								{ value : '64',text : '四星81' },
								{ value : '74',text : '四星91' },
								{ value : '84',text : '四星a1' },
								{ value : '49',text : '四星b1' },
								{ value : '423',text : '四星c1' },
								{ value : '412',text : '四星d1' },
								{ value : '23444',text : '四星e1' },
								{ value : '123414',text : '四星f1' },
								{ value : '41234',text : '四星g1' },
								{ value : '5',text : '五星' }
							],
						placeholder : '请输入...',
						onChange : function(v){
							console.log(v)	
						},
						value : '5',
						name : 'age',
						group : 'userinfo test',
						onCreate : function(){
							var el = this.getBody();
							$('<div class="error-tip nex-form-tooltip">信息错误！</div>').appendTo( el );	
						}
					});
});