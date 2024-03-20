import React, { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/core';

// thirds-party
import { gql, useQuery } from '@apollo/client';

// project imports
import { useData, useTheme } from '@src/hooks';
import { Block, Button, Image, Modal, Text, Iconify } from '@src/components';
import { getCurrentTime } from '@src/utils/customDateAndTime';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GETRIDESALL = gql`
  query GetRidesAll($idAmusementpark: String!) {
    GetRidesAll(id_amusementpark: $idAmusementpark) {
      id
      nameEng
      nameThai
      picture
      maxseats
      isSpecial
      usedFastpassAvailable
      roundrides {
        id
        ridesId
        startTime
        endTime
      }
    }
  }
`;

// เรียงลำดับเวลาเริ่มรอบเครื่องเล่น
function getSortTimeRoundRides(array: any[]) {

  return array.sort((a: { startTime: string; }, b: { startTime: any; }) => {
    return a.startTime.localeCompare(b.startTime);
  });
}

// ตรวจสอบเวลาเล่นครั้งถัดไป
function validNextTimeRidesOfFastpass(array: any[]) {

  const modifieRoundRidesData = getSortTimeRoundRides([...array])

  let nexttime = ""
  const currentTime = getCurrentTime();

  for (let i = 0; i < modifieRoundRidesData.length; i++) {
    if (currentTime <= modifieRoundRidesData[i]?.startTime || currentTime <= modifieRoundRidesData[i]?.endTime) {
      nexttime = `${modifieRoundRidesData[i]?.startTime} - ${modifieRoundRidesData[i]?.endTime}`
      break;
    }
  }
  return nexttime
}

async function getUserEmail() {
  const jsonValue = await AsyncStorage.getItem("user");
  // console.log(jsonValue)
  return jsonValue ? JSON.parse(jsonValue).email : null;
};

const SelectRidesForTicket = ({ route }: any) => {
  const { state, dispatch }: any = useData();
  const { colors, sizes, icons } = useTheme();
  const {
    id_amusementpark,
    amusementparkname,
    purchaseoftypesId,
    dateofuse,
    nameticket,
    statusofticket,
    typeofpurchaseticket,
    purchaseticketofrides
  } = route.params;
  const navigation: { navigate: (arg0: string, arg1?: any) => void } = useNavigation();
  const [userEmail, setUserEmail] = useState("");

  const {
    loading: queryRidesAllLoading,
    error: queryRidesAllError,
    data: queryRidesAllData,
    refetch: refetchRidesAll
  } = useQuery(GETRIDESALL, {
    variables: { idAmusementpark: id_amusementpark }
  });

  const onRefreshRides = () => {
    // ใช้ฟังก์ชันการดึงข้อมูลจาก useQuery เพื่อดึงข้อมูลอีกครั้ง
    refetchRidesAll();
  };

  if (queryRidesAllError) {
    return <Text margin={50} bold h7>เกิดข้อผิดพลาดทางระบบเซิร์ฟเวอร์ !!</Text>
  }

  let ridesData: any[] = [];

  if (!queryRidesAllLoading) {
    const modifiedRidesData = [...queryRidesAllData?.GetRidesAll]
    // console.log("loading finish: ", modifiedRidesData)
    ridesData = modifiedRidesData
  }

  React.useMemo(async () => {
    // console.log("getEmail");
    const email = await getUserEmail();
    setUserEmail(email)
  }, [])

  const renderItemShowRides = ({ item, index }: any) => {
    const roundRidesSortData: any = getSortTimeRoundRides([...item?.roundrides])
    const IsClosedHours = getCurrentTime() >= roundRidesSortData[roundRidesSortData.length - 1]?.endTime
    // console.log(IsClosedHours)
    // const IsClosedHours = false

    const amountofuseticket = purchaseticketofrides[index].usedLimit === purchaseticketofrides[index].usedCount
    // {
    //   amountofuseticket ? (nameticket === "บัตรผ่านประตู" ? "เลือกเครื่องเล่นได้ 1 รอบ" : "เล่นครบจำนวนรอบแล้ว")
    //     : purchaseticketofrides[index].usedLimit === 99 ? "เล่นได้ไม่จำกัดรอบ"
    //       : `เล่นได้อีก ${purchaseticketofrides[index].usedLimit - purchaseticketofrides[index].usedCount} รอบ`
    // }

    return (
      <Button
        disabled={IsClosedHours || (statusofticket === (1 || 2) && item.id === purchaseticketofrides.ridesId)}
      >
        <Block
          flex={0}
          card
          radius={15}
          marginHorizontal={5}
          marginBottom={10}
          width={sizes.width * 0.45}
          height={sizes.height * 0.3}
          justify='flex-end'
        >
          {!IsClosedHours ? (
            <Block
              flex={0}
              width={"100%"}
              height={"75%"}
              position='absolute'
              top={0}
              style={{
                zIndex: -15,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            >
              <Image
                source={{ uri: item.picture }}
                alt='rides'
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover"
                }}
              />
            </Block>
          ) : (
            <>
              <Block
                flex={0}
                width={"100%"}
                height={"75%"}
                position='absolute'
                top={0}
                style={{
                  zIndex: -15,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
              >
                <Image
                  source={{ uri: item.picture }}
                  alt='rides'
                  tintColor='gray'
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "cover"
                  }}
                />
              </Block>
              <Block
                flex={0}
                width={"100%"}
                height={"75%"}
                position='absolute'
                top={0}
                style={{
                  zIndex: -10,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
              >
                <Image
                  source={{ uri: item.picture }}
                  alt='rides'
                  style={{
                    opacity: 0.3,
                    width: "100%",
                    height: "100%",
                    resizeMode: "cover"
                  }}
                />
              </Block>
            </>
          )}
          <Block
            flex={0}
            height={"35%"}
            radius={15}
            paddingTop={8}
            bgcolor={colors.fourth400}
            justify='space-between'
            style={{ opacity: 1 }}
          >
            <Text h10 bold center>{item.nameEng}</Text>
            <Block
              flex={0}
              marginTop={0}
              width={"100%"}
              height={"45%"}
              justify='center'
              align='center'
              bgcolor={colors.primaryDark}
              style={{
                borderBottomLeftRadius: 15,
                borderBottomRightRadius: 15,
              }}
            >
              {IsClosedHours ?
                <Text white bold h11>🚨 เครื่องเล่นปิดทำการ 🚨</Text>
                : <Text white bold h11>
                  {amountofuseticket ? (nameticket === "บัตรผ่านประตู" ? "เลือกเครื่องเล่นได้ 1 รอบ" : "เล่นครบจำนวนรอบแล้ว")
                    : purchaseticketofrides[index].usedLimit === 99 ? "เล่นได้ไม่จำกัดรอบ"
                      : purchaseticketofrides[index].usedLimit == purchaseticketofrides[index].usedCount ? "เล่นครบจำนวนรอบแล้ว"
                        : `เล่นได้อีก ${purchaseticketofrides[index].usedLimit - purchaseticketofrides[index].usedCount} รอบ`}
                </Text>
              }
            </Block>
          </Block>
        </Block>
      </Button>
    )
  }

  return (
    <Block width={sizes.width} bgcolor={colors.white}>
      <Block paddingTop={20} style={{ alignItems: 'center', alignSelf: 'center' }} bgcolor={'transparent'}>

        <Block
          flex={0}
          width={sizes.width * 0.95}
          height={sizes.height * 0.81}
        >
          {!queryRidesAllLoading ? (
            <Block
              flex={0}
            >
              <FlatList
                data={ridesData}
                renderItem={renderItemShowRides}
                keyExtractor={(item) => item.id}
                numColumns={2}
                refreshControl={
                  <RefreshControl
                    refreshing={queryRidesAllLoading}
                    onRefresh={onRefreshRides}
                  />
                }
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              />
              <Button
                flex={0}
                radius={15}
                marginVertical={15}
                width={sizes.width * 0.8}
                height={sizes.height * 0.07}
                bgcolor={colors.error}
                style={{ alignSelf: 'center' }}
                onPress={() => navigation.navigate("OrderTicketDetail", {
                  userEmail,
                  purchaseoftypesId,
                  dateofuse,
                  nameticket,
                  typeofpurchaseticket
                })}
              >
                <Text bold white h7>Next</Text>
              </Button>
            </Block>
          ) : (
            <Block align='center' justify='center'>
              <ActivityIndicator size={100} color={colors.secondary800} />
            </Block>
          )}

        </Block>


      </Block>
    </Block>
  )
}

export default SelectRidesForTicket