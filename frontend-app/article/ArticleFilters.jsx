import _ from 'underscore';
require("!style!css!less!./ArticleFilters.less");

export
default React.createClass({

  qTimeout: null,

  getDefaultProps() {
    return {
      onFilterChanged: () => {}
    };
  },

  getInitialState() {
    return {
      q: '',
      from: this.props.from,
      to: this.props.to,
      sources: this.props.sources
    }
  },

  // componentWillReceiveProps(nextProps) {
  //  this.setState(nextProps);
  // },

  componentDidMount() {
    var el = ReactDOM.findDOMNode(this);

    $(el).find('[name="date-picker"]').slider({
      min: this.props.from,
      max: this.props.to,
      value: [this.props.from, this.props.to],
      formatter: (value) => {
        if(!_.isArray(value)) return;
        return `${this.formatDate(value[0])} - ${this.formatDate(value[1])}`;
      }
    }).on('slideStop', (e) => {
      this.setState({
        from: e.value[0],
        to: e.value[1]
      })
    });

    $(el).find('.sources a').on('click', (event) => {
      var $input = $(event.currentTarget).find('input');
      $input.prop('checked', !$input.prop('checked'));

      var selectedSources = [];
      $(el).find('.sources input:checked').each((i, inp) => {
          return selectedSources.push($(inp).val());
      });

      this.setState({
        sources: selectedSources
      });

      return false;
    });
  },

  componentWillUnmount() {
    var el = ReactDOM.findDOMNode(this);

    $(el).find('[name="date-picker"]').slider('destroy');
    $(el).find('.sources a').off('click');
  },

  formatDate(timestamp) {
    var d = new Date(timestamp);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`; 
  },

  handleQ(event) {
    if(this.qTimeout) {
      clearTimeout(this.qTimeout);
    }

    const value = event.target.value;
    this.qTimeout = setTimeout(() => {
      this.setState({
        q: value
      });
      this.qTimeout = null;
    }, 500);
  },

  handleFrom(event) {
    this.setState({
      from: event.target.value
    });
  },

  handleTo(event) {
    this.setState({
      to: event.target.value
    });
  },

  shouldComponentUpdate(nextProps, nextState) {
    // console.log('shouldComponentUpdate:', nextProps, nextState);
    if (_.isEqual(this.state, nextState) && _.isEqual(this.props, nextProps)) {
      return false;
    }
    return true;
  },

  componentDidUpdate(a, b) {
    // console.log('ArticlesFilter:componentDidUpdate', this.state);
    this.props.onFilterChanged(this.state);
  },

  render() {
    var sources = this.props.sources.map((source) => {
      return <li key={source}>
                <a href="#" className="small"><input type="checkbox" value={source}/>&nbsp;{source}</a>
             </li>;
    });
    return (
      <div className = "ArticleFilters container-fluid">
        <div className="row">
          <div className="col-xs-4">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Search..." onChange={this.handleQ}/>
              <span className="input-group-addon">
                <span className="glyphicon glyphicon-search"></span>
              </span>
            </div>
          </div>
          <div className="col-xs-6 date-picker-column">
            <div className="slider-container">
              <span className="from-label">{this.formatDate(this.props.from)}</span>
              <input type="text" name="date-picker"/>
              <span className="to-label">{this.formatDate(this.props.to)}</span>
            </div>
            <div className="slider-value">
              {this.formatDate(this.state.from)} - {this.formatDate(this.state.to)}
            </div>
          </div>
          <div className="col-xs-2 sources-column">
            <div className="button-group">
              <button type="button" className="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown">
                <span>Sources</span>
                <span className="caret"></span>
              </button>
              <ul className="sources dropdown-menu">
                {sources}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
});


            
            
            
          