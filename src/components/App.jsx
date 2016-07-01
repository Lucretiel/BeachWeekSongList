"use strict"

import debounce from 'lodash.debounce'
import React from 'react'
import { connect } from 'react-redux'

import mapSelectorsToProps from '../mapSelectorsToProps.jsx'
import Interface from './Interface.jsx'
import SongList from './SongList.jsx'
import { haveSongsSelector } from '../store/selectors.jsx'

const {string, number, arrayOf, shape, bool} = React.PropTypes

const App = React.createClass({
	propTypes: {
		haveSongs: bool.isRequired
	},

	render() {
		const songlist = this.props.haveSongs ?
			<SongList /> :
			<div className="loading">
				Loading song list...
			</div>

		return (
			<div className="container-fluid content">
				<h1 className="title">Beach Week Karaoke Song List</h1>
				<div className="row">
					<Interface />
				</div>
				<div className="row">
					{songlist}
				</div>
			</div>
		)
	}
})

export default connect(
	mapSelectorsToProps({ haveSongs: haveSongsSelector })
)(App)
