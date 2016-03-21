import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, Redirect} from 'react-router';

import VisualizationPanelWc from './VisualizationPanelWc';

    	// <Redirect from="/" to="/wc" />
//
// <Route path="/wc" component={VisualizationPanel} enabled={{wordCloud:true}}/>
// <Route path="/dc" component={VisualizationPanel} enabled={{distributionChart:true}}/>


ReactDOM.render((
    <Router history={hashHistory}>
    	<Route path="/" component={VisualizationPanelWc}/>
		</Router>
		),document.getElementById('content')
);
