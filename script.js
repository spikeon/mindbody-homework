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


var barOptions = {

	categoryPercentage: 0.5,
	legend: {
		display: false,
	},
	scales: {
		xAxes: [{
			beginAtZero: true,
			display: true,
			gridLines : {
					display: false,
					drawBorder: false,
			},
			ticks : {
				display: true,
				beginAtZero: true,
				zeroLineWidth: 0
			}
		}],
		yAxes: [{
			ticks:{
				beginAtZero: true,
			},
			display: false
		}]
	}
};

function get_random_sparkline(){
	var r = [];
	for(i=0; i <= 20; i++){
		r.push(Math.random()*20);
	}

	return r;
}
function get_random_barchart(){
	var r = [];
	for(i=1; i <= 7; i++){
		r.push( Math.random()*200 + 300);
	}
	console.log(r);
	return r;
}


$(function(){
	$(".sales").each(function(){
		var myBarChart = new Chart($(this), {
		    type: 'bar',
		    data: {
				labels : ["Jan","Feb","Mar","Apr","May","Jun","Jul"],
				datasets : [
					{
						backgroundColor : barColor1,
						data : get_random_barchart()
					},
					{
						backgroundColor : barColor2,
						data : get_random_barchart()
					}

				]
			},
		    options: barOptions
		});
	});


	$('.hardlinehere').each(function(){$(this).sparkline(get_random_sparkline(),hard_sparkline_line_options);});
	$('.softlinehere').each(function(){$(this).sparkline(get_random_sparkline(),soft_sparkline_line_options);});

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
