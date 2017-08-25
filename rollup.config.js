import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default {
  banner: '#!/usr/bin/env node',

  output: {
    file: pkg.main,
    format: 'cjs'
  },

  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: ['stage-3'],
      plugins: [
        /*
               ['transform-regenerator', {
                 asyncGenerators: true,
                 generators: false,
                 async: false
               }]*/
      ]
    })
  ],

  external: [
    'url-resolver-fs',
    'fs-resolver-fs',
    'svn-dav-fs',
    'sftp-resolver-fs',
    'config-expander'
  ],

  input: pkg.module
};
