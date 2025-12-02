import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// Vite 配置
export default defineConfig({
  // 插件配置
  plugins: [vue()],
  // 示例目录
  root: path.resolve(__dirname, 'tests'),
  // 解析配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'dom-tracker': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.ts', '.vue', '.json'],
  },
  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  // CSS 配置
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: '',
      },
    },
  },
})
