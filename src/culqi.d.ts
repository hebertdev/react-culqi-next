interface Window {
    Culqi: any;
    culqi:any
}

declare global {
  interface Window {
    CulqiCheckout?: new (
      publicKey: string,
      config: {
        settings: unknown;
        client?: unknown;
        options?: unknown;
        appearance?: unknown;
      }
    ) => {
      open: () => void;
      close?: () => void;
    };
    __culqiCheckoutInstance?: {
      open: () => void;
      close?: () => void;
    };
  }
}
