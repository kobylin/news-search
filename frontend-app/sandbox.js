import React from 'react';
import ReactDOM from 'react-dom';

var Filter = React.createClass({

  getDefaultProps () {
    console.log('getDefaultProps');
    return {
      // title: 'vasia',
      // name: 'dusik'
    }
  },

  getInitialState() {
    console.log('getInitialState', this.props, this.state);
    return {
      title: 'vasia',
      name: 'dusik'
    };
  },

  componentWillReceiveProps (a,b) {
    console.log('componentWillReceiveProps'. a,b);
  },

  // shouldComponentUpdate (a, b) {
  //  console.log('shouldComponentUpdate', a,b);
  // },

  onTextChange (e) {
    console.log(e.target);
    this.replaceState({name: 'pusik'});
    console.log('changedState',this.state);
  },

  render() {
    window.FF = this;
    console.log('render:state', this.state, 'is mounted', this.isMounted());
    return (
      <div className="Filter">
        Hello <b>{this.props.title}</b>
        <input type="text" onChange={this.onTextChange}/>
      </div>
    );
  }
});

ReactDOM.render((
  <Filter/>
),document.getElementById('content'));
