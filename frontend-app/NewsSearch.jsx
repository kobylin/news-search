import _ from 'underscore';
import NewsFilters from './NewsFilters';
import DistributionChart from './DistributionChart';
import WordCloud from './WordCloud';
import ArticleList from './ArticleList';

export default React.createClass({
	
	// mixins: [RouteHandler],
	
	getDefaultProps () {
		return {
			enabled: {}
		}
	},

	getInitialState() {
		return {
			filter: {
				from: +new Date(2014, 0),
				groupBySource: 1
				// sourceName: 'korrespondent'
			},
			url: ''
		};
	},

	handleFilterChanged (filter) {
		var chart1filter = {
				from: +new Date(2014, 0),
				groupBySource: 1,
				// wholeWord: 1
				// sourceName: 'korrespondent'
		};

		console.log('filter', filter);
		this.setState({
			filter: _.extend({}, filter, chart1filter)
		});
	},

	handleWordCloudClick (data) {
		this.setState({
			url: '/words_distribution/articles',
			filter: {
				q: data.word
			}
		});
	},

	render () {

		var chart2filter = {
				from: +new Date(2014, 0),
				sourceName: 'pravda',
		};
				// <DistributionChart filter={this.state.filter}/>
				// <WordCloud />
				// 
		var enabledComponents = [];
		var url;
		if(this.props.route.enabled.wordCloud)  {
			enabledComponents.push(
				<WordCloud onWordClick={this.handleWordCloudClick} key="wc"/>
			);
			url = '/words_distribution/articles';
		}
		if(this.props.route.enabled.distributionChart)  {
			enabledComponents.push(
				<DistributionChart filter={this.state.filter}  key="dc"/>
			);
			url = '/articles';
		}

		return(
			<div className="NewsSearch">
				<NewsFilters onFilterChanged={this.handleFilterChanged}/>
				{enabledComponents}
				<h1>{this.state.filter.q}</h1>
				<ArticleList filter={this.state.filter} url={url}/>
			</div>
		)
	}
});