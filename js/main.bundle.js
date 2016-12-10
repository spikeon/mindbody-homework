'use strict';

/* Google Analytics Code */

(function (i, s, o, g, r, a, m) {
	i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
		(i[r].q = i[r].q || []).push(arguments);
	}, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m);
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-84279981-1', 'auto');
ga('send', 'pageview');

// Settings

var hardLineColor = '#31312F';
var softLineColor = '#d9d5d0';

var barColor1 = '#C7BBDB';
var barColor2 = '#BCD6B6';

// the settings for the light grey sparklines
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
	disableHiddenCheck: true
};

// the settings for the dark grey sparklines
var hard_sparkline_line_options = {
	lineColor: hardLineColor,
	type: 'line',
	fillColor: false,
	lineWidth: 1,
	spotColor: false,
	spotRadius: 3,
	drawNormalOnTop: false,
	width: 80,
	height: 20
};

// the settings for the bar charts
var barOptions = {
	categoryPercentage: 0.5,
	legend: {
		display: false
	},
	scales: {
		xAxes: [{
			beginAtZero: true,
			display: true,
			gridLines: {
				display: false,
				drawBorder: false
			},
			ticks: {
				display: true,
				beginAtZero: true,
				zeroLineWidth: 0
			}
		}],
		yAxes: [{
			ticks: {
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
Number.prototype.format = function (n, x) {
	var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
	return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

/**
 * Generate random sparkline data
 *
 * @return Array
 */
function get_random_sparkline() {
	var r = [];
	for (var i = 0; i <= 20; i++) {
		r.push(Math.random() * 20);
	}return r;
}

/**
 * Generate random bar graph data
 *
 * Use this if you want to run the page without the API
 *
 * @return Array
 */
function get_random_barchart() {
	var r = [];
	for (var i = 1; i <= 7; i++) {
		r.push(Math.random() * 200 + 300);
	}return r;
}

/** Array of programs */
var programs = void 0;

/** Array of Pricing Options */
var pricingOptions = void 0;

$(function () {

	// Get the programs
	$.getJSON("https://api.myjson.com/bins/5bdb3", function (data) {

		// Set the programs
		programs = data;

		// Get the Pricing Options
		$.getJSON("https://api.myjson.com/bins/47axv", function (data) {

			// Set the Pricing Options
			pricingOptions = data;

			// Data is Loaded; Start generating the page
			buildPrograms();
		});
	});

	function buildPrograms() {

		// Extract Program Template from DOM
		var $mastertemplate = $('.programtemplate').detach();

		// Extract Pricing Options template from master template
		var $masterpricingtemplate = $mastertemplate.find('.pricetemplate').detach();

		// Remove template identifier from master template
		$mastertemplate.removeClass('.programtemplate');

		// Remove template identifier from master pricing template
		$masterpricingtemplate.removeClass('.pricetemplate');

		// Build Programs
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			var _loop = function _loop() {
				var program = _step.value;


				// Create working copy of template
				var $template = $mastertemplate.clone(true, true);

				// Place working copy of template into the DOM
				$('.programs').append($template);

				// Generate Bar Chart
				$template.find(".sales").each(function () {
					new Chart($(this), {
						type: 'bar',
						data: {
							labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
							datasets: [{
								backgroundColor: barColor1,
								data: program.Sales.PreviousYear
							}, {
								backgroundColor: barColor2,
								data: program.Sales.CurrentYear
							}]
						},
						options: barOptions
					});
				});

				// Generate top sparkline
				$template.find('.hardlinehere').each(function () {
					$(this).sparkline(program.Sales.CurrentYear, hard_sparkline_line_options);
				});

				// Place sales amount into DOM
				$template.find('.totalsales').text('$' + program.TotalMonthlySales.format());

				// Place title into DOM
				$template.find('.title').text(program.Name);

				// Build Pricing Options
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = pricingOptions[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var option = _step2.value;


						// Make sure that the pricing option belongs to the program
						if (option.ProgramID == program.ProgramID) {

							// Create working copy of template
							var $pricetemplate = $masterpricingtemplate.clone(true, true);

							// Place working copy into DOM
							$template.find('.prices').append($pricetemplate);

							// Place price into DOM
							$pricetemplate.find('.price').text("$" + option.Sales.format());

							// Place Pricing Option Name into DOM
							$pricetemplate.find('.name').text(option.Name);
						}
					}

					// Generate pricing option sparklines
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				$template.find('.softlinehere').each(function () {
					$(this).sparkline(get_random_sparkline(), soft_sparkline_line_options);
				});
			};

			for (var _iterator = programs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				_loop();
			}

			// Page is built, place triggers on top of it
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		pageBuilt();
	}

	function pageBuilt() {

		// Handle clicking a "more" link
		$('.toggle').click(function (e) {

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
		$('.menu a').click(function (e) {
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
			$(".submenu ul[data-parentmenu='" + $(this).data('menu') + "']").show();
		});
	}

	$('button.edit').click(function () {
		//analytics
		ga('send', 'event', 'Edit Button', 'clicked', 'Urban Yoga');
	});

	$('button.newprogrambtn').click(function () {
		//analytics
		ga('send', 'event', 'New Program Button', 'clicked', 'Urban Yoga');
	});
});
