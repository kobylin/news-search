import _ from 'underscore';

export default React.createClass({

	getDefaultProps() {
		return {
			onFilterChanged: () => {}
		};
	},

	getInitialState () {
		return {
			q: '',
			from: '',
			to: '',
		}
	},

	componentDidMount () {
		this.onFilterChangedDebounced = _.debounce(this.props.onFilterChanged, 500);
	},

	handleQ(event) {
		this.setState({
			q: event.target.value
		});
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

	shouldComponentUpdate (nextProps,nextState) {
		// console.log('shouldComponentUpdate:', nextProps, nextState);
		if(_.isEqual(this.state, nextState) && _.isEqual(this.props, nextProps)) {
			return false;
		}
		return true;
	},

	componentDidUpdate() {
		console.log('ArticlesFilter:componentDidUpdate', this.state);
		this.props.onFilterChanged(this.state);
	},

	render() {
		// console.log('ArticleFilters: render()');
		return (
			<div className="ArticlesFilter">
				<input type="date" placeholder="From" onChange={this.handleFrom}/>
				<input type="date" placeholder="To" onChange={this.handleTo}/>
				<input type="text" placeholder="Search..." onChange={this.handleQ}/>
			</div>
		)
	}
});
