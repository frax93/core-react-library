import fs from 'fs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import copy from 'rollup-plugin-copy';
import replace from '@rollup/plugin-replace';

// Leggi il package.json
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

// Shared plugins
const sharedPlugins = [
  peerDepsExternal(),
  json(),
  nodeResolve({ browser: true, preferBuiltins: false }),
  commonjs(),
  replace({
    preventAssignment: true,
    values: {
      'process.env': JSON.stringify({}),
    },
  }),
  typescript({ tsconfig: './tsconfig.json' }),
  terser(),
];

export default [
  // Build ESM
  {
    input: 'src/index.ts',
    output: {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
    external: [...Object.keys(packageJson.peerDependencies || {})],
    plugins: [
      ...sharedPlugins,
      copy({
        targets: [{ src: 'package.json', dest: 'dist' }],
      }),
    ],
  },
  // Build CommonJS
  {
    input: 'src/index.ts',
    output: {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    external: [...Object.keys(packageJson.peerDependencies || {})],
    plugins: sharedPlugins,
  },
  // Tipi
  {
    input: 'src/index.ts',
    output: [{ file: packageJson.types, format: 'es' }],
    plugins: [dts()],
  },
];
