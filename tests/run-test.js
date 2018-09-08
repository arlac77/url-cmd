import test from "ava";
import { join } from "path";
import execa from "execa";

test("cli help", async t => {
  const result = await execa(join(__dirname, "..", "bin", "url-cmd"), ["-h"]);
  t.regex(result.stdout, /work with url resources/);
});

test("cli schemes", async t => {
  const result = await execa(join(__dirname, "..", "bin", "url-cmd"), [
    "--config",
    join(__dirname, "..", "tests", "fixtures", "config.json"),
    "schemes"
  ]);
  t.is(result.code, 0);
  t.regex(result.stdout, /https/);
  t.regex(result.stdout, /assembla/);
});

test.skip("cli assembla", async t => {
  const result = await execa(join(__dirname, "..", "bin", "url-cmd"), [
    "--config",
    join(__dirname, "..", "tests", "fixtures", "config.json"),
    "info",
    "assembla:delivery_notes/data/environments.json"
  ]);
  t.is(result.code, 0);
  t.regex(result.stdout, /assembla/);
});

test("cli info", async t => {
  const result = await execa(join(__dirname, "..", "bin", "url-cmd"), [
    "info",
    "file://" + __dirname
  ]);
  t.truthy(result.stdout.match(/size/));
  t.is(result.code, 0);
  //t.regex(result.stderr, /size/);
});
