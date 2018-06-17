import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import executable from 'rollup-plugin-executable';
import json from 'rollup-plugin-json';

export default {
  output: {
    file: pkg.bin['url-cmd'],
    format: 'cjs',
    banner: '#!/usr/bin/env node',
    interop: false
  },
  plugins: [resolve(), commonjs(), json(), executable()],
  external: [
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
  ],
  input: pkg.module
};
