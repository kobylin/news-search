import DistributionChartD3 from './charts/DistributionChartD3';
import ReactDOM from 'react-dom';

export default React.createClass({
	getInitialState() {
		return {
			filter: {}
		}
	},

	componentWillReceiveProps (props) {
		console.log('DistributionChart.componentWillReceiveProps', props);
	
		this.searchDistribution(props.filter).then((result) => {
			this.chart.update(result);
		});
	},

	searchDistribution(filter) {
		return $.ajax({
			url: '/articles_distribution'
		})
	},

	componentDidMount: function() {
    var el = ReactDOM.findDOMNode(this)
    this.chart = new DistributionChart(el);
  },

	render() {
		return (
			<div className="DistributionChart">
			</div>
		)
	}
});