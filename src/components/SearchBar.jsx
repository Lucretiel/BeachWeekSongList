"use strict"

import React from 'react'
const {func} = React.PropTypes

//TODO: convert search params to separate class

export default React.createClass({
	propTypes: {
		updateHandler: func.isRequired
	},

	getInitialState() {
		return {text: ""};
	},

	update(text) {
		this.setState({text: text})
		this.props.updateHandler(text)
	},

	render() {
		return (
				<input
					type="text"
					className='form-control'
					value={this.state.text}
					onChange={event => this.update(event.target.value)}
					placeholder="Search"
				/>
		);
	}
});
