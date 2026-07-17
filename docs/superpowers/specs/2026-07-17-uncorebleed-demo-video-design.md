# UncoreBleed RSA Demonstration Video Design

Date: 2026-07-17

## Goal

Replace the conceptual RSA SVG in the existing `#demo` section with the supplied recorded demonstration. The video should be the central visual evidence for the TLBlur-protected RSA result while preserving the site's concise, research-first reading flow.

## Selected Design

Use the selected primary-video layout (option A):

1. Keep the current `#demo` section and its navigation link.
2. Retain a compact Demo eyebrow, heading, and short high-level explanation above the media.
3. Display the actual RSA demonstration as a wide, centered 16:9 video beneath that copy.
4. Use a short caption beneath the player to identify the result as TLBlur-protected RSA key recovery and state that the page intentionally omits operational instructions.
5. Remove the now-redundant conceptual `rsa-demo.svg` reference from the page.

## Playback and Responsive Behavior

- Bundle the supplied MP4 as `website/assets/uncorebleed-rsa-demo.mp4`.
- Render it with native browser controls, `muted`, `playsinline`, and `preload="metadata"`.
- Do not autoplay, loop, or enable audio by default.
- Preserve its native aspect ratio inside a bounded player surface that expands to the available section width without cropping or horizontal overflow.
- On mobile, keep the same single-column presentation and controls.

## Accessibility and Content Safety

- Provide an accurate `aria-label` for the video.
- Keep the surrounding explanatory copy and caption meaningful when video playback is unavailable.
- Do not add exploit steps, source code, secrets, or any operational recovery guidance. The video is presented as a research demonstration only.

## Verification

- Add static tests that require the MP4 asset and verify the Demo section uses a video with `controls`, `muted`, and `playsinline`.
- Run the complete website test suite.
- Preview the page locally and verify that the video element loads, retains controls, does not autoplay, and remains legible on desktop and narrow mobile layouts.
- Push the completed change to `main` and confirm the GitHub Pages deployment serves the video-enabled page.

## Non-Goals

- No new page or navigation section.
- No autoplay, custom player, tracking, analytics, or backend service.
- No changes to paper, citation, team, principles, or FAQ content beyond the Demo media replacement.
