"use strict"

import React from 'react'

export default React.createClass({
	render() {
		return (
			<tr>
				<th className="id-column">Song ID</th>
				<th className="data-column">Title</th>
				<th classname="data-column">Artist</th>
				<th className="data-column">Source</th>
			</tr>
		);
	}
})
