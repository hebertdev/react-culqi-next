import { useContext, useCallback, useEffect, useState } from "react";
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

  const onCulqiEvent = useCallback(
    (messageEvent: MessageEvent) => {
      const { origin, data } = messageEvent;
      if (origin !== baseCulqiUrl) return;

      if (typeof data === "object") {
        const { object } = data;
        if (!object) return;
        if (object === "token") {
          setToken(data);
          onToken && onToken(data);
          window.Culqi.close();
        } else if (object === "error") {
          setError(data);
          onError && onError(data);
        } else if (object === "closeCheckout") {
          onClose && onClose();
        }
      }
    },
    [onClose, onError, onToken, settings]
  );

  useEffect(() => {
    if (culqiLoaded) {
      window.addEventListener("message", onCulqiEvent, false);
    }
    return () => {
      window.removeEventListener("message", onCulqiEvent, false);
    };
  }, [culqiLoaded, onCulqiEvent]);

  const openCulqi = useCallback(() => {
    if (culqiLoaded && window.Culqi) {
      requestAnimationFrame(() => {
        window.Culqi.settings(settings);
        window.Culqi.options(settings.options);
        window.Culqi.open();
      });
      window.culqi = () => {};
    }
  }, [culqiLoaded, settings]);

  return { openCulqi, token, error };
};
