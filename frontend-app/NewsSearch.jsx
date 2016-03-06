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
		return(
			<div className="NewsSearch">
				<NewsFilters onFilterChanged={this.doSearch}/>
				<DistributionChart filter={this.state.filter}/>
				<ArticleList filter={this.state.filter}/>
			</div>
		)
	}
});