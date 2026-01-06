
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
  moduleNameMapper: {
  // Utils mappings
  '^../absolute$': '<rootDir>/../rescript/src/utils/Absolute.res.js',
  '^../compare$': '<rootDir>/../rescript/src/utils/CompareUtil.res.js',
  '^../computeBase$': '<rootDir>/../rescript/src/utils/ComputeBase.res.js',
  '^../countTrailingZeros$': '<rootDir>/../rescript/src/utils/CountTrailingZeros.res.js',
  '^../distribute$': '<rootDir>/../rescript/src/utils/Distribute.res.js',
  '^../equal$': '<rootDir>/../rescript/src/utils/EqualUtil.res.js',
  '^../getAmountAndScale$': '<rootDir>/../rescript/src/utils/GetAmountAndScale.res.js',
  '^../getDivisors$': '<rootDir>/../rescript/src/utils/GetDivisors.res.js',
  '^../greaterThanOrEqual$': '<rootDir>/../rescript/src/utils/GreaterThanOrEqualUtil.res.js',
  '^../greaterThan$': '<rootDir>/../rescript/src/utils/GreaterThanUtil.res.js',
  '^../isArray$': '<rootDir>/../rescript/src/utils/IsArray.res.js',
  '^../isEven$': '<rootDir>/../rescript/src/utils/IsEven.res.js',
  '^../isHalf$': '<rootDir>/../rescript/src/utils/IsHalf.res.js',
  '^../isScaledAmount$': '<rootDir>/../rescript/src/utils/IsScaledAmount.res.js',
  '^../lessThanOrEqual$': '<rootDir>/../rescript/src/utils/LessThanOrEqualUtil.res.js',
  '^../lessThan$': '<rootDir>/../rescript/src/utils/LessThanUtil.res.js',
  '^../maximum$': '<rootDir>/../rescript/src/utils/MaximumUtil.res.js',
  '^../minimum$': '<rootDir>/../rescript/src/utils/MinimumUtil.res.js',
  '^../sign$': '<rootDir>/../rescript/src/utils/Sign.res.js',
  
  // Divide mappings
  '^../down$': '<rootDir>/../rescript/src/divide/Down.res.js',
  '^../up$': '<rootDir>/../rescript/src/divide/Up.res.js',
  '^../halfAwayFromZero$': '<rootDir>/../rescript/src/divide/HalfAwayFromZero.res.js',
  '^../halfDown$': '<rootDir>/../rescript/src/divide/HalfDown.res.js',
  '^../halfEven$': '<rootDir>/../rescript/src/divide/HalfEven.res.js',
  '^../halfOdd$': '<rootDir>/../rescript/src/divide/HalfOdd.res.js',
  '^../halfTowardsZero$': '<rootDir>/../rescript/src/divide/HalfTowardsZero.res.js',
  '^../halfUp$': '<rootDir>/../rescript/src/divide/HalfUp.res.js',
  
  // Helpers mappings  
  '^../assert$': '<rootDir>/../rescript/src/helpers/Assert.res.js',
  '^../createDinero$': '<rootDir>/../rescript/src/helpers/CreateDinero.res.js',
  
  // Types mappings - specific types first, then types index
  '^../types/Calculator$': '<rootDir>/../rescript/src/types/Calculator.res.js',
  '^../types/BinaryOperation$': '<rootDir>/../rescript/src/types/BinaryOperation.res.js',
  '^../types/Dinero$': '<rootDir>/../rescript/src/types/Dinero.res.js',
  '^../types/DineroFactory$': '<rootDir>/../rescript/src/types/DineroFactory.res.js',
  '^../types/DineroOptions$': '<rootDir>/../rescript/src/types/DineroOptions.res.js',
  '^../types/DineroSnapshot$': '<rootDir>/../rescript/src/types/DineroSnapshot.res.js',
  '^../types/DivideOperation$': '<rootDir>/../rescript/src/types/DivideOperation.res.js',
  '^../types/Formatter$': '<rootDir>/../rescript/src/types/Formatter.res.js',
  '^../types/Rates$': '<rootDir>/../rescript/src/types/Rates.res.js',
  '^../types/ScaledAmount$': '<rootDir>/../rescript/src/types/ScaledAmount.res.js',
  '^../types/Transformer$': '<rootDir>/../rescript/src/types/Transformer.res.js',
  '^../types/UnaryOperation$': '<rootDir>/../rescript/src/types/UnaryOperation.res.js',
  '^../types$': '<rootDir>/../rescript/src/types/Types.res.js',
  
  // General mappings
  '^../binaryOperation$': '<rootDir>/../rescript/src/types/BinaryOperation.res.js',
  '^../calculator$': '<rootDir>/../rescript/src/types/Calculator.res.js',
  '^../dinero$': '<rootDir>/../rescript/src/types/Dinero.res.js',
  '^../dineroFactory$': '<rootDir>/../rescript/src/types/DineroFactory.res.js',
  '^../dineroOptions$': '<rootDir>/../rescript/src/types/DineroOptions.res.js',
  '^../dineroSnapshot$': '<rootDir>/../rescript/src/types/DineroSnapshot.res.js',
  '^../divideOperation$': '<rootDir>/../rescript/src/types/DivideOperation.res.js',
  '^../formatter$': '<rootDir>/../rescript/src/types/Formatter.res.js',
  '^../rates$': '<rootDir>/../rescript/src/types/Rates.res.js',
  '^../scaledAmount$': '<rootDir>/../rescript/src/types/ScaledAmount.res.js',
  '^../transformer$': '<rootDir>/../rescript/src/types/Transformer.res.js',
  '^../unaryOperation$': '<rootDir>/../rescript/src/types/UnaryOperation.res.js'
}
};