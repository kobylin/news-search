import _ from 'underscore';

export default React.createClass({
	getInitialState() {
		return {
		}
	},

	render() {
		
		return (
			<li className="Article">
				<b>{this.props.data.title}</b>
				<span>{this.props.data.text}</span>
			</li>
		)
	}
});