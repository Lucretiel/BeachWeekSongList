const webpack = require('webpack')
const config = require("./webpack.config.js")
const merge = require('webpack-merge')
const validate = require('webpack-validator')

module.exports = validate(merge(config, {
	output: {path: "dist.prod"},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"'
		})
	]
}))
