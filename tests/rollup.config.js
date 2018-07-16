import istanbul from 'rollup-plugin-istanbul';

import multiEntry from 'rollup-plugin-multi-entry';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import executable from 'rollup-plugin-executable';
import json from 'rollup-plugin-json';
import pkg from '../package.json';
import baseRollup from '../rollup.config.js';

const external = [
  'ava',
  'execa',
  'assert',
  'os',
  'events',
  'path',
  'url',
  'url-resolver-fs',
  'fs-resolver-fs',
  'svn-dav-fs',
  'sftp-resolver-fs',
  'config-expander'
];
export default [
  baseRollup,
  {
    input: 'tests/**/*-test.js',
    external,
    plugins: [resolve(), commonjs(), multiEntry()],
    output: {
      file: 'build/bunde-test.js',
      format: 'cjs',
      sourcemap: true,
      interop: false
    }
  }
];
