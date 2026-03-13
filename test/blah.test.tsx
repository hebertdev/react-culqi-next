import {
  CulqiProvider,
  useCheckout,
  CulqiProviderCustom,
  useCheckoutCustom,
} from '../src';

describe('CulqiProvider import', () => {
  it('imports CulqiProvider correctly', () => {
    expect(typeof CulqiProvider).toBe('function');
  });
});

describe('useCheckout import', () => {
  it('imports useCheckout correctly', () => {
    expect(typeof useCheckout).toBe('function');
  });
});

describe('CulqiProviderCustom import', () => {
  it('imports CulqiProviderCustom correctly', () => {
    expect(typeof CulqiProviderCustom).toBe('function');
  });
});

describe('useCheckoutCustom import', () => {
  it('imports useCheckoutCustom correctly', () => {
    expect(typeof useCheckoutCustom).toBe('function');
  });
});
