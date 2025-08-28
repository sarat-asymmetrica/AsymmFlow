/**
 * Global test utility types for consciousness testing
 */

declare global {
  namespace globalThis {
    interface Global {
      consciousnessTestUtils: {
        validateBusinessFlow: (workflowSteps: any[]) => void;
        assertConsciousnessResponseTime: (responseTime: number, threshold: number) => void;
      };
    }
  }
}

export {};