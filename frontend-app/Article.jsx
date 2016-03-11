import _ from 'underscore';

export default React.createClass({
	getInitialState() {
		return {
		}
	},

	render() {
		var date = new Date(this.props.data.created);
		return (
			<li className="Article">
				<b>{date.toLocaleDateString()} - {date.toTimeString()}</b>
				<b>{this.props.data.title}</b>
				<span>{this.props.data.text}</span>
			</li>
		)
	}
});