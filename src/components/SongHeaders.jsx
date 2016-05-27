"use strict"

import _ from 'underscore'
import React from 'react'
import classNames from 'classnames'
const {string, bool, func, oneOf} = React.PropTypes

const SortHeader = React.createClass({
	propTypes: {
		text: string.isRequired,
		reverse: bool,
		reSortCb: func.isRequired,
	},

	render() {
		const arrow = this.props.reverse !== null ?
			<span className={classNames(
				'glyphicon', 'sort-arrow',
				this.props.reverse ?
					'glyphicon-chevron-up' :
					'glyphicon-chevron-down'
			)} aria-hidden="true" /> : null;

		return (
			<th className="data-column" onClick={event => this.props.reSortCb()}>
				{this.props.text} {arrow}
			</th>)
	}
})

export default React.createClass({
	propsTypes: {
		sortColumn: oneOf(['artist', 'title']).isRequired,
		reverse: bool.isRequired,
		reSortCb: func.isRequired
	},

	columns: [{
		text: "Title",
		id: "title"
	}, {
		text: "Artist",
		id: "artist"
	}],

	render() {
		return (
			<tr>
				<th className="id-column">Song ID</th>
				{_.map(this.columns, column =>
					<SortHeader
						key={column.id}
						text={column.text}
						reverse={this.props.sortColumn == column.id ?
							this.props.reverse :
							null}
						reSortCb={() => this.props.reSortCb(column.id)}
					/>
				)}
				<th className="data-column">Source</th>
			</tr>)
	}
})
