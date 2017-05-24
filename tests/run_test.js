/* jslint node: true, esnext: true */

'use strict';

import path from 'path';
import test from 'ava';

const execa = require('execa');

test('cli help', async t => {
  const result = await execa(path.join(__dirname, '..', '..', 'bin', 'url-cmd'), ['-h']);
  t.regex(result.stdout, /--config <file>/);
});

test('cli info', async t => {
  const result = await execa(path.join(__dirname, '..', '..', 'bin', 'url-cmd'), ['info', 'file://' + __dirname]);
  t.regex(result.stderr, /size/);
});
