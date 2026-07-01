import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteDir = dirname(dirname(fileURLToPath(import.meta.url)));
const siteFile = (relativePath) => join(siteDir, relativePath);
const readSiteFile = (relativePath) => readFileSync(siteFile(relativePath), 'utf8');

test('required static website files exist', () => {
  [
    'index.html',
    'styles.css',
    'main.js',
    'assets/pipeline.svg',
    'assets/libjpeg-demo.svg',
    'assets/rsa-demo.svg',
    'assets/uncorebleed-paper.pdf',
  ].forEach((relativePath) => {
    assert.equal(existsSync(siteFile(relativePath)), true, `${relativePath} should exist`);
  });
});

test('home page contains the required research-site sections', () => {
  const html = readSiteFile('index.html');
  [
    'hero',
    'claim',
    'attack',
    'demos',
    'findings',
    'materials',
    'faq',
  ].forEach((id) => {
    assert.match(html, new RegExp(`id="${id}"`), `section #${id} should exist`);
  });

  [
    'UncoreBleed',
    'AEX-free',
    '64 B granularity',
    'Low-noise',
    'SGX',
    'Uncore PMC',
    'M2M PKT_MATCH',
    'Libjpeg',
    'TLBlur-protected RSA',
  ].forEach((term) => {
    assert.match(html, new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  });
});

test('paper metadata matches the uploaded publication PDF', () => {
  const html = readSiteFile('index.html');
  [
    'UncoreBleed: AEX-free, High-Resolution, and Low-Noise Side-Channel Attacks on SGX Enclaved Execution',
    'Decheng Chen',
    'Zhi Zhang',
    'Zhenkai Zhang',
    'Xin Zhang',
    'Yansong Gao',
    'Yi Zou',
    'South China University of Technology',
    'The University of Western Australia',
    'Clemson University',
    'Shandong University',
    'Southeast University',
  ].forEach((term) => {
    assert.match(html, new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  });
});

test('navigation links point to existing sections', () => {
  const html = readSiteFile('index.html');
  const sectionIds = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  assert.ok(anchors.length >= 5, 'expected several in-page navigation links');
  anchors.forEach((anchor) => {
    assert.equal(sectionIds.has(anchor), true, `#${anchor} should match a section id`);
  });
});

test('local asset references resolve', () => {
  const html = readSiteFile('index.html');
  const refs = [...html.matchAll(/\s(?:href|src)="([^"#][^"]*)"/g)].map((match) => match[1]);

  refs
    .filter((ref) => !ref.startsWith('http') && !ref.startsWith('mailto:'))
    .forEach((ref) => {
      assert.equal(existsSync(siteFile(ref)), true, `${ref} should resolve inside website/`);
    });
});

test('paper PDF is bundled and non-empty', () => {
  const pdf = siteFile('assets/uncorebleed-paper.pdf');
  assert.equal(existsSync(pdf), true, 'paper PDF should exist');
  assert.ok(statSync(pdf).size > 1_000_000, 'paper PDF should be the full publication PDF');
});

test('release-gated materials are explicit', () => {
  const html = readSiteFile('index.html');
  assert.match(html, /Code[\s\S]*Coming soon/i);
  assert.match(html, /Artifact[\s\S]*Planned release/i);
  assert.match(html, /Demo materials[\s\S]*Preview only/i);
});

test('site content has no unfinished planning tokens', () => {
  const files = ['index.html', 'styles.css', 'main.js'];
  const unfinishedTokens = ['TB' + 'D', 'TO' + 'DO', 'FIX' + 'ME'];
  const unfinishedPattern = new RegExp(`\\b(${unfinishedTokens.join('|')})\\b`, 'i');
  files.forEach((relativePath) => {
    const content = readSiteFile(relativePath);
    assert.doesNotMatch(content, unfinishedPattern, `${relativePath} should not contain unfinished planning tokens`);
  });
});

test('section titles use a restrained editorial scale', () => {
  const css = readSiteFile('styles.css');
  const sizeFor = (selector) => {
    const match = css.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\s*\\{[\\s\\S]*?font-size:\\s*([0-9.]+)rem`));
    assert.ok(match, `${selector} should define a rem font-size`);
    return Number(match[1]);
  };

  assert.ok(sizeFor('.section h2') <= 3, 'desktop section titles should not dominate the page');
  assert.match(css, /@media \(max-width: 980px\)[\s\S]*?\.section h2\s*\{[\s\S]*?font-size:\s*2\.2rem/);
  assert.match(css, /@media \(max-width: 560px\)[\s\S]*?\.section h2\s*\{[\s\S]*?font-size:\s*1\.75rem/);
});
