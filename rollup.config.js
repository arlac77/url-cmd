import pkg from './package.json';
import json from 'rollup-plugin-json';

export default {
  output: {
    file: pkg.bin['url-cmd'],
    format: 'cjs',
    banner: '#!/usr/bin/env node'
  },
  plugins: [json()],
  external: [
    'url-resolver-fs',
    'fs-resolver-fs',
    'svn-dav-fs',
    'sftp-resolver-fs',
    'config-expander'
  ],
  input: pkg.module
};
