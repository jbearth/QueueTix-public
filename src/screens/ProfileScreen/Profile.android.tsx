import React, { useState } from 'react';
import { ActivityIndicator, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/core';

// thirds-party
import { gql, useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// project imports
import { useTheme } from '@src/hooks';
import { Block, Button, Iconify, Image, Input, Text } from '@src/components';
import { ticketColor } from '@src/constants/mocks';

async function getUserEmail() {
  const jsonValue = await AsyncStorage.getItem("user");
  // console.log(jsonValue)
  return jsonValue ? JSON.parse(jsonValue) : null;
};

const Profile = () => {
  const { assets, colors, sizes, icons }: any = useTheme();
  const navigation: { navigate: (arg0: string, arg1?: any) => void } = useNavigation();
  const [userEmail, setUserEmail] = useState<any>(null)

  React.useMemo(async () => {
    const user = await getUserEmail();
    console.log("getEmail2: ", user);
    setUserEmail(user)
  }, [])

  return (
    <Block align='center' bgcolor={colors.white}>

      <Block flex={0} row marginVertical={50} justify='center' align='center' width={"100%"}>
        <Button
          row
          radius={50}
          width={80}
          height={80}
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
            source={{ uri: userEmail?.profilePicture || "https://queuetix.s3.ap-southeast-2.amazonaws.com/people.png" }}
          />
        </Button>
        <Text
          h6
          black
          bold
          numberOfLines={1}
          ellipsizeMode='tail'
          marginLeft={25}
          style={{ width: sizes.width * 0.5 }}
        >
          {userEmail?.fullname}
        </Text>
      </Block>

      <Button
        flex={0}
        row
        align='center'
        justify='space-between'
        marginVertical={20}
        paddingRight={10}
        width={sizes.width * 0.9}
        height={sizes.height * 0.09}
        style={{
          borderRadius: 15,
          borderWidth: 2
        }}
        onPress={() => navigation.navigate('Setting', {
          fullname: userEmail?.fullname || "None",
          email: userEmail?.email || "None",
          profilePicture: userEmail?.profilePicture || assets.profile,
        })}

      >
        <Button
          flex={0}
          width={"20%"}
          height={"100%"}
          style={{
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            borderRightWidth: 2
          }}
        >
          <Iconify
            IconUri={icons.setting}
            IconWidth={"45"}
            IconHeight={"45"}
            IconColorDuotone={colors[`primaryMain`]}
          />
        </Button>
        <Text bold h9>Setting</Text>
        <Block flex={0} row align='center'>
          <Iconify
            IconUri={icons.chevron_right_rounded}
            IconWidth={"45"}
            IconHeight={"45"}
            IconColors={colors[`primaryMain`]}
          />
        </Block>
      </Button>


      <Button
        flex={0}
        row
        align='center'
        justify='space-between'
        marginVertical={20}
        paddingRight={10}
        width={sizes.width * 0.9}
        height={sizes.height * 0.09}
        style={{
          borderRadius: 15,
          borderWidth: 2
        }}
        onPress={() => navigation.navigate('HelpCenter')}
      >
        <Button
          flex={0}
          width={"20%"}
          height={"100%"}
          style={{
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            borderRightWidth: 2
          }}
        >
          <Iconify
            IconUri={icons.helpcenter}
            IconWidth={"45"}
            IconHeight={"45"}
            IconColorDuotone={colors[`fourthMain`]}
          />
        </Button>
        <Text bold h9>Help Center</Text>
        <Block flex={0} row align='center'>
          <Iconify
            IconUri={icons.chevron_right_rounded}
            IconWidth={"45"}
            IconHeight={"45"}
            IconColors={colors[`fourthMain`]}
          />
        </Block>
      </Button>


      <Button
        flex={0}
        row
        align='center'
        justify='space-between'
        marginVertical={20}
        paddingRight={10}
        width={sizes.width * 0.9}
        height={sizes.height * 0.09}
        style={{
          borderRadius: 15,
          borderWidth: 2
        }}
        onPress={() => Linking.openURL(`tel:0928894210`)}
      >
        <Button
          flex={0}
          width={"20%"}
          height={"100%"}
          style={{
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            borderRightWidth: 2
          }}
        >
          <Iconify
            IconUri={icons.call_contact}
            IconWidth={"45"}
            IconHeight={"45"}
            IconColorDuotone={colors[`tertiaryMain`]}
          />
        </Button>
        <Text bold h9>Contact us</Text>
        <Block flex={0} row align='center'>
          <Iconify
            IconUri={icons.chevron_right_rounded}
            IconWidth={"45"}
            IconHeight={"45"}
            IconColors={colors[`tertiaryMain`]}
          />
        </Block>
      </Button>

    </Block>
  )
}

export default Profile