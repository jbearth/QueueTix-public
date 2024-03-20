import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/core';

// thirds-party
import { gql, useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// project imports
import { useTheme } from '@src/hooks';
import { Block, Button, Image, Input, Text } from '@src/components';
const HelpCenter = () => {
  const { assets, colors, sizes, icons } = useTheme();
  const navigation: { navigate: (arg0: string, arg1?: any) => void } = useNavigation();
  return (
    <Block safe justify='center' align='center' bgcolor={colors.white}>

      <Text>index</Text>
    </Block>
  )
}

export default HelpCenter