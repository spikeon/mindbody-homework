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
/**
 * Number.prototype.format(n, x)
 *
 * @param integer n: length of decimal
 * @param integer x: length of sections
 */
Number.prototype.format = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
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

var programs;
var pricingOptions;

$(function(){
	$.getJSON("https://api.myjson.com/bins/5bdb3", function(data){
		programs = data;
		$.getJSON("https://api.myjson.com/bins/47axv", function(data){
			pricingOptions = data;
			buildPrograms();
		});
	});

	function buildPrograms(){
		console.log(programs);
		console.log(pricingOptions);
		var $mastertemplate = $('.programtemplate').detach();
		// Build Programs
		$.each(programs, function(k, program){
			var $template = $mastertemplate.clone(true, true);
			$template.removeClass('.programtemplate');
			$('.programs').append($template);

			$template.find(".sales").each(function(){
				var myBarChart = new Chart($(this), {
					type: 'bar',
					data: {
						labels : ["Jan","Feb","Mar","Apr","May","Jun","Jul"],
						datasets : [
							{
								backgroundColor : barColor1,
								data : program.Sales.PreviousYear
							},
							{
								backgroundColor : barColor2,
								data : program.Sales.CurrentYear
							}

						]
					},
					options: barOptions
				});
			});

			$template.find('.hardlinehere').each(function(){$(this).sparkline(program.Sales.CurrentYear,hard_sparkline_line_options);});

			$template.find('.totalsales').text('$'+program.TotalMonthlySales.format());

			$template.find('.title').text(program.Name);

			var $masterpricingtemplate = $template.find('.pricetemplate').detach();
			// Build Programs
			$.each(pricingOptions, function(k, price){
				if(price.ProgramID == program.ProgramID){
					var $pricetemplate = $masterpricingtemplate.clone(true, true);
					$template.find('.prices').append($pricetemplate);
					$pricetemplate.find('.price').text("$"+price.Sales.format());
					$pricetemplate.find('.name').text(price.Name);
				}
			});

			// place pricing options
			$template.find('.softlinehere').each(function(){$(this).sparkline(get_random_sparkline(),soft_sparkline_line_options);});


		});

		dataLoaded();

	}

	function dataLoaded(){


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

		});
	}
});
