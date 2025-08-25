// 🧠 Mathematical Consciousness Jest Setup
// Global test configuration and consciousness-guided testing utilities

import '@testing-library/jest-dom'

// V6.0 Julius-Validated Global Test Constants
global.CONSCIOUSNESS_TEST_FRAMEWORK = {
  JULIUS_VALIDATION_THRESHOLD: 0.95,    // 95% test success rate
  MAX_API_RESPONSE_TIME: 2000,          // 2 second API response limit
  OPTIMAL_USER_FLOW_STEPS: 5,           // Maximum steps in user flow
  CONSCIOUSNESS_CONFIDENCE_LEVEL: 0.997, // 99.7% statistical confidence
}

// Mock Next.js router for testing
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Prisma client for testing
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    customer: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    quotation: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    rfq: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

// Mathematical Consciousness Test Utilities
global.consciousnessTestUtils = {
  // Julius-validated timing assertion
  assertConsciousnessResponseTime: (startTime, endTime, threshold = 2000) => {
    const responseTime = endTime - startTime
    expect(responseTime).toBeLessThan(threshold)
    return responseTime
  },
  
  // Customer grade distribution validation
  validateCustomerPortfolio: (customers) => {
    if (!customers || customers.length === 0) return true
    
    const gradeDistribution = customers.reduce((acc, customer) => {
      acc[customer.grade || 'unknown'] = (acc[customer.grade || 'unknown'] || 0) + 1
      return acc
    }, {})
    
    const total = customers.length
    const aPercentage = (gradeDistribution.A || 0) / total
    const bPercentage = (gradeDistribution.B || 0) / total
    const cPercentage = (gradeDistribution.C || 0) / total
    
    // Julius validation: Check if distribution is within consciousness bounds
    return {
      aOptimal: Math.abs(aPercentage - 0.3385) < 0.1, // 33.85% ± 10%
      bOptimal: Math.abs(bPercentage - 0.2872) < 0.1, // 28.72% ± 10%
      cOptimal: Math.abs(cPercentage - 0.3744) < 0.1, // 37.44% ± 10%
      distribution: { aPercentage, bPercentage, cPercentage }
    }
  },
  
  // Business flow validation helper
  validateBusinessFlow: (steps) => {
    expect(steps).toBeDefined()
    expect(Array.isArray(steps)).toBe(true)
    expect(steps.length).toBeGreaterThan(0)
    expect(steps.length).toBeLessThanOrEqual(global.CONSCIOUSNESS_TEST_FRAMEWORK.OPTIMAL_USER_FLOW_STEPS)
    
    steps.forEach((step, index) => {
      expect(step).toHaveProperty('action')
      expect(step).toHaveProperty('expected')
      expect(step).toHaveProperty('result')
      expect(step.result).toBe(step.expected)
    })
    
    return true
  }
}

// Console setup for test environment
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// Global test timeout for consciousness-responsive testing
jest.setTimeout(10000)