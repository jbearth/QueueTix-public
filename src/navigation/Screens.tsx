import React, { useState, useEffect, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// project-imports
import {
  IntroGetStarted,
  IntroScreens,
  Signin,

  Setting,
  HelpCenter,
  FAQScreen,

  PurchaseTicket,
  PromotionDetail,
  TotalPurchaseTicket,
  PayWithORPromptpay,

  ShowFastpassToUse,
  SelectRidesForFastpass,

  SelectRidesForTicket,
  OrderDetails,
  OrderTicketDetail,
  ShowAmusementPark,
  BookingFastpass,
  ShowFastpassDetail,

} from '@src/screens';
import { Platform, Alert } from 'react-native';
import { useTheme } from '@src/hooks';
import TabNavigator from './TabNavigator';
import { Block, Button, Image, Text } from '@src/components';
import { Iconify } from '@src/components';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import registerNNPushToken from 'native-notify';
import AsyncStorage from '@react-native-async-storage/async-storage';
;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createNativeStackNavigator();


export const CustomHeader = ({ navigation, headerName, isCenter = false, headerBackVisible = true }: any) => {
  const { colors, sizes, icons } = useTheme();
  return (
    <Block
      flex={0}
      safe
      row
      align={"center"}
      paddingTop={!headerBackVisible ? 14 : 10}
      paddingHorizontal={25}
    >
      {headerBackVisible && <Button onPress={() => navigation.goBack()}>
        <Iconify
          IconUri={icons.arrow_circle_left_rounded}
          IconWidth={"50"}
          IconHeight={"50"}
          IconColors={colors.black}
        />
      </Button>}
      <Block marginRight={30}>
        <Text bold h6 align={isCenter ? "center" : undefined}>{headerName}</Text>
      </Block>
    </Block >
  );
}

async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('You need to enable permissions in order to receive notifications');
    return;
  } else {
    console.log("access")
  }

  let token: any;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#C178EE',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants?.expoConfig?.extra?.eas.projectId || "",
    });
    console.log("token: ", token);
  } else {
    // const { data } = await Notifications.getExpoPushTokenAsync();
    alert('Must use physical device for Push Notificationss');
  }

  return token?.data;
}


export default () => {
  registerNNPushToken(14610, '');


  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<boolean>(false);
  const notificationListener: any = useRef();
  const responseListener: any = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification2: any) => {
      setNotification(notification2);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="Signin"
      // initialRouteName="Signin"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="IntroGetStarted"
        component={IntroGetStarted}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="IntroScreens"
        component={IntroScreens}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signin"
        component={Signin}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="PromotionDetail"
        component={PromotionDetail}
        options={{
          headerShown: true,
          header: ({ navigation }) => (
            <CustomHeader navigation={navigation} headerName={"News"} isCenter />
          ),
          headerShadowVisible: false
        }}
      />

      {/* ================================= Profile =================================*/}

      <Stack.Screen
        name="Setting"
        component={Setting}
        options={{
          headerShown: true,
          header: ({ navigation }) => (
            <CustomHeader navigation={navigation} headerName={"Setting"} isCenter />
          ),
          headerShadowVisible: false
        }}
      />

      <Stack.Screen
        name="HelpCenter"
        component={FAQScreen}
        options={{
          headerShown: true,
          header: ({ navigation }) => (
            <CustomHeader navigation={navigation} headerName={"QueueTix Help Center"} isCenter />
          ),
          headerShadowVisible: false
        }}
      />

      {/* ================================= Purchase Product =================================*/}

      <Stack.Screen
        name="PurchaseTicket"
        component={PurchaseTicket}
        options={{
          headerShown: true,
          header: ({ navigation, route }) => (
            <CustomHeader navigation={navigation} headerName={"Purchase ticket"} isCenter />
          ),
          headerShadowVisible: false
        }}
      />

      <Stack.Screen
        name="TotalPurchaseTicket"
        component={TotalPurchaseTicket}
        options={{
          headerShown: true,
          header: ({ navigation, route }) => (
            <CustomHeader navigation={navigation} headerName={"Check out"} isCenter headerBackVisible={false} />
          ),
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="PayWithORPromptpay"
        component={PayWithORPromptpay}
        options={{
          headerShown: true,
          header: ({ navigation, route }) => (
            <CustomHeader navigation={navigation} headerName={"Payment"} isCenter headerBackVisible={false} />
          ),
          headerShadowVisible: false
        }}
      />

      {/* ================================= Booking Fastpass =================================*/}

      <Stack.Screen
        name="ShowFastpassToUse"
        component={ShowFastpassToUse}
        options={{
          headerShown: true,
          header: ({ navigation, route }) => (
            <CustomHeader navigation={navigation} headerName={"Fastpass"} isCenter />
          ),
          headerShadowVisible: false
        }}
      />

      <Stack.Screen
        name="SelectRidesForFastpass"
        component={SelectRidesForFastpass}
        options={{
          headerShown: true,
          header: ({ navigation, route }) => (
            <CustomHeader navigation={navigation} headerName={"Select Rides"} isCenter />
          ),
          headerShadowVisible: false
        }}
      />

      <Stack.Screen
        name="BookingFastpass"
        component={BookingFastpass}
        options={{
          headerShown: true,
          header: ({ navigation, route }) => (
            <CustomHeader navigation={navigation} headerName={"BookingFastpass"} isCenter />
          ),
          headerShadowVisible: false
        }}
      />

      <Stack.Screen
        name="ShowFastpassDetail"
        component={ShowFastpassDetail}
        options={{
          headerShown: true,
          header: ({ navigation, route }) => (
            <CustomHeader navigation={navigation} headerName={"Fastpass Detail"} isCenter />
          ),
          headerShadowVisible: false
        }}
      />

      {/* ================================= History Purchase Ticket =================================*/}

      <Stack.Screen
        name="SelectRidesForTicket"
        component={SelectRidesForTicket}
        options={{
          headerShown: true,
          header: ({ navigation, route }) => (
            <CustomHeader navigation={navigation} headerName={"Show Rides"} isCenter />
          ),
          headerShadowVisible: false
        }}
      />

      <Stack.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={{
          headerShown: true,
          header: ({ navigation, route }) => (
            <CustomHeader navigation={navigation} headerName={"Order Details"} isCenter />
          ),
          headerShadowVisible: false
        }}
      />

      <Stack.Screen
        name="OrderTicketDetail"
        component={OrderTicketDetail}
        options={{
          headerShown: true,
          header: ({ navigation, route }) => (
            <CustomHeader navigation={navigation} headerName={"Ticket Detail"} isCenter />
          ),
          headerShadowVisible: false
        }}
      />


      {/* ================================= Tabs =================================*/}

      <Stack.Screen
        name="TabScreens"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
