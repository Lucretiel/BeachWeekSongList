"use strict"

import map from "lodash.map"
import filter from "lodash.filter"
import take from "lodash.take"
import React from "react"
import SongHeaders from "./SongHeaders.jsx"
import SongRow from "./SongRow.jsx"
const {shape, arrayOf, string, number, func, bool} = React.PropTypes

//TODO: Split up the sorting, filtering, and selection into different components

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
		).isRequired,

		searchMatcher: func,
		showDisabled: bool.isRequired,
	},

	getInitialState() {
		return {
			selectedId: null,
		}
	},

	toggleSelection(selection) {
		if (this.state.selectedId === selection) {
			this.setState({selectedId: null})
		} else {
			this.setState({selectedId: selection})
		}
	},

	filteredSongs(songs) {
		const searchMatcher = this.props.searchMatcher || (song => true)
		const disabled = this.props.showDisabled ? (song => false) : (song => song.disabled)
		const selectedId = this.state.selectedId

		return filter(songs, song =>
			(song.id === selectedId || searchMatcher(song)) && !disabled(song))
	},

	capSongs(songs) {
		return take(songs, 100)
	},


	render() {
		const songs = this.capSongs(this.filteredSongs(this.props.songs))

		return (
			<table className='table table-condensed table-striped table-bordered'>
				<thead>
					<SongHeaders/>
				</thead>
				<tbody>
					{map(songs, song =>
						<SongRow
							key={song.id}
							title={song.title}
							artist={song.artist}
							source={song.source || ""}
							idNumber={song.id}
							selected={song.id === this.state.selectedId}
							clickCb={() => this.toggleSelection(song.id)}
							disabled={song.disabled || false}
						/>
					)}
				</tbody>
			</table>
		);
	}
});
