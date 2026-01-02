
/// <reference types="node" />

// Helper to create mappings only for files that exist
function createPortedFileMapper() {
  const fs = require('fs');
  const path = require('path');
  
  const rescriptRoot = path.join(__dirname, '..', 'rescript', 'src');
  const mappings: { [key: string]: string } = {};
  
  const mapDirectory = (dirName: string) => {
    const dirPath = path.join(rescriptRoot, dirName);
    if (fs.existsSync(dirPath)) {
      const rescriptFiles = fs.readdirSync(dirPath)
        .filter((f: string) => f.endsWith('.res.js'))
        .map((f: string) => f.replace('.res.js', ''));
      
      rescriptFiles.forEach((fileName: string) => {
        const tsName = fileName.toLowerCase(); // Convert Compare -> compare
        // Pattern for relative imports from __tests__ subdirectory
        mappings[`^\.\./${tsName}$`] = `<rootDir>/../rescript/src/${dirName}/${fileName}.res.js`;
        // Pattern for absolute imports from root
        // mappings[`^../${dirName}/${tsName}$`] = `<rootDir>/../rescript/src/${dirName}/${fileName}.res.mjs`;
      });
    }
  };
  
  mapDirectory('utils');
  mapDirectory('helpers');  
  mapDirectory('types');
  
  return mappings;
}

console.log(createPortedFileMapper())

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
  moduleNameMapper: createPortedFileMapper(),
};