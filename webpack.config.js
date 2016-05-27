var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack')
module.exports = {
	entry: './src/main.jsx',
	output: {
		path: 'dist',
		filename: 'bundle.js'
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "Beach Week Karaoke Song Finder",
		}),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		})
	],
	module: {
		loaders: [{
			test: /\.json$/,
			loader: 'json'
		}, {
			test: /\.jsx$/,
			loader: 'babel-loader',
			query: {
				presets: ['es2015', 'react']
			}
		},

		{ test: /\.css$/, loader: "style-loader!css-loader" },

		// Bootstrap loaders
		{test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
		{test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
		{test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
		{test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'}]
	}
}
