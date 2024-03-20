import React from 'react';
import { StyleSheet, Modal as RNModal, ViewStyle, Platform } from 'react-native';

import { useTheme } from '../hooks/';
import { IModalProps } from '../constants/types';

const Modal = ({
  id = 'Modal',
  children,
  style,
  onRequestClose,
  ...props
}: IModalProps) => {
  const { assets, colors, sizes } = useTheme();
  const modalStyles = StyleSheet.flatten([style, {}]) as ViewStyle;

  // generate component testID or accessibilityLabel based on Platform.OS
  const modalID =
    Platform.OS === 'android' ? { accessibilityLabel: id } : { testID: id };

  return (
    <RNModal
      {...modalID}
      {...props}
      transparent
      style={modalStyles}
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      {children}
    </RNModal>
  );
};

export default React.memo(Modal);
