import {
  CulqiProvider,
  CulqiProviderV3,
  useCheckout,
  useCheckoutV3,
} from '../src';

describe('CulqiProvider import', () => {
  it('imports CulqiProvider correctly', () => {
    expect(typeof CulqiProvider).toBe('function');
  });
});

describe('CulqiProviderV3 import', () => {
  it('imports CulqiProviderV3 correctly', () => {
    expect(typeof CulqiProviderV3).toBe('function');
  });
});

describe('useCheckout import', () => {
  it('imports useCheckout correctly', () => {
    expect(typeof useCheckout).toBe('function');
  });
});

describe('useCheckoutV3 import', () => {
  it('imports useCheckoutV3 correctly', () => {
    expect(typeof useCheckoutV3).toBe('function');
  });
});
