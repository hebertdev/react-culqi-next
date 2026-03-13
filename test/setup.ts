// Jest setup file
import '@testing-library/jest-dom';

// Mock window.Culqi for tests
Object.defineProperty(window, 'Culqi', {
  value: {
    publicKey: '',
    settings: jest.fn(),
    options: jest.fn(),
    open: jest.fn(),
    close: jest.fn(),
  },
  writable: true,
});

// Mock window.culqi callback
Object.defineProperty(window, 'culqi', {
  value: jest.fn(),
  writable: true,
});

// Mock requestAnimationFrame
Object.defineProperty(window, 'requestAnimationFrame', {
  value: (callback: FrameRequestCallback) => {
    return setTimeout(callback, 0);
  },
  writable: true,
});

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock CulqiCheckout constructor for Custom Checkout
Object.defineProperty(window, "CulqiCheckout", {
  value: function (_publicKey: string, _config: any) {
    return {
      open: jest.fn(),
      close: jest.fn(),
    };
  },
  writable: true,
});