import marked from 'marked';

var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: this.props.data || []};
  },

  componentDidMount: function() { 
    
  },

  componentWillUpdate: function (nextProps,nextState) {
    console.log('CommentBox.componentWillUpdate', nextProps,nextState);
  },
  componentDidUpdate: function (prevProps,prevState) {
    console.log('CommentBox.componentDidUpdate',prevProps,prevState);
  },

  handleSubmittedComment: function(comment) {
  	comment.id = Math.random();
  	this.setState({
  		data: this.state.data.concat([comment])
  	})
  },

  render: function() {
    console.log('CommentBox.render');
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onSubmitComment={this.handleSubmittedComment} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
  	var commentNodes = this.props.data.map((comment) => {
			return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      );
  	});
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
 	getInitialState: function() {
    return {body: []};
  },

	handleSubmit: function(event) {
		event.preventDefault();

		this.props.onSubmitComment({
			text: this.state.body
		});
	},

	handleBody: function(event) {
		this.setState({
			body: event.target.value.substr(0, 14)
		});
	},

  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
      	<div>body: {this.state.body}</div>
        <input type="text" onChange={this.handleBody} value={this.state.body}/>
        <input type="submit"/>
      </form>
    );
  }
});

var Comment = React.createClass({
  getInitialState: function() {
    console.log('Comment.getInitialState');
    return {};
  },
  componentDidMount: function() { 
    console.log('Comment.componentDidMount');
  },
	rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },
  render: function() {
    console.log('Comment.render');
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

module.exports.CommentBox = CommentBox;