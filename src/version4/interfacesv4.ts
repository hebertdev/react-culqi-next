export interface CulqiContextProps {
  culqiLoaded: boolean;
}

export interface UseCulqiPropsV4 {
  settings: SettingsV4;
  onToken?: (token: TokenV4) => void;
  onError?: (error: ErrorV4) => void;
  onClose?: () => void;
}

type Currency = "PEN";

export interface SettingsV4 {
  title: string;
  currency: Currency;
  amount: number;
  options?: Partial<Options>;
}

export interface Options {
  lang: string;
  installments: boolean;
  paymentMethods?: Partial<PaymentMethods>;
  style?: Partial<Style>;
}

export interface PaymentMethods {
  tarjeta: boolean;
  yape: boolean;
}

export interface Style {
  logo?: string;
  bannerColor?: string;
  buttonBackground?: string;
  menuColor?: string;
  linksColor?: string;
  buttonText?: string;
  buttonTextColor?: string;
  priceColor?: string;
}

export interface ErrorV4 {
  codigo: string;
  code: string;
  user_message: string;
  merchant_message: string;
  type: string;
  object: string;
}

export interface TokenV4 {
  metadata: Metadata;
  card_number: string;
  last_four: string;
  active: boolean;
  client: Client;
  id: string;
  creation_date: number;
  type: string;
  email: string;
  object: string;
  iin: Iin;
}

export interface Client {
  device_fingerprint: string;
  ip_country_code: string;
  ip: string;
  browser: string;
  ip_country: string;
  device_type: string;
}

export interface Iin {
  installments_allowed: any[];
  bin: string;
  card_category: null;
  card_brand: string;
  card_type: string;
  issuer: Issuer;
  object: string;
}

export interface Issuer {
  country: string;
  country_code: string;
  website: string;
  name: string;
  phone_number: string;
}

export interface Metadata {
  installments: string;
}
