import React, { createContext, useState, useEffect, ReactNode } from "react";
import type { CulqiContextPropsV3 } from "./interfacesv3";

export const CulqiContextV3 = createContext<CulqiContextPropsV3>({
  culqiLoaded: false,
});

export const baseCulqiUrl = "https://checkout.culqi.com";
const culqiId = "culqi-js";
const culqiUrl = `${baseCulqiUrl}/js/v3`;

export const culqiMessages = {
  welcome: "checkout_bienvenido",
  closed: "checkout_cerrado",
};

interface CulqiProviderProps {
  publicKey: string;
  children: ReactNode;
}

export const CulqiProviderV3 = ({
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
    <CulqiContextV3.Provider value={{ culqiLoaded }}>
      {children}
    </CulqiContextV3.Provider>
  );
};
