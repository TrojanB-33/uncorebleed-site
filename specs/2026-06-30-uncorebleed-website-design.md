# UncoreBleed Research Website Design

Date: 2026-06-30

## Goal

Build a full-English research landing page for the UncoreBleed paper. The site should communicate the paper's core security finding, provide a safe high-level demonstration of the work, and give researchers a clear path to the paper, citation, and release-gated materials.

The site is inspired by the genre of security research websites such as `sgx.fail`, but it should not copy that page. UncoreBleed should feel sharp, credible, and technically grounded rather than sensational.

## Audience

The primary audience is security researchers and security engineers. The page should also serve academic readers who need paper materials quickly and technically curious readers who need a clear explanation of SGX, PMCs, and the impact.

This creates three content layers:

- Plain-English explanation for first-time readers.
- Technical anchors for security engineers and researchers.
- Paper materials for academic readers.

## Core Message

The homepage should lead with the paper identity and its main claim:

> UncoreBleed: AEX-free, high-resolution, and low-noise side-channel attacks on SGX enclaved execution.

Supporting message:

> UncoreBleed shows that while SGX suppresses sensitive core PMCs, uncore performance monitoring can still expose enclave-correlated memory behavior.

The page should repeatedly connect the work to four memorable technical anchors:

- AEX-free monitoring.
- 64 B granularity.
- Low-noise uncore PMC observation.
- SGX enclave confidentiality assumptions.

## Information Architecture

The site should be a one-page static research site with in-page navigation.

1. Hero
   - Project name: UncoreBleed.
   - Subtitle: AEX-free, high-resolution, and low-noise side-channel attacks on SGX enclaved execution.
   - Short paragraph explaining the SGX PMC assumption being challenged.
   - Primary buttons: Read the Paper, Explore the Attack, FAQ.
   - Compact technical tags: AEX-free, 64 B granularity, Low-noise, SGX, Uncore PMC.

2. Core Claim
   - Explain that prior work and common assumptions focus on sensitive core PMCs being suppressed in SGX.
   - State the UncoreBleed finding: uncore PMCs remain active and can record enclave-correlated events.
   - Keep the paragraph readable for non-specialists while preserving the precise distinction between core and uncore PMCs.

3. Attack Pipeline
   - Use a clear diagram: production SGX enclave -> M2M PKT_MATCH -> 64 B address-based monitoring -> recovered behavior/secrets.
   - Present the pipeline as conceptual and explanatory, not as exploit instructions.
   - Include a short note that UncoreBleed is passive and AEX-free.

4. Demonstrations
   - Demo 1: Recovering pictures from enclaved Libjpeg.
     - Use a safe visual explanation of reconstruction from monitored behavior.
     - Avoid publishing operational exploit details.
   - Demo 2: Recovering TLBlur-protected RSA keys.
     - Explain why AEX-free monitoring matters against defenses built around AEX/interrupt-aware behavior.
     - Keep the demo high-level until release decisions are final.

5. Technical Findings
   - Present compact finding cards:
     - SGX disables sensitive core PMCs, but uncore PMCs can remain active.
     - PKT_MATCH in the M2M subsystem enables address-based filtering.
     - The monitoring primitive reaches 64 B granularity.
     - Parallel monitoring across M2M boxes supports high-resolution observation.
     - The attack remains relevant against TLBlur with AEX-Notify because it does not rely on triggering AEXs.
   - Each card should have a short plain-language sentence and a precise technical sentence.

6. Paper Materials
   - Paper PDF: available when the public version is selected.
   - BibTeX: available.
   - Code: release-gated label, initially `Coming soon`.
   - Artifact: release-gated label, initially `Planned release`.
   - Demo materials: release-gated label, initially `Preview only`.
   - Contact: corresponding authors or project contact once confirmed.

7. FAQ
   - What is Intel SGX?
   - What are PMCs?
   - What is the difference between core and uncore PMCs?
   - What does AEX-free mean?
   - Why does 64 B granularity matter?
   - Does this break every SGX deployment?
   - How does this relate to TLBlur and AEX-Notify?
   - What should vendors or platform operators consider?

8. Footer
   - Paper title.
   - Authors and affiliations.
   - Links to paper, citation, code/artifact status, and contact.
   - Short responsible disclosure or release-status note if needed.

## Visual Design

The recommended visual direction is Dark Technical Editorial.

The page should use a deep graphite or near-black background, crisp white text, cyan signal accents, and restrained red or amber warnings. It should avoid exaggerated "hacker" visuals, skulls, breach imagery, heavy glitch effects, or commercial security product styling.

Visual motifs should be derived from the research:

- Memory/cache-line lanes.
- Monitoring traces.
- Mesh or uncore interconnect hints.
- Signal versus noise contrast.
- 64 B block highlighting.

The first viewport should make `UncoreBleed` the dominant signal. It should include a subtle technical visual behind or beside the hero copy, such as a memory-lane trace diagram. The page should hint at the next section within the first viewport so it feels like a research story rather than a static title card.

## Component Design

The implementation should include these components:

- Sticky or lightweight top navigation with in-page anchors.
- Hero section with title, subtitle, CTA buttons, and technical tags.
- Pipeline diagram component.
- Demonstration panels for Libjpeg and RSA.
- Technical finding cards.
- Materials/status grid.
- FAQ accordion.
- BibTeX block with copy button if JavaScript is used.
- Footer with authors, affiliations, and links.

The site should remain usable without a backend. JavaScript should be optional and limited to progressive enhancement such as FAQ toggles, copy-to-clipboard, or small animation.

## Content Safety and Release Gating

Because public release decisions are not final, the design should support materials that look intentional before everything is public.

Initial public states:

- Paper: enabled once the final public PDF is placed in the site.
- BibTeX: enabled.
- Code: disabled with `Coming soon`.
- Artifact: disabled with `Planned release`.
- Demo: visible as high-level explanation and visual preview only.

The site should not publish step-by-step exploit instructions, raw exploit code, private test data, or sensitive operational details unless the authors explicitly decide to release them.

## Deployment Design

The site should be deployable as a static GitHub Pages site with a custom domain.

Recommended repository shape:

- A dedicated website repository, such as `uncorebleed-site` or a user/organization Pages repository if the team wants the root GitHub Pages domain.
- Static assets under a small site directory, with no server dependency.
- A `CNAME` file when the custom domain is chosen.

Recommended custom domain path:

- Prefer a `www` subdomain for stability, such as `www.<chosen-domain>`.
- Configure the apex domain to redirect to the `www` domain when desired.
- Enable HTTPS after DNS propagation.
- Verify the domain in GitHub before public launch to reduce domain takeover risk.

The exact domain is a launch input, not a design blocker. The implementation must make it easy to add the chosen domain later.

## Error and Edge Cases

- If code or artifact links are unavailable, the materials grid should show clear release-gated labels rather than broken or empty links.
- If the PDF filename changes, the paper link should be data-driven from a single site content configuration or a single constant.
- If JavaScript fails, all core content must remain visible and navigation must still work.
- If custom domain setup is delayed, the site should still work from the GitHub Pages URL.
- If some demos are held back, the page should retain high-level explanation blocks without claiming public availability.

## Testing and Validation

Before launch:

- Verify desktop and mobile layouts.
- Check that text does not overlap, overflow, or become unreadable on narrow screens.
- Check all links and release-gated buttons.
- Confirm PDF and BibTeX downloads work.
- Validate that FAQ content is accessible with and without JavaScript.
- Run a static build or local server smoke test.
- Confirm the GitHub Pages build output is static and deployable.
- After DNS setup, verify HTTPS and both `www` and apex behavior.

## Non-Goals

- No backend service.
- No user accounts.
- No exploit-as-a-service or interactive attack tooling.
- No premature publication of unreleased code, artifact, or sensitive demo details.
- No broad refactor of the existing `paper-collector` Python package.

## Open Launch Inputs

These items are intentionally deferred until publication preparation:

- Final public domain.
- Final paper PDF filename.
- Public code URL.
- Artifact URL.
- Demo media that the authors approve for release.
- Contact email or corresponding-author contact format.
