"use strict"

import _ from 'underscore'
import React from 'react'
import SearchBar from './SearchBar.jsx'
import SongList from './SongList.jsx'
import SearchMatcher from '../searchMatcher.jsx'

const {string, number, arrayOf, shape, bool} = React.PropTypes

export default React.createClass({
	propTypes: {
		songs: arrayOf(
			shape({
				title: string.isRequired,
				artist: string.isRequired,
				id: number.isRequired,
				source: string,
				disabled: bool,
			}).isRequired
		).isRequired
	},

	getInitialState() {
		return {
			searchMatcher: null,
			showDisabled: false,
		}
	},

	updateSearch(text) {
		this.setState({searchMatcher: SearchMatcher(text)})
	},

	componentWillMount() {
		this.updateSearchPeriodically = _.debounce(text => this.updateSearch(text), 250)
	},

	setShowDisabled(showDisabled) {
		this.setState({showDisabled: showDisabled})
	},

	render() {
		return (
			<div className="container-fluid content">
				<h1 className="title">Beach Week Karaoke Song List</h1>
				<div className="row search-interface">
					<form>
						<div className="form-group">
							<SearchBar updateHandler={text=>this.updateSearchPeriodically(text)} />
						</div>
						<div className="form-group">
							<div className="checkbox">
								<label>
									<input type="checkbox" onChange={event=>this.setShowDisabled(event.target.checked)} />
									Show nonfree
								</label>
							</div>
						</div>
					</form>
				</div>
				<div className="row">
					<SongList
						songs={this.props.songs}
						searchMatcher={this.state.searchMatcher}
						showDisabled={this.state.showDisabled}
					/>
				</div>
			</div>
		);
	}
});
