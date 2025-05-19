import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV==='production'?'./':'/',
  plugins: [vue()],
  server: {
    https: {
      key: fs.readFileSync('ssl/key.pem'),
      cert: fs.readFileSync('ssl/cert.pem')
    },
    host: true  // 允许局域网访问
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "./src/assets/style/themes.less";`,  // 注入全局变量
        javascriptEnabled: true
      }
    }
  }
})
