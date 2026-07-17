# UncoreBleed RSA Demo Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the conceptual RSA illustration with the supplied recorded TLBlur-protected RSA demonstration in the published UncoreBleed site.

**Architecture:** Keep the existing single-page `#demo` section and replace only its illustration figure with a native HTML video player. Bundle the supplied MP4 in `website/assets/`, validate the static HTML/CSS contract with the existing Node.js test suite, and deploy through the already-configured GitHub Pages workflow.

**Tech Stack:** Static HTML, CSS, native HTML5 video, Node.js built-in test runner, GitHub Pages Actions.

## Global Constraints

- Use `website/assets/uncorebleed-rsa-demo.mp4` as the public video asset.
- Use native controls with `muted`, `playsinline`, and `preload="metadata"`.
- Do not set `autoplay` or `loop`.
- Keep the presentation high-level; do not add exploit instructions, source code, or secret material.
- Preserve the existing section IDs, navigation, paper link, citation behavior, and responsive layout.

---

### Task 1: Define the Recorded-Demo Contract

**Files:**
- Modify: `website/tests/site.test.mjs`
- Create: `website/assets/uncorebleed-rsa-demo.mp4`
- Delete: `website/assets/rsa-demo.svg`

**Interfaces:**
- Consumes: The source file `C:\Users\30418\Desktop\processing.mp4` supplied by the authors.
- Produces: A bundled MP4 asset and static assertions that the `#demo` section uses a manually initiated, muted native video player.

- [ ] **Step 1: Replace the obsolete required asset entry and add the failing video contract**

  In `D:\UncoreWbesite\website\tests\site.test.mjs`, replace the `assets/rsa-demo.svg` entry in the `required static website files exist` array with `assets/uncorebleed-rsa-demo.mp4`. Add this test after `site focuses on one TLBlur-protected RSA demo`:

  ```javascript
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
  });
  ```

- [ ] **Step 2: Run the static site test to confirm it fails**

  Run:

  ```powershell
  C:\Users\30418\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test website\tests\site.test.mjs
  ```

  Expected: FAIL because `assets/uncorebleed-rsa-demo.mp4` and the required `<video>` tag do not exist yet.

- [ ] **Step 3: Copy the approved recording into the public asset directory**

  Run:

  ```powershell
  Copy-Item -LiteralPath 'C:\Users\30418\Desktop\processing.mp4' -Destination 'D:\UncoreWbesite\website\assets\uncorebleed-rsa-demo.mp4'
  Remove-Item -LiteralPath 'D:\UncoreWbesite\website\assets\rsa-demo.svg'
  ```

  Expected: `website/assets/uncorebleed-rsa-demo.mp4` exists and `website/assets/rsa-demo.svg` no longer exists.

### Task 2: Render the Primary Video Layout

**Files:**
- Modify: `website/index.html`
- Modify: `website/styles.css`
- Test: `website/tests/site.test.mjs`

**Interfaces:**
- Consumes: `assets/uncorebleed-rsa-demo.mp4` produced by Task 1.
- Produces: A responsive `.demo-video` figure containing the native player and a concise, safety-focused caption.

- [ ] **Step 1: Replace the conceptual illustration figure with the real video**

  In `D:\UncoreWbesite\website\index.html`, replace the complete `<figure class="demo-figure">...</figure>` inside `#demo` with:

  ```html
  <figure class="demo-video">
    <video class="demo-player" controls muted playsinline preload="metadata" src="assets/uncorebleed-rsa-demo.mp4" aria-label="Recorded demonstration of UncoreBleed recovering a TLBlur-protected RSA private key">
      Your browser does not support embedded video. Download the recorded demonstration instead.
    </video>
    <figcaption>Recorded TLBlur-protected RSA key recovery demonstration. This public overview intentionally omits operational attack instructions.</figcaption>
  </figure>
  ```

- [ ] **Step 2: Convert the Demo section from a split grid into the selected primary-video layout**

  In `D:\UncoreWbesite\website\styles.css`, replace the existing `.demo`, `.demo-figure`, `.demo-figure img`, and `.demo-figure figcaption` rules with:

  ```css
  .demo {
    display: block;
  }

  .demo-video {
    max-width: 960px;
    margin: 34px auto 0;
  }

  .demo-player {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: #171717;
  }

  .demo-video figcaption {
    margin-top: 10px;
    color: var(--muted);
    font-size: .9rem;
    font-style: italic;
  }
  ```

  In the `@media (max-width: 900px)` rule, change:

  ```css
  .intro,
  .demo {
    grid-template-columns: 1fr;
  }
  ```

  to:

  ```css
  .intro {
    grid-template-columns: 1fr;
  }
  ```

- [ ] **Step 3: Strengthen the test with the responsive player contract**

  Add this assertion inside `RSA demo uses a manually initiated native video player` in `D:\UncoreWbesite\website\tests\site.test.mjs`:

  ```javascript
  const css = readSiteFile('styles.css');
  assert.match(css, /\.demo-player\s*\{[\s\S]*?width:\s*100%;[\s\S]*?aspect-ratio:\s*16\s*\/\s*9/);
  ```

- [ ] **Step 4: Run the complete site test suite**

  Run:

  ```powershell
  C:\Users\30418\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test website\tests\site.test.mjs website\tests\main.test.mjs website\tests\deploy.test.mjs
  ```

  Expected: all tests pass, including the new video contract and existing citation/deployment checks.

- [ ] **Step 5: Commit the implementation**

  Run:

  ```powershell
  git -c safe.directory=D:/UncoreWbesite add website
  git -c safe.directory=D:/UncoreWbesite commit -m "feat: add recorded RSA demo video"
  ```

  Expected: the commit adds the MP4, updates the Demo markup and responsive styling, updates the site test, and removes the unused SVG.

### Task 3: Verify the Public Page and Publish

**Files:**
- Verify: `website/index.html`
- Verify: `website/styles.css`
- Verify: `website/assets/uncorebleed-rsa-demo.mp4`
- Verify: `.github/workflows/pages.yml`

**Interfaces:**
- Consumes: The committed static site from Task 2 and the existing GitHub Pages deployment workflow.
- Produces: A live GitHub Pages site where the Demo section serves the recorded video.

- [ ] **Step 1: Start a local static server for browser verification**

  Run:

  ```powershell
  $cmd = '"C:\Users\30418\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" -m http.server 8000 --bind 127.0.0.1 --directory "D:\UncoreWbesite\website"'
  C:\Windows\System32\cmd.exe /c start "UncoreBleedServer" /b $cmd
  ```

  Expected: `http://127.0.0.1:8000/` responds with status 200.

- [ ] **Step 2: Check the player at desktop and mobile widths**

  Open `http://127.0.0.1:8000/#demo` in a browser and verify:

  ```text
  Desktop: the player is wide, centered, uncropped, and has visible native controls.
  Mobile: the player fits within the section without horizontal scrolling or clipped controls.
  Playback: the video remains paused and muted until the visitor starts it.
  Content: the caption identifies the recorded RSA demonstration and does not reveal operational details.
  ```

- [ ] **Step 3: Push the committed implementation to GitHub**

  Run:

  ```powershell
  git -c safe.directory=D:/UncoreWbesite push origin main
  ```

  Expected: the `main` branch is updated at `https://github.com/TrojanB-33/uncorebleed-site`.

- [ ] **Step 4: Confirm the GitHub Pages deployment and public video reference**

  Run:

  ```powershell
  $response = Invoke-WebRequest -Uri 'https://trojanb-33.github.io/uncorebleed-site/' -UseBasicParsing -TimeoutSec 30
  [pscustomobject]@{
    StatusCode = $response.StatusCode
    HasDemoVideo = $response.Content.Contains('assets/uncorebleed-rsa-demo.mp4')
    HasAutoplay = $response.Content -match '<video[^>]*\bautoplay\b'
  } | ConvertTo-Json
  ```

  Expected: `StatusCode` is `200`, `HasDemoVideo` is `true`, and `HasAutoplay` is `false`.
