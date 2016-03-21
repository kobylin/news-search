import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, Redirect} from 'react-router';

import VisualizationPanelWc from './VisualizationPanelWc';
import VisualizationPanelDc from './VisualizationPanelDc';

    	// <Redirect from="/" to="/wc" />

ReactDOM.render((
    <Router history={hashHistory}>
    	<Route path="/wc" component={VisualizationPanelWc}/>
    	<Route path="/" component={VisualizationPanelDc}/>
		</Router>
		),document.getElementById('content')
);
