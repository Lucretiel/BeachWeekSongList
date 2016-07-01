import map from 'lodash.map'
import reject from 'lodash.reject'
import filter from 'lodash.filter'
import isEmpty from 'lodash.isempty'
import take from 'lodash.take'

import { createSelector } from 'reselect'

import SearchMatcher from '../searchMatcher.jsx'
// Selectors

/*
Quick data folow reference

All Songs --> Non-disabled songs --> searched songs --> unselected songs \.
          `----------------> Selected Songs --------------------------------> Final list -> culled list

TODO: technically, any ordering of the top 3 filter steps is accurate. Do some
profiling to see which is the fastest for common cases.

Also maybe see if you can get some generators or other lazy sequences in here.
It'd be nice if the take(100) at the end could auto-optimize the search to only
return the first 100 search results
*/
const songlistSelector = state => state.songlist
const selectedSetSelector = state => state.selectedSet
const selectedSongSelector = createSelector(
	songlistSelector,
	selectedSetSelector,
	(songs, selected) => isEmpty(selected) ? [] : filter(songs, song => selected[song.id])
)
const showDisabledSelector = state => state.showDisabled
const nonDisabledSongSelector = createSelector(
	songlistSelector,
	showDisabledSelector,
	(songs, showDisabled) => showDisabled ? songs : reject(songs, song => songs.disabled)
)
const searchTextSelector = state => state.searchText
const searchMatcherSelector = createSelector(
	searchTextSelector,
	searchText => SearchMatcher(searchText)
)
const matchingSongs = createSelector(
	nonDisabledSongSelector,
	searchMatcherSelector,
	(songs, matcher) => matcher === null ? songs : filter(songs, matcher)
)
const unselectedSongSelector = createSelector(
	matchingSongs,
	selectedSetSelector,
	(songs, selected) => isEmpty(selected) ? songs : reject(songs, song => selected[song.id])
)
const finalSongSelector = createSelector(
	selectedSongSelector,
	unselectedSongSelector,
	(selected, rest) => [
		...map(selected, song => ({...song, selected: true})),
		...map(rest, song => ({...song, selected: false}))
	]
)
export const cappedSongSelector = createSelector(
	finalSongSelector,
	songs => take(songs, 100)
)

export const haveSongsSelector = state => state.songlist !== null ? true : false
