"use strict"

import map from "lodash.map"
import filter from "lodash.filter"
import take from "lodash.take"
import React from "react"
import { connect } from 'react-redux'

import mapSelectorsToProps from '../mapSelectorsToProps.jsx'
import SongHeaders from "./SongHeaders.jsx"
import SongRow from "./SongRow.jsx"

import { cappedSongSelector } from '../store/selectors.jsx'
import { selectSong, deselctSong } from '../store/actions.jsx'

const {shape, arrayOf, string, number, func, bool} = React.PropTypes


const SongList = React.createClass({
	propTypes: {
		songs: arrayOf(
			shape({
				title: string.isRequired,
				artist: string.isRequired,
				id: number.isRequired,
				source: string,
				disabled: bool,
				selected: bool.isRequired
			}).isRequired
		).isRequired,

		selectSong: func.isRequired,
		deselctSong: func.isRequired,
	},

	render() {
		return (
			<table className='table table-condensed table-striped table-bordered'>
				<thead>
					<SongHeaders/>
				</thead>
				<tbody>
					{map(this.props.songs, song =>
						<SongRow
							key={song.id}
							title={song.title}
							artist={song.artist}
							source={song.source || ""}
							idNumber={song.id}
							selected={song.selected}
							clickCb={song.selected ?
								() => deselctSong(song.id) :
								() => selectSong(song.id)
							}
							disabled={song.disabled || false}
						/>
					)}
				</tbody>
			</table>
		);
	}
})

export default connect(
	mapSelectorsToProps({ songs: cappedSongSelector }),
	{ selectSong, deselctSong }
)(SongList)
