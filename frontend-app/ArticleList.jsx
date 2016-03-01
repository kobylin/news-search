module.exports = React.createClass({
    getInitialState: function() {
        return {
            articles: []
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get('/articles', function (result) {
            this.setState({
                articles: result.result
            });
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    render: function() {
        return (
            <ul>
                for(var idx in this.state.articles) {
                    <li>this.state.articles[idx].title</li>
                }
            </ul>
        );
    }
});