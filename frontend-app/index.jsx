/** @jsx React.DOM */
'use strict'
var React = require('react')
var ReactDOM = require('react-dom')
var UserGist = require('./UserGist')

//ReactDOM.render(<Hello />, document.getElementById('content'))


ReactDOM.render(
    <UserGist source="https://api.github.com/users/octocat/gists" />,
    document.getElementById('content')
);