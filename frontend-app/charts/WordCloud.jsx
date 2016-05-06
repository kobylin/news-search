import WordCloudD3 from './WordCloudD3';
import ReactDOM from 'react-dom';
import _ from 'underscore';

export
default React.createClass({

    getDefaultProps() {
      return {
        staticFilter: {
          nostopwords: 1,
          // wholeWord: 1
        },
        filter: {

        }
      };
    },

    searchDistribution(filter = {}) {
      return $.ajax({
        url: '/words_distribution',
        data: filter
      });
    },

    componentDidMount: function() {
      var el = ReactDOM.findDOMNode(this)

      this.chart = new WordCloudD3(el, {
        width: 1200,
        height: 600,
        onWordClick: this.props.onWordClick
      });
      this.loadData();
    },

    componentDidUpdate () {
      console.log('WordCloud: componentDidUpdate');
      this.loadData();
    },

    loadData () {
      var filter = _.extend({}, this.props.staticFilter, this.props.filter);

      this.searchDistribution(filter)
        .then((result) => {
          this.chart.initChart(result);
        });
    },

    render() {
      console.log('WordCloud: render')
      return ( 
        <div className="WordCloud"></div>
      )
  }
});