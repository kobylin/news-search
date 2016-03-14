import WordCloudD3 from './charts/WordCloudD3';

import ReactDOM from 'react-dom';

export
default React.createClass({

		// componentWillReceiveProps(props) {
		// 	console.log('DistributionChart.componentWillReceiveProps', props);
		// 	var self = this;
		// 	this.searchDistribution(props.filter).then((result) => {
		// 		var el = ReactDOM.findDOMNode(self);
		// 		$(el).empty();
		// 		// debugger;
		// 		this.chart = new DistributionChartManySourcesD3(el, {
		// 			width: 800,
		// 			height: 600
		// 		});
		// 		self.chart.initChart(result);
		// 	});
		// },

		searchDistribution(filter = {}) {
			return $.ajax({
				url: '/words_distribution',
				data: filter
			});
		},

		componentDidMount: function() {
			var el = ReactDOM.findDOMNode(this)

			this.chart = new WordCloudD3(el, {
				width: 800,
				height: 600,
				onWordClick: this.props.onWordClick
			});

			this.searchDistribution({
				nostopwords: 1
			}).then((result) => {
				this.chart.initChart(result);
			});
		},

		render() {
			return ( 
				<div className="WordCloud"></div>
			)
	}
});