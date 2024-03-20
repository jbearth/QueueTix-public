import i18n from 'i18n-js';
import { ImageSourcePropType } from 'react-native';
import { ITheme } from './theme';

export * from './components';
export * from './theme';

export interface ITranslate {
  locale: string;
  setLocale: (locale?: string) => void;
  t: (scope?: i18n.Scope, options?: i18n.TranslateOptions) => string;
  translate: (scope?: i18n.Scope, options?: i18n.TranslateOptions) => string;
}
