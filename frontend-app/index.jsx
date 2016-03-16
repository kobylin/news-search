import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, Redirect} from 'react-router';

import VisualizationPanel from './VisualizationPanel';

require("!style!css!less!./VisualizationPanel.less");

ReactDOM.render((
    <Router history={hashHistory}>
    	<Redirect from="/" to="/wc" />
    	<Route path="/wc" component={VisualizationPanel} enabled={{wordCloud:true}}/>
    	<Route path="/dc" component={VisualizationPanel} enabled={{distributionChart:true}}/>
		</Router>
		),document.getElementById('content')
);
