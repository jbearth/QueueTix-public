import { alpha } from '@mui/material/styles';

interface ThemePaletteProps {
  [x: string]: string;
  paper?: any;
  indigoMain?: any;
  transparent?: any;
  iconDrawer?: any;
  primaryLight?: any;
  primaryMain?: any;
  primaryDark?: any;
  primary100?: any;
  primary200?: any;
  primary300?: any;
  primary400?: any;
  primary600?: any;
  primary700?: any;
  primary800?: any;
  primary900?: any;
  secondaryLight?: any;
  secondaryMain?: any;
  secondaryDark?: any;
  secondary100?: any;
  secondary200?: any;
  secondary300?: any;
  secondary400?: any;
  secondary600?: any;
  secondary700?: any;
  secondary800?: any;
  secondary900?: any;
  orangeLight?: any;
  orangeMain?: any;
  orangeDark?: any;
  successLight?: any;
  successMain?: any;
  successDark?: any;
  errorCustomLighter?: any;
  errorCustomLight?: any;
  errorCustomMain?: any;
  errorCustomDark?: any;
  errorCustomDarker?: any;
  warningCustomLighter?: any;
  warningCustomLight?: any;
  warningCustomMain?: any;
  warningCustomDark?: any;
  warningCustomDarker?: any;
  successCustomLighter?: any;
  successCustomLight?: any;
  successCustomMain?: any;
  successCustomDark?: any;
  successCustomDarker?: any;
  infoCustomLighter?: any;
  infoCustomLight?: any;
  infoCustomMain?: any;
  infoCustomDark?: any;
  infoCustomDarker?: any;
  grey50?: any;
  grey100?: any;
  grey200?: any;
  grey300?: any;
  grey400?: any;
  grey500?: any;
  grey600?: any;
  grey700?: any;
  grey800?: any;
  grey900?: any;
  lightbluemain?: any;
  lightblue50?: any;
  lightblue100?: any;
  lightblue200?: any;
  lightblue400?: any;
  lightblue500?: any;
  lightblue700?: any;
  lightblue800?: any;
}


export default function themePalette(colors: ThemePaletteProps) {
  return {
    // mode: theme?.customization?.navType,
    background: {
      paper: colors?.paper,
      indigoMain: colors?.indigoMain,
      transparent: colors?.transparent
    },
    icon: {
      drawer: colors?.iconDrawer
    },
    primary: {
      light: colors?.primaryLight,
      main: colors?.primaryMain,
      dark: colors?.primaryDark,
      100: colors?.primary100,
      200: colors?.primary200,
      300: colors?.primary300,
      400: colors?.primary400,
      600: colors?.primary600,
      700: colors?.primary700,
      800: colors?.primary800,
      900: colors?.primary900
    },
    secondary: {
      light: colors?.secondaryLight,
      main: colors?.secondaryMain,
      dark: colors?.secondaryDark,
      100: colors?.secondary100,
      200: colors?.secondary200,
      300: colors?.secondary300,
      400: colors?.secondary400,
      600: colors?.secondary600,
      700: colors?.secondary700,
      800: colors?.secondary800,
      900: colors?.secondary900
    },
    orange: {
      light: colors?.orangeLight,
      main: colors?.orangeMain,
      dark: colors?.orangeDark
    },
    success: {
      light: colors?.successLight,
      main: colors?.successMain,
      dark: colors?.successDark
    },
    errorCustom: {
      lighter: colors?.errorCustomLighter,
      light: colors?.errorCustomLight,
      main: colors?.errorCustomMain,
      dark: colors?.errorCustomDark,
      darker: colors?.errorCustomDarker
    },
    warningCustom: {
      lighter: colors?.warningCustomLighter,
      light: colors?.warningCustomLight,
      main: colors?.warningCustomMain,
      dark: colors?.warningCustomDark,
      darker: colors?.warningCustomDarker
    },
    successCustom: {
      lighter: colors?.successCustomLighter,
      light: colors?.successCustomLight,
      main: colors?.successCustomMain,
      dark: colors?.successCustomDark,
      darker: colors?.successCustomDarker
    },
    infoCustom: {
      lighter: colors?.infoCustomLighter,
      light: colors?.infoCustomLight,
      main: colors?.infoCustomMain,
      dark: colors?.infoCustomDark,
      darker: colors?.infoCustomDarker
    },
    grey: {
      50: colors?.grey50,
      100: colors?.grey100,
      200: colors?.grey200,
      300: colors?.grey300,
      400: colors?.grey400,
      500: colors?.grey500,
      600: colors?.grey600,
      700: colors?.grey700,
      800: colors?.grey800,
      900: colors?.grey900,
    },
    lightblue: {
      main: colors?.lightbluemain,
      50: colors?.lightblue50,
      100: colors?.lightblue100,
      200: colors?.lightblue200,
      400: colors?.lightblue400,
      500: colors?.lightblue500,
      700: colors?.lightblue700,
      800: colors?.lightblue800,
    },
    divider: alpha(colors?.grey500, 0.24),
    primaryAlpha: alpha(colors?.primaryLight, 0.7),
    infoAlpha: alpha(colors?.infoCustomLight, 0.7),
    secondaryAlpha: alpha(colors?.secondaryLight, 0.7),
    successAlpha: alpha(colors?.successCustomLight, 0.7),
    warningAlpha: alpha(colors?.warningCustomLight, 0.7),
    errorAlpha: alpha(colors?.errorCustomLight, 0.7),
    customShadow: `0px 2px 8px ${alpha(colors?.grey900, 0.15)}`
    // dark: {
    //   light: theme.colors?.darkTextPrimary,
    //   main: theme.colors?.darkLevel1,
    //   dark: theme.colors?.darkLevel2,
    //   800: theme.colors?.darkBackground,
    //   900: theme.colors?.darkPaper
    // },
  }
}
