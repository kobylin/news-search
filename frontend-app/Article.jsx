import _ from 'underscore';

export default React.createClass({
	getInitialState() {
		return {
		}
	},

	render() {
		var date = new Date(this.props.data.created);
		var formatedDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getMinutes()}:${date.getHours()}`;

		return (
			<li className="Article">
				<b>{formatedDate}</b>
				<span> </span>
				<a href={this.props.data.link}>{this.props.data.title}</a><br/>
				<span>{this.props.data.text}</span>
			</li>
		)
	}
});