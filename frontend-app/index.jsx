import React from 'react';
import ReactDOM from 'react-dom';
import ArticleList from './ArticleList';
import NewsSearch from './NewsSearch';

require("!style!css!less!./NewsSearch.less");

var data = [
  {id: 1, author: "Pete Hunt", text: "This is one comment"},
  {id: 2, author: "Jordan Walke", text: "This is *another* comment"}
];

ReactDOM.render(
    <NewsSearch/>,
    document.getElementById('content')
);