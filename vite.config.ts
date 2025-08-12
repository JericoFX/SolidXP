import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import path from 'path';

const isLib = process.env.BUILD_MODE === 'lib';
const repoName = process.env.npm_package_name || 'solidxp';

export default defineConfig({
  plugins: [solid()],
  base: isLib ? '/' : `/${repoName}/`,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: isLib ? {
    // Library build configuration
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'SolidXP',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['solid-js'],
      output: {
        globals: {
          'solid-js': 'SolidJS',
        },
      },
    },
    outDir: 'dist',
    sourcemap: true,
  } : {
    // Playground build configuration
    outDir: 'playground-dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
    sourcemap: false,
  },
});