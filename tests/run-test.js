import path from 'path';
import test from 'ava';

const execa = require('execa');

test('cli help', async t => {
  const result = await execa(path.join(__dirname, '..', 'bin', 'url-cmd'), [
    '-h'
  ]);
  t.regex(result.stdout, /work with url resources/);
});

test('cli schemes', async t => {
  const result = await execa(path.join(__dirname, '..', 'bin', 'url-cmd'), [
    'schemes'
  ]);
  t.regex(result.stderr, /https/);
});

test('cli info', async t => {
  const result = await execa(path.join(__dirname, '..', 'bin', 'url-cmd'), [
    'info',
    'file://' + __dirname
  ]);
  t.regex(result.stderr, /size/);
});
