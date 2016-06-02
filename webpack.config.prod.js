var webpack = require('webpack')
var config = require("./webpack.config.js")

config.output.path = "dist.prod"
config.plugins.push(
	new webpack.DefinePlugin({
		'process.env.NODE_ENV': '"production"'
	})
)

module.exports = config
