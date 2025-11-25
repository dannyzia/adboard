// Global test setup for Vitest + Testing Library
// Place shared test setup here (jest-dom, global mocks, etc.)
// Ensure Vitest's expect is available before jest-dom registers matchers.
import { expect as vitestExpect } from 'vitest';
(globalThis as any).expect = vitestExpect;
import '@testing-library/jest-dom/vitest';

// Optionally set any globals you need for tests, e.g.:
// (globalThis as any).fetch = (...args) => fetchMock(...args);

// Silence console.error in tests that intentionally exercise error paths
// (uncomment if you want to suppress noisy logs)
// const originalError = console.error;
// beforeAll(() => { console.error = (...args) => { /* noop or filter */ }; });
// afterAll(() => { console.error = originalError; });
