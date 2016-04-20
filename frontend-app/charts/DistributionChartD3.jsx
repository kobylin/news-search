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
		const monthInMsec = 60 * 60 * 24 * 30 * 1000;
		const width = this.width,
			height = this.height,
			margin = {
				top: 60,
				right: 120,
				bottom: 60,
				left: 50
			},
			plotWidth = width - (margin.right + margin.left),
			plotHeight = height - (margin.top + margin.bottom);
		const legendRectWidth = 20;

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
					date: +new Date(d.date.year, d.date.month - 1),
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

		console.log('normalizedData: ', normalizedData);
		normalizedData = _.values(normalizedData);
		normalizedData = _.sortBy(normalizedData, 'date');

		var legendItemBinded = legend.selectAll('.legend-item')
			.data(sourceNames);

		var legendItemNew = legendItemBinded.enter()
			.append('g')
			.attr('class', 'legend-item')
			.attr('transform', (d) => {
				return `translate(0, ${sourceNames.indexOf(d) * legendRectWidth * 2})`
			});
		legendItemNew.append('rect')
			.attr('width', legendRectWidth)
			.attr('height', legendRectWidth)
			.attr('class', (d) => {
				return 'source' + sourceNames.indexOf(d);
			});
		legendItemNew.append('text')
			.attr('dx', legendRectWidth + 5)
			.attr('dy', legendRectWidth)
			.text(function(d) {
				return d;
			});

		var timeRange = d3.extent(normalizedData, function(d) {
			return d.date;
		});
		var mothsInRange = Math.ceil((timeRange[1] - timeRange[0]) / monthInMsec);
		mothsInRange = mothsInRange < 2 ? 2 : mothsInRange;
		var yearsInRange = Math.ceil(mothsInRange / 12);
		var barGroupWidth = Math.round(width / (mothsInRange + 0 /*two month that we added at the bottom*/ ));
		var axisTimeRange = [timeRange[0], timeRange[1] + monthInMsec];
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
				return `translate(${x(d.date)}, 0)`;
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
				var yy = y(d.count);
				if(plotHeight - yy < 30) {
					return plotHeight - 30;
				} 
				return yy;
			})
			.attr('x', function(d) {
				return sourceNames.indexOf(d.sourceName) * barWidth;
			})
			.attr("width", function(d) {
				return barWidth;
			})
			.attr("height", function(d) {
				if(plotHeight - y(d.count) < 30) {
					return 30;
				}
				return plotHeight - y(d.count);
			});

		barGroupBinded
			.on('mouseover', function(d) {
				d3.select(this).classed('selected', true);
				var tooltip = [];
				_.each(d.sources, (s) => {
					return tooltip.push(`${s.sourceName.substring(0,1)}:${s.count}`);
				});
				tooltip = tooltip.join('\n');

				var tooltipX = x(d.date);
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
	}

	update(data) {

	}

}

export
default DistributionChartManySourcesD3;