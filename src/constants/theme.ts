import { Dimensions, Platform } from 'react-native';
import {
  ICommonTheme,
  ThemeAssets,
  ThemeFonts,
  ThemeIcons,
  ThemeLineHeights,
  ThemeWeights,
} from './types';

const { width, height } = Dimensions.get('window');

// Naming source: https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#Common_weight_name_mapping
export const WEIGHTS: ThemeWeights = {
  text: 'normal',
  h1: Platform.OS === 'ios' ? '700' : 'normal',
  h2: Platform.OS === 'ios' ? '700' : 'normal',
  h3: Platform.OS === 'ios' ? '700' : 'normal',
  h4: Platform.OS === 'ios' ? '700' : 'normal',
  h5: Platform.OS === 'ios' ? '600' : 'normal',

  thin: Platform.OS === 'ios' ? '100' : 'normal',
  extralight: Platform.OS === 'ios' ? '200' : 'normal',
  light: Platform.OS === 'ios' ? '300' : 'normal',
  normal: Platform.OS === 'ios' ? '400' : 'normal',
  medium: Platform.OS === 'ios' ? '500' : 'normal',
  semibold: Platform.OS === 'ios' ? '600' : 'normal',
  bold: Platform.OS === 'ios' ? '700' : 'normal',
  extrabold: Platform.OS === 'ios' ? '800' : 'normal',
  black: Platform.OS === 'ios' ? '900' : 'normal',
};

export const ICONS: ThemeIcons = {
  dollor_coin: "https://api.iconify.design/streamline:money-cash-dollar-coin-accounting-billing-payment-cash-coin-currency-money-finance.svg",
  check_circle: "https://api.iconify.design/material-symbols:check-circle-rounded.svg",
  add_rounded: "https://api.iconify.design/material-symbols:add-rounded.svg",
  minus_rounded: "https://api.iconify.design/ic:round-minus.svg",
  calendar: "https://api.iconify.design/material-symbols:calendar-month.svg",
  phone: "https://api.iconify.design/material-symbols:call.svg",
  direction: "https://api.iconify.design/material-symbols:directions.svg",
  bell_badge: "https://api.iconify.design/mdi:bell-badge.svg",
  shoppingbag: "https://api.iconify.design/mdi:shopping.svg",
  scan_outline: "https://api.iconify.design/ion:scan-outline.svg",
  scan_outline2: "https://api.iconify.design/streamline:interface-page-controller-fit-screen-fit-screen-adjust-display-artboard-frame-corner.svg",
  amusemnetpark: "https://api.iconify.design/maki:amusement-park.svg",
  arrow_circle_left_rounded: "https://api.iconify.design/material-symbols:arrow-circle-left-outline-rounded.svg",
  arrow_circle_right_rounded: "https://api.iconify.design/material-symbols:arrow-circle-right-outline-rounded.svg",
  chevron_left_rounded: "https://api.iconify.design/material-symbols:chevron-left-rounded.svg",
  chevron_right_rounded: "https://api.iconify.design/material-symbols:chevron-right-rounded.svg",
  check_circle_duotone: "https://api.iconify.design/ph:check-circle-duotone.svg",
  check_box: "https://api.iconify.design/material-symbols:check-box-outline-rounded.svg",
  check_box_blank: "https://api.iconify.design/material-symbols:check-box-outline-blank.svg",
  pause_circle: "https://api.iconify.design/solar:pause-circle-bold.svg",
  setting: "https://api.iconify.design/solar:settings-bold-duotone.svg",
  ticket: "https://api.iconify.design/solar:ticket-bold-duotone.svg",
  helpcenter: "https://api.iconify.design/solar:question-square-bold-duotone.svg",
  call_contact: "https://api.iconify.design/ic:twotone-contact-phone.svg"
};

export const ASSETS: ThemeAssets = {
  // fonts
  SarabunLight: require('@src/assets/fonts/Sarabun-Light.ttf'),
  SarabunRegular: require('@src/assets/fonts/Sarabun-Regular.ttf'),
  SarabunMedium: require('@src/assets/fonts/Sarabun-Medium.ttf'),
  SarabunSemiBold: require('@src/assets/fonts/Sarabun-SemiBold.ttf'),
  SarabunExtraBold: require('@src/assets/fonts/Sarabun-ExtraBold.ttf'),
  SarabunBold: require('@src/assets/fonts/Sarabun-Bold.ttf'),
  GaladaRegular: require('@src/assets/fonts/Galada-Regular.ttf'),
  Lemon: require('@src/assets/fonts/Lemon.ttf'),
  Lemonada: require('@src/assets/fonts/Lemonada.ttf'),

  // backgrounds/logo/profile
  logo: require('@src/assets/images/logo.png'),
  logowithbg: require('@src/assets/images/logobg.png'),
  profile: require('@src/assets/images/avatar2.png'),
  google: require('@src/assets/icons/google.png'),

  // intro screens
  introGetStarted: require('@src/assets/images/illustrations/ticket.png'),
  bgIntroGetStarted: require('@src/assets/images/illustrations/bgGetStarted.png'),
  intro1: require('@src/assets/images/illustrations/ticket.png'),
  intro2: require('@src/assets/images/illustrations/ridesfastpass.png'),
  intro3: require('@src/assets/images/illustrations/notification.png'),
  intro4: require('@src/assets/images/illustrations/payment.png'),

  // welcome screen
  welcome: require('@src/assets/images/illustrations/welcome.png'),

  // Ticket
  bgticket: require('@src/assets/images/bgTicket.png'),

  // Fastpass
  bgfastpass: require('@src/assets/images/bgFastpass.png'),
};

export const FONTS: ThemeFonts = {
  // based on font size
  h1: 'Sarabun-Bold',
  h2: 'Sarabun-Bold',
  h3: 'Sarabun-Bold',
  h4: 'Sarabun-Bold',
  h5: 'Sarabun-SemiBold',
  text: 'Sarabun-Regular',

  // based on fontWeight
  thin: 'Sarabun-Light',
  extralight: 'Sarabun-Light',
  light: 'Sarabun-Light',
  normal: 'Sarabun-Regular',
  medium: 'Sarabun-SemiBold',
  semibold: 'Sarabun-SemiBold',
  bold: 'Sarabun-Bold',
  extrabold: 'Sarabun-ExtraBold',
  black: 'Sarabun-ExtraBold',
};

export const LINE_HEIGHTS: ThemeLineHeights = {
  // font lineHeight
  h1: 54,
  h2: 48,
  h3: 44,
  h4: 40,
  h5: 38,
  h6: 34,
  h7: 30,
  h8: 26,
  h9: 22,
  h10: 18,
  h11: 14,

};

export const THEME: ICommonTheme = {
  icons: ICONS,
  assets: { ...ASSETS },
  fonts: FONTS,
  weights: WEIGHTS,
  lines: LINE_HEIGHTS,
  sizes: { width, height },
};
