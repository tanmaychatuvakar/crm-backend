const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  // moduleNameMapper: {
  //   '^@db/(.*)$': '<rootDir>/src/db/$1',
  //   '^@config/(.*)': '<rootDir>/src/config/$1',
  //   '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
  //   '^@dtos/(.*)$': '<rootDir>/src/dtos/$1',
  //   '^@exceptions/(.*)$': '<rootDir>/src/exceptions/$1',
  //   '^@interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
  //   '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
  //   '^@models/(.*)$': '<rootDir>/src/models/$1',
  //   '^@routes/(.*)$': '<rootDir>/src/routes/$1',
  //   '^@services/(.*)$': '<rootDir>/src/services/$1',
  //   '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  //   '^@dao/(.*)$': '<rootDir>/src/dao/$1',
  //   '^@custom-types/(.*)$': '<rootDir>/src/custom-types/$1',
  //   '^@artifacts/(.*)$': '<rootDir>/src/artifacts/$1',
  //   // Add other module name mappings here
  //   // '^@(.*)$': '<rootDir>/src/$1',
  // },
  globals: {
    // Set the NODE_ENV environment variable to something other than 'test'
    // when running your tests
    NODE_ENV: 'development',
  },
};
