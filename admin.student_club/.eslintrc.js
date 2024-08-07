module.exports = {
    root: true,
    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended"
    ],
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module'
      },
    parser: 'vue-eslint-parser',
    env: {
        browser: true,
        node: true,
        es6: true
    },
    rules: {
        "vue/max-attributes-per-line": [2, {
        "singleline": 10,
        "multiline": {
            "max": 1,
            "allowFirstLine": false
        }
        }],
        "vue/singleline-html-element-content-newline": "off",
        "vue/multiline-html-element-content-newline":"off",
        "vue/name-property-casing": ["error", "PascalCase"],
        "vue/no-v-html": "off",
        // 要求或禁止末尾逗号
        'comma-dangle': [2, 'never'],
        // 强制在逗号前后使用一致的空格
        'comma-spacing': [2, { 'before': false, 'after': true }],
        // 强制在逗号前后使用一致的空格
        'comma-style': [2, 'last'],
        // 禁用不必要嵌套块
        'no-lone-blocks': 2,
        // 禁止使用多个空格
        'no-multi-spaces': 2,
        'no-console': 'off',
        // 强制所有控制语句使用一致的括号风格
        'curly': [2, 'multi-line'],
        // 强制在点号之前和之后一致的换行
        'dot-location': [2, 'property'],
        // 要求使用 ===和 !==
        'eqeqeq': [2, 'allow-null'],
        // 禁止使用分号代替ASI(自动分号插入)
        'semi': [2, 'never'],
        // 强制分号之前和之后使用一致的空格
        'semi-spacing': [2, { 'before': false, 'after': true }],
        // 强制在块之前使用一致的空格
        'space-before-blocks': [2, 'always'],
        // 强制在圆括号内使用一致的空格
        'space-in-parens': [2, 'never'],
        // 要求操作符周围有空格
        'space-infix-ops': 2,
        // 强制在一元操作符前后使用一致的空格
        'space-unary-ops': [2, { 'words': true, 'nonwords': false }],
        // 强制在注释// 或/*使用一致的空格
        'spaced-comment': [1, 'always', {
            'markers': ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ',']
        }],
        // 强制在大括号中使用一致的空格
        'object-curly-spacing': [2, 'always', {
            'objectsInObjects': false
        }],
        // 禁止或强制在括号内使用空格
        'array-bracket-spacing': [2, 'never'],
        // 强制要求在对象字面量的属性中键和值之间使用一致的间距
        'key-spacing': [2, {
            'beforeColon': false,
            'afterColon': true
        }],
        // 强制箭头函数前后使用一致的空格
        'arrow-spacing': [
            2,
            {
                'before': true,
                'after': true
            }
        ],
        // 强制使用一致的缩进
        'indent': ["error", 4],
        // 禁止行尾空格
        'no-trailing-spaces': 2,
        // 禁止可以在有更简单的可替代的表达式时使用三元操作符
        'no-unneeded-ternary': [2, {
            // 允许表达式作为默认的赋值模式
            'defaultAssignment': true
        }],
        // 禁止属性前有空白
        'no-whitespace-before-property': 2
    }
}