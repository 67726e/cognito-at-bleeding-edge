
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    clearMocks: true,
    collectCoverage: true,

    rootDir: './',
    roots: [
        '<rootDir>/src',
        '<rootDir>/test',
    ],

    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '\\.[jt]sx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }]
    }
};
