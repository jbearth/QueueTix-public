import {
  ITheme,
  ThemeColors,
  ThemeSizes,
  ThemeSpacing,
} from './types';

import { THEME as commonTheme } from './theme';


export const COLORS: ThemeColors = {
  // default text color
  text: '#252F40',

  /** primary colors */
  primaryLight: '#F8E8E7',
  primaryMain: '#F05333',
  primaryDark: '#E54D2F',
  primary100: '#F9CABE',
  primary200: '#F5A895',
  primary300: '#F2866C',
  primary400: '#F16C4E',
  primary700: '#D7472A',
  primary800: '#C94126',
  primary900: '#B0341E',

  /** secondary colors */
  secondaryLight: '#E5F2FC',
  secondaryMain: '#4A99EA',
  secondaryDark: '#448bdc',
  secondary100: '#BFDFF9',
  secondary200: '#99CBF5',
  secondary300: '#75b7f0',
  secondary400: '#5CA7ED',
  secondary700: '#3D79C9',
  secondary800: '#3768B7',
  secondary900: '#2c4b97',

  /** tertiary colors */
  tertiaryLight: '#e5f5e9',
  tertiaryMain: '#00ad50',
  tertiaryDark: '#009e47',
  tertiary100: '#c0e6c9',
  tertiary200: '#96d5a7',
  tertiary300: '#69c685',
  tertiary400: '#43b96b',
  tertiary700: '#008c3c',
  tertiary800: '#007b31',
  tertiary900: '#005c1c',

  /** fourth colors */
  fourthLight: '#fdf6e2',
  fourthMain: '#eeb12d',
  fourthDark: '#eca42a',
  fourth100: '#fae6b5',
  fourth200: '#f6d687',
  fourth300: '#f3c85b',
  fourth400: '#f0bb40',
  fourth700: '#eb9327',
  fourth800: '#e98324',
  fourth900: '#e7661e',


  // non-colors
  black: '#252F40',
  white: '#FFFFFF',

  /** danger colors */
  error: '#EA0606',

  /** warning colors */
  warning: '#FFC107',

  /** sucess colors */
  success: '#54D62C',

  /** info colors */
  info: '#17C1E8',

  /** UI colors for navigation & card */
  card: '#FFFFFF',
  background: '#E9ECEF',

  /** UI color for shadowColor */
  shadow: '#000000',
  overlay: 'rgba(0,0,0,0.3)',

  /** UI color for input borderColor on focus */
  focus: '#666AF6',
  input: '#252F40',

  /** UI color for switch checked/active color */
  switchOn: '#3A416F',
  switchOff: '#E9ECEF',

  /** grey colors */
  greyLight: '#fafafa',
  greyMain: '#9e9e9e',
  greyDark: '#757575',
  grey100: '#f5f5f5',
  grey200: '#eeeeee',
  grey300: '#e0e0e0',
  grey400: '#bdbdbd',
  grey700: '#616161',
  grey800: '#424242',
  grey900: '#212121',

  /** blue grey colors */
  bluegreyLight: '#eceff1',
  bluegreyMain: '#607d8b',
  bluegreyDark: '#546e7a',
  bluegrey100: '#cfd8dc',
  bluegrey200: '#b0bec5',
  bluegrey300: '#90a4ae',
  bluegrey400: '#78909c',
  bluegrey700: '#455a64',
  bluegrey800: '#37474f',
  bluegrey900: '#263238',

};

export const SIZES: ThemeSizes = {
  // global sizes
  base: 8,
  text: 14,
  radius: 4,
  padding: 20,

  // font sizes
  h1: 44,
  h2: 40,
  h3: 34,
  h4: 30,
  h5: 28,
  h6: 24,
  h7: 20,
  h8: 18,
  h9: 16,
  h10: 14,
  h11: 12,

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
};

export const SPACING: ThemeSpacing = {
  /** xs: 4px */
  xs: SIZES.base * 0.5,
  /** s: 8px */
  s: SIZES.base * 1,
  /** sm: 16px */
  sm: SIZES.base * 2,
  /** m: 24px */
  m: SIZES.base * 3,
  /** md: 32px */
  md: SIZES.base * 4,
  /** l: 40px */
  l: SIZES.base * 5,
  /** xl: 48px */
  xl: SIZES.base * 6,
  /** xxl: 56px */
  xxl: SIZES.base * 7,
};

export const THEME: ITheme = {
  ...commonTheme,
  colors: COLORS,
  sizes: { ...SIZES, ...commonTheme.sizes, ...SPACING },
};
