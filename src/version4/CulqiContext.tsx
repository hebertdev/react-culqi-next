import { createContext, useState, useEffect, ReactNode } from 'react';
import type { CulqiContextProps } from './interfacesv4';
import { useScript } from '../hooks/useScript';

export const CulqiContext = createContext<CulqiContextProps>({
  culqiLoaded: false,
});

export const baseCulqiUrl = 'https://checkout.culqi.com';
const culqiUrl = `${baseCulqiUrl}/js/v4`;

interface CulqiProviderProps {
  publicKey: string;
  children: ReactNode;
}

export const CulqiProvider = ({
  publicKey,
  children,
}: CulqiProviderProps): JSX.Element => {
  const [culqiLoaded, setCulqiLoaded] = useState(false);
  const status = useScript(culqiUrl);

  // Validate publicKey on mount and when it changes
  useEffect(() => {
    if (!publicKey || typeof publicKey !== 'string') {
      throw new Error(
        'CulqiProvider: publicKey is required and must be a valid string.'
      );
    }

    if (!publicKey.startsWith('pk_')) {
      console.warn(
        "CulqiProvider: publicKey should start with 'pk_' for public keys."
      );
    }
  }, [publicKey]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    if (status === 'ready') {
      if (window.Culqi) {
        window.Culqi.publicKey = publicKey;
        setCulqiLoaded(true);
      } else {
        // Retry if window.Culqi is not immediately available
        interval = setInterval(() => {
          if (window.Culqi) {
            window.Culqi.publicKey = publicKey;
            setCulqiLoaded(true);
            clearInterval(interval);
          }
        }, 100);

        // Safety timeout to stop checking after 3 seconds
        timeout = setTimeout(() => {
          clearInterval(interval);
          if (!window.Culqi) {
            console.error(
              'CulqiProvider: Culqi object not found after script load timeout'
            );
          }
        }, 3000);
      }
    } else if (status === 'error') {
      setCulqiLoaded(false);
      console.error('CulqiProvider: Failed to load Culqi script');
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [status, publicKey]);

  return (
    <CulqiContext.Provider value={{ culqiLoaded }}>
      {children}
    </CulqiContext.Provider>
  );
};
