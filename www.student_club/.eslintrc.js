// .eslintrc.js
module.exports = {
    "env": {    //用来预定义全局环境变量，常用的有browser，es6,node,jest,jquery
        "browser": true,
        "es6": true,
        "node": true
    },
    
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential"
    ],
    "parserOptions": {  // 支持的 JavaScript 语言选项
        "parser": "babel-eslint",   // 默认使用Espree作为其解析器,除此之外就Esprima,Babel-ESLint,@typescript-eslint/parser
        "ecmaVersion": 12, // ECMAScript 版本,默认设置为 3，5（默认）,也可以年份，2015（同 6），2012（as 12）
        "sourceType": "module"  // "script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)
    },
    "plugins": [    //eslint支持使用第三方插件，需要npm先安装,后使用
        "vue"   // 可以用package的名称,eslint-plugin-vue，也可以省略eslint-plugin-,直接填写vue
    ],
    "rules": {
        // 强制使用单引号 
        'quotes': ['error', 'single'],
        // 在块级作用域外访问块内定义的变量是否报错提示 
        'block-scoped-var': 0,
    }
};