/// <reference types="vite/client" />
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts' // Add this
import path from 'path'
import { name } from './package.json'
const projectName = name.replace('@tenorlab/', '').trim().toLowerCase()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({ 
      rollupTypes: true, // This flattens Core's types into one file
      insertTypesEntry: true 
    })
  ],
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
