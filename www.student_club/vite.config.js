import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'

import viteCompression from 'vite-plugin-compression'

import path from 'path'

export default defineConfig({
    plugins: [vue(), WindiCSS(),
    viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
    }),
   ],
    base: './',
    build: {
        outDir: 'dist1',
        chunkSizeWarningLimit: 1000,
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
        rollupOptions: {
            output: {
                chunkFileNames: 'asset/js/[name]-[hash].js',
                entryFileNames: 'asset/js/[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    // 将图片文件输出到 static/images 文件夹中
                    if (assetInfo.type === 'asset' && ['.png', '.jpg', '.gif', '.svg'].includes(path.extname(assetInfo.name))) {
                        return 'asset/images/[name]-[hash].[ext]';
                    }
                    else if (assetInfo.type === 'asset' && path.extname(assetInfo.name) === '.css') {
                        return 'asset/css/[name]-[hash].[ext]';
                    }
                    else {
                        // 其他类型文件保持原有输出路径
                        return 'static/[ext]/[name]-[hash].[ext]';
                    }
                },
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                }
            }
        }

    },
    resolve: {
        extensions: ['.vue', '.js'],
        alias: {
            "@": path.resolve(__dirname, "src")
        }
    },
    server: {
        // port: 5000, // 挂载端口
        proxy: {
            '/api': {
                target: 'http://images.quwancode.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    },
})