module.exports = {
	entry: './client/index',
	output: {
		path: __dirname + '/static/dist',
		filename: 'bundle.js',
		publicPath: '/static/'
	},
	module: {
		loaders: [
			{
					test: /\.js$/,
					exclude: /node_modules/,
					loaders: ['babel-loader']
			},
			{
					test: /\.css$/,
					loaders: ['style-loader', 'css-loader']
			},
			{
	test: /\.(png|jpg)$/,
	loader: 'url?limit=25000'
}
		]
	},
	watch: true
}
