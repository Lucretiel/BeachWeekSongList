"use strict";

import "bootstrap-webpack"
import "./style.css"

import ReactDOM from "react-dom"
import React from "react"
import App from "./components/App.jsx"

(function(root) {
	document.body.appendChild(root);
	ReactDOM.render(<App/>, root);
})(document.createElement('div'));
