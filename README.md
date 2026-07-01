# UncoreBleed Site

Static research website for the UncoreBleed paper.

## Local preview

```powershell
C:\Users\30418\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m http.server 8000 --directory website
```

Open `http://localhost:8000`.

## Tests

```powershell
C:\Users\30418\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --test website\tests\site.test.mjs website\tests\deploy.test.mjs website\tests\main.test.mjs
```

## Deployment

The GitHub Actions workflow at `.github/workflows/pages.yml` deploys the `website/` directory to GitHub Pages on pushes to `main` or `master`.

After pushing the repository, enable Pages in GitHub:

1. Open repository settings.
2. Go to `Pages`.
3. Set the source to `GitHub Actions`.
4. Run the `Deploy UncoreBleed website` workflow if it does not start automatically.
