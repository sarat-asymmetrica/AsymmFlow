// 🎯 Mathematical Consciousness Jest Configuration
// 2025 SSOT-Compliant Testing Setup for Next.js 15 + React 19 + TypeScript 5

const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// V6.0 Julius-Validated Jest Configuration
const customJestConfig = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Module name mapping for absolute imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
  },
  
  // Test patterns - exclude API tests that need NextRequest mocking
  testMatch: [
    '**/__tests__/lib/**/*.(js|jsx|ts|tsx)',
    '**/__tests__/integration/**/*.(js|jsx|ts|tsx)',
    '**/?(*.)+(spec|test).(js|jsx|ts|tsx)'
  ],
  
  // Transform configuration for TypeScript and ES modules
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['@swc/jest', {
      jsc: {
        parser: {
          syntax: 'typescript',
          jsx: true,
        },
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    }],
  },
  
  // Transform ignore patterns (allow ES modules from node_modules)
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@testing-library|next|@next|framer-motion|gsap|d3|three))',
  ],
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Test environment options
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!src/generated/**',
    '!**/.next/**',
  ],
  
  // Coverage thresholds (Julius-validated quality gates)
  coverageThreshold: {
    global: {
      branches: 60,    // 60% branch coverage minimum
      functions: 70,   // 70% function coverage
      lines: 65,       // 65% line coverage
      statements: 65,  // 65% statement coverage
    },
  },
  
  // Verbose output for consciousness-guided debugging
  verbose: true,
  
  // Timeout for consciousness-responsive testing
  testTimeout: 10000,
  
  // Globals for mathematical consciousness constants
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
}

// Export Next.js compatible configuration
module.exports = createJestConfig(customJestConfig)