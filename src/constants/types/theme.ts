import * as React from 'react';
import {
  ColorValue,
  FlexStyle,
  ImageSourcePropType,
  ScaledSize,
  TextStyle,
} from 'react-native';

// Spacing types
export interface ISpacing
  extends Pick<
    FlexStyle,
    | 'margin'
    | 'marginVertical'
    | 'marginHorizontal'
    | 'marginLeft'
    | 'marginRight'
    | 'marginTop'
    | 'marginBottom'
    | 'padding'
    | 'paddingVertical'
    | 'paddingHorizontal'
    | 'paddingLeft'
    | 'paddingRight'
    | 'paddingTop'
    | 'paddingBottom'
  > { }

export type TWeight =
  /** fontWeight: 400 */
  | 'normal'
  /** fontWeight: 100 */
  | 'thin'
  /** fontWeight: 200 */
  | 'extralight'
  /** fontWeight: 300 */
  | 'light'
  /** fontWeight: 500 */
  | 'medium'
  /** fontWeight: 600 */
  | 'semibold'
  /** fontWeight: 700 */
  | 'bold'
  /** fontWeight: 800 */
  | 'extrabold'
  /** fontWeight: 900 */
  | 'black';

export interface ITheme {
  colors: ThemeColors;
  sizes: ThemeSizes & ThemeSpacing & ICommonTheme['sizes'];
  assets: ThemeAssets;
  icons: ThemeIcons;
  fonts: ThemeFonts;
  weights: ThemeWeights;
  lines: ThemeLineHeights;
}
export interface ICommonTheme {
  assets: ThemeAssets;
  icons: ThemeIcons;
  fonts: ThemeFonts;
  weights: ThemeWeights;
  lines: ThemeLineHeights;
  sizes: {
    width: ScaledSize['width'];
    height: ScaledSize['height'];
  };
}

export interface IThemeProvider {
  children?: React.ReactNode;
  theme?: ITheme;
  setTheme?: (theme?: ITheme) => void;
}

export interface ThemeColors {
  [key: string]: ColorValue;
  text: ColorValue;
  primaryLight: ColorValue;
  primaryMain: ColorValue;
  primaryDark: ColorValue;
  primary100: ColorValue;
  primary200: ColorValue;
  primary300: ColorValue;
  primary400: ColorValue;
  primary700: ColorValue;
  primary800: ColorValue;
  primary900: ColorValue;
  secondaryLight: ColorValue;
  secondaryMain: ColorValue;
  secondaryDark: ColorValue;
  secondary100: ColorValue;
  secondary200: ColorValue;
  secondary300: ColorValue;
  secondary400: ColorValue;
  secondary700: ColorValue;
  secondary800: ColorValue;
  secondary900: ColorValue;
  tertiaryLight: ColorValue;
  tertiaryMain: ColorValue;
  tertiaryDark: ColorValue;
  tertiary100: ColorValue;
  tertiary200: ColorValue;
  tertiary300: ColorValue;
  tertiary400: ColorValue;
  tertiary700: ColorValue;
  tertiary800: ColorValue;
  tertiary900: ColorValue;
  fourthLight: ColorValue;
  fourthMain: ColorValue;
  fourthDark: ColorValue;
  fourth100: ColorValue;
  fourth200: ColorValue;
  fourth300: ColorValue;
  fourth400: ColorValue;
  fourth700: ColorValue;
  fourth800: ColorValue;
  fourth900: ColorValue;
  greyLight: ColorValue;
  greyMain: ColorValue;
  greyDark: ColorValue;
  grey100: ColorValue;
  grey200: ColorValue;
  grey300: ColorValue;
  grey400: ColorValue;
  grey700: ColorValue;
  grey800: ColorValue;
  grey900: ColorValue;
  bluegreyLight: ColorValue;
  bluegreyMain: ColorValue;
  bluegreyDark: ColorValue;
  bluegrey100: ColorValue;
  bluegrey200: ColorValue;
  bluegrey300: ColorValue;
  bluegrey400: ColorValue;
  bluegrey700: ColorValue;
  bluegrey800: ColorValue;
  bluegrey900: ColorValue;
  black: ColorValue;
  white: ColorValue;
  error: ColorValue;
  warning: ColorValue;
  success: ColorValue;
  info: ColorValue;
  card: ColorValue;
  background: ColorValue;
  shadow: ColorValue;
  overlay: ColorValue;
  focus: ColorValue;
  input: ColorValue;
  switchOn: ColorValue;
  switchOff: ColorValue;
}

export interface ThemeGradients {
  primary?: string[];
  secondary?: string[];
  tertiary?: string[];
  black?: string[];
  white?: string[];
  light?: string[];
  dark?: string[];
  gray?: string[];
  danger?: string[];
  warning?: string[];
  success?: string[];
  info?: string[];
  divider?: string[];
  menu?: string[];
}

export interface ThemeSizes {
  base: number;
  text: number;
  radius: number;
  padding: number;


  h1: number;
  h2: number;
  h3: number;
  h4: number;
  h5: number;
  h6: number;
  h7: number;
  h8: number;
  h9: number;
  h10: number;
  h11: number;

  // button sizes
  buttonBorder: 1,
  buttonRadius: 8,
  socialSize: 64,
  socialRadius: 16,
  socialIconSize: 26,

  // button shadow
  shadowOffsetWidth: 2,
  shadowOffsetHeight: 8,
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 3,

  // input sizes
  inputHeight: 46,
  inputBorder: 1,
  inputRadius: 8,
  inputPadding: 12,

  // card sizes
  cardRadius: 16,
  cardPadding: 1,

  // image sizes
  imageRadius: 14,
  avatarSize: 32,
  avatarRadius: 8,

  // switch sizes
  switchWidth: 50,
  switchHeight: 24,
  switchThumb: 20,

  // checkbox sizes
  checkboxWidth: 18,
  checkboxHeight: 18,
  checkboxRadius: 5,
  checkboxIconWidth: 10,
  checkboxIconHeight: 8,

  // product link size
  linkSize: 12,

  /** font size multiplier: for maxFontSizeMultiplier prop */
  multiplier: 2,
}

export interface ThemeSpacing {
  xs: number;
  s: number;
  sm: number;
  m: number;
  md: number;
  l: number;
  xl: number;
  xxl: number;
}

export interface ThemeWeights {
  text: TextStyle['fontWeight'];
  h1?: TextStyle['fontWeight'];
  h2?: TextStyle['fontWeight'];
  h3?: TextStyle['fontWeight'];
  h4?: TextStyle['fontWeight'];
  h5?: TextStyle['fontWeight'];


  thin: TextStyle['fontWeight'];
  extralight: TextStyle['fontWeight'];
  light: TextStyle['fontWeight'];
  normal: TextStyle['fontWeight'];
  medium: TextStyle['fontWeight'];
  semibold?: TextStyle['fontWeight'];
  bold?: TextStyle['fontWeight'];
  extrabold?: TextStyle['fontWeight'];
  black?: TextStyle['fontWeight'];
}
export interface ThemeIcons {
  // [key: string]: string;
  dollor_coin: string;
  check_circle: string;
  add_rounded: string;
  minus_rounded: string;
  calendar: string;
  phone: string;
  direction: string;
  bell_badge: string;
  shoppingbag: string;
  scan_outline: string;
  scan_outline2: string;
  amusemnetpark: string;
  arrow_circle_left_rounded: string;
  arrow_circle_right_rounded: string;
  chevron_left_rounded: string;
  chevron_right_rounded: string;
  check_circle_duotone: string;
  check_box: string;
  check_box_blank: string;
  pause_circle: string;
  setting: string;
  ticket: string;
  helpcenter: string;
  call_contact: string;
}

export interface ThemeAssets {
  SarabunLight?: any;
  SarabunRegular?: any;
  SarabunMedium?: any;
  SarabunSemiBold?: any;
  SarabunExtraBold?: any;
  SarabunBold?: any;
  GaladaRegular?: any;
  Lemon?: any;
  Lemonada?: any;

  logo: ImageSourcePropType;
  logowithbg: ImageSourcePropType;
  profile: ImageSourcePropType;
  google: ImageSourcePropType;

  introGetStarted: ImageSourcePropType;
  bgIntroGetStarted: ImageSourcePropType;
  intro1: ImageSourcePropType;
  intro2: ImageSourcePropType;
  intro3: ImageSourcePropType;
  intro4: ImageSourcePropType;

  welcome: ImageSourcePropType;

  bgticket: ImageSourcePropType;
  bgfastpass: ImageSourcePropType;
}

export interface ThemeFonts {
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  text: string;

  thin: string;
  extralight: string;
  light: string;
  normal: string;
  medium: string;
  bold: string;
  semibold: string;
  extrabold: string;
  black: string;
}

export interface ThemeLineHeights {
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  h5: number;
  h6: number;
  h7: number;
  h8: number;
  h9: number;
  h10: number;
  h11: number;
}
