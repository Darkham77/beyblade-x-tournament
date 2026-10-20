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
    productionRef: 'main'
  },
  testCoverage: {
    enabled: false
  },
  encoding: {
    enabled: true,
    defaultEncoding: 'utf-8',
    prohibitBom: true,
    detectMojibake: true
  },
  coverage: {
    enabled: true,
    acknowledgedDegradations: [
      {
        policy: 'scripts',
        glob: 'scripts/**',
        reason: 'Maintenance, build verification, and deployment scripts'
      }
    ]
  },
  constants: {
    enabled: true
  },
  environment: {
    enabled: true
  },
  dependencyVulnerabilities: {
    enabled: true,
    failOn: 'critical'
  },
  persistence: {
    enabled: true
  },
  fallow: {
    enabled: true,
    typeAware: true,
    showCascade: true,
    duplicates: {
      nearMiss: true,
      mode: 'strict'
    },
    viz: {
      enabled: true,
      outputPath: 'scratch/fallow_map.html'
    },
    similarCode: {
      enabled: true,
      threshold: 0.95,
      ignoreSameFile: true
    }
  },
  animation: {
    enabled: true
  },
  oxfmt: {
    enabled: true
  },
  oxlint: {
    enabled: true
  },
  pinia: {
    enabled: true
  },
  scriptExtensions: {
    enabled: true,
    enforceTypeScript: true,
    allowMjs: false,
    allowCjs: false,
    allowJsScripts: false,
    exemptFiles: []
  },
  scssArchitecture: {
    enabled: true
  },
  stylelint: {
    enabled: true,
    order: {
      enabled: true,
      enforceHasBlockPartitioning: true
    }
  },
  types: {
    enabled: true
  },
  typeCoverage: {
    enabled: true,
    atLeast: 95
  },
  vitePlusConfig: {
    enabled: true,
    precompress: {
      enabled: true,
      server: 'nginx',
      spa: true,
      report: 'summary',
      threshold: 512
    }
  },
  domain: {
    enabled: true
  },
  valibot: {
    enabled: true,
    targets: []
  },
  queryPerformance: {
    enabled: true
  },
  webPerformance: {
    enabled: true
  },
  securityHardening: {
    enabled: true
  }
});
