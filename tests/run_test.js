/* jslint node: true, esnext: true */

'use strict';

import path from 'path';
import test from 'ava';

const execa = require('execa');

test('cli', async t =>
  execa(path.join(__dirname, '..', '..', 'bin', 'url-util'), ['-h']).then(result =>
    t.regex(result.stdout, /--config <file>/)
  )
);
