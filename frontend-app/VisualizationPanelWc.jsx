import _ from 'underscore';
import DistributionChart from './charts/DistributionChart';
import WordCloud from './charts/WordCloud';
import ArticleFilters from './article/ArticleFilters';
import ArticleList from './article/ArticleList';

require("!style!css!less!./VisualizationPanel.less");

export default React.createClass({

	getDefaultProps() {
		return {
			filterDefaults: {
				from: +new Date(2014, 0),
			}
		}
	},

	getInitialState() {
		return {
			articleFilters: this.props.filterDefaults
		};
	},

	handleFilterChanged(filter) {
		console.log('VisualizationPanel:handleFilterChanged', filter);
		this.setState({
			articleFilters: filter
		});
	},

	handleWordCloudClick(data) {
		this.setState({
			articleFilters: _.extend({}, this.state.articleFilters, {q: data.word})
		});
	},

	render() {
		window.FF = this;

		// <DistributionChart filter={this.state.filter}/>
		// <WordCloud />
		// 
		// var enabledComponents = [];
		// var url;
		// if (this.props.route.enabled.wordCloud) {
		// 	enabledComponents.push(<WordCloud onWordClick = {this.handleWordCloudClick} key = "wc"/>);
		// 	url = '/words_distribution/articles';
		// }
		// if (this.props.route.enabled.distributionChart) {
		// 	enabledComponents.push( < DistributionChart filter = {
		// 			this.state.filter
		// 		}
		// 		key = "dc" / >
		// 	);
		// 	url = '/articles';
		// }
				// 

		return (
			<div className="VisualizationPanel">
				<ArticleFilters onFilterChanged={this.handleFilterChanged}/>
				<WordCloud onWordClick={this.handleWordCloudClick} filter={this.state.articleFilters}/>
				<h1>{this.state.articleFilters.q}</h1>
				<ArticleList filter={this.state.articleFilters} url="/words_distribution/articles"/>
			</div>
		)
	}
});