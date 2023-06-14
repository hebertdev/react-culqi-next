import { useContext, useCallback, useEffect, useState } from "react";
import { CulqiContextV3, culqiMessages, baseCulqiUrl } from "./CulqiContextV3";
import type {
  TokenV3,
  ErrorV3,
  CulqiContextPropsV3,
  UseCulqiPropsV3,
} from "./interfacesv3";

export const useCheckoutV3 = ({
  settings,
  onToken,
  onError,
  onClose,
}: UseCulqiPropsV3) => {
  const { culqiLoaded } = useContext(CulqiContextV3) as CulqiContextPropsV3;
  const [token, setToken] = useState<TokenV3 | null>(null);
  const [error, setError] = useState<ErrorV3 | null>(null);

  const onCulqiEvent = useCallback(
    (messageEvent: MessageEvent) => {
      const { origin, data } = messageEvent;

      if (origin !== baseCulqiUrl) return;

      if (typeof data === "string" && data === culqiMessages.closed) {
        onClose && onClose();
      }

      if (typeof data === "object") {
        const { object } = data;
        if (!object) return;
        if (object === "token") {
          setToken(data);
          onToken && onToken(data);
        } else if (object === "error") {
          setError(data);
          onError && onError(data);
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
