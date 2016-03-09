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
			url: '/articles_distribution',
			data: {
				from: +new Date(2015, 0)
			}
		});
	},

	componentDidMount: function() {
    var el = ReactDOM.findDOMNode(this)
    this.chart = new DistributionChartD3(el, {
    	width: 800,
    	height: 600
    });

    this.searchDistribution().then((result) => {
	    this.chart.initChart(result);
    });
  },

	render() {
		return (
			<div className="DistributionChart">
			</div>
		)
	}
});