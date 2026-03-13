import { createContext, useEffect, useState, ReactNode } from 'react';
import type { CulqiCustomContextProps } from './interfacesCustom';
import { useScript } from '../hooks/useScript';

// ─────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────
export const CULQI_SCRIPT_URL = 'https://js.culqi.com/checkout-js';
export const CULQI_ORIGIN = 'https://js.culqi.com';

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────
export const CulqiCustomContext = createContext<CulqiCustomContextProps>({
  culqiLoaded: false,
  publicKey: '',
});

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────
interface CulqiProviderCustomProps {
  publicKey: string;
  children: ReactNode;
}

export const CulqiProviderCustom = ({
  publicKey,
  children,
}: CulqiProviderCustomProps): JSX.Element => {
  const [culqiLoaded, setCulqiLoaded] = useState(false);
  const status = useScript(CULQI_SCRIPT_URL);

  // Validación de publicKey en desarrollo
  useEffect(() => {
    if (!publicKey || typeof publicKey !== 'string') {
      throw new Error(
        'CulqiProviderCustom: publicKey es requerido y debe ser string.'
      );
    }
    if (!publicKey.startsWith('pk_')) {
      console.warn(
        "CulqiProviderCustom: publicKey debería empezar con 'pk_' (llave pública)."
      );
    }
  }, [publicKey]);

  useEffect(() => {
    if (status === 'ready') {
      setCulqiLoaded(true);
    } else if (status === 'error') {
      setCulqiLoaded(false);
      console.error(
        'CulqiProviderCustom: Falló la carga del script de Culqi Custom Checkout.'
      );
    }
  }, [status]);

  return (
    <CulqiCustomContext.Provider value={{ culqiLoaded, publicKey }}>
      {children}
    </CulqiCustomContext.Provider>
  );
};
