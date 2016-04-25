import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, Redirect} from 'react-router';
import ArticleFilters from './article/ArticleFilters.jsx';

require("!style!css!less!./Main.less");

// import VisualizationPanelWc from './VisualizationPanelWc';
import VisualizationPanelDc from './VisualizationPanelDc';

      // <Redirect from="/" to="/wc" />

// ReactDOM.render((
//     <Router history={hashHistory}>
//      <Route path="/wc" component={VisualizationPanelWc}/>
//      <Route path="/" component={VisualizationPanelDc}/>
//    </Router>
//    ),document.getElementById('content')
// );

function showFilters(filters) {
  console.log('showFilters', filters);
}

ReactDOM.render((
   <VisualizationPanelDc/>
   ),$('.panel-body')[0]
);
