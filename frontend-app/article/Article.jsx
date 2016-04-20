import _ from 'underscore';
require("!style!css!less!./Article.less");

export default React.createClass({
	getInitialState() {
		return {
		}
	},

	highlightText (html, textToHighlight) {
		var replacement = new RegExp(`(${textToHighlight})`, 'gi');
		return {
			__html: html.replace(replacement, `<span class="highlighted-text">$1</span>`)
		};
	},

	render() {
		var date = new Date(this.props.data.created);
		var formatedDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getMinutes()}:${date.getHours()}`;

		return (
			<li className="Article">
				<b>{formatedDate}</b>
				<span> </span>
				<a href={this.props.data.link}
					dangerouslySetInnerHTML={this.highlightText(this.props.data.title, this.props.highlight)}></a>
				<br/>
				<span dangerouslySetInnerHTML={this.highlightText(this.props.data.text, this.props.highlight)}></span>
			</li>
		)
	}
});