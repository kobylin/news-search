import _ from 'underscore';
import Article from './Article';
require("!style!css!less!./ArticleList.less");

export default React.createClass({

  getDefaultProps () {
    return {
      url: '',
      filter: {},
      staticFilter: {
        // nostopwords: 1,
        // wholeWord: 1
      },
      meta: {
        size: 10
      }
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
    var filter = _.extend({}, this.props.staticFilter, nextProps.filter, this.props.meta);

    this.searchArticles(nextProps.url, filter).then((result) => {
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
      this.searchArticles(this.props.url, _.extend({},this.props.filter, {
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
      this.searchArticles(this.props.url, _.extend({},this.props.filter, {
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
  //  console.log('ArticleList: nextProps', nextProps, 'nextState', nextState);
  // },
  
  render() {
    var articles = _.map(this.state.articles, (art) => {
      return (
        <Article data={art} key={art._id} highlight={this.props.filter.q}/>
      );
    });

    return (
      <div className="ArticleList">
        <ul>
          {articles}
        </ul>
        <div>
          Total: {this.state.meta.count}, offset {this.state.meta.offset}
        </div>

        <ul className="pagination">
          <li className="page-item">
            <a className="page-link" aria-label="Previous" onClick={this.goPrev}>
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" aria-label="Next" onClick={this.goNext}>
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </div>
    )
  }
});