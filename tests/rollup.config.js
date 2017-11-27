import multiEntry from 'rollup-plugin-multi-entry';

export default {
  input: 'tests/**/*-test.js',
  external: ['ava', 'path'],

  plugins: [multiEntry()],

  output: {
    file: 'build/bunde-test.js',
    format: 'cjs',
    sourcemap: true
  }
};
