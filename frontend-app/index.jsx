import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';

import NewsSearch from './NewsSearch';

require("!style!css!less!./NewsSearch.less");

var data = [
  {id: 1, author: "Pete Hunt", text: "This is one comment"},
  {id: 2, author: "Jordan Walke", text: "This is *another* comment"}
];

var newsSearchCloud = (<NewsSearch/>);
var newsSearchDistribution = (<NewsSearch/>);

// var routes = ();

// Router.run(routes, function(Handler) {  
//     React.render(<Handler />, document.getElementById('content'));
// });

// const routes = (
//   <Route>
//     <Route path='*' handler={NewsSearch} />
//   </Route>
// )

// Router.run(routes, Router.HashLocation, (Root) => {
//   React.render(<Root />, document.getElementById('content'))
// })
ReactDOM.render((
    <Router history={hashHistory}>
    	<Route path="/wc" component={NewsSearch} enabled={{wordCloud:true}}/>
    	<Route path="/dc" component={NewsSearch} enabled={{distributionChart:true}}/>
		</Router>
		),document.getElementById('content')
);

// <NewsSearch>