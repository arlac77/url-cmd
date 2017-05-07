/* jslint node: true, esnext: true */
'use strict';

import babel from 'rollup-plugin-babel';

export default {
  format: 'cjs',
  plugins: [
    babel({
      babelrc: false,
      plugins: [
        'transform-async-generator-functions'
      ],
      exclude: 'node_modules/**'
    })
  ]
};
