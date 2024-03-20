import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/core';

// thirds-party
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { gql, useMutation, useQuery } from '@apollo/client';

// project-imports
import { useData, useTheme, useTranslation } from '../hooks';
import { Block, Button, Input, Image, Text } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isAndroid = Platform.OS === 'android';

const CREATEONEUSER = gql`
  mutation CreateUser($userInput: UserCreateInputSignUp!) {
    CreateUser(UserInput: $userInput) {
      user {
        email
        role
        profile {
          fullname
          firstname
          lastname
          phone
          profilePicture
        }
      }
    }
  }
`;

const GETONEUSER = gql`
  mutation GetOneUser2($email: String!) {
    getOneUser2(email: $email) {
      user {
        id
        email
        role
        profile {
          firstname
          lastname
          profilePicture
        }
      }
    }
  }
`;

const Signin = () => {
  const { assets, colors, sizes, icons } = useTheme();

  const navigation: any = useNavigation();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  const [mutationFoundUser, {
    loading: mutatuinFoundUserLoading,
    error: mutatuinFoundUUserError,
    data: mutatuinFoundUUserData,
  }] = useMutation(GETONEUSER);

  const [mutationCreateUser, {
    loading: mutatuinCreateUserLoading,
    error: mutatuinCreateUserError,
    data: mutatuinCreateUserData,
  }] = useMutation(CREATEONEUSER);

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    GoogleSignin.configure({
      webClientId: '',
      offlineAccess: false, // To prevent automatic sign-in with the obtained credentials
      forceCodeForRefreshToken: true,
      scopes: ['profile', 'email'],
    });
    try {

      // Prompt user to select a Google account for sign-in
      const { idToken } = await GoogleSignin.signIn();

      if (idToken) {

        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // You might want to store user data in state or Firebase after authentication
        const googleSignIn = auth().signInWithCredential(googleCredential);


        googleSignIn
          .then(async (signedInUser: any) => {
            console.log("Signed in user:", signedInUser.additionalUserInfo.profile.email);
            const foundUser = await mutationFoundUser({
              variables: {
                email: signedInUser.additionalUserInfo.profile?.email
              }
            })
            if (foundUser.data.getOneUser2.user == null) {
              await AsyncStorage.clear();
              console.log("Create user")
              const result = mutationCreateUser({
                variables: {
                  userInput: {
                    email: signedInUser.additionalUserInfo?.profile?.email,
                    role: "User",
                    fullname: signedInUser.user.displayName,
                    firstname: signedInUser.additionalUserInfo?.profile?.family_name,
                    lastname: signedInUser.additionalUserInfo?.profile?.given_name,
                    phone: signedInUser?.additionalUserInfo?.profile?.phoneNumber || "",
                    profilePicture: signedInUser.additionalUserInfo?.profile?.picture
                  }
                }
              })
              console.log(result)
              const data = {
                email: signedInUser.additionalUserInfo?.profile?.email,
                fullname: signedInUser.user?.displayName,
                role: "User",
                phone: signedInUser.additionalUserInfo.profile?.phoneNumber,
                profilePicture: signedInUser.additionalUserInfo?.profile?.picture
              }
              await AsyncStorage.setItem("user", JSON.stringify(data));
              navigation.navigate("TabScreens", {
                screen: "Home"
              })
            } else {
              const data = {
                email: signedInUser.additionalUserInfo.profile.email,
                fullname: signedInUser.user.displayName,
                role: "User",
                phone: signedInUser.additionalUserInfo.profile?.phoneNumber,
                profilePicture: signedInUser.additionalUserInfo.profile.picture
              }
              await AsyncStorage.setItem("user", JSON.stringify(data));
              navigation.navigate("TabScreens", {
                screen: "Home",
                email: signedInUser.additionalUserInfo.profile.email
              }
              )
            }
            console.log({
              email: signedInUser.additionalUserInfo.profile.email,
              fullname: signedInUser.user.displayName,
              picture: signedInUser.additionalUserInfo.profile.picture
            })
            // Handle navigation or any other logic after successful sign-in
          })
          .catch((error) => {
            console.log("Firebase authentication error:", error);
            // Handle Firebase authentication errors
          });
      } else {
        // Handle when the user doesn't select an account
        console.log('No user selected');
      }
    } catch (error) {
      // Handle any other errors during the sign-in process
      console.log('Error during Google Sign-In:', error);
    }
  }


  return (
    <Block
      flex={1}
      justify='space-between'
    >
      <Block flex={0} align="center" safe>
        {/* Logo */}
        <Image
          style={{
            width: 180,
            height: 180,
            resizeMode: "contain",
            alignSelf: "center",
          }}
          source={assets.logo}
        />

        {/* Logo name and description */}
        <Text
          black
          h2
          marginTop={15}
          marginBottom={5}
        >
          WELCOME!
        </Text>
        <Text
          black
          h8
          align="center"
          paddingHorizontal={30}
        >
          Please login with your social account for faster login
        </Text>
      </Block>

      {/* Button Login with or without Google */}
      <Block flex={0} align='center'>
        <Button
          row
          radius={25}
          marginBottom={20}
          width={sizes.width * 0.9}
          height={sizes.height * 0.090}
          bgcolor={colors.primary400}
          style={{ borderWidth: 3, borderColor: colors.primary800 }}
          endAdornmentIcon
          endIconUri={icons.chevron_right_rounded}
          endIconWidth={40}
          endIconHeight={40}
          endIconColors={"white"}
          onPress={() => onGoogleButtonPress()}
        >
          <Block flex={0} white radius={50} padding={3}>
            <Image
              style={{
                width: 40,
                height: 40,
                resizeMode: "contain",
                alignSelf: "center",
              }}
              source={assets.google}
            />
          </Block>
          <Text
            color={"white"}
            marginHorizontal={10}
            style={{
              fontSize: 20,
              fontWeight: "bold",
              fontFamily: "Sarabun-Medium",
            }}
          >
            Continue with Google
          </Text>
        </Button>

        {/* <Button
          row
          radius={25}
          marginBottom={20}
          width={sizes.width * 0.9}
          height={sizes.height * 0.090}
          bgcolor={colors.primary400}
          style={{ borderWidth: 3, borderColor: colors.primary800 }}
          endAdornmentIcon
          endIconUri={icons.chevron_right_rounded}
          endIconWidth={40}
          endIconHeight={40}
          endIconColors={"white"}
          onPress={() => signOut()}
        >
          <Block flex={0} white radius={50} padding={3}>
            <Image
              style={{
                width: 40,
                height: 40,
                resizeMode: "contain",
                alignSelf: "center",
              }}
              source={assets.google}
            />
          </Block>
          <Text
            color={"white"}
            marginHorizontal={10}
            style={{
              fontSize: 20,
              fontWeight: "bold",
              fontFamily: "Sarabun-Medium",
            }}
          >
            Sign Out
          </Text>
        </Button> */}

      </Block>

      {/* <Block flex={0} primary marginBottom={25}> */}
      {/* Welcome Picture */}
      <Image
        style={{
          width: 350,
          height: 250,
          resizeMode: "contain",
          alignSelf: "center",
        }}
        source={assets.welcome}
      />
      {/* </Block> */}

    </Block>
  );
};

export default Signin;
