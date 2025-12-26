/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import path from 'path'
import { name } from './package.json'
const projectName = name.replace('@tenorlab/', '').trim().toLowerCase()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  envDir: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/')
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      name: projectName,
      fileName: (format) => `${projectName}.${format}.js`,
    },
  },
})
