import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, Redirect, IndexRoute} from 'react-router';
import ArticleFilters from './article/ArticleFilters.jsx';

require("!style!css!less!./Main.less");

import App from './App';
import VisualizationPanelWc from './VisualizationPanelWc';
import VisualizationPanelDc from './VisualizationPanelDc';

const DistributionChart = React.createClass({
	componentWillUnmount() {
		// console.log('componentWillUnmount');
	},

	render() {
    return <div>
	    <h3>DistributionChart</h3>
    	{this.props.children}
    </div>;
  }
});

const WordCloud = React.createClass({
	render() {
    return <h3>WordCloud</h3>
  }
});

const Shit = React.createClass({
	render() {
    return <h4>Some shit</h4>
  }
});

ReactDOM.render((
   <Router history={hashHistory}>
   	<Route name="app" path="/" component={App}>
			<Route name="distributionChart" path="distributionChart" component={VisualizationPanelDc}/>
			<Route name="wordCloud" path="wordCloud" component={VisualizationPanelWc}/>
   	</Route>
     <Redirect from="/" to="distributionChart" />
   </Router>
   ), $('#wrapper')[0]
);