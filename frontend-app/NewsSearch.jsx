import _ from 'underscore';
import NewsFilters from './NewsFilters';
import DistributionChart from './DistributionChart';
import ArticleList from './ArticleList';

export default React.createClass({
	getInitialState() {
		return {
			filter: {}
		};
	},

	doSearch (filter) {
		console.log('filter', filter);
		this.setState({
			filter: filter
		});
		
	},

	render () {
		var chart1filter = {
				from: +new Date(2014, 0),
				groupBySource: 1
				// sourceName: 'korrespondent'
		};
		var chart2filter = {
				from: +new Date(2014, 0),
				sourceName: 'pravda',
		};

		return(
			<div className="NewsSearch">
				<NewsFilters onFilterChanged={this.doSearch}/>
				<DistributionChart filter={chart1filter}/>
				<ArticleList filter={this.state.filter}/>
			</div>
		)
	}
});