// import DistributionChartD3 from './charts/DistributionChartD3';
import DistributionChartManySourcesD3 from './DistributionChartManySourcesD3';

import ReactDOM from 'react-dom';

export
default React.createClass({
		// getInitialState() {
		// 	return {
		// 		filter: {}
		// 	}
		// },

		componentWillReceiveProps(props) {
			console.log('DistributionChart.componentWillReceiveProps', props);
			var self = this;
			this.searchDistribution(props.filter).then((result) => {
				var el = ReactDOM.findDOMNode(self);
				$(el).empty();
				// debugger;
				this.chart = new DistributionChartManySourcesD3(el, {
					width: 800,
					height: 600
				});
				self.chart.initChart(result);
			});
		},

		searchDistribution(filter) {
			return $.ajax({
				url: '/articles_distribution',
				data: filter
			});
		},

		componentDidMount: function() {
			var el = ReactDOM.findDOMNode(this)

			this.chart = new DistributionChartManySourcesD3(el, {
				width: 800,
				height: 600
			});

			this.searchDistribution(this.props.filter).then((result) => {
				this.chart.initChart(result);
			});
		},

		render() {
			return ( 
				<div className = "DistributionChart"></div>
		)
	}
});