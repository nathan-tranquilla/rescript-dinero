export default {
  preset: 'ts-jest',
  rootDir: './',
  displayName: 'core',
  clearMocks: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['node_modules/', 'dist/'],
  coveragePathIgnorePatterns: ['node_modules/', 'dist/', 'test/'],
  globals: {
    __DEV__: true,
    __TEST__: true,
  },
};