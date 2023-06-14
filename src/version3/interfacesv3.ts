export interface CulqiContextPropsV3 {
  culqiLoaded: boolean;
}

export interface UseCulqiPropsV3 {
  settings: SettingsV3;
  onToken?: (token: TokenV3) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}

type Currency = "PEN";

export interface SettingsV3 {
  title: string;
  currency: Currency;
  description?: string;
  amount: number;
  options?: Partial<Options>;
}

export interface Options {
  lang: string;
  modal: boolean;
  installments: boolean;
  customButton: string;
  style?: Partial<Style>;
}

export interface Style {
  logo: string;
  maincolor: string;
  buttontext: string;
  maintext: string;
  desctext: string;
}

export interface ErrorV3 {
  codigo: string;
  code: string;
  user_message: string;
  merchant_message: string;
  type: string;
  object: string;
}

export interface TokenV3 {
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
