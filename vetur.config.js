// vetur.config.js
module.exports = {
	// vetur配置，会覆盖vscode中的设置。  default: `{}`
	settings: {
		'vetur.useWorkspaceDependencies': true,
		'vetur.experimental.templateInterpolationService': true,
	},
	// 普通项目采用默认配置 default: `[{ root: './' }]`
	projects: [
		'./packages/repo2', // shorthand for only root.
		{
			// **required**
			// Where is your project?
			// It is relative to `vetur.config.js`.
			root: './',
			// **optional** default: `'package.json'`
			// Where is `package.json` in the project?
			// We use it to determine the version of vue.
			// It is relative to root property.
			package: './package.json',
			// **optional** default: `[]`
			// Register globally Vue component glob.
			// If you set it, you can get completion by that components.
			// It is relative to root property.
			// Notice: It won't actually do it. You need to use `require.context` or `Vue.component`
			globalComponents: ['./src/components/**/*.vue'],
		},
	],
};
