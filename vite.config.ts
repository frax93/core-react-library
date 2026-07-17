import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import dts from 'vite-plugin-dts';
import copy from 'rollup-plugin-copy';
import replace from '@rollup/plugin-replace';

const libraryName = 'core-react-library';
const outDir = path.resolve(__dirname, 'dist');

const commonExternal = ['react', 'react-dom', 'axios', 'mitt', '@juggle/resize-observer'];
const commonGlobals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  axios: 'axios',
  mitt: 'mitt',
  '@juggle/resize-observer': 'ResizeObserverPolyfill',
};

/**
 * Generates the published `dist/package.json` from the root `package.json`,
 * stripping dev-only fields. This keeps a single source of truth (version,
 * dependencies, metadata) and prevents drift between two manifests.
 */
function generatePublishManifest(): Plugin {
  return {
    name: 'generate-publish-manifest',
    writeBundle() {
      const publishable = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
      );

      // Fields that only make sense during development are removed.
      for (const field of ['scripts', 'devDependencies', 'files', 'prettier', 'lint-staged']) {
        delete publishable[field];
      }

      fs.writeFileSync(
        path.join(outDir, 'package.json'),
        `${JSON.stringify(publishable, null, 2)}\n`
      );
    },
  };
}

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
        { src: 'README.md', dest: 'dist' },
        { src: 'LICENSE', dest: 'dist' },
      ],
      hook: 'writeBundle',
    }),
    generatePublishManifest(),
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
      formats: ['es', 'cjs'],
      // With "type": "module", a .js file is treated as ESM by Node. Emit the
      // CommonJS build with a .cjs extension so `require()` resolves it correctly.
      fileName: (format) => `${libraryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: commonExternal,
      output: {
        globals: commonGlobals,
      },
    },
  },
});
