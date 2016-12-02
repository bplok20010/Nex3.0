
require(['Nex/tooltip/ToolTip','Nex/button/Button'],function(){
  function showTip(el){
  	Nex.Create('tooltip', {
				//border : true,
				showShadow : false,
				title : '123'	,
				bodyPadding : 5,
				//border : false,
				//backColor : 'red',
				//borderColor : '#000',
				//textColor : '#000',
				showArrow : true,
				//arrowOffset : 100,
				ui : 'white',
				html : '加载中...',
				onDestroy : function(){
					console.log('onDestroy?');	
				},
				showAt : el,/*{
					at : $('#btn')
					,xAlign : 'left'
					,yAlign : 'center'
					,zAlign : 'x'
					,offsetX : 5
				},*/
				//arrowDir : 'left',
				//arrowAlign : 'left',
				dir : 'bottom',
				dirAlign : 'center',
				offset : 0,
				borderWidth : 2,
				arrowBorderWidth : 2,
				//arrowAlign : 'right',
				onShow : function(){
					var self = this;
					//return;
					//setTimeout(function(){
						if(xt) return;
						xt = true;
						self.hide();
						self.html('Hello ToolTips! loading Test');
						//self.resetPosition();
						self.show();
					//},2000);	
				},
				onBeforeShow : function(){
				},
			//	arrowSize : 10,
				onCreate : function(){
				//	this.addCssRules('.nex-tooltip-arrow-left .nex-tooltip-arrow-bg','border-left-color: #FFF;')
					/*var arrow = this.createArrow('top');
					this.el.append(arrow);	
					var arrow1 = this.createArrow('bottom');
					this.el.append(arrow1);	
					var arrow1 = this.createArrow('left');
					this.el.append(arrow1);	*/
					//var arrow1 = this.createArrow('right');
					//this.el.append(arrow1);	
					//console.log(arrow);
				}
			});
  }
  Nex.Create('button', {
    text : 'ToolTip',
    renderTo : render,
    onClick : function(){
    	
      showTip(this.el)
    	
    }
  })
});