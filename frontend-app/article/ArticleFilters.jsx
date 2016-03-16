import _ from 'underscore';

export default React.createClass({
	getInitialState () {
		return {
			q: '',
			from: '',
			to: '',
		}
	},

	componentWillMount () {
		this.onFilterChangedDeb = _.debounce(this.props.onFilterChanged, 500);
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
			<div className="ArticlesFilter">
				<input type="date" placeholder="From" onChange={this.handleFrom}/>
				<input type="date" placeholder="To" onChange={this.handleTo}/>
				<input type="text" placeholder="Search..." onChange={this.handleQ}/>
			</div>
		)
	}
});
