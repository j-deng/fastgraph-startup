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
        proxy: {
          '/graphql': 'http://localhost:4000'
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
