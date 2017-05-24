/* jslint node: true, esnext: true */

'use strict';

import path from 'path';
import test from 'ava';

const execa = require('execa');

test('cli', async t => {
  const result = await execa(path.join(__dirname, '..', '..', 'bin', 'url-cmd'), ['-h']);
  t.regex(result.stdout, /--config <file>/);
});
