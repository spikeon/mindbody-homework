/* Google Analytics Code */

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-84279981-1', 'auto');
ga('send', 'pageview');

// Settings

let hardLineColor = '#31312F';
let softLineColor = '#d9d5d0';

let barColor1 = '#C7BBDB';
let barColor2 = '#BCD6B6';

// the settings for the light grey sparklines
let soft_sparkline_line_options = {
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

// the settings for the dark grey sparklines
let hard_sparkline_line_options = {
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

// the settings for the bar charts
let barOptions = {
	categoryPercentage: 0.5,
	legend: {
		display: false
	},
	scales: {
		xAxes: [{
			beginAtZero: true,
			display: true,
			gridLines : {
					display: false,
					drawBorder: false
			},
			ticks : {
				display: true,
				beginAtZero: true,
				zeroLineWidth: 0
			}
		}],
		yAxes: [{
			ticks:{
				beginAtZero: true
			},
			display: false
		}]
	}
};

/**
 * Format number as Money
 *
 * This was borrowed from an answer on StackOverflow.  {@link http://stackoverflow.com/a/14428340/3347093|Stack Overflow Answer}
 *
 * @param integer n: length of decimal
 * @param integer x: length of sections
 */
Number.prototype.format = function(n, x) {
    const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

/**
 * Generate random sparkline data
 *
 * @return Array
 */
function get_random_sparkline(){
	let r = [];
	for ( let i = 0; i <= 20; i++ ) r.push(Math.random()*20);
	return r;
}

/**
 * Generate random bar graph data
 *
 * Use this if you want to run the page without the API
 *
 * @return Array
 */
function get_random_barchart(){
	let r = [];
	for ( let i = 1; i <= 7; i++ ) r.push( Math.random()*200 + 300);
	return r;
}

/** Array of programs */
let programs;

/** Array of Pricing Options */
let pricingOptions;

$(function(){

	// Get the programs
	$.getJSON("https://api.myjson.com/bins/5bdb3", function(data){

		// Set the programs
		programs = data;

		// Get the Pricing Options
		$.getJSON("https://api.myjson.com/bins/47axv", function(data){

			// Set the Pricing Options
			pricingOptions = data;

			// Data is Loaded; Start generating the page
			buildPrograms();
		});
	});

	function buildPrograms(){

		// Extract Program Template from DOM
		let $mastertemplate = $('.programtemplate').detach();

		// Extract Pricing Options template from master template
		let $masterpricingtemplate = $mastertemplate.find('.pricetemplate').detach();

		// Remove template identifier from master template
		$mastertemplate.removeClass('.programtemplate');

		// Remove template identifier from master pricing template
		$masterpricingtemplate.removeClass('.pricetemplate');

		// Build Programs
		for(let program of programs){

			// Create working copy of template
			let $template = $mastertemplate.clone(true, true);

			// Place working copy of template into the DOM
			$('.programs').append($template);

			// Generate Bar Chart
			$template.find(".sales").each(function(){
				new Chart($(this), {
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

			// Generate top sparkline
			$template.find('.hardlinehere').each(function(){
				$(this).sparkline(program.Sales.CurrentYear,hard_sparkline_line_options);
			});

			// Place sales amount into DOM
			$template.find('.totalsales').text('$'+program.TotalMonthlySales.format());

			// Place title into DOM
			$template.find('.title').text(program.Name);

			// Build Pricing Options
			for(let option of pricingOptions){

				// Make sure that the pricing option belongs to the program
				if(option.ProgramID == program.ProgramID){

					// Create working copy of template
					let $pricetemplate = $masterpricingtemplate.clone(true, true);

					// Place working copy into DOM
					$template.find('.prices').append($pricetemplate);

					// Place price into DOM
					$pricetemplate.find('.price').text("$"+option.Sales.format());

					// Place Pricing Option Name into DOM
					$pricetemplate.find('.name').text(option.Name);

				}
			}

			// Generate pricing option sparklines
			$template.find('.softlinehere').each(function(){
				$(this).sparkline(get_random_sparkline(),soft_sparkline_line_options);
			});

		}

		// Page is built, place triggers on top of it
		pageBuilt();

	}

	function pageBuilt(){

		// Handle clicking a "more" link
		$('.toggle').click(function(e){

			// Prevent clicking of link default action
			e.preventDefault();

			//analytics
			ga('send', 'event', 'More Link', 'toggle', 'Urban Yoga');

			// Change from "more" to "less" or vice versa
			$(this).find('span').toggle();

			// Hide or show the content
			$(this).parent().find('.more').toggle();

		});

		// Handle changing the tab in the menu
		$('.menu a').click(function(e){
			// Prevent clicking of link default action
			e.preventDefault();

			//analytics
			ga('send', 'event', 'Menu Tab', 'clicked', 'Urban Yoga');

			// Un-select previously active tab
			$('.menu li').removeClass('active');

			// Set this tab as active
			$(this).parent().addClass('active');

			// hide previously displayed submenu
			$(".submenu ul").hide();

			// show the submenu for this menu item
			$(".submenu ul[data-parentmenu='"+$(this).data('menu')+"']").show();

		});
	}

	$('button.edit').click(function(){
		//analytics
		ga('send', 'event', 'Edit Button', 'clicked', 'Urban Yoga');
	});

	$('button.newprogrambtn').click(function(){
		//analytics
		ga('send', 'event', 'New Program Button', 'clicked', 'Urban Yoga');
	});

});
