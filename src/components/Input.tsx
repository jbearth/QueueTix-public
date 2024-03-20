import React, { useCallback, useState } from 'react';
import {
  Image,
  TextInput,
  TextStyle,
  ViewStyle,
  StyleSheet,
  Platform,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';

import Block from './Block';
import Text from './Text';

import useTheme from '../hooks/useTheme';
import { IInputProps } from '../constants/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Input = ({
  id = 'Input',
  children,
  style,
  inputContainnerStyle,
  inputStyle,
  sizeIconSerach,
  color,
  primary,
  secondary,
  tertiary,
  fourth,
  modeSecureText,
  black,
  white,
  gray,
  error,
  warning,
  success,
  info,
  search,
  disabled,
  label,
  inputBorder,
  Icon,
  IconSize,
  IconColors,
  password,
  formhelpers,
  formhelperslabel,
  marginBottom,
  marginTop,
  marginHorizontal,
  marginVertical,
  marginRight,
  marginLeft,
  onFocus,
  onBlur,
  radius,
  ...props
}: IInputProps) => {
  const { assets, colors, sizes } = useTheme();
  const [isFocused, setFocused] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const handleFocus = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>, focus: boolean | ((prevState: boolean) => boolean)) => {
      setFocused(focus);
      focus && onFocus?.(event);
      !focus && onBlur?.(event);
    },
    [setFocused, onFocus, onBlur],
  );

  const colorIndex = primary
    ? 'primaryMain'
    : secondary
      ? 'secondaryMain'
      : tertiary
        ? 'tertiaryMain'
        : fourth
          ? 'fourthMain'
          : black
            ? 'black'
            : white
              ? 'white'
              : gray
                ? 'gray'
                : error
                  ? 'error'
                  : warning
                    ? 'warning'
                    : success
                      ? 'success'
                      : info
                        ? 'info'
                        : null;

  const inputColor = color
    ? color
    : colorIndex
      ? colors?.[colorIndex]
      : colors.grey400;

  const inputBoxStyles = StyleSheet.flatten([
    style,
    {
      ...(marginBottom && { marginBottom: marginBottom }),
      ...(marginTop && { marginTop: marginTop }),
      ...(marginHorizontal && { marginHorizontal: marginHorizontal }),
      ...(marginVertical && { marginVertical: marginVertical }),
      ...(marginRight && { marginRight: marginRight }),
      ...(marginLeft && { marginLeft: marginLeft }),
    },
  ]) as ViewStyle;

  const inputContainerStyles = StyleSheet.flatten([
    inputContainnerStyle,
    {
      borderRadius: radius,
      borderWidth: isFocused ? 2 : inputBorder,
      borderColor: isFocused ? colors.focus : inputColor,
    },
  ]) as ViewStyle;

  const inputStyles = StyleSheet.flatten([
    inputStyle,
    {
      flex: 1,
      zIndex: 2,
      height: '100%',
      fontSize: sizes.h9,
      color: colors.input,
      // paddingHorizontal: sizes.inputPadding,
    },
  ]) as TextStyle;

  // generate component testID or accessibilityLabel based on Platform.OS
  const inputID =
    Platform.OS === 'android' ? { accessibilityLabel: id } : { testID: id };

  return (
    <Block flex={0} style={inputBoxStyles}>
      <Block row align="center" style={inputContainerStyles}>
        {search && assets.search && (
          <Image
            source={assets.search}
            style={{ width: sizeIconSerach, height: sizeIconSerach, tintColor: colors.grey300 }}
          />
        )}
        {Icon && (
          <MaterialCommunityIcons
            name={Icon}
            size={IconSize}
            color={IconColors}
          />
        )}
        {children}
        <TextInput
          {...inputID}
          {...props}
          style={inputStyles}
          editable={!disabled}
          secureTextEntry={modeSecureText ? secureText : false}
          placeholderTextColor={inputColor}
          onFocus={(event) => handleFocus(event, true)}
          onBlur={(event) => handleFocus(event, false)}
        />
        {error && assets.warning && (
          <Image
            source={assets.warning}
            style={{
              marginRight: sizes.s,
              tintColor: colors.error,
            }}
          />
        )}
        {success && assets.check && (
          <Image
            source={assets.check}
            style={{
              width: 12,
              height: 9,
              marginRight: sizes.s,
              tintColor: colors.success,
            }}
          />
        )}
        {modeSecureText && (
          <MaterialCommunityIcons
            name={secureText ? "eye-off" : "eye"}
            size={20}
            color={colors.focus}
            style={{
              marginRight: sizes.s,
            }}
            onPress={() => setSecureText(!secureText)}
          />
        )}
      </Block>
      {formhelperslabel && (
        <Text paddingTop={5} error>
          {formhelperslabel}
        </Text>
      )}
    </Block>
  );
};

export default React.memo(Input);
