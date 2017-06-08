import babel from 'rollup-plugin-babel';

export default {
  banner: '#!/usr/bin/env node',
  format: 'cjs',
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [
        'stage-3'
      ],
      plugins: [
        ['transform-regenerator', {
          asyncGenerators: true,
          generators: false,
          async: false
        }]
      ]
    })
  ],
  external: ['url-resolver-fs', 'fs-resolver-fs', 'svn-dav-fs', 'config-expander']
};
