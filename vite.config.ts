import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import path from 'path';

const isLib = process.env.BUILD_MODE === 'lib';

export default defineConfig({
  plugins: [solid()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: isLib ? {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'SolidXP',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'esm' : format}.js`
    },
    rollupOptions: {
      external: ['solid-js', 'xp.css'],
      output: {
        globals: {
          'solid-js': 'SolidJS',
          'xp.css': 'XPCSS'
        }
      }
    },
    copyPublicDir: false
  } : {
    outDir: 'playground-dist'
  },
});