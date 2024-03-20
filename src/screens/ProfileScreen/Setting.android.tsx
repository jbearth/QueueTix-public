import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/core';

// thirds-party
import {
  GoogleSignin
} from '@react-native-google-signin/google-signin';

// project imports
import { useTheme } from '@src/hooks';
import { Block, Button, Image, Input, Text } from '@src/components';

const Setting = ({ route }: any) => {
  const { assets, colors, sizes, icons } = useTheme();
  const navigation: { navigate: (arg0: string, arg1?: any) => void } = useNavigation();

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      navigation.navigate("Signin")
      console.log("sign Out2")
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Block safe justify='space-between' align='center' bgcolor={colors.white}>
      <Block flex={0} width={"100%"} align='center'>
        <Block flex={0} row marginVertical={50} justify='center' width={"100%"}>
          <Button
            radius={50}
            width={120}
            height={120}
            bgcolor={colors.tertiaryMain}
            style={{ borderWidth: 3, borderColor: colors.white }}
            onPress={() => navigation.navigate('Home')}
          >
            <Image
              radius={50}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: "contain",
                alignSelf: "center",
              }}
              source={{ uri: route.params.profilePicture }}
            />
          </Button>
        </Block>

        <Block
          row
          flex={0}
          width={sizes.width * 0.9}
          height={sizes.height * 0.06}
          radius={10}
          // justify='center'
          align='center'
          style={{
            borderWidth: 2
          }}
        >
          <Block
            flex={0}
            width={"28%"}
            height={"100%"}
            justify='center'
            align='center'
            style={{
              borderRightWidth: 2,
              borderTopLeftRadius: 9,
              borderBottomLeftRadius: 9
            }}
          >
            <Text bold h9>Fullname</Text>
          </Block>
          <Block flex={0} width={"72%"} justify='center' align='center' >
            <Text bold h9 center>{route.params.fullname}</Text>
          </Block>
        </Block>

        <Block
          row
          flex={0}
          marginTop={25}
          width={sizes.width * 0.9}
          height={sizes.height * 0.06}
          radius={10}
          // justify='center'
          align='center'
          style={{
            borderWidth: 2
          }}
        >
          <Block
            row
            flex={0}
            width={"28%"}
            height={"100%"}
            justify='center'
            align='center'
            style={{
              borderRightWidth: 2,
              borderTopLeftRadius: 9,
              borderBottomLeftRadius: 9
            }}
          >
            <Block flex={0} white radius={50} paddingRight={5}>
              <Image
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: "contain",
                  alignSelf: "center",
                }}
                source={assets.google}
              />
            </Block>
            <Text bold h9>Google</Text>
          </Block>
          <Block flex={0} width={"72%"} justify='center' align='center' >
            <Text bold h9 center>{route.params.email}</Text>
          </Block>
        </Block>
      </Block>

      <Button
        flex={0}
        radius={15}
        marginVertical={25}
        width={sizes.width * 0.8}
        height={sizes.height * 0.07}
        bgcolor={colors.error}
        style={{ alignSelf: 'center' }}
        onPress={() => signOut()}
      >
        <Text bold white h7>Sign Out</Text>
      </Button>

    </Block>
  )
}

export default Setting