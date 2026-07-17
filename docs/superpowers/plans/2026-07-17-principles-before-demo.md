# Principles Before Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Present UncoreBleed's attack principles before the recorded RSA demo without changing either section's content or behavior.

**Architecture:** The static page remains a single `index.html` document. The work changes only document order: `#principles` becomes the section immediately before `#demo`; existing navigation targets, CSS classes, and video attributes stay intact.

**Tech Stack:** Static HTML, Node.js built-in test runner, GitHub Pages Actions.

## Global Constraints

- Preserve the IDs `principles` and `demo`, so navigation links stay unchanged.
- Preserve all section content, the recorded MP4 player, captions, CSS, and JavaScript behavior.
- Verify the full test suite, merge the focused branch into `main`, and push it to publish through GitHub Pages.

---

### Task 1: Enforce and Apply the Reader-First Section Order

**Files:**
- Modify: `website/tests/site.test.mjs`
- Modify: `website/index.html`

**Interfaces:**
- Consumes: The existing `#principles` and `#demo` section IDs.
- Produces: A document-order contract that places the attack explanation before the recorded demonstration.

- [ ] **Step 1: Add the failing document-order test**

  Add this test after `home page contains the required research-site sections` in `D:\UncoreWbesite\website\tests\site.test.mjs`:

  ```javascript
  test('principles appear before the recorded demo in document order', () => {
    const html = readSiteFile('index.html');
    const principlesOffset = html.indexOf('id="principles"');
    const demoOffset = html.indexOf('id="demo"');

    assert.ok(principlesOffset >= 0, 'the Principles section should exist');
    assert.ok(demoOffset >= 0, 'the Demo section should exist');
    assert.ok(principlesOffset < demoOffset, 'Principles should appear before Demo');
  });
  ```

- [ ] **Step 2: Run the site test to confirm it fails**

  Run:

  ```powershell
  C:\Users\30418\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test website\tests\site.test.mjs
  ```

  Expected: FAIL with `Principles should appear before Demo` because `#demo` currently precedes `#principles`.

- [ ] **Step 3: Move the existing complete Principles section directly before the existing complete Demo section**

  In `D:\UncoreWbesite\website\index.html`, leave the two sections unchanged internally and make their surrounding document order exactly:

  ```html
  <section class="principles section" id="principles">
    <div class="section-copy">
      <p class="eyebrow">How it works</p>
      <h2>UncoreBleed turns a shared processor monitor into a precise enclave side channel.</h2>
      <p>The attack relies on an address-filterable uncore event in the mesh-to-memory subsystem. Instead of interrupting the enclave, it observes memory traffic that remains visible outside the core PMC suppression boundary.</p>
    </div>
    <div class="principle-list" aria-label="Main properties">
      <article><strong>AEX-free</strong><p>No page faults, interrupts, or asynchronous enclave exits are needed to collect the signal.</p></article>
      <article><strong>High-resolution</strong><p>M2M PKT_MATCH enables selected address monitoring at 64 B granularity, exposing cache-line scale behavior.</p></article>
      <article><strong>Low-noise</strong><p>Hardware address filtering counts targeted memory blocks and suppresses unrelated system activity.</p></article>
    </div>
  </section>

  <section class="demo section" id="demo">
    <div class="section-copy">
      <p class="eyebrow">Demo</p>
      <h2>Recovering TLBlur-protected RSA keys.</h2>
      <p>TLBlur with AEX-Notify is designed around attacks that observe chosen execution points through asynchronous enclave exits. UncoreBleed changes the setting: it passively monitors selected DRAM accesses through uncore PMCs and recovers RSA private keys from a single decryption without triggering AEXs.</p>
    </div>
    <figure class="demo-video">
      <video class="demo-player" controls muted playsinline preload="metadata" src="assets/uncorebleed-rsa-demo.mp4" aria-label="Recorded demonstration of UncoreBleed recovering a TLBlur-protected RSA private key">
        Your browser does not support embedded video. <a href="assets/uncorebleed-rsa-demo.mp4">Open the recorded demonstration.</a>
      </video>
      <figcaption>Recorded TLBlur-protected RSA key recovery demonstration. This public overview intentionally omits operational attack instructions.</figcaption>
    </figure>
  </section>
  ```

- [ ] **Step 4: Run the complete website suite**

  Run:

  ```powershell
  C:\Users\30418\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test website\tests\site.test.mjs website\tests\main.test.mjs website\tests\deploy.test.mjs
  ```

  Expected: 18 tests pass with no failures.

- [ ] **Step 5: Commit the section-order implementation**

  Run:

  ```powershell
  git -c safe.directory=D:/UncoreWbesite add website
  git -c safe.directory=D:/UncoreWbesite commit -m "content: show principles before demo"
  ```

  Expected: the commit contains only the reordered sections and their regression test.

### Task 2: Integrate and Publish

**Files:**
- Verify: `website/index.html`
- Verify: `website/tests/site.test.mjs`
- Verify: `.github/workflows/pages.yml`

**Interfaces:**
- Consumes: The committed section-order implementation from Task 1.
- Produces: A published GitHub Pages site where `#principles` precedes `#demo`.

- [ ] **Step 1: Merge the feature branch into `main` and re-run all tests**

  Run:

  ```powershell
  git -c safe.directory=D:/UncoreWbesite merge codex/principles-before-demo
  C:\Users\30418\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test website\tests\site.test.mjs website\tests\main.test.mjs website\tests\deploy.test.mjs
  ```

  Expected: merge succeeds and 18 tests pass.

- [ ] **Step 2: Push `main` and confirm the public page**

  Run:

  ```powershell
  git -c safe.directory=D:/UncoreWbesite push origin main
  $response = Invoke-WebRequest -Uri 'https://trojanb-33.github.io/uncorebleed-site/' -UseBasicParsing -TimeoutSec 30
  [pscustomobject]@{
    StatusCode = $response.StatusCode
    PrinciplesBeforeDemo = $response.Content.IndexOf('id="principles"') -lt $response.Content.IndexOf('id="demo"')
  } | ConvertTo-Json
  ```

  Expected: `StatusCode` is `200` and `PrinciplesBeforeDemo` is `true`.
