export default {
  collectCoverage: false,
  preset: 'ts-jest',
  testEnvironment: 'node',
  // testRegex: '\\.(int|e2e)\\.test\\.ts', // jest.config.int.ts
  testRegex: '\\.e2e\\.test\\.ts',
  testTimeout: 8 * 1000,
  maxWorkers: 1,
  roots: ['<rootDir>/src/tests'],
  globalSetup: './src/tests/setup/global-setup.ts', // démarrer des containes
  globalTeardown: './src/tests/setup/global-teardown.ts' // terminer, nettoyer fermer container bien fini
 };