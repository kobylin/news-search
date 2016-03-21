import DistributionChartManySourcesD3 from './DistributionChartManySourcesD3';
import _ from 'underscore';
import ReactDOM from 'react-dom';

export
default React.createClass({

		getDefaultProps() {
			return {
				filterDefaults: {
					groupBySource: 1
				}
			}
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

			var filter = _.extend({}, this.props.filterDefaults, this.props.filter)

			this.searchDistribution(filter).then((result) => {
				this.chart.initChart(result);
			});
		},

		componentWillReceiveProps(nextProps) {
			console.log('DistributionChart.componentWillReceiveProps', nextProps);
			var self = this;
			var filter = _.extend({}, this.props.filterDefaults, nextProps.filter)

			this.searchDistribution(filter).then((result) => {
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

		render() {
			return ( 
				<div className = "DistributionChart"></div>
		)
	}
});