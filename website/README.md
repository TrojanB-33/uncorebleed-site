# UncoreBleed Website

This directory contains the static UncoreBleed research website.

## Local preview

Run this from the repository root:

```powershell
C:\Users\30418\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m http.server 8000 --directory website
```

Open `http://localhost:8000`.

The site also works by opening `website/index.html` directly in a browser.

## GitHub Pages

The workflow at `.github/workflows/pages.yml` deploys the `website/` directory to GitHub Pages when changes are pushed to `master` or `main`.

In GitHub, open the repository settings and set Pages source to GitHub Actions.

## Custom domain

When the final custom domain is chosen, create `website/CNAME` containing exactly the chosen host name, for example:

```text
www.example.org
```

Then configure DNS at the domain provider and enable HTTPS in GitHub Pages after DNS propagation. Prefer a `www` host and redirect the apex domain to it.

## Release-gated materials

The current site labels code, artifact, and detailed demo material as release-gated. Update those cards only after the authors decide which materials are public.
