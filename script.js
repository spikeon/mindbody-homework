var hardLineColor = '#31312F';
var softLineColor = '#d9d5d0';

var barColor1 = '#C7BBDB';
var barColor2 = '#BCD6B6';

var soft_sparkline_line_options = {
	lineColor: softLineColor,
    type: 'line',
    fillColor: false,
    lineWidth: 1,
    spotColor: false,
    spotRadius: 2,
    drawNormalOnTop: false,
	width: 80,
	height: 20,
	disableHiddenCheck: true,
};

var hard_sparkline_line_options = {
	lineColor: hardLineColor,
	type: 'line',
    fillColor: false,
    lineWidth: 1,
    spotColor: false,
    spotRadius: 3,
    drawNormalOnTop: false,
	width: 80,
	height: 20,
};

var barData = {
	labels : ["Jan","Feb","Mar","Apr","May","Jun","Jul"],
	datasets : [
		{
			backgroundColor : barColor1,
			data : [456,479,324,569,702,600, 100]
		},
		{
			backgroundColor : barColor2,
			data : [364,504,605,400,345,320, 200]
		}

	]
};

var barOptions = {

	categoryPercentage: 0.5,
	legend: {
		display: false,
	},
	scales: {
		xAxes: [{
			display: true,
			gridLines : {
					display: false,
					drawBorder: false,
			},
			ticks : {
				display: true,
				zeroLineWidth: 0
			}
		}],
		yAxes: [{
			display: false
		}]
	}
};

$(function(){
$(".sales").each(function(){
	var myBarChart = new Chart($(this), {
	    type: 'bar',
	    data: barData,
	    options: barOptions
	});
});

	$('.hardlinehere').each(function(){$(this).sparkline('html',hard_sparkline_line_options);});
	$('.softlinehere').each(function(){$(this).sparkline('html',soft_sparkline_line_options);});

	$('.toggle').click(function(e){
		e.preventDefault();
		$(this).find('span').toggle();
		$(this).parent().find('.more').toggle();
	});
	$('.menu a').click(function(e){
		e.preventDefault();
		$('.menu li').removeClass('active');
		$(this).parent().addClass('active');
		$(".submenu ul").hide();
		$(".submenu ul[data-parentmenu='"+$(this).data('menu')+"']").show();

	})
});
