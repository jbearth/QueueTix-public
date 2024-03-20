import React, { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/core';

// thirds-party
import { gql, useMutation, useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// project imports
import { useData, useTheme } from '@src/hooks';
import { Block, Button, Iconify, Image, Modal, Text } from '@src/components';
import { addToBooking } from '@src/hooks/myActions';
import { formatDate } from '@src/utils/customDateAndTime';
import { convertTimetoDateTimeNow } from '@src/utils/customDateAndTime';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

type SelectIdsProps = {
  indexSelected: number;
  id_purchasetickettypes: string;
  id_roundrides: string;
  startDateTime: string;
  endDateTime: string;
}

const CREATEFASTPASS = gql`
  mutation CreateFastpass($createFastpassInput: PurchaseFastpassInput!) {
    CreateFastpass(CreateFastpassInput: $createFastpassInput) {
      success {
        message
      }
      error {
        message
      }
    }
  }
`;

async function getUserEmail() {
  const jsonValue = await AsyncStorage.getItem("user");
  // console.log(jsonValue)
  return jsonValue ? JSON.parse(jsonValue).email : null;
};

const BookingFastpass = ({ route }: any) => {
  const { state, dispatch }: any = useData();
  const { colors, sizes, icons } = useTheme();
  const {
    id_rides,
    id_amusementpark,
    nameEng_rides,
    nameThai_rides,
    name_amusementpark,
    timeroundrides,
    maxseats,
    rides_picture,
  } = route.params;
  const navigation: { replace: (arg0: string, arg1?: any) => void, goBack: () => void, setOptions: any } = useNavigation();
  const [selectedIds, setSelectedIds] = useState<SelectIdsProps[]>([]);
  const [modalConfirmBooking, setModalConfirmBooking] = useState<boolean>(false);
  const [modalShowStatusBooking, setModalShowStatusBooking] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState("");
  const formatDateNow = formatDate(String(new Date()), "DD", "MMM", "YYYY")


  React.useMemo(async () => {
    // console.log("getEmail");
    const email = await getUserEmail();
    setUserEmail(email)
  }, [])

  const [mutationCreateFastPass] = useMutation(CREATEFASTPASS);

  let newBookingFastpass: any[] = []

  const renderItemRoundRides = ({ item, index }: any) => {
    let IsCloseRides = false

    let currentDate = new Date();
    let currentHours = currentDate.toLocaleTimeString().split(":")[0]; // Get the current hour in UTC
    let currentMinutes = currentDate.toLocaleTimeString().split(":")[1]; // Get the current minute in UTC
    const specificHoursendTime = item.endTime.split(":")[0];
    const specificMinutesendTime = item.endTime.split(":")[1];
    // console.log(currentHours + " | " + specificHoursendTime)

    if (currentHours > specificHoursendTime || (currentHours === specificHoursendTime && currentMinutes > specificMinutesendTime)) {
      IsCloseRides = true
    }

    return (
      <Button
        flex={0}
        radius={10}
        marginHorizontal={5}
        marginBottom={10}
        disabled={(maxseats / 2) === item.roundridesofticketandfastpass[1].usedCount || IsCloseRides}
        width={sizes.width * 0.4}
        height={sizes.height * 0.075}
        bgcolor={selectedIds.some((item) => item?.indexSelected === index) === true && !IsCloseRides ? colors.tertiary400 : (maxseats / 2) !== item.roundridesofticketandfastpass[1].usedCount && !IsCloseRides ? colors.white : colors.grey400}
        style={{
          borderColor: colors.black,
          borderWidth: 1.5
        }}
        onPress={async () => {
          // console.log(selectedIds.length + " | " + state.booking.length)
          // console.log("selectedIds: ", selectedIds)

          // เงื่อนไข ถ้าผู้ใช้กดปุ่มที่ index ตรงกับ indexSelected ใน selectIds
          if (selectedIds.some((item) => item.indexSelected === index) && selectedIds) {
            console.log("remove")

            setSelectedIds(selectedIds.filter((itemId) => itemId.indexSelected !== index)); // ให้ลบข้อมูลที่ index ตรงกันทิ้ง

            // เงื่อนไข ถ้าขนาดข้อมูล selectedIds ไม่เท่ากับ ขนาดข้อมูลของ state booking
          } else if (selectedIds.length !== state.booking.length) {

            state.booking.forEach((itemBooking: any, indexbooking: number) => {
              setSelectedIds((prevData) => [...prevData, {
                indexSelected: index,
                id_purchasetickettypes: itemBooking.id_purchasetickettypes,
                id_roundrides: item.id,
                startDateTime: item.startTime,
                endDateTime: item.endTime
              }]);
            })

          }
        }}
      >
        <Text bold lineHeight={20} color={colors.black}>{item.startTime} - {item.endTime}</Text>
        {(maxseats / 2) !== item.roundridesofticketandfastpass[1].usedCount ? (
          <Text bold lineHeight={20} color={colors.black}>
            <Text bold primary>
              {(maxseats / 2) - item.roundridesofticketandfastpass[1].usedCount}{"\t"}
            </Text>
            seat left
          </Text>
        ) : (
          <Text bold lineHeight={20} primary>
            full
          </Text>
        )}
      </Button>
    )
  }

  return (
    <Block
      width={sizes.width}
      scroll
      hiddenScrollIndicator={false}
      bgcolor={colors.white}
    >
      <Block width={sizes.width * 0.9} marginBottom={20} style={{ alignItems: 'center', alignSelf: 'center' }}>

        {/* Header */}
        <Block
          flex={0}
          row
          card
          marginTop={15}
          style={{
            width: "100%",
            height: sizes.height * 0.2,
            borderRadius: 25,
          }}
        >
          <Block flex={0} width={"48%"}>
            <Image
              style={{
                width: '100%',
                height: '100%',
                resizeMode: "cover",
              }}
              alt='banner'
              source={{ uri: rides_picture }}
            />
          </Block>
          <Block flex={0} width={"50%"} padding={15} paddingRight={5}>
            <Text bold h9>{nameEng_rides} - {nameThai_rides}</Text>
            <Block flex={0} row width={"100%"} align='center'>
              <Block flex={0} height={"40%"} width={"15%"}>
                <Iconify
                  IconUri={"https://api.iconify.design/solar:map-point-bold-duotone.svg"}
                  IconWidth="100%"
                  IconHeight="100%"
                  IconColorDuotone={colors.primaryMain}
                />
              </Block>
              <Text bold h9>
                {name_amusementpark}
              </Text>
            </Block>
          </Block>
        </Block>

        <Block
          flex={0}
          row
          marginTop={20}
          padding={8}
          width={"100%"}
          align='center'
          justify='space-between'
          style={{
            borderTopColor: colors.grey300,
            borderTopWidth: 2
          }}
        >
          <Text bold h10>{formatDateNow}</Text>
          <Text bold h10>For <Text font={"Sarabun-ExtraBold"} h9 primary>{state.booking.length}</Text> seat</Text>
        </Block>

        <Block
          flex={0}
          // marginBottom={20}
          width={"100%"}
          height={sizes.height}
          align='center'
          radius={15}
          bgcolor={colors.fourthDark}
        >
          <Block
            flex={0}
            width={"100%"}
            height={"8%"}
            paddingTop={10}
            style={{
              borderBottomColor: colors.grey300,
              borderBottomWidth: 2
            }}
          >
            <Text bold h9 center>เลือกเวลาที่ต้องการ</Text>
          </Block>

          <Text
            position='absolute'
            bold
            top={45}
            style={{
              paddingVertical: 4,
              paddingHorizontal: 16,
              backgroundColor: colors.fourthDark,
              zIndex: 1
            }}
          >
            {timeroundrides[0]?.startTime} - {timeroundrides[timeroundrides.length - 1]?.endTime}
          </Text>

          <Block
            flex={0}
            marginTop={20}
          >
            <FlatList
              data={timeroundrides}
              renderItem={renderItemRoundRides}
              keyExtractor={(_, index) => String(index)}
              extraData={selectedIds}
              numColumns={2}
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              style={{
                height: "auto"
              }}
            />
          </Block>

        </Block>

        <Block
          flex={1}
          row
          align='center'
          justify={"space-evenly"}
          width={"100%"}
          height={sizes.height * 0.08}
        // bgcolor={'red'}
        >
          <>
            <Block
              flex={0}
              width={30}
              height={30}
              radius={50}
              bgcolor={colors.grey400}
              style={{ borderWidth: 1 * 1.5 }}
            />
            <Text bold>Reserved</Text>
          </>
          <>
            <Block
              flex={0}
              width={30}
              height={30}
              radius={50}
              bgcolor={colors.tertiary400}
              style={{ borderWidth: 1 * 1.5 }}
            />
            <Text bold>Selected</Text>
          </>
          <>
            <Block
              flex={0}
              width={30}
              height={30}
              radius={50}
              bgcolor={colors.white}
              style={{ borderWidth: 1 * 1.5 }}
            />
            <Text bold>Available</Text>
          </>
        </Block>

        {<Button
          marginVertical={8}
          width={sizes.width * 0.9}
          height={sizes.height * 0.08}
          bgcolor={colors.fourthDark}
          radius={25}
          style={{
            position: 'relative',
            borderWidth: 2
          }}
          onPress={() => {
            selectedIds[0]?.endDateTime === undefined ? (
              ToastAndroid.showWithGravityAndOffset(
                "กรุณาเลือกที่นั่งให้ครบตามจำนวนที่เลือกตั๋วที่ใช้",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
                55,
                20,
              )
            ) : (
              setModalConfirmBooking(true),
              console.log(typeof selectedIds)
            )
          }}
        >
          <Text bold h7 white>Confirm Reservation</Text>
        </Button>}

        {/* Modal Confirm Booking */}
        <Modal
          transparent
          visible={modalConfirmBooking}
          onRequestClose={() => setModalConfirmBooking(false)}
        >
          <Block
            black
            align='center'
            justify='center'
            blur
            intensity={100}
          >
            <Block
              flex={0}
              white
              radius={25}
              width={sizes.width * 0.7}
              height={sizes.height * 0.2}
              align='center'
            >

              <Block
                flex={0}
                width={sizes.width * 0.14}
                height={sizes.height * 0.07}
                marginTop={10}
              >
                <Iconify
                  IconUri={icons.check_circle_duotone}
                  IconWidth={"100%"}
                  IconHeight={"100%"}
                  IconColorDuotone={colors.tertiary400}
                />
              </Block>
              <Text h8 bold>ยืนยันการจอง FastPass</Text>
              <Text h8 bold>เวลา {selectedIds[0]?.startDateTime} - {selectedIds[0]?.endDateTime}</Text>

              <Block
                flex={0}
                row
                width={"100%"}
                height={"40%"}
              >
                <Button
                  marginTop={0}
                  width={"50%"}
                  height={"100%"}
                  justify='center'
                  align='center'
                  bgcolor={colors.primaryDark}
                  style={{
                    borderTopColor: colors.grey300,
                    borderTopWidth: 1,
                    borderBottomLeftRadius: 25
                  }}
                  onPress={async () => {
                    const trigger = new Date();
                    console.log(Number(selectedIds[0].startDateTime.split(":")[0]))
                    console.log(Number(selectedIds[0].endDateTime.split(":")[0]))
                    trigger.setHours(Number(selectedIds[0].startDateTime.split(":")[0])); // Set the hours to 17 (5 PM)
                    trigger.setMinutes(Number(selectedIds[0].endDateTime.split(":")[0]));
                    trigger.setSeconds(0)

                    async function schedulePushNotification() {
                      await Notifications.scheduleNotificationAsync({
                        content: {
                          title: "QueueTix - แจ้งเตือนคิว",
                          body: `คิวเวลาที่จอง ${selectedIds[0].startDateTime} - ${selectedIds[0].endDateTime}`,
                          data: { data: 'goes here' },
                        },
                        trigger,
                      });
                    }

                    schedulePushNotification()
                    setModalConfirmBooking(false)

                    await state.booking.forEach((value: any, index: number) => {
                      newBookingFastpass.push({
                        id_amusementpark: id_amusementpark,
                        id_purchasetickettypes: selectedIds[index].id_purchasetickettypes,
                        id_rides: id_rides,
                        id_roundrides: selectedIds[index].id_roundrides,
                        startDateTime: convertTimetoDateTimeNow(selectedIds[index].startDateTime),
                        endDateTime: convertTimetoDateTimeNow(selectedIds[index].endDateTime)
                      })
                    })

                    mutationCreateFastPass({
                      variables: {
                        createFastpassInput: {
                          email: userEmail,
                          countofused: Number(state.booking.length),
                          pruchasefastpass: newBookingFastpass
                        }
                      }
                    })

                    setModalShowStatusBooking(true)
                  }}
                >
                  <Text white bold h7>ตกลง</Text>
                </Button>
                <Button
                  marginTop={0}
                  width={"50%"}
                  height={"100%"}
                  justify='center'
                  align='center'
                  bgcolor={colors.greyMain}
                  style={{
                    borderTopColor: colors.grey300,
                    borderTopWidth: 1,
                    borderBottomRightRadius: 25,
                  }}
                  onPress={() => {
                    setModalConfirmBooking(false)
                  }}
                >
                  <Text white bold h7>ยกเลิก</Text>
                </Button>
              </Block>

            </Block>
          </Block>
        </Modal>

        {/* Modal show successfully booking fastpass */}
        <Modal
          transparent
          visible={modalShowStatusBooking}
          onRequestClose={() => setModalShowStatusBooking(false)}
        >
          <Block
            black
            align='center'
            justify='center'
            blur
            intensity={100}
          >
            <Block
              flex={0}
              white
              radius={25}
              width={sizes.width * 0.7}
              height={sizes.height * 0.2}
              align='center'
            >

              <Block
                flex={0}
                width={sizes.width * 0.14}
                height={sizes.height * 0.07}
                marginTop={10}
              >
                <Iconify
                  IconUri={icons.check_circle_duotone}
                  IconWidth={"100%"}
                  IconHeight={"100%"}
                  IconColorDuotone={colors.tertiary400}
                />
              </Block>
              <Text h8 bold>จองที่นั่งสำเร็จ</Text>
              <Button
                marginTop={0}
                width={"100%"}
                height={"40%"}
                justify='center'
                align='center'
                bgcolor={colors.primaryDark}
                style={{
                  borderTopColor: colors.grey300,
                  borderTopWidth: 1,
                  borderBottomRightRadius: 25,
                  borderBottomLeftRadius: 25
                }}
                onPress={() => {
                  setModalShowStatusBooking(false),
                    navigation.replace("TabScreens", { screen: 'Tickets' })
                }}
              >
                <Text white bold h7>ตกลง</Text>
              </Button>

            </Block>
          </Block>
        </Modal>

      </Block>


    </Block>
  )
}

export default BookingFastpass