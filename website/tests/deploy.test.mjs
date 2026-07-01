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
