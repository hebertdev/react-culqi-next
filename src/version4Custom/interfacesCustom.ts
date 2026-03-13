// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────
export interface CulqiCustomContextProps {
  culqiLoaded: boolean;
  publicKey: string;
}

// ─────────────────────────────────────────────
// Primitivos / Enums
// ─────────────────────────────────────────────
type Currency = 'PEN';
type Lang = 'auto' | 'es' | 'en';

/** Validaciones de inputs predefinidas */
export type TypeValidate = 'DNI' | 'PHONE' | 'RUC';

/** Alineación para campos tipo paragraph */
export type Align = 'left' | 'right' | 'center';

/** Tipo de menú del checkout */
export type MenuType = 'default' | 'sidebar' | 'sliderTop' | 'select';

// ─────────────────────────────────────────────
// Links dinámicos en labels / textos
// ─────────────────────────────────────────────
export interface LinkItem {
  text: string;
  url: string;
}
export type LinksMap = Record<string, LinkItem>;

// ─────────────────────────────────────────────
// Custom Fields
// ─────────────────────────────────────────────
interface BaseFieldCommon {
  /** Permite que el campo ocupe el ancho completo del checkout */
  doubleSpan?: boolean;
}

/** Campo tipo input (text o number) */
export interface InputField extends BaseFieldCommon {
  type?: 'text' | 'number';
  /** Identificador del input. Debe ser lowercase y solo letras */
  id: string;
  label: string;
  placeholder?: string;
  typeValidate?: TypeValidate;
  minLength?: number;
  maxLength?: number;
  /** Patrón regex opcional. Ej: "/^[a-zA-Z]+$/" */
  regex?: string;
  required?: boolean;
  links?: LinksMap;
}

/** Campo tipo checkbox */
export interface CheckboxField extends BaseFieldCommon {
  type: 'checkbox';
  /** Identificador del input. Debe ser lowercase y solo letras */
  id: string;
  label?: string;
  required?: boolean;
  links?: LinksMap;
}

/** Campo tipo párrafo (solo texto / links, no recoge datos) */
export interface ParagraphField extends BaseFieldCommon {
  type: 'paragraph';
  text: string;
  align?: Align;
  links?: LinksMap;
}

export type CustomField = InputField | CheckboxField | ParagraphField;

export interface CustomFieldsConfig {
  /**
   * Campos que aparecen ANTES de cargar el checkout.
   * Recomendado para modo modal. Máximo 3 campos.
   */
  customInput?: CustomField[];
  /**
   * Campos dentro del formulario de tarjeta.
   * Disponible en modo modal y embebido. Máximo 3 campos.
   */
  card?: CustomField[];
}

// ─────────────────────────────────────────────
// Settings
// ─────────────────────────────────────────────
export interface SettingsCustom {
  title: string;
  /** Requerido para pagos con Yape */
  currency: Currency;
  /** Requerido para pagos con Yape. Monto en céntimos (ej: 8000 = S/80.00) */
  amount: number;
  /**
   * Order ID generado previamente.
   * Requerido para habilitar PagoEfectivo, billeteras y Cuotéalo.
   * Sin este campo solo se mostrará pago con tarjetas.
   */
  order?: string;
  /** ID de la llave pública RSA para encriptar el payload */
  xculqirsaid?: string;
  /** Llave pública RSA para encriptar el payload */
  rsapublickey?: string;
}

// ─────────────────────────────────────────────
// Client
// ─────────────────────────────────────────────
export interface ClientCustom {
  /** Pre-llena el email del cliente en el checkout */
  email?: string;
}

// ─────────────────────────────────────────────
// Payment Methods
// ─────────────────────────────────────────────
export interface PaymentMethodsCustom {
  tarjeta: boolean;
  yape: boolean;
  billetera?: boolean;
  bancaMovil?: boolean;
  agente?: boolean;
  cuotealo?: boolean;
}

// ─────────────────────────────────────────────
// Options
// ─────────────────────────────────────────────
export interface OptionsCustom {
  /** Idioma del checkout */
  lang: Lang;
  /** Activa o desactiva el campo de cuotas */
  installments: boolean;
  /** true = modal (popup) | false = embebido */
  modal?: boolean;
  /** Selector CSS del div donde se carga el checkout embebido. Ej: "#culqi-container" */
  container?: string;
  paymentMethods?: Partial<PaymentMethodsCustom>;
  /** Orden en que se muestran los métodos de pago */
  paymentMethodsSort?: Array<keyof PaymentMethodsCustom>;
  customFields?: CustomFieldsConfig;
}

// ─────────────────────────────────────────────
// Appearance
// ─────────────────────────────────────────────

/**
 * Personalización básica / rápida.
 * NOTA: Las reglas CSS (rules) prevalecen sobre defaultStyle.
 */
export interface DefaultStyle {
  /** Color del banner. Ej: "#9BB613" */
  bannerColor?: string;
  /** Color del botón pagar. Ej: "#9BB613" */
  buttonBackground?: string;
  /** Color de las letras del menú activo. Ej: "#9BB613" */
  menuColor?: string;
  /** Color de los links. Ej: "#9BB613" */
  linksColor?: string;
  /** Color del texto del botón. Ej: "#9BB613" */
  buttonTextColor?: string;
  /** Color del texto del precio. Ej: "#9BB613" */
  priceColor?: string;
}

/**
 * Variables CSS personalizadas.
 * Se pueden referenciar en rules como var(--nombreVariable).
 */
export type AppearanceVariables = Record<string, string>;

/**
 * Reglas CSS avanzadas: selector CSS → propiedades CSS.
 * Las claves son selectores CSS de Culqi (ej: ".Culqi-Button").
 * Los valores son objetos con propiedades CSS en camelCase.
 */
export type CssRules = Record<string, Record<string, string>>;

export interface AppearanceCustom {
  /** Tema del checkout. Valor actual soportado: "default" */
  theme?: string;
  /** Oculta el logo de Culqi */
  hiddenCulqiLogo?: boolean;
  /** Oculta el contenido del banner (logo del comercio) */
  hiddenBannerContent?: boolean;
  /** Oculta el banner completo (cabecera del checkout) */
  hiddenBanner?: boolean;
  /** Oculta el monto en el toolbar */
  hiddenToolBarAmount?: boolean;
  /** Oculta el campo de email */
  hiddenEmail?: boolean;
  /** Tipo de menú de métodos de pago */
  menuType?: MenuType;
  /** Texto personalizado del botón de pago con tarjeta */
  buttonCardPayText?: string;
  /** URL del logo del comercio. null para quitar el logo */
  logo?: string | null;
  /**
   * Configuración rápida de colores.
   * No aplica cuando se usan rules CSS.
   */
  defaultStyle?: DefaultStyle;
  /** Variables CSS inyectadas como custom properties */
  variables?: AppearanceVariables;
  /** Reglas CSS avanzadas. Prevalecen sobre defaultStyle */
  rules?: CssRules;
}

// ─────────────────────────────────────────────
// Hook props
// ─────────────────────────────────────────────
export interface UseCulqiCustomProps {
  settings: SettingsCustom;
  client?: ClientCustom;
  options?: OptionsCustom;
  appearance?: AppearanceCustom;
  onToken?: (token: import('../version4/interfacesv4').TokenV4) => void;
  onError?: (error: import('../version4/interfacesv4').ErrorV4) => void;
  onClose?: () => void;
  onOrder?: (order: import('../version4/interfacesv4').OrderV4) => void;
}

// ─────────────────────────────────────────────
// Instancia de CulqiCheckout (window.CulqiCheckout)
// ─────────────────────────────────────────────
export interface CulqiCheckoutInstance {
  open: () => void;
  close?: () => void;
  /** Callback que Culqi invoca cuando se genera un token, orden o error */
  culqi?: () => void;
  token?: import('../version4/interfacesv4').TokenV4;
  order?: import('../version4/interfacesv4').OrderV4;
  error?: import('../version4/interfacesv4').ErrorV4;
}
