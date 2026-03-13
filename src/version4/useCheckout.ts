import { useContext, useCallback, useEffect, useState, useRef } from "react";
import { CulqiContext, baseCulqiUrl } from "./CulqiContext";
import type {
  TokenV4,
  ErrorV4,
  CulqiContextProps,
  UseCulqiPropsV4
} from "./interfacesv4";

export const useCheckout = ({
  settings,
  onToken,
  onError,
  onClose,
}: UseCulqiPropsV4) => {
  const { culqiLoaded } = useContext(CulqiContext) as CulqiContextProps;
  const [token, setToken] = useState<TokenV4 | null>(null);
  const [error, setError] = useState<ErrorV4 | null>(null);

  // Refs for callbacks to avoid re-binding event listeners on every render
  const onTokenRef = useRef(onToken);
  const onErrorRef = useRef(onError);
  const onCloseRef = useRef(onClose);

  useEffect(() => { onTokenRef.current = onToken; }, [onToken]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  const onCulqiEvent = useCallback(
    (messageEvent: MessageEvent) => {
      const { origin, data } = messageEvent;
      
      // Security check: only accept messages from Culqi domain
      if (origin !== baseCulqiUrl) return;

      if (typeof data === "object" && data !== null) {
        const { object } = data;
        if (!object) return;
        
        switch (object) {
          case "token":
            setToken(data);
            onTokenRef.current?.(data);
            // Safe check for window.Culqi existence
            if (window?.Culqi?.close) {
              window.Culqi.close();
            }
            break;
          case "error":
            setError(data);
            onErrorRef.current?.(data);
            break;
          case "closeCheckout":
            onCloseRef.current?.();
            break;
          default:
            // Handle unknown object types gracefully
            break;
        }
      }
    },
    [] // No dependencies needed as we use refs
  );

  useEffect(() => {
    // SSR guard: ensure we're in browser environment
    if (typeof window === "undefined" || !culqiLoaded) return;

    window.addEventListener("message", onCulqiEvent, false);
    
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("message", onCulqiEvent, false);
      }
    };
  }, [culqiLoaded, onCulqiEvent]);

  const openCulqi = useCallback(() => {
    // SSR guard and safety checks
    if (typeof window === "undefined" || !culqiLoaded || !window.Culqi) {
      console.warn("Culqi is not loaded or not available in this environment");
      return;
    }

    try {
      requestAnimationFrame(() => {
        if (window.Culqi?.settings && window.Culqi?.options && window.Culqi?.open) {
          window.Culqi.settings(settings);
          if (settings.options) {
            window.Culqi.options(settings.options);
          }
          window.Culqi.open();
        }
      });
      
      // Clear any existing global culqi callback to avoid conflicts
      if (typeof window !== 'undefined') {
          window.culqi = () => {};
      }
    } catch (err) {
       console.error("Error opening Culqi checkout:", err);
       const errorObj: ErrorV4 = { 
         object: "error", 
         type: "checkout_error", 
         code: "CHECKOUT_OPEN_ERROR",
         codigo: "CHECKOUT_OPEN_ERROR",
         user_message: "No se pudo abrir el checkout",
         merchant_message: "Failed to open checkout"
       };
       setError(errorObj);
       onErrorRef.current?.(errorObj);
    }
  }, [culqiLoaded, settings]);

  return {
    openCulqi,
    token,
    error
  };
};
