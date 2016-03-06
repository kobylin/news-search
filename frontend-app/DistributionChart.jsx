export default React.createClass({
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