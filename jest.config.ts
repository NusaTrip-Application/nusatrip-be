import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	testEnvironment: "node",
	roots: ["<rootDir>/src/test"],
	testMatch: ["**/*.test.ts"],
	setupFiles: ["<rootDir>/src/config/jest.env.ts"],
	setupFilesAfterEnv: ["<rootDir>/src/config/jest.setup.ts"],
	moduleFileExtensions: ["ts", "js", "json"],
	clearMocks: true,
};

export default config;
