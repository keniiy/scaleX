module.exports = {
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    testMatch: ["**/?(*.)+(spec|test).js"],
    collectCoverageFrom: ['src/**/*.js'],
    testTimeout: 30000,
};
