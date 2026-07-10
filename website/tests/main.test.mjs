import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const siteDir = dirname(dirname(fileURLToPath(import.meta.url)));

test('BibTeX copy button still responds without Clipboard API', async () => {
  const source = readFileSync(join(siteDir, 'main.js'), 'utf8');
  const listeners = new Map();
  const label = { textContent: 'Copy citation' };
  const bibtex = { textContent: 'citation text' };
  const copyButton = {
    querySelector: () => label,
    addEventListener: (event, handler) => listeners.set(event, handler),
  };
  const textarea = {
    value: '',
    setAttribute() {},
    select() {},
  };
  const appended = [];
  const removed = [];

  const context = {
    document: {
      querySelector: (selector) => {
        if (selector === '[data-copy-bibtex]') return copyButton;
        if (selector === '#bibtex') return bibtex;
        return null;
      },
      querySelectorAll: () => [],
      createElement: () => textarea,
      execCommand: (command) => command === 'copy',
      body: {
        appendChild: (node) => appended.push(node),
        removeChild: (node) => removed.push(node),
      },
    },
    navigator: {},
    window: {
      setTimeout: () => {},
    },
  };

  vm.runInNewContext(source, context);

  assert.equal(typeof listeners.get('click'), 'function');
  await listeners.get('click')();

  assert.equal(textarea.value, 'citation text');
  assert.deepEqual(appended, [textarea]);
  assert.deepEqual(removed, [textarea]);
  assert.equal(label.textContent, 'Copied');
});

test('BibTeX copy button can use direct button text as its label', async () => {
  const source = readFileSync(join(siteDir, 'main.js'), 'utf8');
  const listeners = new Map();
  const copyButton = {
    textContent: 'Copy BibTeX',
    querySelector: () => null,
    addEventListener: (event, handler) => listeners.set(event, handler),
  };
  const textarea = {
    value: '',
    setAttribute() {},
    select() {},
  };

  const context = {
    document: {
      querySelector: (selector) => {
        if (selector === '[data-copy-bibtex]') return copyButton;
        if (selector === '#bibtex') return { textContent: 'citation text' };
        return null;
      },
      querySelectorAll: () => [],
      createElement: () => textarea,
      execCommand: () => true,
      body: {
        appendChild() {},
        removeChild() {},
      },
    },
    navigator: {},
    window: {
      setTimeout: () => {},
    },
  };

  vm.runInNewContext(source, context);

  await listeners.get('click')();

  assert.equal(copyButton.textContent, 'Copied');
});
