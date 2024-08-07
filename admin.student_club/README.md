## 安装
```
npm i
```

## 启动
```
npm run dev
```

## 注意排坑
1. import()动态加载不能使用，可以用import.meta.glob替代 [详情](https://cn.vitejs.dev/guide/features.html#glob-import)
2. 如果要使用public里的文件，引用时应该使用绝对路径 即 `/assets/logo.png` 而不是 `assets/logo.png`
3. import引用文件时需要把后缀都加上 如`index.vue`

更多问题查看[vite官方文档](https://cn.vitejs.dev/)

