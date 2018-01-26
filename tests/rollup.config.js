import multiEntry from 'rollup-plugin-multi-entry';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'tests/**/*-test.js',
  external: ['ava', 'path'],

  plugins: [resolve(), commonjs(), multiEntry()],

  output: {
    file: 'build/bunde-test.js',
    format: 'cjs',
    sourcemap: true
  }
};
