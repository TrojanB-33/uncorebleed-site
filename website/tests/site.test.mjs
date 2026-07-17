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
    'assets/uncorebleed-icon.svg',
    'assets/uncorebleed-rsa-demo.mp4',
    'assets/uncorebleed-paper.pdf',
  ].forEach((relativePath) => {
    assert.equal(existsSync(siteFile(relativePath)), true, `${relativePath} should exist`);
  });
});

test('home page contains the required research-site sections', () => {
  const html = readSiteFile('index.html');
  [
    'intro',
    'demo',
    'principles',
    'team',
    'faq',
  ].forEach((id) => {
    assert.match(html, new RegExp(`id="${id}"`), `section #${id} should exist`);
  });

  [
    'UncoreBleed',
    'AEX-free',
    'High-resolution',
    'Low-noise',
    'SGX',
    'Uncore PMC',
    'M2M PKT_MATCH',
    '64 B granularity',
    'TLBlur-protected RSA',
    'Responsible disclosure',
    'Intel TDX',
  ].forEach((term) => {
    assert.match(html, new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  });
});

test('site focuses on one TLBlur-protected RSA demo', () => {
  const html = readSiteFile('index.html');
  assert.match(html, /TLBlur-protected RSA/i);
  assert.match(html, /single decryption/i);
  assert.doesNotMatch(html, /Libjpeg/i);
});

test('RSA demo uses a manually initiated native video player', () => {
  const html = readSiteFile('index.html');
  const demoMatch = html.match(/<section class="demo section" id="demo">([\s\S]*?)<\/section>/);

  assert.ok(demoMatch, 'the Demo section should exist');

  const videoMatch = demoMatch[1].match(/<video\b[^>]*>/i);
  assert.ok(videoMatch, 'the Demo section should contain a video element');

  const videoTag = videoMatch[0];
  assert.match(videoTag, /src="assets\/uncorebleed-rsa-demo\.mp4"/i);
  assert.match(videoTag, /\bcontrols\b/i);
  assert.match(videoTag, /\bmuted\b/i);
  assert.match(videoTag, /\bplaysinline\b/i);
  assert.match(videoTag, /preload="metadata"/i);
  assert.doesNotMatch(videoTag, /\bautoplay\b/i);
  assert.doesNotMatch(videoTag, /\bloop\b/i);

  const css = readSiteFile('styles.css');
  assert.match(css, /\.demo-player\s*\{[\s\S]*?width:\s*100%;[\s\S]*?aspect-ratio:\s*16\s*\/\s*9/);
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

  assert.ok(sizeFor('.section h2') <= 2.4, 'desktop section titles should stay compact');
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.section h2\s*\{[\s\S]*?font-size:\s*1\.75rem/);
});

test('narrow layouts allow the intro grid to shrink without overflow', () => {
  const css = readSiteFile('styles.css');
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*?\.intro\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)/);
});
