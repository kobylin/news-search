import _ from 'underscore';
import NewsFilters from './NewsFilters';
import DistributionChart from './DistributionChart';
import ArticleList from './ArticleList';

export default React.createClass({
	getInitialState() {
		return {
			filter: {
				from: +new Date(2014, 0),
				groupBySource: 1
				// sourceName: 'korrespondent'
			}
		};
	},

	handleFilterChanged (filter) {
		var chart1filter = {
				from: +new Date(2014, 0),
				groupBySource: 1
				// sourceName: 'korrespondent'
		};

		console.log('filter', filter);
		this.setState({
			filter: _.extend({}, filter, chart1filter)
		});
	},

	render () {

		var chart2filter = {
				from: +new Date(2014, 0),
				sourceName: 'pravda',
		};

		return(
			<div className="NewsSearch">
				<NewsFilters onFilterChanged={this.handleFilterChanged}/>
				<DistributionChart filter={this.state.filter}/>
				<ArticleList filter={this.state.filter}/>
			</div>
		)
	}
});