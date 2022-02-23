import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const baseConfig = {
    plugins: [vue()]
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
