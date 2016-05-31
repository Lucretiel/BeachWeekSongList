"use strict";

import "bootstrap"
import "bootstrap-webpack"
import "./style.css"

import ReactDOM from "react-dom"
import React from "react"
import App from "./components/App.jsx"
import songlist from "./data/songlist.json"

(function(root) {
	document.body.appendChild(root);
	ReactDOM.render(<App songs={songlist}/>, root);
})(document.createElement('div'));
