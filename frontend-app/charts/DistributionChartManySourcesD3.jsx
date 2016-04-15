import d3 from 'd3';
import _ from 'underscore';
require("!style!css!less!./DistributionChartD3.less");

class DistributionChartManySourcesD3 {
	getTemplate() {
		return `
			<svg class="distribution-chart">
			   <g class="plot">
			      <g class="x axis axis-month"></g>
			      <g class="x axis axis-year"></g>
			      <g class="y axis"></g>
			      <g class="bars-container"></g>
			      <text class="bar-tooltip"></text>
			   </g>
			   <g class="legend">
			   </g>
			</svg>
		`;
	}

	constructor(element, options = {}) {
		this.element = element;
		this.width = options.width;
		this.height = options.height;
	}

	initChart(wordsData) {
		console.log('data', wordsData);
		var monthInMsec = 60 * 60 * 24 * 30 * 1000;
		var width = this.width,
			height = this.height,
			margin = {
				top: 60,
				right: 120,
				bottom: 60,
				left: 50
			},
			plotWidth = width - (margin.right + margin.left),
			plotHeight = height - (margin.top + margin.bottom);

		var rootElement = d3.select(this.element);
		rootElement.html(this.getTemplate());

		var chart = rootElement.select(".distribution-chart")
			.attr("width", width)
			.attr("height", height);

		var plot = chart.select('.plot')
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var barTooltip = plot.select('.bar-tooltip');

		var legend = rootElement.select('.legend');
		legend.attr('transform', `translate(${width - 120}, 40)`)

		if (wordsData.length == 0) {
			plot.selectAll(".bar").remove();
			return;
		}

		var normalizedData = {};
		var sourceNames = [];
		_.each(wordsData, function(d) {
			var dateKey = d.date.year + '.' + d.date.month;

			if (!normalizedData[dateKey]) {
				normalizedData[dateKey] = {
					date: +new Date(d.date.year, d.date.month),
					sources: []
				};
			}
			normalizedData[dateKey].sources.push({
				count: d.count,
				sourceName: d.sourceName
			});
			if (sourceNames.indexOf(d.sourceName) === -1) {
				sourceNames.push(d.sourceName);
			}
		});

		// var colorRange = d3.scale.category10().range();
		// var darkerColorRange = colorRange.map(function(c) {return d3.rgb(c).darker(2).toString()} );

		// var sourceColorScale = d3.scale.ordinal()
		// 	.domain(sourceNames)
		// 	.range();

		// var darkerColorScale = 

		var legendItemBinded = legend.selectAll('.legend-item')
			.data(sourceNames);

		var legendItemNew = legendItemBinded.enter()
			.append('g')
			.attr('class', 'legend-item')
			.attr('transform', (d) => {
				return `translate(0, ${sourceNames.indexOf(d) * 20})`
			});
		legendItemNew.append('rect')
			.attr('width', 10)
			.attr('height', 10)
			.attr('class', (d) => {
				return 'source' + sourceNames.indexOf(d);
			});
		legendItemNew.append('text')
			.attr('dx', 15)
			.attr('dy', 10)
			.text(function(d) {
				return d;
			});

		normalizedData = _.values(normalizedData);
		normalizedData = _.sortBy(normalizedData, 'date');

		console.log(normalizedData);

		var timeRange = d3.extent(normalizedData, function(d) {
			return d.date;
		});
		var mothsInRange = Math.ceil((timeRange[1] - timeRange[0]) / monthInMsec);
		var yearsInRange = Math.ceil(mothsInRange / 12);
		var barGroupWidth = Math.round(width / (mothsInRange + 4 /*two month that we added at the bottom*/ )) - 1;
		var axisTimeRange = [+timeRange[0] - monthInMsec, +timeRange[1] + monthInMsec];
		var x = d3.time.scale()
			.domain(axisTimeRange)
			.range([0, plotWidth]);

		var y = d3.scale.linear()
			.domain([0, d3.max(normalizedData, function(w) {
				var localMax = d3.max(w.sources, (s) => {
					return s.count;
				});
				return localMax;
			})])
			.range([plotHeight, 0]);


		var xAxisMonth = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.ticks(mothsInRange)
			.tickFormat(d3.time.format("%m"));

		var xAxisYear = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.ticks(yearsInRange)
			.tickFormat(d3.time.format("%Y"));

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

		plot.select(".x.axis.axis-month")
			.attr("transform", "translate(0," + (plotHeight) + ")")
			.call(xAxisMonth);

		plot.select(".x.axis.axis-year")
			.attr("transform", "translate(0," + (plotHeight + 30) + ")")
			.call(xAxisYear);

		plot.select(".y.axis")
			.call(yAxis);

		var barGroupBinded = plot.select('.bars-container')
			.selectAll(".bar-group")
			.data(normalizedData, function(d) {
				var created = new Date(d.date);
				return created.getFullYear() + '' + created.getMonth();
			});

		barGroupBinded.enter()
			.append('g')
			.attr('class', 'bar-group');

		barGroupBinded
			.attr("transform", function(d, i) {
				return "translate(" + (x(d.date) - barGroupWidth / 2) + ", 0)";
			});

		barGroupBinded
			.on('mouseover', function(d) {
				d3.select(this).classed('selected', true);
				var tooltip = [];
				_.each(d.sources, (s) => {
					return tooltip.push(`${s.sourceName.substring(0,1)}:${s.count}`);
				});
				tooltip = tooltip.join('\n');

				var tooltipX = x(d.date) - barGroupWidth + barWidth;
				var tooltipY = y(d3.max(d.sources, (s) => {
					return s.count;
				}));

				barTooltip.style('visibility', 'visible');
				barTooltip
					.attr('text-anchor', 'center')
					.attr('transform', `translate(${tooltipX}, ${tooltipY - sourceNames.length * 20})`)

				var sourceValueBinded = barTooltip.selectAll('.source-value')
					.data(d.sources, d => d.sourceName);
				sourceValueBinded.enter()
					.append('tspan')
					.attr('class', 'source-value');

				sourceValueBinded
					.attr('class', function(d) {
						return d3.select(this).attr('class') + ' source' + sourceNames.indexOf(d.sourceName)
					})
					.attr('x', 0)
					.attr('y', (d) => {
						return `${sourceNames.indexOf(d.sourceName)*1.2}em`;
					})
					.text(d => d.count);
			})
			.on('mouseout', function(d) {
				barTooltip.style('visibility', 'hidden');
				d3.select(this).classed('selected', false);
			});

		var barBinded = barGroupBinded
			.selectAll('.bar')
			.data((d) => {
				return d.sources;
			}, (dd) => {
				return dd.sourceName;
			});

		barBinded.enter()
			.append('rect')
			.attr('class', 'bar')
		// .style('fill-opacity', 0.5)
		.attr('class', function(d) {
			return d3.select(this).attr('class') + ' source' + sourceNames.indexOf(d.sourceName)
		})
			.style('stroke', 'black')
			.attr('text', (d) => {
				return d.count;
			});

		var barWidth = barGroupWidth / (sourceNames.length + 1);

		barBinded
			.attr("y", function(d) {
				return y(d.count)
			})
			.attr('x', function(d) {
				return sourceNames.indexOf(d.sourceName) * barWidth;
			})
			.attr("width", function(d) {
				return barWidth;
			})
			.attr("height", function(d) {
				return plotHeight - y(d.count);
			});
	}

	update(data) {

	}

}

export
default DistributionChartManySourcesD3;