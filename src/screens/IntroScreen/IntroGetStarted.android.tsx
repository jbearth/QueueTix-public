import React from "react";
import { Block, Button, Image, Text } from "@src/components";

// thirds-party
import { useNavigation } from "@react-navigation/native";
// import * as Notifications from 'expo-notifications';

// project-imports
import { useTheme } from '@src/hooks';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

const IntroGetStarted = () => {
  const navigation: { navigate: (arg0: string) => void } = useNavigation();
  const { assets, sizes, colors, fonts } = useTheme();

  // const checkAndSendNotification = async () => {
  //   const storedTime = await AsyncStorage.getItem('storedTime');
  //   const newstore: any = storedTime?.split("-")
  //   if (storedTime) {
  //     const trigger = new Date();
  //     console.log(Number(newstore[0].split(":")[0]))
  //     console.log(Number(newstore[0].split(":")[1]))
  //     trigger.setHours(Number(newstore[0].split(":")[0])); // Set the hours to 17 (5 PM)
  //     trigger.setMinutes(Number(newstore[0].split(":")[1]));
  //     trigger.setSeconds(0)

  //     async function schedulePushNotification() {
  //       await Notifications.scheduleNotificationAsync({
  //         content: {
  //           title: "QueueTix - แจ้งเตือนคิว FastPass",
  //           body: `คิวเวลาที่จอง 10:50 - 10:55`,
  //         },
  //         trigger,
  //       });
  //     }
  //     schedulePushNotification()
  //     // }
  //   }
  // };

  return (
    <Block
      flex={1}
      justify="space-between"
    >
      {/* Background */}
      <Image
        source={assets.bgIntroGetStarted}
        resizeMode="contain"
        style={{
          width: 700,
          height: 800,
          position: "absolute",
          zIndex: -1,
          left: -175,
          top: 20,
        }}
      />

      <Block flex={0} align="center" safe>
        {/* Logo */}
        <Image
          style={{
            width: 100,
            height: 100,
            resizeMode: "contain",
            alignSelf: "center",
          }}
          source={assets.logo}
        />

        {/* Logo name */}
        <Text
          style={{
            fontSize: 40,
            fontFamily: "Galada-Regular",
          }}
          color={colors.secondaryMain}
        >
          Queue
          <Text
            style={{
              fontSize: 40,
              fontFamily: "Galada-Regular",
            }}
            color={colors.primaryDark}
          >
            Tix
          </Text>
        </Text>
      </Block>

      <Block flex={0} marginBottom={30} align="center">
        <Text
          style={{
            width: sizes.width * 0.7,
            fontWeight: "bold",
            fontFamily: fonts.normal,
            fontSize: 18,
            textAlign: "center"
          }}
          color={colors.primary400}
        >
          A platform built for a new way of queue
        </Text>
        <Button
          bgcolor={colors.secondaryMain}
          style={{
            width: sizes.width * 0.8,
            height: 60,
            marginTop: 15,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => navigation.navigate('IntroScreens')}
        // onPress={async () => {
        //   console.log("addItem")
        //   await AsyncStorage.setItem('storedTime', "10:43-10:50")
        // }}
        >
          <Text
            color={"#fff"}
            style={{
              fontSize: 20,
              fontWeight: "bold",
              fontFamily: fonts.medium,
            }}
          >
            GET STARTED
          </Text>
        </Button>
        {/* <Button
          bgcolor={colors.secondaryMain}
          style={{
            width: sizes.width * 0.8,
            height: 60,
            marginTop: 15,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
          // onPress={() => navigation.navigate('IntroScreens')}
          onPress={async () =>
            checkAndSendNotification()
          }
        >
          <Text
            color={"#fff"}
            style={{
              fontSize: 20,
              fontWeight: "bold",
              fontFamily: fonts.medium,
            }}
          >
            GET STARTED2
          </Text>
        </Button> */}
      </Block>

    </Block>
  );
}

export default IntroGetStarted;