import { handleAction, handleActions } from 'redux-actions'
import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
import omit from 'lodash.omit'
import mapValues from 'lodash.mapvalues'

import SearchMatcher from '../searchMatcher.jsx'
import { addSongs, setSearch, selectSong, deselctSong, showDisabled} from './actions.jsx'

// Wrappers for handleAction and handleActions. Forward the payload to the
// reducer.
const passPayloadTo = reducer => (state, action) => reducer(state, action.payload)

const handlePayload = (actionType, reducer, defaultState) =>
	handleAction(actionType, passPayloadTo(reducer), defaultState)

const handlePayloads = (reducers, defaultState) =>
	handleActions(mapValues(reducers, reducer => passPayloadTo(reducer)), defaultState)

// Individual reducers
const songReducer = handlePayload(
	addSongs, (state, songlist) => songlist,
	null)

const searchReducer = handlePayload(
	setSearch, (state, searchText) => searchText,
	"")

const selectionReducer = handlePayloads({
	[selectSong]: (selected, songId) =>
		includes(selected, songId) ?
			selected :
			[...selected, songId],
	[deselctSong]: (selected, songId) =>
		includes(selected, songId) ?
			omit(selected, songId) :
			selected
	}, {})

const disabledReducer = handlePayload(
	showDisabled, (state, show) => show,
	false)

// Root reducer
export default combineReducers({
	songlist: songReducer,
	searchText: searchReducer,
	selectedSet: selectionReducer,
	showDisabled: disabledReducer
})
