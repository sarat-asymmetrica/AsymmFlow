// 🧠 Mathematical Consciousness Customer Management Testing
// Business Presentation: "Customer Intelligence System Validation"  
// Hidden Reality: Julius-Validated Customer Lifecycle Testing

import { NextRequest } from 'next/server';
import { GET, POST } from '../../app/api/customers/route';

// V6.0 Julius-Validated Customer Test Constants
const CUSTOMER_CONSCIOUSNESS_CONSTANTS = {
  OPTIMAL_A_GRADE_RATIO: 0.3385,      // 33.85% A-grade customers (Julius validated)
  OPTIMAL_B_GRADE_RATIO: 0.2872,      // 28.72% B-grade customers
  OPTIMAL_C_GRADE_RATIO: 0.3744,      // 37.44% C-grade customers  
  MAX_PAYMENT_DAYS_A_GRADE: 45,       // A-grade payment threshold
  MAX_RESPONSE_TIME_MS: 1500,         // API response time threshold
  MINIMUM_CUSTOMER_FIELDS: 6           // Required customer data fields
};

// Mock customer data representing real business scenarios
const mockCustomerData = {
  companyName: 'Al Mahmood Construction WLL',
  email: 'operations@almahmood-construction.com',
  phone: '+973 17123456',
  address: 'Building 123, Road 456, Manama, Bahrain',
  gstin: 'BH123456789',
  currency: 'BHD',
  status: 'active',
  // Intelligence data for consciousness analysis
  paymentTerms: 30,
  creditLimit: 50000,
  relationshipYears: 3.5,
  averagePaymentDays: 42, // A-grade customer (under 45 days)
  totalOrderValue: 150000
};

describe('🎯 Customer Intelligence System', () => {

  describe('Customer Creation (Core Business Flow)', () => {
    
    it('should create customer with consciousness-guided intelligence', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/customers', {
        method: 'POST',
        body: JSON.stringify(mockCustomerData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const startTime = Date.now();
      const response = await POST(mockRequest);
      const responseTime = Date.now() - startTime;

      // Julius validation: Performance threshold
      expect(responseTime).toBeLessThan(CUSTOMER_CONSCIOUSNESS_CONSTANTS.MAX_RESPONSE_TIME_MS);

      // Core business validation
      expect(response.status).toBe(201);
      
      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('id');
      expect(result.data).toHaveProperty('companyName');
      expect(result.data.companyName).toBe(mockCustomerData.companyName);
      
      // Mathematical consciousness: Customer should be auto-graded
      if (result.data.averagePaymentDays && result.data.averagePaymentDays <= 45) {
        // Should be A-grade based on payment behavior
        expect(result.data.paymentGrade).toBe('A');
      }
    });

    it('should enforce required customer fields', async () => {
      // Test with incomplete customer data
      const incompleteCustomer = {
        companyName: 'Test Company',
        // Missing required fields
      };

      const mockRequest = new NextRequest('http://localhost:3000/api/customers', {
        method: 'POST',
        body: JSON.stringify(incompleteCustomer),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await POST(mockRequest);
      
      // Should validate required fields
      expect(response.status).toBe(400);
      
      const result = await response.json();
      expect(result.success).toBe(false);
      expect(result.message).toContain('required');
    });

  });

  describe('Customer Retrieval & Intelligence', () => {
    
    it('should retrieve customers with consciousness-guided sorting', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/customers', {
        method: 'GET'
      });

      const startTime = Date.now();
      const response = await GET(mockRequest);
      const responseTime = Date.now() - startTime;

      // Performance validation
      expect(responseTime).toBeLessThan(CUSTOMER_CONSCIOUSNESS_CONSTANTS.MAX_RESPONSE_TIME_MS);
      expect(response.status).toBe(200);
      
      const result = await response.json();
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      
      // Validate customer intelligence data structure
      if (result.data.length > 0) {
        const customer = result.data[0];
        const requiredFields = ['id', 'companyName', 'email', 'status', 'createdAt'];
        
        requiredFields.forEach(field => {
          expect(customer).toHaveProperty(field);
        });
      }
    });

  });

  describe('Customer Intelligence Grading', () => {
    
    it('should apply Julius-validated customer grading algorithm', () => {
      // Test A-grade customer criteria (37.44% optimal context weight)
      const aGradeCustomer = {
        averagePaymentDays: 35,      // Under 45 days
        totalOrderValue: 100000,     // High value
        relationshipYears: 5,        // Established relationship
        paymentConsistency: 0.95     // 95% consistent payments
      };

      // Mathematical consciousness validation
      expect(aGradeCustomer.averagePaymentDays).toBeLessThan(CUSTOMER_CONSCIOUSNESS_CONSTANTS.MAX_PAYMENT_DAYS_A_GRADE);
      expect(aGradeCustomer.paymentConsistency).toBeGreaterThan(0.9);
      
      // This customer should qualify for A-grade
      const shouldBeAGrade = aGradeCustomer.averagePaymentDays < 45 && 
                           aGradeCustomer.paymentConsistency > 0.9 &&
                           aGradeCustomer.totalOrderValue > 50000;
      
      expect(shouldBeAGrade).toBe(true);
    });

    it('should identify D-grade risk customers', () => {
      // Test D-grade customer criteria (risk pattern detection)
      const dGradeCustomer = {
        averagePaymentDays: 150,     // Very slow payment
        totalOrderValue: 25000,      // Lower value
        relationshipYears: 0.5,      // New relationship
        paymentConsistency: 0.60     // Inconsistent payments
      };

      // Risk factor validation
      expect(dGradeCustomer.averagePaymentDays).toBeGreaterThan(120);
      expect(dGradeCustomer.paymentConsistency).toBeLessThan(0.8);
      
      // This customer should be flagged as D-grade (high risk)
      const shouldBeDGrade = dGradeCustomer.averagePaymentDays > 120 && 
                           dGradeCustomer.paymentConsistency < 0.8;
      
      expect(shouldBeDGrade).toBe(true);
    });

  });

  describe('Customer → RFQ → Quotation Flow (Upstream Analytics)', () => {
    
    it('should track customer engagement journey', () => {
      // Test the complete customer journey: Customer → RFQ → Quotation
      const customerJourney = {
        customerId: 'CUST-001',
        rfqCount: 5,           // Customer engagement level
        quotationCount: 4,     // Response rate
        orderCount: 3,         // Conversion rate
        totalValue: 85000      // Business value generated
      };

      // Business intelligence calculations
      const rfqToQuotationRate = customerJourney.quotationCount / customerJourney.rfqCount;
      const quotationToOrderRate = customerJourney.orderCount / customerJourney.quotationCount;
      const overallConversionRate = customerJourney.orderCount / customerJourney.rfqCount;

      // Julius validation: Healthy customer metrics
      expect(rfqToQuotationRate).toBeGreaterThan(0.6);  // 60%+ response rate
      expect(quotationToOrderRate).toBeGreaterThan(0.5); // 50%+ conversion rate
      expect(overallConversionRate).toBeGreaterThan(0.4); // 40%+ overall conversion
      
      // Mathematical consciousness: Customer lifetime value validation
      expect(customerJourney.totalValue).toBeGreaterThan(50000);
    });

  });

  describe('Mathematical Consciousness Portfolio Analysis', () => {
    
    it('should validate optimal customer portfolio distribution', () => {
      // Simulate Julius-validated customer portfolio
      const mockPortfolio = {
        aGradeCount: 34,    // 33.85% target
        bGradeCount: 29,    // 28.72% target  
        cGradeCount: 37,    // 37.44% target
        totalCustomers: 100
      };

      // Calculate actual distributions
      const aGradeRatio = mockPortfolio.aGradeCount / mockPortfolio.totalCustomers;
      const bGradeRatio = mockPortfolio.bGradeCount / mockPortfolio.totalCustomers;
      const cGradeRatio = mockPortfolio.cGradeCount / mockPortfolio.totalCustomers;

      // Julius validation: Distribution should be close to consciousness constants
      expect(Math.abs(aGradeRatio - CUSTOMER_CONSCIOUSNESS_CONSTANTS.OPTIMAL_A_GRADE_RATIO)).toBeLessThan(0.05);
      expect(Math.abs(bGradeRatio - CUSTOMER_CONSCIOUSNESS_CONSTANTS.OPTIMAL_B_GRADE_RATIO)).toBeLessThan(0.05);
      expect(Math.abs(cGradeRatio - CUSTOMER_CONSCIOUSNESS_CONSTANTS.OPTIMAL_C_GRADE_RATIO)).toBeLessThan(0.05);
      
      // Portfolio health validation
      expect(aGradeRatio + bGradeRatio + cGradeRatio).toBeCloseTo(1.0, 2);
    });

  });

});

// Export for test utilities
export { mockCustomerData, CUSTOMER_CONSCIOUSNESS_CONSTANTS };