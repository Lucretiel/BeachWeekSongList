var webpack = require('webpack')
var config = require("./webpack.config.js")
const validate = require('webpack-validator')

config.output.path = "dist.prod"
config.plugins.push(
	new webpack.DefinePlugin({
		'process.env.NODE_ENV': '"production"'
	})
)

module.exports = validate(config)
