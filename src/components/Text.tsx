import React from 'react';
import { Platform, StyleSheet, Text, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

import useTheme from '../hooks/useTheme';
import { ITextProps } from '../constants/types';

const Typography = (props: ITextProps) => {
  const {
    id = 'Text',
    children,
    style,
    center,
    gradient,
    color,
    opacity,
    // predefined colors
    primary,
    secondary,
    tertiary,
    fourth,
    black,
    white,
    gray,
    error,
    warning,
    success,
    info,
    size,
    bold,
    semibold,
    weight,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    h7,
    h8,
    h9,
    h10,
    h11,
    font,
    align,
    transform,
    lineHeight,
    position,
    right,
    left,
    top,
    bottom,
    start,
    end,
    marginBottom,
    marginTop,
    marginHorizontal,
    marginVertical,
    marginRight,
    marginLeft,
    paddingBottom,
    paddingTop,
    paddingHorizontal,
    paddingVertical,
    paddingRight,
    paddingLeft,
    ...rest
  } = props;
  const { colors, sizes, lines, weights, fonts } = useTheme();

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

  const textColor = color
    ? color
    : colorIndex
      ? colors?.[colorIndex]
      : undefined;

  const textStyles = StyleSheet.flatten([
    style,
    {
      color: colors.text,
      ...(textColor && { color: textColor }),
      ...(h1 && {
        fontSize: sizes.h1,
        lineHeight: lines.h1,
        fontWeight: weights.h1,
        fontFamily: fonts.h1,
      }),
      ...(h2 && {
        fontSize: sizes.h2,
        lineHeight: lines.h2,
        fontWeight: weights.h2,
        fontFamily: fonts.h2,
      }),
      ...(h3 && {
        fontSize: sizes.h3,
        lineHeight: lines.h2,
        fontWeight: weights.h3,
        fontFamily: fonts.h3,
      }),
      ...(h4 && {
        fontSize: sizes.h4,
        lineHeight: lines.h2,
        fontWeight: weights.h4,
        fontFamily: fonts.h4,
      }),
      ...(h5 && {
        fontSize: sizes.h5,
        lineHeight: lines.h3,
        fontWeight: weights.h5,
        fontFamily: fonts.h5,
      }),
      ...(h6 && {
        fontSize: sizes.h6,
        lineHeight: lines.h4,
        fontWeight: weights.text,
        fontFamily: fonts.text,
      }),
      ...(h7 && {
        fontSize: sizes.h7,
        lineHeight: lines.h5,
        fontWeight: weights.text,
        fontFamily: fonts.text,
      }),
      ...(h8 && {
        fontSize: sizes.h8,
        lineHeight: lines.h6,
        fontWeight: weights.text,
        fontFamily: fonts.text,
      }),
      ...(h9 && {
        fontSize: sizes.h9,
        lineHeight: lines.h7,
        fontWeight: weights.text,
        fontFamily: fonts.text,
      }),
      ...(h10 && {
        fontSize: sizes.h10,
        lineHeight: lines.h8,
        fontWeight: weights.text,
        fontFamily: fonts.text,
      }),
      ...(h11 && {
        fontSize: sizes.h11,
        lineHeight: lines.h9,
        fontWeight: weights.text,
        fontFamily: fonts.text,
      }),
      ...(marginBottom && { marginBottom }),
      ...(marginTop && { marginTop }),
      ...(marginHorizontal && { marginHorizontal }),
      ...(marginVertical && { marginVertical }),
      ...(marginRight && { marginRight }),
      ...(marginLeft && { marginLeft }),
      ...(paddingBottom && { paddingBottom }),
      ...(paddingTop && { paddingTop }),
      ...(paddingHorizontal && { paddingHorizontal }),
      ...(paddingVertical && { paddingVertical }),
      ...(paddingRight && { paddingRight }),
      ...(paddingLeft && { paddingLeft }),
      ...(center && { textAlign: 'center' }),
      ...(align && { textAlign: align }),
      ...(bold && { fontFamily: fonts.bold }),
      ...(semibold && { fontFamily: fonts.semibold }),
      ...(weight && { fontWeight: weight }),
      ...(transform && { textTransform: transform }),
      ...(font && { fontFamily: font }),
      ...(size && { fontSize: size }),
      ...(color && { color }),
      ...(opacity && { opacity }),
      ...(lineHeight && { lineHeight }),
      ...(position && { position }),
      ...(right !== undefined && { right }),
      ...(left !== undefined && { left }),
      ...(top !== undefined && { top }),
      ...(bottom !== undefined && { bottom }),
    },
  ]) as TextStyle;

  /*
   * Calculate gradient height container based on text lineHeight or fontSize
   * add an extra value from marginVertical or marginTop or marginBottom
   */
  const gradientHeight =
    Number(textStyles?.lineHeight || textStyles?.fontSize || 0) +
    Number(
      textStyles?.marginVertical ||
      textStyles?.marginTop ||
      textStyles?.marginBottom ||
      0,
    );

  // generate component testID or accessibilityLabel based on Platform.OS
  const textID =
    Platform.OS === 'android' ? { accessibilityLabel: id } : { testID: id };

  if (gradient) {
    return (
      <MaskedView
        maskElement={
          <Text {...textID} {...rest} style={textStyles}>
            {children}
          </Text>
        }
      >
        <LinearGradient
          colors={gradient}
          end={end || [0.2, 0]}
          start={start || [0, 0]}
          style={{ flex: 1, height: gradientHeight, flexWrap: 'wrap' }}
        />
      </MaskedView>
    );
  }

  return (
    <Text {...textID} {...rest} style={textStyles}>
      {children}
    </Text>
  );
};

export default React.memo(Typography);
