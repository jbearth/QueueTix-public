import React, { useMemo } from 'react';

// material-ui
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MUIThemeProvider, createTheme, StyledEngineProvider, Theme } from '@mui/material/styles';
import { thTH } from '@mui/material/locale';

// project imports
import colors from 'assets/scss/_themes-vars.module.scss';
import themePalette from './palette';
import themeTypography from './typography';
import GlobalStyles from './GlobalStyle';
import themeCustomShadows from './CustomShadow';

declare module '@mui/material/styles' {
  interface Palette extends Theme {
    icon: {
      drawer: string;
    };
    orange: Palette['primary'];
    lightblue: Palette['primary'];
    successCustom: {
      lighter: string,
      light: string,
      main: string,
      dark: string,
      darker: string
    };
    warningCustom: {
      lighter: string,
      light: string,
      main: string,
      dark: string,
      darker: string
    };
    errorCustom: {
      lighter: string,
      light: string,
      main: string,
      dark: string,
      darker: string
    };
    infoCustom: {
      lighter: string,
      light: string,
      main: string,
      dark: string,
      darker: string
    };
    divider: string;
    primaryAlpha: string;
    infoAlpha: string;
    secondaryAlpha: string;
    successAlpha: string;
    warningAlpha: string;
    errorAlpha: string;
    customShadow: string;
  }

  // allow configuration using `createTheme`
  interface PaletteOptions extends Theme {
    icon?: {
      drawer: string;
    };
    orange?: PaletteOptions['primary'];
    lightblue?: PaletteOptions['primary'];
    successCustom?: {
      lighter: string,
      light: string,
      main: string,
      dark: string,
      darker: string
    };
    warningCustom?: {
      lighter: string,
      light: string,
      main: string,
      dark: string,
      darker: string
    };
    errorCustom?: {
      lighter: string,
      light: string,
      main: string,
      dark: string,
      darker: string
    };
    infoCustom?: {
      lighter: string,
      light: string,
      main: string,
      dark: string,
      darker: string
    };
    divider?: string;
    customShadow?: string;
  }

  interface TypographyVariants {
    h7: React.CSSProperties;
    h8: React.CSSProperties;
    h9: React.CSSProperties;
    fontItemLeftDrawerSelect: React.CSSProperties;
    subItemDrawerClose: React.CSSProperties;
    subItemDrawerSelect: React.CSSProperties;
    mainContent: React.CSSProperties;
    menuCaption: React.CSSProperties;
    subMenuCaption: React.CSSProperties
    commonAvatar: React.CSSProperties;
    smallAvatar: React.CSSProperties;
    mediumAvatar: React.CSSProperties;
    largeAvatar: React.CSSProperties;
    customInput: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    h7?: React.CSSProperties;
    h8?: React.CSSProperties;
    h9?: React.CSSProperties;
    fontItemLeftDrawerSelect?: React.CSSProperties;
    subItemDrawerClose?: React.CSSProperties;
    subItemDrawerSelect?: React.CSSProperties;
    mainContent?: React.CSSProperties;
    menuCaption?: React.CSSProperties;
    subMenuCaption?: React.CSSProperties
    commonAvatar?: React.CSSProperties;
    smallAvatar?: React.CSSProperties;
    mediumAvatar?: React.CSSProperties;
    largeAvatar?: React.CSSProperties;
    customInput?: React.CSSProperties;
  }
  interface Shadows {
    card: string
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h7: true;
    h8: true;
    h9: true;
    fontItemLeftDrawerSelect: true;
    subItemDrawerClose: true;
    subItemDrawerSelect: true;
    mainContent: true;
    menuCaption: true;
    subMenuCaption: true;
    commonAvatar: true;
    smallAvatar: true;
    mediumAvatar: true;
    largeAvatar: true;
  }
}

interface Props {
  children?: React.ReactNode
}

const ThemeProvider = ({ children }: Props) => {

  const themeOptions: any = useMemo(
    () => ({
      palette: themePalette(colors),
      typography: themeTypography(colors),
      customShadows: themeCustomShadows()
    }), []
  );

  const theme = createTheme(themeOptions, thTH);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  )
}
export default ThemeProvider