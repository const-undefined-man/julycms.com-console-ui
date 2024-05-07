let apiUrl = process.env.VUE_APP_API_URL;

module.exports = {
	// 基本路径
	publicPath: process.env.VUE_APP_BASE_URL,
	assetsDir: 'assets',
	// eslint-loader 是否在保存的时候检查
	lintOnSave: false,
	// webpack配置
	// see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
	runtimeCompiler: false, // 禁止使用template模板，影响js代码性能
	// 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来
	// https://cli.vuejs.org/zh/config/#transpiledependencies
	transpileDependencies: [],
	// source map
	productionSourceMap: process.env.NODE_ENV !== 'production',
	// 为 Babel 或 TypeScript 使用 thread-loader
	// 在系统的 CPU 有多于一个内核时自动启用，提高构建速度
	parallel: require('os').cpus().length > 1,
	// css相关配置
	css: {
		// 是否使用css分离插件 ExtractTextPlugin
		extract: true,
		// 开启 CSS source maps?
		sourceMap: false,
		requireModuleExtension: true,
	},
	// webpack-dev-server 相关配置
	devServer: {
		open: true,
		host: '0.0.0.0',
		port: 8080,
		hotOnly: true,
		proxy: {
			'/api': {
				target: apiUrl,
				changeOrigin: true,
				pathRewrite: {
					'^/api': '/api',
				},
			},
		},
	},
};
