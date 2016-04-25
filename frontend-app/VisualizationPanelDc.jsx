import _ from 'underscore';
import DistributionChart from './charts/DistributionChart';
import WordCloud from './charts/WordCloud';
import ArticleFilters from './article/ArticleFilters';
import ArticleList from './article/ArticleList';

require("!style!css!less!./VisualizationPanel.less");

export default React.createClass({

  getDefaultProps() {
    return {
      filterDefaults: {
        from: +new Date(2016, 0, 1),
        to: +new Date(2017, 0, 1)
      }
    }
  },

  getInitialState() {
    return {
      articleFilters: {},
      sources: []
    };
  },

  handleFilterChanged(filter) {
    console.log('VisualizationPanel:handleFilterChanged', filter);
    this.setState({
      articleFilters: filter
    });
  },

  componentWillMount() {
    $.ajax({
      url: '/articles/sources',
    }).then((result) => {
      this.setState({
        sources: result
      })
    })
  },

  handleBarClick(data) {
    
  },

  render() {
    return (
      <div className="VisualizationPanel">
        <ArticleFilters 
          from={this.props.filterDefaults.from} 
          to={this.props.filterDefaults.to} 
          sources={this.state.sources} 
          onFilterChanged={this.handleFilterChanged}/>
        <DistributionChart onBarClick={this.handleBarClick} filter={this.state.articleFilters}/>
        <ArticleList filter={this.state.articleFilters} url="/articles"/>
      </div>
    )
  }
});