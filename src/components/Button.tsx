import React, { useCallback } from 'react';
import {
  ViewStyle,
  Vibration,
  StyleSheet,
  TouchableOpacity,
  Platform,
  GestureResponderEvent,
} from 'react-native';

// thirds-party
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgUri } from 'react-native-svg';

// project imports
import useTheme from '../hooks/useTheme';
import { IButtonProps } from '../constants/types';

const Button = ({
  id = 'Button',
  children,
  style,
  bgcolor,
  gradient,
  primary,
  secondary,
  tertiary,
  fourth,
  black,
  white,
  light,
  dark,
  gray,
  error,
  warning,
  success,
  info,
  flex,
  radius,
  round,
  rounded,
  disabled,
  margin,
  marginBottom,
  marginTop,
  marginHorizontal,
  marginVertical,
  marginRight,
  marginLeft,
  padding,
  paddingBottom,
  paddingTop,
  paddingHorizontal,
  paddingVertical,
  paddingRight,
  paddingLeft,
  align,
  justify,
  height,
  width,
  row,
  outlined,
  startAdornmentIcon,
  endAdornmentIcon,
  startIconUri,
  startIconWidth,
  startIconHeight,
  startIconColors,
  endIconUri,
  endIconWidth,
  endIconHeight,
  endIconColors,
  activeOpacity = 0.7,
  card,
  shadow = true,
  position,
  right,
  left,
  top,
  bottom,
  haptic = true,
  vibrate,
  vibrateRepeat,
  onPress,
  ...props
}: IButtonProps) => {
  const { colors, sizes } = useTheme();
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

  const buttonColor = bgcolor
    ? bgcolor
    : colorIndex
      ? colors?.[colorIndex]
      : 'transparent';

  const buttonStyles = StyleSheet.flatten([
    style,
    {
      minHeight: sizes.m,
      minWidth: sizes.m,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: buttonColor,
      ...(shadow &&
        buttonColor !== 'transparent' && {
        shadowColor: colors.shadow,
        shadowOffset: {
          width: sizes.shadowOffsetWidth,
          height: sizes.shadowOffsetHeight,
        },
        shadowOpacity: sizes.shadowOpacity,
        shadowRadius: sizes.shadowRadius,
        elevation: sizes.elevation,
      }),
      ...(card && {
        backgroundColor: colors.card,
        padding: sizes.cardPadding,
        shadowColor: colors.shadow,
        // shadowOffset: {
        //   width: sizes.shadowOffsetWidth,
        //   height: sizes.shadowOffsetHeight,
        // },
        shadowOpacity: sizes.shadowOpacity,
        shadowRadius: sizes.shadowRadius,
        elevation: sizes.elevation,
      }),
      ...(row && { flexDirection: 'row' }),
      ...(radius && { borderRadius: radius }),
      ...(flex !== undefined && { flex }),
      ...(margin !== undefined && { margin }),
      ...(marginBottom && { marginBottom }),
      ...(marginTop && { marginTop }),
      ...(marginHorizontal && { marginHorizontal }),
      ...(marginVertical && { marginVertical }),
      ...(marginRight && { marginRight }),
      ...(marginLeft && { marginLeft }),
      ...(padding !== undefined && { padding }),
      ...(paddingBottom && { paddingBottom }),
      ...(paddingTop && { paddingTop }),
      ...(paddingHorizontal && { paddingHorizontal }),
      ...(paddingVertical && { paddingVertical }),
      ...(paddingRight && { paddingRight }),
      ...(paddingLeft && { paddingLeft }),
      ...(align && { alignItems: align }),
      ...(justify && { justifyContent: justify }),
      ...(height && { height }),
      ...(width && { width }),
      ...(typeof outlined === 'boolean' && {
        borderWidth: sizes.buttonBorder,
        borderColor: buttonColor,
        backgroundColor: 'transparent',
      }),
      ...(typeof outlined === 'string' && {
        borderWidth: sizes.buttonBorder,
        borderColor: outlined,
      }),
      // ...(disabled && { opacity: 0.5 }),
      ...(position && { position }),
      ...(right !== undefined && { right }),
      ...(left !== undefined && { left }),
      ...(top !== undefined && { top }),
      ...(bottom !== undefined && { bottom }),
    },
  ]) as ViewStyle;

  /* handle onPress event */
  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      onPress?.(event);

      /* vibrate onPress */
      if (vibrate) {
        Vibration.vibrate(vibrate, vibrateRepeat);
      }

      /* haptic feedback onPress */
      if (haptic) {
        Haptics.selectionAsync();
      }
    },
    [haptic, vibrate, vibrateRepeat, onPress],
  );

  if (round) {
    const maxSize = Math.max(
      Number(buttonStyles.width || 0),
      Number(buttonStyles.minWidth || 0),
      Number(buttonStyles.maxWidth || 0),
      Number(buttonStyles.height || 0),
      Number(buttonStyles.minHeight || 0),
      Number(buttonStyles.maxHeight || 0),
    );
    buttonStyles.maxWidth = maxSize;
    buttonStyles.maxHeight = maxSize;
    buttonStyles.borderRadius = maxSize / 2;
  }

  const gradientStyles = StyleSheet.flatten([
    buttonStyles,
    {
      flex: 1,
      width: '100%',
      ...(round && { maxWidth: buttonStyles.maxWidth }),
    },
  ]) as ViewStyle;

  // generate component testID or accessibilityLabel based on Platform.OS
  const buttonID =
    Platform.OS === 'android' ? { accessibilityLabel: id } : { testID: id };

  if (gradient) {
    return (
      <TouchableOpacity
        {...buttonID}
        activeOpacity={activeOpacity}
        onPress={handlePress}
        disabled={disabled}
        {...props}
        style={buttonStyles}
      >
        <LinearGradient
          style={gradientStyles}
          colors={gradient}
          start={[0, 1]}
          end={[1, 0]}>
          {children}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (startIconUri || endIconUri) {

    return (
      <TouchableOpacity
        {...buttonID}
        activeOpacity={activeOpacity}
        onPress={handlePress}
        disabled={disabled}
        {...props}
        style={buttonStyles}
      >
        {startAdornmentIcon &&
          <SvgUri
            width={startIconWidth}
            height={startIconHeight}
            color={startIconColors}
            uri={startIconUri}
          />
        }
        {children}
        {endAdornmentIcon &&
          <SvgUri
            width={endIconWidth}
            height={endIconHeight}
            color={endIconColors}
            uri={endIconUri}
          />
        }
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      {...buttonID}
      activeOpacity={activeOpacity}
      onPress={handlePress}
      disabled={disabled}
      {...props}
      style={buttonStyles}
    >
      {children}
    </TouchableOpacity>
  );
};

export default React.memo(Button);
