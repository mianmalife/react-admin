import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 9000,
    host: '0.0.0.0'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./', import.meta.url))
    }
  },
  plugins: [
    react(),
    UnoCSS(),
    svgr({
      svgrOptions: {
        icon: true
      },
      include: "**/*.svg?react"
    })
  ],
  css: {
    preprocessorOptions: {
      less: {}
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react': ['react', 'react-dom', 'react-router'],
          'antd': ['@ant-design/v5-patch-for-react-19', 'antd', '@ant-design/icons'],
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: ['log']
      }
    }
  }
})
