const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const validate = require('webpack-validator')

module.exports = validate({
	entry: './src/main.jsx',
	output: {
		path: 'dist',
		filename: 'bundle.js'
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "Beach Week Karaoke Song Finder",
			favicon: "./favicon.png"
		}),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		}),
		new LodashModuleReplacementPlugin(),
	],
	module: {
		loaders: [{
			test: /\.json$/,
			loader: 'json'
		}, {
			test: /\.jsx$/,
			loader: 'babel',
			query: {
				plugins: ['lodash'],
				presets: ['es2015', 'react']
			}
		}, {
			test: /\.css$/,
			loader: "style!css"
		},

		// Bootstrap loaders
		{test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
		{test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
		{test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
		{test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'}]
	}
})
