import React from 'react';
import ReactDOM from 'react-dom';
import ArticleList from './ArticleList';
import comments from './CommentBox';

var data = [
  {id: 1, author: "Pete Hunt", text: "This is one comment"},
  {id: 2, author: "Jordan Walke", text: "This is *another* comment"}
];

ReactDOM.render(
    <comments.CommentBox data={data}/>,
    document.getElementById('content')
);