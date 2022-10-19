import test from "ava";
import { execa } from "execa";

test("cli help", async t => {
  const result = await execa(
    new URL("../src/url-cmd-cli.mjs", import.meta.url).pathname,
    ["-h"]
  );
  t.regex(result.stdout, /work with url resources/);
});

test("cli schemes", async t => {
  const result = await execa(
    new URL("../src/url-cmd-cli.mjs", import.meta.url).pathname,
    [
      "--config",
      new URL("fixtures/config.json", import.meta.url).pathname,
      "schemes"
    ]
  );
  t.is(result.code, 0);
  t.regex(result.stdout, /https/);
  t.regex(result.stdout, /assembla/);
});

test.skip("cli assembla", async t => {
  const result = await execa(
    new URL("../src/url-cmd-cli.mjs", import.meta.url).pathname,
    [
      "--config",
      new URL("fixtures/config.json", import.meta.url).pathname,
      "info",
      "assembla:delivery_notes/data/environments.json"
    ]
  );
  t.is(result.code, 0);
  t.regex(result.stdout, /assembla/);
});

test("cli info", async t => {
  const result = await execa(
    new URL("../src/url-cmd-cli.mjs", import.meta.url).pathname,
    ["info", "file://" + new URL(import.meta.url).pathname]
  );
  t.truthy(result.stdout.match(/size/));
  t.is(result.code, 0);
  //t.regex(result.stderr, /size/);
});
