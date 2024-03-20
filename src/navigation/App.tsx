import React, { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import Screens from './Screens';
import { useData, ThemeProvider, TranslationProvider } from '../hooks';

SplashScreen.preventAutoHideAsync();

const AppNavigation = () => {
  const { isDark, theme, setTheme }: any = useData();

  /* set the status bar based on isDark constant */
  useEffect(() => {
    Platform.OS === 'android' && StatusBar.setTranslucent(true);
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    return () => {
      StatusBar.setBarStyle('default');
    };
  }, [isDark]);

  // load custom fonts
  const [fontsLoaded] = useFonts({
    'Sarabun-Light': theme.assets.SarabunLight,
    'Sarabun-Regular': theme.assets.SarabunRegular,
    'Sarabun-Medium': theme.assets.SarabunMedium,
    'Sarabun-SemiBold': theme.assets.SarabunSemiBold,
    'Sarabun-ExtraBold': theme.assets.SarabunExtraBold,
    'Sarabun-Bold': theme.assets.SarabunBold,
    'Galada-Regular': theme.assets.GaladaRegular,
    'Lemon': theme.assets.Lemon,
  });

  if (!fontsLoaded) {
    return null;
  } else {
    SplashScreen.hideAsync();
  }

  return (
    <TranslationProvider>
      <ThemeProvider theme={theme} setTheme={setTheme}>
        <NavigationContainer>
          <Screens />
        </NavigationContainer>
      </ThemeProvider>
    </TranslationProvider>
  );
};

export default AppNavigation;