import type { Config } from 'jest';

const config: Config = {
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};

export default config;
