/**
 * Build & Integrity Verification Pipeline for Beyblade X Tournament
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { BEYBLADE_X_VERSION, FINISH_POINTS } from '../src/index.ts';

const ROOT_DIR = path.resolve(import.meta.dirname, '..');
const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html');
const MANIFEST_PATH = path.join(ROOT_DIR, 'manifest.json');
const SW_PATH = path.join(ROOT_DIR, 'sw.js');

function verifyIndexHtml(): void {
  if (!fs.existsSync(INDEX_HTML_PATH)) {
    throw new Error('index.html not found in project root.');
  }

  const html = fs.readFileSync(INDEX_HTML_PATH, 'utf8');

  // Verify core structural tags
  if (!/<!doctype html>/i.test(html) || !html.includes('<html') || !html.includes('</html>')) {
    throw new Error('index.html missing DOCTYPE or root html tags.');
  }

  // Verify PWA manifest link
  if (!html.includes('manifest.json')) {
    throw new Error('index.html missing manifest.json link.');
  }

  // Verify mobile viewport and theme-color meta tags
  if (!html.includes('name="viewport"') || !html.includes('name="theme-color"')) {
    throw new Error('index.html missing mobile viewport or theme-color metadata.');
  }

  // Verify version alignment between source domain and index.html
  const versionNeedle = `const APP_VERSION = '${BEYBLADE_X_VERSION}';`;
  if (!html.includes(versionNeedle)) {
    throw new Error(
      `index.html APP_VERSION does not match src/index.ts BEYBLADE_X_VERSION (${BEYBLADE_X_VERSION}).`
    );
  }

  // Verify script syntax integrity
  const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
  let match: RegExpExecArray | null = null;
  let scriptIndex = 0;

  while ((match = scriptRegex.exec(html)) !== null) {
    const code = match[1];
    if (code && code.trim().length > 0) {
      try {
        new vm.Script(code, { filename: `index.html#script-${scriptIndex}` });
      } catch (err) {
        throw new Error(
          `Syntax error in index.html script block ${scriptIndex}: ${(err as Error).message}`
        );
      }
      scriptIndex += 1;
    }
  }

  console.log(`✓ index.html validated: ${scriptIndex} script block(s) checked.`);
}

function verifyPwaManifest(): void {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error('manifest.json not found in project root.');
  }

  const raw = fs.readFileSync(MANIFEST_PATH, 'utf8');
  let manifest: Record<string, unknown>;
  try {
    manifest = JSON.parse(raw);
  } catch (err) {
    throw new Error(`manifest.json is not valid JSON: ${(err as Error).message}`);
  }

  if (manifest['display'] !== 'standalone') {
    throw new Error('manifest.json must declare display: standalone.');
  }
  if (!manifest['name'] || !manifest['short_name']) {
    throw new Error('manifest.json missing name or short_name.');
  }
  if (!Array.isArray(manifest['icons']) || manifest['icons'].length === 0) {
    throw new Error('manifest.json missing icons array.');
  }

  console.log('✓ manifest.json validated: PWA standalone manifest conforms to spec.');
}

function verifyServiceWorker(): void {
  if (!fs.existsSync(SW_PATH)) {
    throw new Error('sw.js not found in project root.');
  }

  const swCode = fs.readFileSync(SW_PATH, 'utf8');
  try {
    new vm.Script(swCode, { filename: 'sw.js' });
  } catch (err) {
    throw new Error(`Syntax error in sw.js: ${(err as Error).message}`);
  }

  if (!swCode.includes('CACHE_NAME') || !swCode.includes('addEventListener')) {
    throw new Error('sw.js missing standard CACHE_NAME or lifecycle listeners.');
  }

  console.log('✓ sw.js validated: Service Worker syntax and lifecycle verified.');
}

function verifyDomainInvariants(): void {
  if (
    FINISH_POINTS.spin !== 1 ||
    FINISH_POINTS.over !== 2 ||
    FINISH_POINTS.burst !== 2 ||
    FINISH_POINTS.xtreme !== 3
  ) {
    throw new Error('Official Beyblade X finish points invariant failed.');
  }

  console.log('✓ Beyblade X official scoring rules verified (Spin 1, Over 2, Burst 2, Xtreme 3).');
}

function runBuildVerification(): void {
  console.log('--- Starting Beyblade X Build & Integrity Verification ---');
  verifyDomainInvariants();
  verifyIndexHtml();
  verifyPwaManifest();
  verifyServiceWorker();
  console.log('✓ All build verification checks passed successfully.');
}

runBuildVerification();
