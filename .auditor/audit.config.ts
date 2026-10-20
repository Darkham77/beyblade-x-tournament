import { defineAuditConfig } from '@francogp/auditor';

export default defineAuditConfig({
  name: 'beyblade-x-tournament',
  auditorVersion: '9.7.9-build.20261020-014135',
  paths: {
    srcRoots: ['src'],
    testRoots: ['tests'],
    scriptsRoots: ['scripts'],
    stylesRoots: [],
    ignoreGlobs: ['node_modules/**', 'dist/**', 'scratch/**', '*.zip', 'descargar.html']
  },
  documentation: {
    language: 'en',
    chatLanguage: 'es',
    languageExemptions: ['docs/**', 'README.md', 'DESIGN_DOC.md']
  },
  accessibility: {
    enabled: true
  },
  agentPlugin: {
    enabled: false
  },
  auditorHygiene: {
    enabled: true
  },
  codeSimplification: {
    enabled: true
  },
  htmlValidate: {
    enabled: true
  },
  packageHygiene: {
    enabled: true
  },
  packageScripts: {
    enabled: true,
    recommendedScripts: true
  },
  secretLeaks: {
    enabled: true,
    maskSecrets: true
  },
  templates: {
    requireInputIds: true
  },
  styles: {
    enforceScss: false,
    zLayersEnabled: false
  },
  ratchet: {
    enabled: false
  },
  testCoverage: {
    enabled: false
  },
  encoding: {
    enabled: true,
    defaultEncoding: 'utf-8',
    prohibitBom: true,
    detectMojibake: true
  }
});
