import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import alias from "@rollup/plugin-alias";
import path from "path";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'



const webpack = require("webpack")
const CompressionWebpackPlugin = require("compression-webpack-plugin")
const productionGzipExtensions = ["js", "css"]

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    resolve: {
        extensions: ['.vue', '.js'],
        alias: {
            "@": path.resolve(__dirname, "src")
        }
    },
    server: {
        port: 2800, 
        
    },
    plugins: [
        alias(),
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
          }),
          Components({
            resolvers: [ElementPlusResolver()],
          }),
    ],
    configureWebpack: (config) => {
        const plugins = []
        //start 生成gzip压缩文件
        plugins.push(
        // Ignore all locale files of moment.js
        new webpack.IgnorePlugin(/^\.\/locale$/,/moment$/),
  
        // 配置compression-webpack-plugin压缩
        new CompressionWebpackPlugin({
            algorithm: "gzip",
            test: new RegExp("\\.(" +productionGzipExtensions.join("|") + ")$"),
            threshold: 10240,	//对10K以上的数据进行压缩
            minRatio: 0.8,
        }),
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 5,
          minChunkSize: 100,
        })
      )
      //end 结束生成gzip压缩文件
      config.plugins = [...config.plugins, ...plugins]
    }
  
})
