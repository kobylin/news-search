/** @jsx React.DOM */
'use strict'
var React = require('react')
var ReactDOM = require('react-dom')
//var UserGist = require('./UserGist')
var ArticleList = require('./ArticleList')

//ReactDOM.render(<Hello />, document.getElementById('content'))


ReactDOM.render(
    <ArticleList/>,
    document.getElementById('content')
);