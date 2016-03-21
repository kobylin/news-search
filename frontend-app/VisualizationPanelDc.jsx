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
				from: new Date(2014, 0).toString(),
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

	handleBarClick(data) {
		
	},

	render() {
		window.FF = this;

		return (
			<div className="VisualizationPanel">
				<ArticleFilters onFilterChanged={this.handleFilterChanged}/>
				<DistributionChart onBarClick={this.handleBarClick} filter={this.state.articleFilters}/>
				<h1>{this.state.articleFilters.q}</h1>
				<ArticleList filter={this.state.articleFilters} url="/articles"/>
			</div>
		)
	}
});