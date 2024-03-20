import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/core';

// thirds-party
import { gql, useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// project imports
import { useData, useTheme } from '@src/hooks';
import { Block, Button, Image, Input, Text } from '@src/components';

const GETAMUSEMENTSTICKETALL = gql`
  query GetAmusementParkAll {
    GetAmusementParkAll {
      id
      name
      description
      email
      phone
      picture
      status
      amusementparkmaps {
        id
        amusementparkId
        address
        city
        zipcode
        country
        latitude
        longitude
      }
    }
  }
`;

const GETPROMOTIONALL = gql`
  query GetPromotionAll {
    GetPromotionAll {
      id
      ticketId
      amusementparkId
      title
      description
      discountchild
      discountadult
      startDate
      endDate
      picture
      amusementpark {
        name
      }
    }
  }
`;

const GETONEUSER = gql`
  query GetOneUser($email: String!) {
    getOneUser(email: $email) {
      user {
        id
        email
        role
        profile {
          fullname
          dateOfBirth
          profilePicture
        }
      }
    }
  }
`;

async function getUserEmail() {
  const jsonValue = await AsyncStorage.getItem("user");
  // console.log(jsonValue)
  return jsonValue ? JSON.parse(jsonValue) : null;
};

const Home = ({ route }: any) => {
  // const { state, dispatch }: any = useData();
  const { assets, colors, sizes, icons } = useTheme();
  const navigation: { navigate: (arg0: string, arg1?: any) => void } = useNavigation();
  const [currentCategory, setCurrentCategory] = useState(0)
  const [userEmail, setUserEmail] = useState<any>(null)
  const [email, setEmail] = useState("")


  React.useMemo(async () => {
    const user = await getUserEmail();
    setUserEmail(user)
    setEmail(user.email)
    // console.log("getEmail: ", user.email);
  }, [])

  // Query
  const {
    loading: queryAmusementLoading,
    error: queryAmusementError,
    data: queryAmusementData,
  } = useQuery(GETAMUSEMENTSTICKETALL);

  const {
    loading: queryPromotionLoading,
    error: queryPromotionError,
    data: queryPromotionData,
  } = useQuery(GETPROMOTIONALL);

  const {
    loading: queryUserLoading,
    error: queryUserError,
    data: queryUserData,
  } = useQuery(GETONEUSER, {
    variables: {
      email: email
    }
  });

  if (queryAmusementError || queryPromotionError || queryUserError) {
    return <Text margin={50} bold h7>เกิดข้อผิดพลาดทางระบบเซิร์ฟเวอร์ !!!</Text>
  }

  if (queryUserLoading) return <ActivityIndicator size={100} color={colors.secondary800} />

  // if (!queryUserLoading) {
  //   (async () => {
  //     const foundUser = await AsyncStorage.getItem("user");
  //     await AsyncStorage.setItem("amusementparkIds", queryAmusementData?.GetAmusementParkAll[0].id || "");
  //     const data = {
  //       email: queryUserData?.getOneUser?.user?.email,
  //       fullname: queryUserData?.getOneUser?.user.profile.fullname,
  //       role: queryUserData?.getOneUser?.user.role,
  //       birthday: queryUserData?.getOneUser?.user.profile.dateOfBirth,
  //       profile: queryUserData?.getOneUser?.user.profile.profilePicture
  //     }
  //     // let user;
  //     if (!foundUser || data.email !== foundUser) {
  //       await AsyncStorage.setItem("user", JSON.stringify(data));
  //     }
  //     console.log("foundUser2: ", JSON.parse(foundUser || "").email)
  //   })();
  // }

  // React.useEffect(() => {

  // }, [route])


  return (
    <Block safe justify='center' align='center' bgcolor={colors.white}>
      <Block
        flex={1}
        scroll
        width={sizes.width}
        hiddenScrollIndicator={false}
      >

        {/* Header Section */}
        <Block
          flex={0}
          row
          marginTop={10}
          width={sizes.width * 0.9}
          align='center'
          justify='space-between'
          style={{ alignSelf: 'center' }}
        >
          <Block flex={0} row align='center'>
            <Button
              row
              radius={50}
              width={50}
              height={50}
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
              h8
              black
              bold
              numberOfLines={1}
              ellipsizeMode='tail'
              marginLeft={8}
              style={{ width: sizes.width * 0.5 }}
            >
              {queryUserData?.getOneUser?.user?.profile?.fullname}!
            </Text>
          </Block>

          <Block flex={0} row>
            {/* <Button
              startAdornmentIcon
              startIconUri={icons.bell_badge}
              startIconWidth={"30"}
              startIconHeight={"30"}
              startIconColors={colors.black}
              marginRight={12}
              onPress={async () => {
                console.log("addItem")
                await AsyncStorage.setItem('storedTime', "17:00")
              }}
            /> */}
            <Button
              startAdornmentIcon
              startIconUri={icons.shoppingbag}
              startIconWidth={"30"}
              startIconHeight={"30"}
              startIconColors={colors.black}
              // onPress={() => navigation.navigate("PurchaseTicket", {
              //   id_amusementpark: queryAmusementData.GetAmusementParkAll[0].id,
              //   picture: queryAmusementData.GetAmusementParkAll[0].picture,
              //   name: queryAmusementData.GetAmusementParkAll[0].name,
              //   description: queryAmusementData.GetAmusementParkAll[0].description,
              //   latitude: queryAmusementData.GetAmusementParkAll[0].amusementparkmaps.latitude,
              //   longitude: queryAmusementData.GetAmusementParkAll[0].amusementparkmaps.longitude
              // })}
              onPress={() => console.log({
                id_amusementpark: queryAmusementData.GetAmusementParkAll[0].id,
                picture: queryAmusementData.GetAmusementParkAll[0].picture,
                name: queryAmusementData.GetAmusementParkAll[0].name,
                description: queryAmusementData.GetAmusementParkAll[0].description,
                latitude: queryAmusementData.GetAmusementParkAll[0].amusementparkmaps.latitude,
                longitude: queryAmusementData.GetAmusementParkAll[0].amusementparkmaps.longitude
              })}
            />
          </Block>
        </Block>

        {/* Tabs (Promotion, All) */}
        <Block
          flex={0}
          row
          marginTop={20}
          marginBottom={25}
          width={sizes.width * 0.90}
          justify='center'
          style={{ alignSelf: 'center' }}
        >
          <Button
            flex={0}
            align='center'
            justify='center'
            width={sizes.width * 0.35}
            height={sizes.height * 0.049}
            bgcolor={currentCategory === 0 ? colors.fourth300 : "transparent"}
            style={{
              borderRadius: 15,
              borderWidth: 2,
              borderColor: colors.black
            }}
            onPress={() => setCurrentCategory(0)}
          >
            <Text
              black
              h10
              font={"Sarabun-ExtraBold"}
            >
              {currentCategory === 0 && "🔥"} Promotion
            </Text>
          </Button>
          <Button
            flex={0}
            marginLeft={10}
            align='center'
            justify='center'
            width={sizes.width * 0.45}
            height={sizes.height * 0.049}
            bgcolor={currentCategory === 1 ? colors.secondary300 : "transparent"}
            style={{
              borderRadius: 15,
              borderWidth: 2,
              borderColor: colors.black
            }}
            onPress={() => setCurrentCategory(1)}
          >
            <Text
              h10
              black
              font={"Sarabun-ExtraBold"}
            >
              {currentCategory === 1 && "🎡"} AmusementPark
            </Text>
          </Button>
        </Block>

        {/* Show Amusement Park */}
        <Block flex={0} align='center'>

          {/* ========== Promotion Tab ============ */}
          {!queryPromotionLoading && currentCategory === 0 ? (
            queryPromotionData.GetPromotionAll.map((item: any, index: number) => (
              <Block flex={0} key={index}>
                <Button
                  flex={0}
                  marginTop={15}
                  justify='flex-start'
                  align='flex-start'
                  style={{
                    width: sizes.width * 0.8,
                    height: sizes.height * 0.5,
                    borderRadius: 20,
                    borderWidth: 2,
                    borderColor: colors.black,
                  }}
                  onPress={() => navigation.navigate("PromotionDetail", {
                    picture: item.picture,
                    title: item.title,
                    description: item.description,
                  })}
                >
                  <Image
                    radius={0}
                    style={{
                      width: '100%',
                      height: '70%',
                      resizeMode: "stretch",
                      borderTopLeftRadius: 18,
                      borderTopRightRadius: 18
                    }}
                    alt='prop'
                    source={{ uri: item.picture }}
                  />

                  <Text
                    h9
                    black
                    bold
                    marginVertical={2}
                    paddingHorizontal={14}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    style={{ width: '95%' }}
                  >
                    {item.amusementpark.name}
                  </Text>
                  <Text
                    h10
                    black
                    paddingHorizontal={14}
                    numberOfLines={2}
                    ellipsizeMode='tail'
                    style={{ width: '95%' }}
                  >
                    {item.description}
                  </Text>

                </Button>
              </Block>
            ))
          ) : queryPromotionLoading && (
            <Block align='center' justify='center'>
              <ActivityIndicator size={100} color={colors.secondary800} />
            </Block>
          )}

          {/* ========== AmusementPark Tab ============ */}
          {!queryAmusementLoading && currentCategory === 1 ? (
            queryAmusementData.GetAmusementParkAll.map((item: any, index: number) => (
              <Block key={index} flex={0} marginBottom={20}>
                <Button
                  flex={0}
                  justify='center'
                  style={{
                    width: sizes.width * 0.9,
                    height: sizes.height * 0.25,
                    borderRadius: 25,
                    borderWidth: 2,
                    borderColor: colors.black,
                  }}
                  onPress={() => navigation.navigate("PurchaseTicket", {
                    id_amusementpark: item.id,
                    picture: item.picture,
                    name: item.name,
                    description: item.description,
                    latitude: item.amusementparkmaps.latitude,
                    longitude: item.amusementparkmaps.longitude
                  })}
                >
                  <Image
                    radius={25}
                    style={{
                      width: '95%',
                      height: '90%',
                      resizeMode: "stretch",
                      alignSelf: "center",
                    }}
                    alt='prop'
                    source={{ uri: "https://queuetix.s3.ap-southeast-2.amazonaws.com/amusementpark01.png" }}
                  />
                </Button>
                <Block
                  flex={0}
                  width={sizes.width * 0.85}
                  marginLeft={10}
                >
                  <Text
                    h8
                    black
                    bold
                    style={{ width: sizes.width * 0.5 }}
                    marginTop={5}
                  >
                    {item.name}
                  </Text>
                  <Text
                    black
                    h11
                    style={{ width: sizes.width * 0.5 }}
                    marginBottom={5}
                  >
                    {item.amusementparkmaps.country}, {item.amusementparkmaps.city}
                  </Text>
                </Block>

                {/* Promotion Start Price of Ticket */}
                {/* <Block
                flex={0}
                align='center'
                justify='center'
                width={sizes.width * 0.25}
                height={sizes.height * 0.058}
                bgcolor={colors.fourth400}
                style={{
                  position: 'absolute',
                  top: -15,
                  left: 280,
                  right: 0,
                  bottom: 0,
                  zIndex: 55,
                  borderRadius: 15,
                  borderWidth: 2,
                  borderStyle: "dashed",
                  borderColor: colors.black
                }}
              >
                <Text
                  h11
                  black
                  font={"Sarabun-ExtraBold"}
                  marginLeft={8}
                  style={{
                    alignSelf: 'flex-start'
                  }}
                >
                  start
                </Text>
                <Text
                  h10
                  black
                  font={"Sarabun-ExtraBold"}
                  marginRight={8}
                  style={{ alignSelf: 'flex-end' }}
                >
                  <Text
                    h10
                    error
                    font={"Sarabun-ExtraBold"}
                  >250</Text> THB
                </Text>
              </Block> */}
              </Block>
            ))
          ) : queryPromotionLoading && (
            <Block align='center' justify='center'>
              <ActivityIndicator size={100} color={colors.secondary800} />
            </Block>
          )}
        </Block>

      </Block>
    </Block>
  );
};

export default Home;
