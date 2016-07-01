import { createAction } from 'redux-actions'

// Actions
export const addSongs = createAction("ADD_SONGS")
export const setSearch = createAction("SET_SEARCH")
export const selectSong = createAction("SELECT_SONG")
export const deselctSong = createAction("DESELECT_SONG")
export const showDisabled = createAction("SET_DISABLED_VISIBLE")
