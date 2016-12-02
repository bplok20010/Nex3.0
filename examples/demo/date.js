require(['Nex/date/Calendar'], function(date){
date.create({
				id : 'cal',
  renderTo : render,
				firstDay : 1,
			//	width : 600,height:400,
				//multiSelect : true,
				//weekIndex : 1,
				numberOfMonths : 2,
				//multiSelect :　true,
				showOtherMonths : true,
				border : true,
				//ymChangeEnable : false,
				//autoShowymPickerIndex : 0,
				ympickerDuration : 0,
				//dateFormat : 'D/M/YYYY',
				//ymPickerAutoClose : false,
				//minDate : Nex.util.Date.now(-2),
				maxDate : Nex.util.Date.now(),
				//enabledDate : ['2015-03-10'],
				dateFilter : function(s){
					return s	
				},
				showWeek : true,
				//display : 'inline',
				showTodayBtn : true,
				showOkBtn : true,
				showCancelBtn : true,
				onDateChange : function(date){
					$('#s').html( date )		
				},
				autoSubmit : false,
				showAt : {
					at : $('#s'),
					xAlign : 'left',
					yAlign : 'bottom'	
				}
			});
});