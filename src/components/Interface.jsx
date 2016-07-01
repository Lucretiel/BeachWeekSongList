import debounce from 'lodash.debounce'
import React from "react"
import { connect } from 'react-redux'

import { setSearch, showDisabled } from '../store/actions.jsx'

const { func } = React.PropTypes

const Interface = React.createClass({
	propTypes: {
		setSearch: func.isRequired,
		showDisabled: func.isRequired
	},

	render() {
		return (
			<div className="search-interface">
				<form>
					<div className="form-group">
						<input
							type="text"
							className='form-control'
							onChange={event => this.props.setSearch(event.target.value)}
							placeholder="Search"
						/>
					</div>
					<div className="form-group">
						<div className="checkbox">
							<label>
								<input
									type="checkbox"
									onChange={event=>this.props.showDisabled(event.target.checked)} />
								Show nonfree
							</label>
						</div>
					</div>
				</form>
			</div>
		)
	}
})

export default connect(
	null,
	{ setSearch, showDisabled }
)(Interface)
