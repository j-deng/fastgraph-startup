import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const baseConfig = {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  }
  if (mode === 'development') {
    return {
      ...baseConfig,
      // dev config
      server: {
        port: 3000,
        proxy: {
          '/graphql': 'http://localhost:4000/graphql'
        }
      }
    }
  } else {
    // mode === 'production'
    return {
      ...baseConfig
      // prod config
    }
  }
})
