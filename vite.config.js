/*
 * @Author: aFei
 * @Date: 2022-07-07 15:36:46
*/
/*
 * @LastEditors: aFei
 * @LastEditTime: 2025-07-22 11:21:34
*/
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import autoImport from "unplugin-auto-import/vite";
import * as path from 'path';

export default defineConfig(({ command, mode }) => ({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, './src'),
      'asset': path.resolve(__dirname, './src/assets'),
      'view': path.resolve(__dirname, './src/views'),
    }
  },
  server: {
    open: true
  },
  esbuild: {
    drop: ['console', 'debugger']
  },
  build: {
    outDir: 'dist',
    lib: {
      entry: path.resolve(__dirname, "./lib/index.js"),
      name: "vuePuzzleSliderPlus",
      fileName: "vue-puzzle-slider-plus",
    },
    rollupOptions: {
      external: ["vue", "vue-router", "element-plus"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  plugins: [vue(), vueDevTools(), autoImport({ imports: ['vue', 'vue-router', { from: 'vue-router', imports: ['createRouter', 'createWebHistory'] }], dts: false })],
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true
      }
    }
  }
}));
