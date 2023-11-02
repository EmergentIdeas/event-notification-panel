const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

/* need to install:

npm i --save-dev webpack-cli node-polyfill-webpack-plugin

*/


module.exports = [{
	entry: './client-js-test/pages.mjs',
	mode: 'development',
	"devtool": 'source-map',
	output: {
		filename: 'pages.js',
		path: path.resolve(__dirname, 'public/js'),
	},
	module: {
		rules: [
			{ test: /\.tmpl$/, use: 'tripartite/webpack-loader.mjs' }
			, { test: /\.tri$/, use: 'tripartite/webpack-loader.mjs' }
		],
	},
	resolve: {
		fallback: {
			stream: require.resolve('stream-browserify'),
		}
	},
	plugins: [
		// new NodePolyfillPlugin()
	],
	stats: {
		colors: true,
		// reasons: true
	},

}
	,
{
	entry: './client-js/index.mjs',
	mode: 'production',
	"devtool": 'source-map',
	experiments: {
		outputModule: true,
	},
	output: {
		filename: 'event-notification-panel.js',
		path: path.resolve(__dirname, 'public/js'),
		library: {
			type: 'module',
		}
	},
	module: {
		rules: [
			{ test: /\.tmpl$/, use: 'tripartite/webpack-loader.mjs' }
			, { test: /\.tri$/, use: 'tripartite/webpack-loader.mjs' }
		],
	},
	resolve: {
		fallback: {
			stream: require.resolve('stream-browserify'),
		}
	},
	plugins: [
		// new NodePolyfillPlugin()
	],
	stats: {
		colors: true,
		// reasons: true
	},

}
]