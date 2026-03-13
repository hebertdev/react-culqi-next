import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ErrorV4, TokenV4, OrderV4 } from '../version4/interfacesv4';
import { CulqiCustomContext } from './CulqiContextCustom';
import type {
  UseCulqiCustomProps,
  CulqiCheckoutInstance,
} from './interfacesCustom';

export const useCheckoutCustom = ({
  settings,
  client,
  options,
  appearance,
  onToken,
  onError,
  onClose,
  onOrder,
}: UseCulqiCustomProps) => {
  const { culqiLoaded, publicKey } = useContext(CulqiCustomContext);

  const [token, setToken] = useState<TokenV4 | null>(null);
  const [order, setOrder] = useState<OrderV4 | null>(null);
  const [error, setError] = useState<ErrorV4 | null>(null);

  // ── Instancia de CulqiCheckout ────────────────────────────────────────────
  // Guardamos la instancia en un ref para:
  // 1. Evitar guardarla en window (anti-pattern global).
  // 2. No perderla entre renders.
  // 3. Poder cerrar el checkout desde callbacks sin depender de closures viejos.
  const instanceRef = useRef<CulqiCheckoutInstance | null>(null);

  // ── Refs estables para callbacks del consumidor ───────────────────────────
  // El consumidor puede pasar funciones inline que se recrean en cada render.
  // Usar refs evita que los efectos y useCallbacks se re-ejecuten por eso.
  const onTokenRef = useRef(onToken);
  const onErrorRef = useRef(onError);
  const onCloseRef = useRef(onClose);
  const onOrderRef = useRef(onOrder);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    onOrderRef.current = onOrder;
  }, [onOrder]);

  // ── Callback del checkout (patrón oficial de Culqi) ───────────────────────
  // Culqi llama a instance.culqi() cuando ocurre un token, orden o error.
  // Este es el mecanismo documentado oficialmente.
  const handleCulqiAction = useCallback(() => {
    const instance = instanceRef.current;
    if (!instance) return;

    try {
      if (instance.token) {
        setToken(instance.token);
        onTokenRef.current?.(instance.token);
        instance.close?.();
        return;
      }

      if (instance.order) {
        setOrder(instance.order);
        onOrderRef.current?.(instance.order);
        instance.close?.();
        return;
      }

      if (instance.error) {
        setError(instance.error);
        onErrorRef.current?.(instance.error);
      }
    } catch (e) {
      console.error('useCheckoutCustom: Error en callback culqi:', e);
    }
  }, []); // Sin dependencias: usa refs para acceder a los callbacks del consumidor

  // ── Abrir el checkout ─────────────────────────────────────────────────────
  const openCulqiCustom = useCallback(() => {
    if (typeof window === 'undefined') {
      console.warn('useCheckoutCustom: No disponible en SSR.');
      return;
    }

    if (!culqiLoaded) {
      console.warn(
        'useCheckoutCustom: El script de Culqi aún no está cargado.'
      );
      return;
    }

    if (!(window as any).CulqiCheckout) {
      console.warn(
        'useCheckoutCustom: window.CulqiCheckout no está disponible. ' +
          'Verifica que el script de Culqi se haya cargado correctamente.'
      );
      return;
    }

    // Si hay una instancia previa abierta, la cerramos antes de crear una nueva
    if (instanceRef.current?.close) {
      try {
        instanceRef.current.close();
      } catch {
        // Ignoramos errores al cerrar instancia anterior
      }
    }

    try {
      const config = { settings, client, options, appearance };

      const instance: CulqiCheckoutInstance = new (window as any).CulqiCheckout(
        publicKey,
        config
      );

      // Asignamos el callback oficial ANTES de abrir
      instance.culqi = handleCulqiAction;

      // Guardamos la instancia en el ref
      instanceRef.current = instance;

      // Abrimos en el siguiente frame para asegurar que el DOM esté listo
      requestAnimationFrame(() => {
        if (typeof instanceRef.current?.open === 'function') {
          instanceRef.current.open();
        }
      });
    } catch (e) {
      console.error('useCheckoutCustom: Error al crear/abrir el checkout:', e);

      const checkoutError: ErrorV4 = {
        object: 'error',
        type: 'checkout_error',
        code: 'CHECKOUT_OPEN_ERROR',
        codigo: 'CHECKOUT_OPEN_ERROR',
        user_message: 'No se pudo abrir el checkout. Inténtalo de nuevo.',
        merchant_message: 'Failed to open Culqi Custom Checkout.',
      } as ErrorV4;

      setError(checkoutError);
      onErrorRef.current?.(checkoutError);
    }
  }, [
    culqiLoaded,
    publicKey,
    settings,
    client,
    options,
    appearance,
    handleCulqiAction,
  ]);

  // ── Cerrar el checkout programáticamente ─────────────────────────────────
  const closeCulqiCustom = useCallback(() => {
    if (instanceRef.current?.close) {
      try {
        instanceRef.current.close();
        onCloseRef.current?.();
      } catch (e) {
        console.error('useCheckoutCustom: Error al cerrar el checkout:', e);
      }
    }
  }, []);

  // ── Limpieza al desmontar ─────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      // Cerramos el checkout si el componente se desmonta con el modal abierto
      if (instanceRef.current?.close) {
        try {
          instanceRef.current.close();
        } catch {
          // Ignoramos errores en cleanup
        }
      }
      instanceRef.current = null;
    };
  }, []);

  return {
    openCulqiCustom,
    closeCulqiCustom,
    token,
    order,
    error,
  };
};
