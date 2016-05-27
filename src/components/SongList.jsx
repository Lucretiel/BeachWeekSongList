"use strict"

import _ from "underscore"
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
			sortColumn: 'artist',
			sortReverse: false
		}
	},

	toggleSortFrom(column) {
		if (this.state.sortColumn === column) {
			this.setState({sortReverse: !this.state.sortReverse})
		} else {
			this.setState({sortColumn: column, sortReverse: false})
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
		const selectedId = this.selectedId

		return _.filter(songs, song =>
			(song.id === selectedId || searchMatcher(song)) && !disabled(song))
	},

	capSongs(songs) {
		return _.first(songs, 100)
	},

	special_rank(song) {
		const {sortReverse, selectedId} = this.state

		const rank = song.id === selectedId ? 0 : song.disabled ? 2 : 1;
		return sortReverse ? -rank : rank;
	},

	sortedSongs(songs) {
		const {sortColumn, sortReverse} = this.state
		let sorted = _.sortBy(songs, song=>[this.special_rank(song), song[sortColumn], song.id])
		if (sortReverse) sorted.reverse();
		return sorted;
	},

	render() {
		const songs = this.sortedSongs(this.capSongs(this.filteredSongs(this.props.songs)))

		return (
			<table className='table table-condensed table-striped table-bordered'>
				<thead>
					<SongHeaders
						sortColumn={this.state.sortColumn}
						reverse={this.state.sortReverse}
						reSortCb={column => this.toggleSortFrom(column)}
					/>
				</thead>
				<tbody>
					{_.map(songs, song =>
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
