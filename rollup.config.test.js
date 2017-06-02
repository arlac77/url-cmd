/* jslint node: true, esnext: true */

import babel from 'rollup-plugin-babel';
import multiEntry from 'rollup-plugin-multi-entry';

export default {
  entry: 'tests/**/*_test.js',
  external: ['ava', 'path'],
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [
        "stage-3"
      ]
    }),
    multiEntry()
  ],
  format: 'cjs',
  dest: 'tests/build/bundle.js',
  sourceMap: true
};
