import '@testing-library/jest-dom';

// Polyfill for TextEncoder, required by some dependencies in a JSDOM environment
import { TextEncoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

// Ensure window.alert is a mock function for tests
// @ts-ignore
window.alert = jest.fn();