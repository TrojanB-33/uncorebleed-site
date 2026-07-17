# Principles Before Demo Design

Date: 2026-07-17

## Goal

Place the UncoreBleed explanation before the recorded RSA demonstration so readers understand the attack properties before seeing the evidence.

## Selected Change

Move the complete `#principles` section ahead of the complete `#demo` section in `website/index.html`.

## Constraints

- Preserve the IDs `principles` and `demo`, so navigation links stay unchanged.
- Preserve all section content, the recorded MP4 player, captions, CSS, and JavaScript behavior.
- Add a static ordering test that requires `#principles` to appear before `#demo`.
- Verify the full test suite, merge the focused branch into `main`, and push it to publish through GitHub Pages.

## Non-Goals

- No content rewrite, visual redesign, or navigation-label change.
- No change to the video playback configuration or asset files.
