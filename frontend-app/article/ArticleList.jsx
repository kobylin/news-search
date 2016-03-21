import _ from 'underscore';
import Article from './Article';

export default React.createClass({

	getDefaultProps () {
		return {
			url: '',
			filter: {},
			staticFilter: {
				// nostopwords: 1,
				// wholeWord: 1
			},
		}
	},

	getInitialState() {
		return {
			articles: [],
			meta: {

			}
		}
	},

	componentWillReceiveProps (nextProps) {
		// console.log('ArticleList:componentWillReceiveProps', nextProps);
		var filter = _.extend({}, this.props.staticFilter, nextProps.filter);

		this.searchArticles(nextProps.url, nextProps.filter).then((result) => {
			this.setState({
				articles: result.items,
				meta: result.meta
			});
		});
	},

	searchArticles(url, filter) {
		return $.ajax({
			method: 'GET',
			url: url,
			data: filter,
			error: (result) => {
				console.log(result);
			}			
		});
	},

	goNext () {
		var nextPos = this.state.meta.offset + this.state.meta.size;
		if(nextPos < this.state.meta.count) {
			this.searchArticles(_.extend({},this.props.filter, {
				offset: nextPos,
			})).then((result) => {
				this.setState({
					articles: result.items,
					meta: result.meta
				});
			});
		}
	},

	goPrev () {
		var prevPos = this.state.meta.offset - this.state.meta.size;
		if(prevPos >= 0) {
			this.searchArticles(_.extend({},this.props.filter, {
				offset: prevPos,
			})).then((result) => {
				this.setState({
					articles: result.items,
					meta: result.meta
				});
			});
		}
	},

	// componentWillUpdate (nextProps, nextState) {
	// 	console.log('ArticleList: nextProps', nextProps, 'nextState', nextState);
	// },
	
	render() {
		var articles = _.map(this.state.articles, (art) => {
			return (
				<Article data={art} key={art._id}/>
			)
		});

		return (
			<div className="ArticleList">
				<ul>
					{articles}
				</ul>
				<div>
					Total: {this.state.meta.count}, offset {this.state.meta.offset}
				</div>
				<a onClick={this.goPrev} href="#">Prev</a>
				<br/>
				<a onClick={this.goNext} href="#">Next</a>
			</div>
		)
	}
});