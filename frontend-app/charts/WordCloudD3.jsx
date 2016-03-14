import d3Cloud from 'd3-cloud';
import d3 from 'd3';
import _ from 'underscore';

class WordCloudD3 {
	getTemplate() {
		return `
		`;
	}

	constructor(element, options = {}) {
		this.element = element;
		this.width = options.width;
		this.height = options.height;
		this.onWordClick = options.onWordClick;
	}

	initChart(wordsData) {
		var self = this;
		var fill = d3.scale.category20();

		var domain = d3.extent(wordsData, (w) => {
			return w.count;
		});

		var sizeF = d3.scale.linear().domain(domain).range([2, 200]);

		var normalizedData = _.map(wordsData, (w) => {
			return {
				text: w.word,
				size: sizeF(w.count),
				origin: w
			};
		});

		var scale

		var layout = d3Cloud()
			.size([500, 500])
			.words(normalizedData)
			.padding(5)
			.rotate(function() {
				return~~ (Math.random() * 2) * 90;
			})
			.font("Impact")
			.fontSize(function(d) {
				return d.size;
			})
			.on("end", draw);

		layout.start();

		function draw(words) {
			d3.select(self.element)
				.append("svg")
				.attr("width", layout.size()[0])
				.attr("height", layout.size()[1])
				.append("g")
				.attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
				.selectAll("text")
				.data(words)
				.enter().append("text")
				.style("font-size", function(d) {
					return d.size + "px";
				})
				.style("font-family", "Impact")
				.style("fill", function(d, i) {
					return fill(i);
				})
				.attr("text-anchor", "middle")
				.attr("transform", function(d) {
					return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
				})
				.text(function(d) {
					return d.text;
				})
				.on('click', (d) => {
					console.log(d.origin);
					if(self.onWordClick) {
						self.onWordClick(d.origin);
					}
				});
		}
	}
}

export
default WordCloudD3;