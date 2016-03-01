var Article = React.createClass({
  render:function() {
    return (<li>{this.props.title}</li>);
  }
});

module.exports = React.createClass({
    getInitialState: function() {
        return {
            articles: [
                {title: 'vah'},
                {title: 'vah'},
                {title: 'vah'},
                {title: 'vah'}
            ]
        };
    },

    componentDidMount: function() {
        // this.serverRequest = $.get('/articles', function (result) {
        //     this.setState({
        //         articles: result.result
        //     });
        // }.bind(this));
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    render: function() {
        let articles = [];
        this.state.articles.forEach((art, idx) => {
            articles.push(<Article title={art.title} key={idx}/>);
        });
        return (<ul>{articles}</ul>);
    }
});