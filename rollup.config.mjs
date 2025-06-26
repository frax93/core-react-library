import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { builtinModules } from 'module';

const external = [...builtinModules, 'react', 'react-dom', 'axios', '@juggle/resize-observer'];

export default [
  {
    input: 'src/public-api.ts',
    output: [
      {
        file: 'dist/public-api.esm.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/public-api.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    external,
    plugins: [resolve(), commonjs(), typescript({ useTsconfigDeclarationDir: true })],
  },
  {
    input: 'src/public-api.ts',
    output: [{ file: 'dist/public-api.d.ts', format: 'es' }],
    plugins: [dts()],
    external,
  },
];
