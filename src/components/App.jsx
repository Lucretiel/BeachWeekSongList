"use strict"

import debounce from 'lodash.debounce'
import React from 'react'
import SearchBar from './SearchBar.jsx'
import SongList from './SongList.jsx'
import SearchMatcher from '../searchMatcher.jsx'

const {string, number, arrayOf, shape, bool} = React.PropTypes

export default React.createClass({
	propTypes: {},

	getInitialState() {
		return {
			songs: null,
			searchMatcher: null,
			showDisabled: false,
		}
	},

	updateSearch(text) {
		this.setState({searchMatcher: SearchMatcher(text)})
	},

	componentWillMount() {
		this.updateSearchPeriodically = debounce(text => this.updateSearch(text), 100)
	},

	componentDidMount() {
		require(["../data/songlist.json"], songs => {
			this.setState({songs: songs})
		})
	},

	setShowDisabled(showDisabled) {
		this.setState({showDisabled: showDisabled})
	},

	render() {
		const songlist = this.state.songs === null ?
			<div className="loading">Loading song list...</div> :
			<SongList
						songs={this.state.songs}
						searchMatcher={this.state.searchMatcher}
						showDisabled={this.state.showDisabled}
			/>

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
					{songlist}
				</div>
			</div>
		);
	}
});
