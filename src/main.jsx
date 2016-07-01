"use strict";

import "bootstrap-webpack"
import "./style.css"

import React from "react"
import { render } from "react-dom"
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import App from "./components/App.jsx"
import rootReducer from "./store/reducers.jsx"
import { addSongs } from "./store/actions.jsx"

(() => {
	let store = createStore(rootReducer)

	require(["./data/songlist.json"], songs => {
		store.dispatch(addSongs(songs))
	})

	render(
		<Provider store={store}>
			<App/>
		</Provider>,
		document.body.appendChild(
			document.createElement('div')))
})()

