import React, { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/core';

// thirds-party
import { gql, useMutation, useQuery } from '@apollo/client';

// project imports
import { useData, useTheme } from '@src/hooks';
import { Block, Button, Image, Modal, Text, Iconify } from '@src/components';
import { getCurrentTime, convertTimetoDateTimeNow } from '@src/utils/customDateAndTime';
import dayjs from 'dayjs';

const GETRIDESALL = gql`
  query GetRidesAll($idAmusementpark: String!) {
    GetRidesAll(id_amusementpark: $idAmusementpark) {
      id
      nameEng
      nameThai
      picture
      maxseats
      usedFastpassAvailable
      roundrides {
        id
        ridesId
        startTime
        endTime
        roundridesofticketandfastpass {
          id
          types
          usedCount
        }
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
    if (currentTime <= modifieRoundRidesData[i].startTime || currentTime <= modifieRoundRidesData[i].endTime) {
      nexttime = `${modifieRoundRidesData[i].startTime} - ${modifieRoundRidesData[i].endTime}`
      break;
    }
  }
  return nexttime
}

const SelectRidesForFastpass = ({ route }: any) => {
  const { state, dispatch }: any = useData();
  const { colors, sizes, icons } = useTheme();
  const { id_amusementpark, amusementparkname, amountticket } = route.params;
  const navigation: { navigate: (arg0: string, arg1?: any) => void } = useNavigation();

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
    ridesData = modifiedRidesData.filter((item) => item.usedFastpassAvailable === 1)
  }

  const renderItemShowRides = ({ item, index }: any) => {
    const roundRidesSortData: any = getSortTimeRoundRides([...item?.roundrides])

    let IsClosedHours: boolean = false
    // Get the current date in UTC+7
    let currentDate = new Date();
    let currentHours = currentDate.getUTCHours(); // Get the current hour in UTC
    let currentMinutes = currentDate.getUTCMinutes(); // Get the current minute in UTC
    // Define the specific time to compare against (17:00 UTC+7)
    const specificHoursstartTime = roundRidesSortData[0].startTime.split(":")[0];
    const specificMinutesstartTime = roundRidesSortData[0].startTime.split(":")[1];
    const specificHoursendTime = roundRidesSortData[roundRidesSortData.length - 1].endTime.split(":")[0];
    const specificMinutesendTime = roundRidesSortData[roundRidesSortData.length - 1].endTime.split(":")[1];
    // console.log(specificHoursstartTime)
    // Compare the times
    if (currentHours >= specificHoursstartTime || (currentHours === specificHoursstartTime && currentMinutes >= specificMinutesstartTime)) {
      IsClosedHours = false
      // console.log(`Current time is after ${roundRidesSortData[roundRidesSortData.length - 1].endTime} UTC+7.`);
    } else if (currentHours > specificHoursendTime || (currentHours === specificHoursendTime && currentMinutes >= specificMinutesendTime)) {
      IsClosedHours = true
      // console.log(`Current time is after ${roundRidesSortData[roundRidesSortData.length - 1].endTime} UTC+7.`);
    }

    // const IsClosedHours = false

    return (
      <Button
        disabled={IsClosedHours}
        onPress={() => {
          navigation.navigate("BookingFastpass", {
            id_rides: item.id,
            id_amusementpark: id_amusementpark,
            nameEng_rides: item?.nameEng,
            nameThai_rides: item?.nameThai,
            name_amusementpark: amusementparkname,
            timeroundrides: roundRidesSortData,
            maxseats: item?.maxseats,
            rides_picture: item?.picture,
          })
        }}
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
              {!IsClosedHours ?
                <Text white bold h11>🕑 Next Time: {validNextTimeRidesOfFastpass(item.roundrides)}</Text>
                : <Text white bold h11>🚨 เครื่องเล่นปิดทำการ 🚨</Text>
              }
            </Block>
          </Block>
        </Block>

      </Button>
    )
  }

  return (
    <Block width={sizes.width} bgcolor={colors.white}>
      <Block paddingTop={20} style={{ alignItems: 'center', alignSelf: 'center' }}>

        <Block
          flex={0}
          width={sizes.width * 0.95}
        >
          {!queryRidesAllLoading ? (
            <Block
              flex={0}
              marginTop={10}
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

export default SelectRidesForFastpass