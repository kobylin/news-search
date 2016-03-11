import d3 from 'd3';
import _ from 'underscore';

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
				top: 20,
				right: 20,
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

		var sourceColorScale = d3.scale.ordinal()
			.domain(sourceNames)
			.range(d3.scale.category10().range());


		normalizedData = _.values(normalizedData);
		normalizedData = _.sortBy(normalizedData, 'date');

		console.log(normalizedData);

		var timeRange = d3.extent(normalizedData, function(d) {
			return d.date
		});
		var mothsInRange = (timeRange[1] - timeRange[0]) / monthInMsec;
		var yearsInRange = Math.ceil(mothsInRange / 12) + 1;
		var barWidth = Math.round(width / (mothsInRange + 4 /*two month that we added at the bottom*/ )) - 1;
		var axisTimeRange = [+timeRange[0] - monthInMsec, +timeRange[1] + monthInMsec];
		var x = d3.time.scale()
			.domain(axisTimeRange)
			.range([0, plotWidth]);

		var y = d3.scale.linear()
			.domain([0, d3.max(normalizedData, function(w) {
				var localMax = d3.max(w.sources, (s) => {
					return s.count
				});
				return localMax;
			})])
			.range([plotHeight, 0]);


		var xAxisMonth = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.ticks(15)
			.tickFormat(d3.time.format("%m"));

		var xAxisYear = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.ticks(yearsInRange)
			.tickFormat(d3.time.format("%Y"));

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");
		// .ticks(10)
		// .tickFormat(d3.time.format("%m.%y"));

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
				return "translate(" + (x(d.date) - barWidth / 2) + ", 0)";
			});

		barGroupBinded
			.on('mouseover', function(d) {
				var tooltip = [];
				_.each(d.sources, (s) => {
					return tooltip.push(`${s.sourceName}:${s.count}`);
				});
				tooltip = tooltip.join(',');

				barTooltip.style('visibility', 'visible');
				barTooltip
					.attr('text-anchor', 'center')
					.attr("x", x(d.date))
					.attr("y", y(d3.max(d.sources, (s) => {
						return s.count;
					})))
					.attr("dx", '1em')
					.attr("dy", '-2px')
					.text(tooltip);
			})
			.on('mouseout', function(d) {
				barTooltip.style('visibility', 'hidden');
			});

		var barBinded = barGroupBinded
			.selectAll('.bar')
			.data((d) => {
				return d.sources;
			});

		barBinded.enter()
			.append('rect')
			.attr('class', 'bar')
			.style('fill-opacity', 0.5)
			.style('fill', (d) => {
				return sourceColorScale(d.sourceName);
			})
			.style('stroke', 'black')
			.attr('text', (d) => {
				return d.count;
			});

		barBinded
			.attr("y", function(d) {
				return y(d.count)
			})
			.attr("width", function(d) {
				return barWidth || 0;
			})
			.attr("height", function(d) {
				return plotHeight - y(d.count);
			});

		return;

		// barBinded.exit().remove();
		// barBinded.enter().append("g")
		// 	.attr('class', 'bar-group')
		// // .append("rect") ?????;

		// plot.select('.bars-container')
		// 	.selectAll(".bar-group")
		// 	.attr("transform", function(d, i) {
		// 		return "translate(" + (x(d.date) - barWidth / 2) + ", 0)";
		// 	});

		// plot.select('.bars-container').selectAll(".bar-group")
		// .select("rect")
		// ???????
		// .attr('class', 'count')
		// 	.attr("height", 0)
		// 	.on('mouseover', function(d) {
		// 			var tooltip = _.reduce(d.sources, (memo, s) => {
		// 				return `${memo}, ${s.sourceName}:${s.count}`;
		// 			}, '');

		// 			barTooltip.style('visibility', 'visible');
		// 			barTooltip
		// 				.attr('text-anchor', 'end')
		// 				.attr("x", x(d.date))
		// 				.attr("y", d3.max(d.sources, (s) => {
		// 						return s.count
		// 					})
		// 					.attr("dx", '1em')
		// 					.attr("dy", '-2px')
		// 					.text(tooltip);
		// 			})
		// 		.on('mouseout', function(d) {
		// 			barTooltip.style('visibility', 'hidden');
		// 		})
		// 		.on('click', function(d) {
		// 			if (scope.onBarClick)
		// 				scope.onBarClick({
		// 					event: d3.event,
		// 					d: d
		// 				});
		// 		})
		// 		.transition()
		// 		.attr("y", function(d) {
		// 			return y(d.count)
		// 		})
		// 		.attr("width", function(d) {
		// 			return barWidth || 0;
		// 		})
		// 		.attr("height", function(d) {
		// 			return plotHeight - y(d.count);
		// 		});

	}

	update(data) {

	}

}

export
default DistributionChartManySourcesD3;