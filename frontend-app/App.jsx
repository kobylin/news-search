import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';
import ArticleFilters from './article/ArticleFilters.jsx';
import classNames from 'classnames';

export default React.createClass({
	componentWillUnmount() {
		console.log('App:componentWillUnmount');
	},

	render() {
    console.log('App:', this);

    var routeName = this.props.routes[1] && this.props.routes[1].name;
    var pageName = routeName
                    // insert a space before all caps
                    .replace(/([A-Z])/g, ' $1')
                    // uppercase the first character
                    .replace(/^./, function(str){ return str.toUpperCase(); })
    return <div>
      <div className="left-bar">
        <h3>Tools</h3>
        <ul className="nav nav-pills nav-stacked">
          <li role="presentation" className={classNames({active: routeName == 'distributionChart'})}>
            <Link to="distributionChart">All search</Link>
          </li>
          <li role="presentation" className={classNames({active: routeName == 'wordCloud'})}>
            <Link to="wordCloud">Word Cloud</Link>
          </li>
        </ul>     
      </div>
      <div className="page">
        <h1 className="page-header">{pageName}</h1>
        <div className="panel panel-default">
          <div className="panel-body container-fluid">
            {this.props.children}
          </div>
        </div>
      </div>
    </div>;
  }
});