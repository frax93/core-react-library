import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import dts from 'vite-plugin-dts';
import copy from 'rollup-plugin-copy';
import replace from '@rollup/plugin-replace';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const libraryName = packageJson.name;

const commonExternal = ['react', 'react-dom', 'axios', 'mitt', '@juggle/resize-observer'];
const commonGlobals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  axios: 'axios',
  mitt: 'mitt',
  '@juggle/resize-observer': 'ResizeObserverPolyfill',
};

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: path.resolve(__dirname, 'tsconfig.build.json'),
      insertTypesEntry: true,
      copyDtsFiles: true,
    }),
    copy({
      targets: [
        { src: 'package.json', dest: 'dist' },
        { src: 'README.MD', dest: 'dist' }
      ],
      hook: 'writeBundle' // esegue la copia dopo il build
    }),
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      },
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: libraryName,
      formats: ['es'],
      fileName: () => 'index.js',
    },
    outDir: 'dist',
    rollupOptions: {
      external: commonExternal,
      output: {
        globals: commonGlobals,
      },
    },
  },
});
