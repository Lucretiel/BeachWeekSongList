"use strict"

import React from 'react'
import classNames from 'classnames'
const {string, bool, number, func} = React.PropTypes

export default React.createClass({
	propTypes: {
		title: string.isRequired,
		artist: string.isRequired,
		source: string.isRequired,
		selected: bool.isRequired,
		idNumber: number.isRequired,
		clickCb: func.isRequired,
		disabled: bool.isRequired
	},

	render() {
		const {selected, disabled} = this.props
		const className = classNames({
			'info': selected,
			'disabled-song': !selected && disabled,
		})
		return (
			<tr className={className}>
				<td className="id-column" onClick={event=>this.props.clickCb()}>{this.props.idNumber}</td>
				<td className="data-column">{this.props.title}</td>
				<td className="data-column">{this.props.artist}</td>
				<td className="data-column">{this.props.source}</td>
			</tr>
		);
	},
});
