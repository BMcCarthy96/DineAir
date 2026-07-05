module.exports = {
    testEnvironment: "node",
    setupFiles: ["<rootDir>/tests/setupEnv.js"],
    testMatch: ["**/tests/**/*.test.js"],
    testTimeout: 15000,
    forceExit: true,
};
