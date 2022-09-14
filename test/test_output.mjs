import test from 'node:test';
import assert from 'node:assert';
import { readFileSync, writeFileSync, rmSync } from "fs"
import { JSDOM } from "jsdom"

function processBundle() {
  const bundle = readFileSync("test/fixture/out.js").toString()

  const { window } = new JSDOM(``, { runScripts: "outside-only" });
  window.eval(bundle)
  const { testing } = window

  return testing
}

function readGlobalCSS() {
  return readFileSync("test/fixture/out.css").toString()
}

test('function within the module script', (t) => {
  const testing = processBundle()
  assert.strictEqual(testing.howdy(), "howdy friend!");
  assert.strictEqual(testing.yo().textContent, "Hello World");
});

test('exported template', (t) => {
  const testing = processBundle()
  assert.strictEqual(testing.HelloWorld.children[0].textContent, "Hello World");
  assert.strictEqual(testing.HelloWorld.children[1].textContent, 'Nice to meet you! \'"` return');
  assert.strictEqual(testing.HelloWorld.children[2].textContent, "More html nodes!");
});

test('processed style tag', (t) => {
  const testing = processBundle()

  assert.strictEqual(testing.HelloWorld.children[3].textContent, "\n      body .and .soul {\n        color: red;\n      }\n")
});

test('global CSS bundled', (t) => {
  const css = readGlobalCSS()

  assert.match(css, /html/)
  assert.match(css, /body/)
  assert.match(css, /color: green/)
  assert.match(css, /color: orange/)

  assert.match(css, /tag-name > h1/)
  assert.match(css, /tag-name > p\[slot=here\]/)
})
