module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	extends: ['eslint:recommended', 'plugin:vue/essential'],
	parserOptions: {
		parser: 'babel-eslint',
		sourceType: 'module'
	},
	plugins: ['vue'],
	rules: {
		// 强制使用一致的换行风格
		'linebreak-style': ['error', 'unix'],
		// 强制使用一致的单引号
		quotes: ['error', 'single'],
		// 控制行尾部分号
		semi: ['error', 'always'],
		// 制所有控制语句使用一致的括号风格
		curly: ['error', 'all'],
		// 禁止出现未使用过的变量
		'no-unused-vars': 2,
		// 禁止 this 关键字出现在类和类对象之外
		'no-invalid-this': 'error',
		// 禁止使用多个空格
		'no-multi-spaces': 'error',
		// 禁止对 __dirname 和 __filename进行字符串连接
		'no-path-concat': 'error',
		// 指定数组的元素之间要以空格隔开(, 后面)
		'array-bracket-spacing': ['error', 'never'],
		// 花括号 风格
		'brace-style': ['error', '1tbs'],
		// 强制驼峰法命名
		camelcase: 'error',
		// 该规则规定了在对象字面量语法中，key和value之间的空白，冒号前不要空格，冒号后面需要一个空格
		'key-spacing': ['error', { beforeColon: false, afterColon: true }],
		// 要求 return 语句之前有一空行
		'newline-before-return': 'error',
		// function 定义中最多允许的参数数量
		'max-params': [1, 3],
		// 构造函数 class 首字母大写
		'new-cap': ['error', { newIsCap: true, capIsNew: false }],
		// 空行不能够超过2行
		'no-multiple-empty-lines': ['error', { max: 2 }],
	},
};
