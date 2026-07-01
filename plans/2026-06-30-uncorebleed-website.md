# UncoreBleed Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, full-English UncoreBleed research landing page that can be previewed locally and deployed to GitHub Pages with a custom domain later.

**Architecture:** Keep the website isolated under `website/` so it does not interfere with the existing Python package. Use plain static HTML, CSS, and progressive-enhancement JavaScript; deploy the `website/` directory to GitHub Pages through a GitHub Actions workflow.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, SVG assets, Node.js built-in test runner, GitHub Pages Actions.

---

## File Structure

- Create `website/index.html`: single-page research site with semantic sections, in-page navigation, materials grid, FAQ, and BibTeX block.
- Create `website/styles.css`: Dark Technical Editorial visual system, responsive layout, diagrams, cards, and accessible controls.
- Create `website/main.js`: progressive enhancement for FAQ state, BibTeX copy button, and active navigation highlighting.
- Create `website/assets/pipeline.svg`: attack pipeline visual asset.
- Create `website/assets/libjpeg-demo.svg`: safe high-level Libjpeg demonstration visual.
- Create `website/assets/rsa-demo.svg`: safe high-level RSA demonstration visual.
- Copy `C:\Users\30418\OneDrive\Desktop\UncoreBleed_publish.pdf` to `website/assets/uncorebleed-paper.pdf`.
- Create `website/tests/site.test.mjs`: static file, content, link, and release-state tests.
- Create `website/tests/deploy.test.mjs`: GitHub Pages workflow tests.
- Create `.github/workflows/pages.yml`: deploy `website/` as a static GitHub Pages artifact.
- Create `website/README.md`: local preview and deployment instructions.

## Task 1: Static Site Tests

**Files:**
- Create: `website/tests/site.test.mjs`
- Test: `website/tests/site.test.mjs`

- [ ] **Step 1: Create the website test directory**

Run:

```powershell
New-Item -ItemType Directory -Force -Path website\tests
```

Expected: `website\tests` exists.

- [ ] **Step 2: Write the failing static site test**

Create `website/tests/site.test.mjs`:

```javascript
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
  const refs = [
    ...html.matchAll(/\s(?:href|src)="([^"#][^"]*)"/g),
  ].map((match) => match[1]);

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
```

- [ ] **Step 3: Run the failing test**

Run:

```powershell
C:\Users\30418\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test website\tests\site.test.mjs
```

Expected: FAIL because `website/index.html` and the website assets do not exist yet.

## Task 2: HTML Content and Visual Assets

**Files:**
- Create: `website/index.html`
- Create: `website/assets/pipeline.svg`
- Create: `website/assets/libjpeg-demo.svg`
- Create: `website/assets/rsa-demo.svg`
- Create: `website/assets/uncorebleed-paper.pdf`
- Test: `website/tests/site.test.mjs`

- [ ] **Step 1: Create the website asset directory**

Run:

```powershell
New-Item -ItemType Directory -Force -Path website\assets
```

Expected: `website\assets` exists.

- [ ] **Step 2: Copy the paper PDF into the website assets**

Run:

```powershell
Copy-Item -LiteralPath 'C:\Users\30418\OneDrive\Desktop\UncoreBleed_publish.pdf' -Destination 'website\assets\uncorebleed-paper.pdf' -Force
```

Expected: `website\assets\uncorebleed-paper.pdf` exists and is larger than 1 MB.

- [ ] **Step 3: Create the initial HTML page**

Create `website/index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="UncoreBleed is a research website for AEX-free, high-resolution, and low-noise side-channel attacks on SGX enclaved execution.">
  <title>UncoreBleed</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="#hero" aria-label="UncoreBleed home">UncoreBleed</a>
    <nav class="site-nav" aria-label="Main navigation">
      <a href="#claim">Claim</a>
      <a href="#attack">Attack</a>
      <a href="#demos">Demos</a>
      <a href="#materials">Paper</a>
      <a href="#faq">FAQ</a>
    </nav>
  </header>

  <main>
    <section class="hero" id="hero">
      <div class="hero-copy">
        <p class="eyebrow">Security research website</p>
        <h1>UncoreBleed</h1>
        <p class="hero-subtitle">AEX-free, high-resolution, and low-noise side-channel attacks on SGX enclaved execution.</p>
        <p class="hero-summary">UncoreBleed shows that while SGX suppresses sensitive core PMCs, uncore performance monitoring can still expose enclave-correlated memory behavior.</p>
        <div class="hero-actions" aria-label="Primary actions">
          <a class="button primary" href="assets/uncorebleed-paper.pdf">Read the Paper</a>
          <a class="button secondary" href="#attack">Explore the Attack</a>
          <a class="button ghost" href="#faq">FAQ</a>
        </div>
        <ul class="tag-list" aria-label="Technical highlights">
          <li>AEX-free</li>
          <li>64 B granularity</li>
          <li>Low-noise</li>
          <li>SGX</li>
          <li>Uncore PMC</li>
        </ul>
      </div>
      <figure class="hero-visual" aria-label="Monitoring traces across memory lanes">
        <img src="assets/pipeline.svg" alt="UncoreBleed attack pipeline from SGX enclave to uncore monitoring and secret recovery">
      </figure>
    </section>

    <section class="section claim" id="claim">
      <div class="section-kicker">Core claim</div>
      <h2>SGX performance-monitoring assumptions need a closer look.</h2>
      <p>Prior work and common assumptions focus on sensitive core PMCs being suppressed during SGX execution. UncoreBleed revisits that boundary and shows that uncore PMCs can remain active and record events correlated with enclave execution.</p>
      <div class="claim-grid">
        <article>
          <span>01</span>
          <h3>Core PMCs are not the whole story</h3>
          <p>SGX behavior differs across core and uncore monitoring domains.</p>
        </article>
        <article>
          <span>02</span>
          <h3>Uncore events remain observable</h3>
          <p>Uncore monitoring can expose signals tied to enclaved memory behavior.</p>
        </article>
        <article>
          <span>03</span>
          <h3>Noise can be filtered</h3>
          <p>M2M PKT_MATCH enables address-based monitoring at 64 B granularity.</p>
        </article>
      </div>
    </section>

    <section class="section attack" id="attack">
      <div class="section-kicker">Attack pipeline</div>
      <h2>From enclave execution to recovered behavior.</h2>
      <p>The website presents the attack as a conceptual pipeline, not as operational exploit instructions.</p>
      <img class="wide-asset" src="assets/pipeline.svg" alt="Production SGX enclave to M2M PKT_MATCH to 64 B address-based monitoring to recovered behavior and secrets">
    </section>

    <section class="section demos" id="demos">
      <div class="section-kicker">Demonstrations</div>
      <h2>Two case studies show why AEX-free monitoring matters.</h2>
      <div class="demo-grid">
        <article class="demo-card">
          <img src="assets/libjpeg-demo.svg" alt="High-level Libjpeg picture recovery visualization">
          <div>
            <h3>Recovering pictures from enclaved Libjpeg</h3>
            <p>A safe visual explanation shows how monitored memory behavior can correlate with image reconstruction without exposing operational attack steps.</p>
          </div>
        </article>
        <article class="demo-card">
          <img src="assets/rsa-demo.svg" alt="High-level TLBlur-protected RSA recovery visualization">
          <div>
            <h3>Recovering TLBlur-protected RSA keys</h3>
            <p>The site explains why an AEX-free primitive remains relevant when defenses focus on interrupt-aware or AEX-triggered observation.</p>
          </div>
        </article>
      </div>
    </section>

    <section class="section findings" id="findings">
      <div class="section-kicker">Technical findings</div>
      <h2>Precise signals, constrained presentation.</h2>
      <div class="finding-grid">
        <article><h3>Uncore PMCs remain active</h3><p>Sensitive core PMCs can be suppressed while uncore performance-monitoring behavior remains observable.</p></article>
        <article><h3>M2M PKT_MATCH</h3><p>The M2M subsystem exposes address-based filtering behavior useful for fine-grained monitoring.</p></article>
        <article><h3>64 B granularity</h3><p>The primitive distinguishes monitored memory blocks at cache-line scale.</p></article>
        <article><h3>AEX-free</h3><p>The monitoring path is passive and does not rely on triggering asynchronous enclave exits.</p></article>
        <article><h3>Low-noise observation</h3><p>Address filtering reduces unrelated memory activity and strengthens the observed signal.</p></article>
        <article><h3>Defense implications</h3><p>The work motivates revisiting SGX assumptions around architectural monitoring interfaces.</p></article>
      </div>
    </section>

    <section class="section materials" id="materials">
      <div class="section-kicker">Paper materials</div>
      <h2>Read, cite, and track release-gated materials.</h2>
      <div class="materials-grid">
        <a class="material-card active" href="assets/uncorebleed-paper.pdf"><span>Paper</span><strong>Download PDF</strong></a>
        <button class="material-card active" type="button" data-copy-bibtex><span>BibTeX</span><strong>Copy citation</strong></button>
        <div class="material-card gated"><span>Code</span><strong>Coming soon</strong></div>
        <div class="material-card gated"><span>Artifact</span><strong>Planned release</strong></div>
        <div class="material-card gated"><span>Demo materials</span><strong>Preview only</strong></div>
      </div>
      <pre class="bibtex" id="bibtex">@misc{uncorebleed2026,
  title = {UncoreBleed: AEX-free, High-Resolution, and Low-Noise Side-Channel Attacks on SGX Enclaved Execution},
  author = {Chen, Decheng and Zhang, Zhi and Zhang, Zhenkai and Zhang, Xin and Gao, Yansong and Zou, Yi},
  year = {2026},
  note = {Research paper}
}</pre>
    </section>

    <section class="section faq" id="faq">
      <div class="section-kicker">Q&A</div>
      <h2>Short answers for readers with different backgrounds.</h2>
      <div class="faq-list">
        <details open><summary>What is Intel SGX?</summary><p>Intel SGX is a trusted execution environment that isolates enclave code and data from privileged software such as the operating system and hypervisor.</p></details>
        <details><summary>What are PMCs?</summary><p>Performance monitoring counters record hardware events. They are useful for profiling, but some events can become side channels when they correlate with secret-dependent execution.</p></details>
        <details><summary>What is the difference between core and uncore PMCs?</summary><p>Core PMCs monitor events close to CPU cores. Uncore PMCs monitor shared processor subsystems such as memory and interconnect components.</p></details>
        <details><summary>What does AEX-free mean?</summary><p>It means the attack does not rely on causing asynchronous enclave exits, which makes it fundamentally different from attacks that need page faults or interrupts to observe chosen execution points.</p></details>
        <details><summary>Why does 64 B granularity matter?</summary><p>64 B is cache-line scale. Monitoring at this granularity can distinguish fine-grained behavior that page-level channels may merge together.</p></details>
        <details><summary>Does this break every SGX deployment?</summary><p>The website should present the paper's evaluated platforms and assumptions carefully. The public page should avoid broad claims beyond the paper's evidence.</p></details>
        <details><summary>How does this relate to TLBlur and AEX-Notify?</summary><p>TLBlur with AEX-Notify targets attacks that leverage AEX-driven observation. UncoreBleed is passive and AEX-free, so the threat model is different.</p></details>
        <details><summary>What should vendors or operators consider?</summary><p>The findings motivate reevaluating uncore performance-monitoring access and its interaction with confidential computing assumptions.</p></details>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <p><strong>UncoreBleed</strong>: AEX-free, high-resolution, and low-noise side-channel attacks on SGX enclaved execution.</p>
    <p>Decheng Chen, Zhi Zhang, Zhenkai Zhang, Xin Zhang, Yansong Gao, and Yi Zou.</p>
  </footer>

  <script src="main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Create the attack pipeline SVG**

Create `website/assets/pipeline.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 420" role="img" aria-labelledby="title desc">
  <title id="title">UncoreBleed attack pipeline</title>
  <desc id="desc">A conceptual pipeline from SGX enclave execution to M2M PKT_MATCH monitoring and recovered behavior.</desc>
  <defs>
    <linearGradient id="bg" x1="0" x2="1">
      <stop offset="0" stop-color="#101820"/>
      <stop offset="1" stop-color="#17212b"/>
    </linearGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="960" height="420" rx="28" fill="url(#bg)"/>
  <g stroke="#22313f" stroke-width="1">
    <path d="M80 80H880M80 140H880M80 200H880M80 260H880M80 320H880"/>
    <path d="M160 50V360M320 50V360M480 50V360M640 50V360M800 50V360"/>
  </g>
  <g fill="#0d1117" stroke="#4fd1c5" stroke-width="2">
    <rect x="70" y="145" width="190" height="110" rx="14"/>
    <rect x="292" y="145" width="190" height="110" rx="14"/>
    <rect x="514" y="145" width="190" height="110" rx="14"/>
    <rect x="736" y="145" width="154" height="110" rx="14"/>
  </g>
  <g fill="#f8fbff" font-family="Arial, sans-serif" text-anchor="middle">
    <text x="165" y="190" font-size="20" font-weight="700">SGX enclave</text>
    <text x="165" y="220" font-size="14" fill="#9fb4c8">protected execution</text>
    <text x="387" y="190" font-size="20" font-weight="700">M2M</text>
    <text x="387" y="220" font-size="14" fill="#9fb4c8">PKT_MATCH event</text>
    <text x="609" y="190" font-size="20" font-weight="700">64 B monitor</text>
    <text x="609" y="220" font-size="14" fill="#9fb4c8">address filtering</text>
    <text x="813" y="190" font-size="20" font-weight="700">Recovery</text>
    <text x="813" y="220" font-size="14" fill="#9fb4c8">behavior and secrets</text>
  </g>
  <g stroke="#ff5f6d" stroke-width="4" fill="none" filter="url(#glow)">
    <path d="M260 200C280 200 272 200 292 200"/>
    <path d="M482 200C502 200 494 200 514 200"/>
    <path d="M704 200C724 200 716 200 736 200"/>
  </g>
  <g fill="#4fd1c5">
    <circle cx="260" cy="200" r="5"/>
    <circle cx="482" cy="200" r="5"/>
    <circle cx="704" cy="200" r="5"/>
  </g>
  <text x="480" y="345" text-anchor="middle" fill="#9fb4c8" font-family="Arial, sans-serif" font-size="16">Passive, AEX-free monitoring through uncore PMCs</text>
</svg>
```

- [ ] **Step 5: Create the Libjpeg demonstration SVG**

Create `website/assets/libjpeg-demo.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 420" role="img" aria-labelledby="title desc">
  <title id="title">Libjpeg picture recovery concept</title>
  <desc id="desc">A safe visualization of monitored traces correlating with picture reconstruction.</desc>
  <rect width="720" height="420" rx="24" fill="#111922"/>
  <rect x="52" y="54" width="250" height="250" rx="18" fill="#0d1117" stroke="#4fd1c5" stroke-width="2"/>
  <g fill="#2dd4bf">
    <rect x="82" y="84" width="44" height="44"/><rect x="132" y="84" width="44" height="44" opacity=".35"/><rect x="182" y="84" width="44" height="44" opacity=".65"/><rect x="232" y="84" width="44" height="44" opacity=".25"/>
    <rect x="82" y="134" width="44" height="44" opacity=".2"/><rect x="132" y="134" width="44" height="44" opacity=".8"/><rect x="182" y="134" width="44" height="44" opacity=".45"/><rect x="232" y="134" width="44" height="44" opacity=".75"/>
    <rect x="82" y="184" width="44" height="44" opacity=".6"/><rect x="132" y="184" width="44" height="44" opacity=".25"/><rect x="182" y="184" width="44" height="44" opacity=".9"/><rect x="232" y="184" width="44" height="44" opacity=".4"/>
    <rect x="82" y="234" width="44" height="44" opacity=".3"/><rect x="132" y="234" width="44" height="44" opacity=".7"/><rect x="182" y="234" width="44" height="44" opacity=".2"/><rect x="232" y="234" width="44" height="44" opacity=".95"/>
  </g>
  <path d="M330 180H430" stroke="#ff5f6d" stroke-width="4" stroke-linecap="round"/>
  <path d="M414 164L438 180L414 196" fill="none" stroke="#ff5f6d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <g stroke="#4fd1c5" stroke-width="3" fill="none">
    <path d="M470 105C500 75 520 135 550 105S600 135 630 105"/>
    <path d="M470 160C500 130 520 190 550 160S600 190 630 160"/>
    <path d="M470 215C500 185 520 245 550 215S600 245 630 215"/>
  </g>
  <text x="177" y="340" fill="#f8fbff" font-family="Arial, sans-serif" font-size="22" font-weight="700" text-anchor="middle">Enclaved Libjpeg</text>
  <text x="552" y="340" fill="#f8fbff" font-family="Arial, sans-serif" font-size="22" font-weight="700" text-anchor="middle">Trace correlation</text>
  <text x="360" y="386" fill="#9fb4c8" font-family="Arial, sans-serif" font-size="16" text-anchor="middle">High-level preview only, without operational attack steps</text>
</svg>
```

- [ ] **Step 6: Create the RSA demonstration SVG**

Create `website/assets/rsa-demo.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 420" role="img" aria-labelledby="title desc">
  <title id="title">TLBlur-protected RSA recovery concept</title>
  <desc id="desc">A safe visualization of passive monitoring in the presence of TLBlur-oriented defenses.</desc>
  <rect width="720" height="420" rx="24" fill="#111922"/>
  <rect x="56" y="76" width="190" height="230" rx="20" fill="#0d1117" stroke="#718096"/>
  <text x="151" y="128" fill="#f8fbff" font-family="Arial, sans-serif" font-size="22" font-weight="700" text-anchor="middle">TLBlur</text>
  <text x="151" y="162" fill="#9fb4c8" font-family="Arial, sans-serif" font-size="15" text-anchor="middle">AEX-aware defense</text>
  <g stroke="#718096" stroke-width="2"><path d="M92 210H210"/><path d="M92 242H210"/><path d="M92 274H210"/></g>
  <rect x="286" y="76" width="170" height="230" rx="20" fill="#0d1117" stroke="#4fd1c5" stroke-width="2"/>
  <text x="371" y="128" fill="#f8fbff" font-family="Arial, sans-serif" font-size="22" font-weight="700" text-anchor="middle">AEX-free</text>
  <text x="371" y="162" fill="#9fb4c8" font-family="Arial, sans-serif" font-size="15" text-anchor="middle">passive signal</text>
  <path d="M318 230C340 200 360 260 382 230S424 260 444 230" fill="none" stroke="#4fd1c5" stroke-width="4"/>
  <rect x="496" y="76" width="168" height="230" rx="20" fill="#0d1117" stroke="#ff5f6d" stroke-width="2"/>
  <text x="580" y="128" fill="#f8fbff" font-family="Arial, sans-serif" font-size="22" font-weight="700" text-anchor="middle">RSA</text>
  <text x="580" y="162" fill="#9fb4c8" font-family="Arial, sans-serif" font-size="15" text-anchor="middle">key recovery</text>
  <g fill="#ff5f6d"><circle cx="540" cy="226" r="8"/><circle cx="580" cy="226" r="8"/><circle cx="620" cy="226" r="8"/></g>
  <path d="M246 190H286M456 190H496" stroke="#ff5f6d" stroke-width="4" stroke-linecap="round"/>
  <text x="360" y="360" fill="#9fb4c8" font-family="Arial, sans-serif" font-size="16" text-anchor="middle">Conceptual explanation of why passive monitoring changes the defense surface</text>
</svg>
```

- [ ] **Step 7: Run the site tests**

Run:

```powershell
C:\Users\30418\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test website\tests\site.test.mjs
```

Expected: FAIL because `website/styles.css` and `website/main.js` do not exist yet. The PDF and HTML-related assertions should now be closer to passing.

## Task 3: Visual System CSS

**Files:**
- Create: `website/styles.css`
- Test: `website/tests/site.test.mjs`

- [ ] **Step 1: Create the stylesheet**

Create `website/styles.css`:

```css
:root {
  color-scheme: dark;
  --bg: #080d12;
  --panel: #101820;
  --panel-strong: #111c26;
  --text: #f8fbff;
  --muted: #9fb4c8;
  --line: #22313f;
  --cyan: #4fd1c5;
  --cyan-strong: #2dd4bf;
  --red: #ff5f6d;
  --amber: #f6c85f;
  --radius: 8px;
  --max: 1160px;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background:
    linear-gradient(90deg, rgba(79, 209, 197, 0.06) 1px, transparent 1px),
    linear-gradient(rgba(79, 209, 197, 0.04) 1px, transparent 1px),
    var(--bg);
  background-size: 72px 72px;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.6;
}

a {
  color: inherit;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px clamp(20px, 4vw, 48px);
  border-bottom: 1px solid rgba(159, 180, 200, 0.18);
  background: rgba(8, 13, 18, 0.86);
  backdrop-filter: blur(16px);
}

.brand {
  color: var(--text);
  font-size: 18px;
  font-weight: 800;
  text-decoration: none;
}

.site-nav {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.site-nav a {
  color: var(--muted);
  font-size: 14px;
  text-decoration: none;
}

.site-nav a:hover,
.site-nav a.is-active {
  color: var(--cyan);
}

.hero {
  min-height: calc(100vh - 72px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.8fr);
  gap: clamp(28px, 5vw, 72px);
  align-items: center;
  max-width: var(--max);
  margin: 0 auto;
  padding: clamp(56px, 8vw, 108px) clamp(20px, 4vw, 48px) 44px;
}

.hero h1 {
  margin: 0;
  font-size: clamp(58px, 13vw, 150px);
  line-height: 0.92;
  letter-spacing: 0;
}

.eyebrow,
.section-kicker {
  margin: 0 0 12px;
  color: var(--cyan);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.hero-subtitle {
  max-width: 780px;
  margin: 22px 0 0;
  color: var(--text);
  font-size: clamp(23px, 3.2vw, 44px);
  line-height: 1.12;
  font-weight: 720;
}

.hero-summary,
.section > p {
  max-width: 820px;
  color: var(--muted);
  font-size: 18px;
}

.hero-actions,
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.button,
.material-card {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  text-decoration: none;
}

.button {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  color: var(--text);
  font-weight: 750;
}

.button.primary {
  background: var(--cyan);
  color: #061014;
  border-color: var(--cyan);
}

.button.secondary {
  background: rgba(79, 209, 197, 0.12);
  border-color: rgba(79, 209, 197, 0.55);
}

.button.ghost {
  color: var(--muted);
}

.tag-list {
  padding: 0;
  list-style: none;
}

.tag-list li {
  border: 1px solid rgba(79, 209, 197, 0.35);
  border-radius: 999px;
  padding: 7px 11px;
  color: var(--cyan);
  background: rgba(79, 209, 197, 0.08);
  font-size: 13px;
  font-weight: 750;
}

.hero-visual img,
.wide-asset,
.demo-card img {
  width: 100%;
  height: auto;
  display: block;
}

.hero-visual {
  margin: 0;
}

.section {
  max-width: var(--max);
  margin: 0 auto;
  padding: clamp(56px, 8vw, 100px) clamp(20px, 4vw, 48px);
  border-top: 1px solid rgba(159, 180, 200, 0.14);
}

.section h2 {
  max-width: 840px;
  margin: 0;
  font-size: clamp(34px, 5vw, 72px);
  line-height: 1.05;
  letter-spacing: 0;
}

.claim-grid,
.demo-grid,
.finding-grid,
.materials-grid {
  display: grid;
  gap: 16px;
  margin-top: 30px;
}

.claim-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.finding-grid,
.materials-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.demo-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.claim-grid article,
.demo-card,
.finding-grid article,
.material-card,
.faq-list details {
  border: 1px solid rgba(159, 180, 200, 0.18);
  border-radius: var(--radius);
  background: rgba(16, 24, 32, 0.84);
}

.claim-grid article,
.finding-grid article,
.material-card,
.faq-list details {
  padding: 20px;
}

.claim-grid span {
  color: var(--red);
  font-weight: 900;
}

.claim-grid h3,
.demo-card h3,
.finding-grid h3 {
  margin: 8px 0;
  color: var(--text);
}

.claim-grid p,
.demo-card p,
.finding-grid p,
.faq-list p {
  color: var(--muted);
}

.wide-asset {
  margin-top: 30px;
  border: 1px solid rgba(79, 209, 197, 0.22);
  border-radius: var(--radius);
}

.demo-card {
  overflow: hidden;
}

.demo-card div {
  padding: 20px;
}

.material-card {
  min-height: 116px;
  color: var(--text);
  text-align: left;
  appearance: none;
  font: inherit;
}

.material-card span {
  display: block;
  color: var(--muted);
  font-size: 14px;
}

.material-card strong {
  display: block;
  margin-top: 10px;
  font-size: 22px;
}

.material-card.active {
  background: rgba(79, 209, 197, 0.12);
  border-color: rgba(79, 209, 197, 0.5);
  cursor: pointer;
}

.material-card.gated {
  background: rgba(246, 200, 95, 0.08);
  border-color: rgba(246, 200, 95, 0.28);
}

.bibtex {
  margin-top: 20px;
  overflow-x: auto;
  padding: 20px;
  border-radius: var(--radius);
  border: 1px solid rgba(159, 180, 200, 0.18);
  background: #05080c;
  color: #d9f7f4;
}

.faq-list {
  display: grid;
  gap: 12px;
  margin-top: 30px;
}

.faq-list summary {
  cursor: pointer;
  color: var(--text);
  font-weight: 780;
}

.site-footer {
  max-width: var(--max);
  margin: 0 auto;
  padding: 36px clamp(20px, 4vw, 48px) 64px;
  color: var(--muted);
  border-top: 1px solid rgba(159, 180, 200, 0.14);
}

@media (max-width: 880px) {
  .site-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero {
    grid-template-columns: 1fr;
  }

  .claim-grid,
  .demo-grid,
  .finding-grid,
  .materials-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Run the site tests**

Run:

```powershell
C:\Users\30418\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test website\tests\site.test.mjs
```

Expected: FAIL because `website/main.js` does not exist yet. CSS-related unfinished-token checks should pass.

## Task 4: Progressive Enhancement JavaScript

**Files:**
- Create: `website/main.js`
- Test: `website/tests/site.test.mjs`

- [ ] **Step 1: Create the JavaScript file**

Create `website/main.js`:

```javascript
const copyButton = document.querySelector('[data-copy-bibtex]');
const bibtex = document.querySelector('#bibtex');

if (copyButton && bibtex && navigator.clipboard) {
  copyButton.addEventListener('click', async () => {
    const original = copyButton.querySelector('strong').textContent;
    await navigator.clipboard.writeText(bibtex.textContent.trim());
    copyButton.querySelector('strong').textContent = 'Copied';
    window.setTimeout(() => {
      copyButton.querySelector('strong').textContent = original;
    }, 1600);
  });
}

const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && observedSections.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0.01 });

  observedSections.forEach((section) => observer.observe(section));
}

document.querySelectorAll('.faq-list details').forEach((item) => {
  item.addEventListener('toggle', () => {
    item.setAttribute('data-open', item.open ? 'true' : 'false');
  });
});
```

- [ ] **Step 2: Run the site tests**

Run:

```powershell
C:\Users\30418\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test website\tests\site.test.mjs
```

Expected: PASS for all tests in `website/tests/site.test.mjs`.

- [ ] **Step 3: Commit the static site**

Run:

```powershell
git add website
git commit -m "feat: add UncoreBleed static website"
```

Expected: Commit includes `website/index.html`, `website/styles.css`, `website/main.js`, SVG assets, PDF, and site tests.

## Task 5: GitHub Pages Workflow and Usage Docs

**Files:**
- Create: `.github/workflows/pages.yml`
- Create: `website/tests/deploy.test.mjs`
- Create: `website/README.md`
- Test: `website/tests/deploy.test.mjs`

- [ ] **Step 1: Write the failing deployment test**

Create `website/tests/deploy.test.mjs`:

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteDir = dirname(dirname(fileURLToPath(import.meta.url)));
const repoDir = dirname(siteDir);
const workflowPath = join(repoDir, '.github', 'workflows', 'pages.yml');
const readWorkflow = () => readFileSync(workflowPath, 'utf8');

test('GitHub Pages workflow exists', () => {
  assert.equal(existsSync(workflowPath), true, 'Pages workflow should exist');
});

test('GitHub Pages workflow deploys the website directory', () => {
  const workflow = readWorkflow();
  assert.match(workflow, /upload-pages-artifact@v3/);
  assert.match(workflow, /path:\s+website/);
  assert.match(workflow, /deploy-pages@v4/);
});

test('website README explains local preview and custom domain launch steps', () => {
  const readme = readFileSync(join(siteDir, 'README.md'), 'utf8');
  assert.match(readme, /Local preview/);
  assert.match(readme, /GitHub Pages/);
  assert.match(readme, /custom domain/i);
  assert.match(readme, /CNAME/);
});
```

- [ ] **Step 2: Run the failing deployment test**

Run:

```powershell
C:\Users\30418\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test website\tests\deploy.test.mjs
```

Expected: FAIL because `.github/workflows/pages.yml` and `website/README.md` do not exist yet.

- [ ] **Step 3: Create the GitHub Pages workflow**

Create `.github/workflows/pages.yml`:

```yaml
name: Deploy UncoreBleed website

on:
  push:
    branches:
      - master
      - main
    paths:
      - "website/**"
      - ".github/workflows/pages.yml"
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: website

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 4: Create website usage documentation**

Create `website/README.md`:

```markdown
# UncoreBleed Website

This directory contains the static UncoreBleed research website.

## Local preview

Run this from the repository root:

```powershell
C:\Users\30418\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m http.server 8000 --directory website
```

Open `http://localhost:8000`.

## GitHub Pages

The workflow at `.github/workflows/pages.yml` deploys the `website/` directory to GitHub Pages when changes are pushed to `master` or `main`.

In GitHub, open the repository settings and set Pages source to GitHub Actions.

## Custom domain

When the final domain is chosen, create `website/CNAME` containing exactly the chosen host name, for example:

```text
www.example.org
```

Then configure DNS at the domain provider and enable HTTPS in GitHub Pages after DNS propagation. Prefer a `www` host and redirect the apex domain to it.

## Release-gated materials

The current site labels code, artifact, and detailed demo material as release-gated. Update those cards only after the authors decide which materials are public.
```

- [ ] **Step 5: Run all website tests**

Run:

```powershell
C:\Users\30418\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test website\tests\site.test.mjs website\tests\deploy.test.mjs
```

Expected: PASS for both test files.

- [ ] **Step 6: Commit deployment setup**

Run:

```powershell
git add .github website\README.md website\tests\deploy.test.mjs
git commit -m "ci: add GitHub Pages deployment for UncoreBleed site"
```

Expected: Commit includes the Pages workflow, deployment test, and website README.

## Task 6: Local Preview and Visual Verification

**Files:**
- No new files required.
- Verify: `website/index.html`, `website/styles.css`, `website/main.js`

- [ ] **Step 1: Start a local static server**

Run:

```powershell
C:\Users\30418\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m http.server 8000 --directory website
```

Expected: Server prints `Serving HTTP on :: port 8000` or equivalent.

- [ ] **Step 2: Open the local site**

Open:

```text
http://localhost:8000
```

Expected: The UncoreBleed hero appears, the pipeline image loads, and the first viewport hints at the next section.

- [ ] **Step 3: Verify desktop layout**

At a desktop-width viewport, confirm:

- The sticky navigation stays readable.
- Hero text and the pipeline visual do not overlap.
- Technical tags fit on one or more clean rows.
- Demo cards and finding cards align in their grids.
- Materials cards show `Download PDF`, `Copy citation`, `Coming soon`, `Planned release`, and `Preview only`.
- FAQ details expand and collapse.

- [ ] **Step 4: Verify mobile layout**

At a narrow mobile-width viewport, confirm:

- Navigation wraps without covering the hero.
- Hero title does not overflow horizontally.
- All grids collapse to one column.
- Buttons and material cards remain tappable.
- No text overlaps adjacent sections.

- [ ] **Step 5: Verify all tests one final time**

Run:

```powershell
C:\Users\30418\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test website\tests\site.test.mjs website\tests\deploy.test.mjs
```

Expected: PASS for both test files.

- [ ] **Step 6: Commit visual verification adjustments if any were needed**

If CSS or HTML needed changes during visual verification, run:

```powershell
git add website
git commit -m "fix: polish UncoreBleed website responsive layout"
```

Expected: A commit exists only if verification required changes.

## Self-Review

Spec coverage:

- Full-English research landing page: Tasks 2 and 3.
- Basic introduction and core claim: Task 2 `#hero` and `#claim`.
- Demonstrations: Task 2 `#demos` and SVG assets.
- Simple FAQ: Task 2 `#faq`, Task 4 progressive enhancement.
- Release-gated material states: Task 2 materials grid and Task 1 tests.
- GitHub Pages custom-domain readiness: Task 5 workflow and README.
- No backend: all tasks use static files only.

Placeholder scan:

- The plan uses intentional release labels: `Coming soon`, `Planned release`, and `Preview only`.
- The plan does not use unfinished implementation marker words directly.

Type and file consistency:

- `index.html` references `styles.css`, `main.js`, and assets that Task 2 and Task 3 create.
- Tests reference the same file names used by the implementation tasks.
- The deployment test checks the workflow path and `website/` artifact path used in Task 5.
