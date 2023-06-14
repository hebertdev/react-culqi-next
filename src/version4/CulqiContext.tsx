import React, { createContext, useState, useEffect, ReactNode } from "react";
import type { CulqiContextProps } from "./interfacesv4";

export const CulqiContext = createContext<CulqiContextProps>({
  culqiLoaded: false,
});

export const baseCulqiUrl = "https://checkout.culqi.com";
const culqiId = "culqi-js";
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

  useEffect(() => {
    if (!publicKey) throw new Error("Please pass along a publicKey prop.");
  }, [publicKey]);

  useEffect(() => {
    if (!publicKey) return;
    const script = document.createElement("script");
    script.id = culqiId;
    script.src = culqiUrl;
    script.async = true;

    script.onload = () => {
      window.Culqi.publicKey = publicKey;
      setCulqiLoaded(true);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [publicKey]);

  return (
    <CulqiContext.Provider value={{ culqiLoaded }}>
      {children}
    </CulqiContext.Provider>
  );
};
