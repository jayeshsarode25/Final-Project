/**
 * Jest configuration for Cart service
 */
module.exports = {
    testEnvironment: 'node',
    roots: [ '<rootDir>/__tests__' ],
    testPathIgnorePatterns: [ '<rootDir>/__tests__/setup/' ],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [ 'src/**/*.js', '!src/db/**' ],
    moduleFileExtensions: [ 'js', 'json' ],
    setupFilesAfterEnv: [ '<rootDir>/tests/setup/globalSetup.js' ]
};
