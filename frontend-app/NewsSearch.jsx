import _ from 'underscore';

export default React.createClass({
	getInitialState() {
		return {
			filter: {}
		};
	},

	doSearch (filter) {
		console.log('filter', filter);
		this.setState({
			filter: filter
		});
		// $.ajax({
		// 	method: 'GET',
		// 	url: 'http://localhost:3000/articles',
		// 	data: {
		// 		q: this.state.text
		// 	},
		// 	success: (result) => {
		// 		this.props.onFind(result);
		// 		console.log(result)
		// 	},
		// 	error: (result) => {
		// 		console.log(result);
		// 	}			
		// });
	},

	render () {
		return(
			<div className="NewsSearch">
				<NewsFilters onFilterChanged={this.doSearch}/>
				<DistributionChart filter={this.state.filter}/>
				<NewsList filter={this.state.filter}/>
			</div>
		)
	}
});

var NewsFilters = React.createClass({
	getInitialState () {
		return {
			q: '',
			from: '',
			to: '',
		}
	},

	componentWillMount () {
		this.onFilterChangedDeb = _.debounce(this.props.onFilterChanged, 1000);
	},

	handleQ(event) {
		this.setState(_.extend(this.state, {
			q: event.target.value
		}));
		this.onFilterChangedDeb(this.state);
	},

	handleFrom(event) {
		this.setState(_.extend(this.state, {
			from: event.target.value
		}));
		this.props.onFilterChanged(this.state);
	},

	handleTo(event) {
		this.setState(_.extend(this.state, {
			to: event.target.value
		}));
		this.props.onFilterChanged(this.state);
	},

	render() {

		return (
			<div className="NewsFilters">
				<input type="date" placeholder="From" onChange={this.handleFrom}/>
				<input type="date" placeholder="To" onChange={this.handleTo}/>
				<input type="text" placeholder="Search..." onChange={this.handleQ}/>
			</div>
		)
	}
});

var DistributionChart = React.createClass({
	getInitialState() {
		return {
			filter: {}
		}
	},

	componentWillReceiveProps (props) {
		console.log('DistributionChart.componentWillReceiveProps', props);
	},

	render() {
		return (
			<div className="DistributionChart">
			</div>
		)
	}
});

var NewsList = React.createClass({
	getInitialState() {
		return {
			filter: {}
		}
	},

	componentWillReceiveProps (props) {
		console.log('DistributionChart.componentWillReceiveProps', props);
	},
	
	render() {
		return (
			<div className="NewsList">
				Список Новостей
			</div>
		)
	}
});