import '@testing-library/jest-dom';

// Polyfill for TextEncoder, required by some dependencies in a JSDOM environment
import { TextEncoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

// Polyfill URL.createObjectURL for jsdom environment used in tests
if (typeof (global as any).URL === 'undefined') {
  // @ts-ignore
  (global as any).URL = {};
}
if (!(global as any).URL.createObjectURL) {
  // @ts-ignore
  (global as any).URL.createObjectURL = jest.fn(() => 'blob://mock');
}
if (!(global as any).URL.revokeObjectURL) {
  // @ts-ignore
  (global as any).URL.revokeObjectURL = jest.fn();
}

// Ensure window.alert is a mock function for tests
// @ts-ignore
window.alert = jest.fn();

// Provide a default Vite E2E mock flag for tests (browser will set this via index.html)
;(globalThis as any).__VITE_E2E_MOCK__ = false;
;(globalThis as any).__JEST__ = true;

// Avoid jsdom navigation errors during tests — components check __JEST__ and skip navigation