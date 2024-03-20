import React, { useState } from 'react';
import { ActivityIndicator, ToastAndroid } from 'react-native';

// thirds-party
import { gql, useQuery, useMutation } from '@apollo/client';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import ViewShot, { captureScreen, captureRef } from "react-native-view-shot";

// project imports
import { useTheme } from '@src/hooks';
import { Block, Button, Iconify, Image, Modal, Text } from '@src/components';
import { convertToCurrencyTHB, convertToCurrencyTHBVat } from '@src/utils/covertToCurrency';
import CounttTime from './CounttTime';

const CREATEQRCODE30 = gql`
  query GetQRCode30($amount: String!) {
    GetQRCode30(Amount: $amount) {
      data {
        result
        ref1
        ref2
      }
    }
  }
`;

const VERIFYQRCODE30 = gql`
  mutation VerifyQRCodePayment($ref2: String!, $ref1: String!) {
    VerifyQRCodePayment(REF2: $ref2, REF1: $ref1) {
      data {
        result
      }
    }
  }
`;

const CLEAREVENTDATA = gql`
  mutation Mutation {
    ClearEventData {
      success {
        message
      }
      error {
        message
      }
    }
  }
`;

const UPDATEPURCHASETICKET = gql`
  mutation UpdatePurchaseTicketStatus($statusTicket: String!, $orderPurchaseticket: String!, $email: String!) {
    UpdatePurchaseTicketStatus(status_ticket: $statusTicket, order_purchaseticket: $orderPurchaseticket, email: $email) {
      success {
        message
      }
      error {
        message
      }
    }
  }
`;

const PayPurchaseTicket = ({ route, navigation }: any) => {
  const { order_purchaseticket, totalsummary } = route.params;
  const { assets, colors, sizes, icons } = useTheme();
  // const navigation: { navigate: (arg0: string, arg1?: any) => void } = useNavigation();
  const [isOpenCheckPayment, setIsOpenCheckPayment] = useState(true)
  const [modalShowStatusPayment, setModalShowStatusPayment] = useState(false)
  const viewShotRef: any = React.useRef();

  const {
    loading: queryQRCodeLoading,
    error: queryQRCodeError,
    data: queryQRCodeData,
  } = useQuery(CREATEQRCODE30, {
    variables: { amount: String(totalsummary + totalsummary * 0.07) },
  });

  const [mutationVerifyQRCode] = useMutation(VERIFYQRCODE30);

  const [mutateClearEventData] = useMutation(CLEAREVENTDATA);

  const [mutationUpdatePurchaseTicket] = useMutation(UPDATEPURCHASETICKET);

  if (queryQRCodeLoading) {
    return <Block align='center' justify='center'>
      <ActivityIndicator size={100} color={colors.secondary800} />
    </Block>
  }

  if (queryQRCodeError) return <Text primary margin={50} bold h7>Error! {queryQRCodeError.message}</Text>;

  async function calFetchData() {

    console.log("=================================================")
    console.log("Ref1: ", queryQRCodeData.GetQRCode30.data.ref1)
    console.log("Ref2: ", queryQRCodeData.GetQRCode30.data.ref2)
    try {
      const response = await mutationVerifyQRCode({
        variables: {
          ref1: queryQRCodeData?.GetQRCode30.data.ref1,
          ref2: queryQRCodeData?.GetQRCode30.data.ref2
        }
      })
      console.log("Status: ", response.data.VerifyQRCodePayment.data.result)

      if (response.data.VerifyQRCodePayment.data.result === "0000") {
        console.log("ยังไม่ได้จ่ายเงิน")
      } else if (response.data.VerifyQRCodePayment.data.result === "1000") {
        console.log("จ่ายแล้ววว")

        const foundUser = await AsyncStorage.getItem("user");
        console.log(order_purchaseticket)
        const response = await mutationUpdatePurchaseTicket({
          variables: {
            email: foundUser ? JSON.parse(foundUser).email : null,
            orderPurchaseticket: order_purchaseticket,
            statusTicket: "Unused"
          }
        })
        console.log("result payment: ", response.data)

        mutateClearEventData()
        setIsOpenCheckPayment(false)
        setModalShowStatusPayment(true)
      }

    } catch (error) {
      console.error("Error:", error);
    }
  };

  const captureSpecificPosition = async () => {
    if (viewShotRef.current) {
      try {
        // Capture the view's position
        const imageURI = await viewShotRef.current.capture({
          format: 'png',
          quality: 1,
        });

        // console.log(imageURI)

        // ขอสิทธิ์การบันทึกลงใน gallery
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
          // บันทึกรูปภาพลงใน gallery
          const saveResult: any = await MediaLibrary.saveToLibraryAsync(imageURI);
          if (saveResult) {
            console.log('รูปภาพถูกบันทึกลงใน gallery แล้ว');
          }
        } else {
          console.log('อุปกรณ์ไม่อนุญาตให้บันทึกลงใน gallery');
        }
      } catch (error) {
        console.error('Error capturing specific position:', error);
      }
    }
  };

  return (
    <Block marginTop={5} width={sizes.width} scroll hiddenScrollIndicator={false} bgcolor={colors.white}>
      <Block width={sizes.width} style={{ alignItems: 'center', alignSelf: 'center' }}>

        <Block
          flex={0}
          marginTop={5}
          width={"100%"}
          align='center'
        >
          <Block safe marginTop={10} flex={0} width={sizes.width}>
            <ViewShot ref={viewShotRef} options={{ fileName: "MyQRPayment", format: "png", quality: 1 }} style={{ width: "100%", alignItems: 'center', backgroundColor: colors.white }}>
              <Block
                flex={0}
                row
                width={"100%"}
                height={sizes.height * 0.14}
                align='center'
                justify='space-between'
                paddingHorizontal={15}
                paddingVertical={8}
                style={{
                  borderTopWidth: 2,
                  borderColor: colors.grey300
                }}
              >
                <Block flex={0}>
                  <Text bold h9>ราคาตั๋วทั้งหมด</Text>
                  <Text bold h9>Vat 7.0%</Text>
                  <Text bold h9>ยอดชำระเงินทั้งหมด</Text>
                </Block>
                <Block flex={0}>
                  <Text bold h9 primary>{convertToCurrencyTHB(totalsummary, "฿")}</Text>
                  <Text bold h9 primary>{convertToCurrencyTHBVat(String(totalsummary * 0.07), "฿")}</Text>
                  <Text bold h9 primary>{convertToCurrencyTHBVat(String(totalsummary + totalsummary * 0.07), "฿")}</Text>
                </Block>
              </Block>
              <Block
                flex={0}
                row
                width={"100%"}
                height={sizes.height * 0.07}
                align='center'
                justify='space-between'
                paddingHorizontal={15}
                paddingVertical={8}
                style={{
                  borderWidth: 2,
                  borderColor: colors.grey300
                }}
              >
                <Text bold h9>กรุณาชำระภายใน</Text>
                {(!queryQRCodeLoading && isOpenCheckPayment) ?
                  <CounttTime
                    calFetchData={calFetchData}
                  />
                  : (<Text bold h9 primary>00:00</Text>)}
              </Block>

              <Block
                flex={0}
                marginTop={20}
                width={"100%"}
                height={sizes.height * 0.1}
                bgcolor={colors.secondary900}
                style={{
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15
                }}
                align='center'
                justify='center'
              >
                <Text bold h7 white>THAI QR PAYMENT</Text>
              </Block>

              {/* Show QR Code */}
              <Block
                flex={0}
                width={sizes.width * 0.66}
                height={sizes.height * 0.34}
                align='center'
                justify='center'
                style={{
                  borderRadius: 40
                }}
              >
                <QRCode
                  value={queryQRCodeData.GetQRCode30.data.result}
                  size={sizes.width * 0.64}
                  logo={assets.logowithbg}
                  logoSize={40}
                />
              </Block>

              {/* total price */}
              <Text bold h9 primary>Total: {convertToCurrencyTHB(totalsummary + totalsummary * 0.07, "฿")}</Text>

              <Block
                flex={0}
                width={sizes.width * 0.8}
                align='center'
                paddingTop={10}
                style={{
                  borderTopWidth: 2,
                  borderColor: colors.grey300
                }}
              >
                <Text h9>บริษัท อะมิวส์เม้นท์ ครีเอชั่น จำกัด</Text>
                <Text h9>AMUSEMENT CREATION CO.,LTD.</Text>
              </Block>

              <Block
                flex={0}
                width={sizes.width * 0.8}
                paddingLeft={sizes.width * 0.15}
                marginTop={5}
                marginBottom={15}
              >
                <Text h10>รหัสอ้างอิง 1:{queryQRCodeData.GetQRCode30.data.ref1}</Text>
                <Text h10>รหัสอ้างอิง 2: {queryQRCodeData.GetQRCode30.data.ref2}</Text>
              </Block>
            </ViewShot>
          </Block>

          <Block flex={0}>
            <Button
              width={sizes.width * 0.9}
              height={sizes.height * 0.08}
              bgcolor={colors.tertiaryMain}
              radius={25}
              style={{
                position: 'relative',
                borderWidth: 3
              }}
              onPress={() => {
                captureSpecificPosition(),
                  ToastAndroid.showWithGravityAndOffset(
                    "บันทึกรูป QR Code เสร็จสิ้น",
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER,
                    55,
                    20,
                  )
              }}
            >
              <Text bold h7 white> บันทึก</Text>
            </Button>
          </Block>

          {!isOpenCheckPayment ? (
            <Block flex={0} marginVertical={20}>
              <Button
                width={sizes.width * 0.9}
                height={sizes.height * 0.08}
                bgcolor={colors.primaryDark}
                radius={25}
                style={{
                  position: 'relative',
                  borderWidth: 3
                }}
                onPress={() => navigation.navigate("Home")}
              >
                <Text bold h7 white>ตกลง</Text>
              </Button>
            </Block>
          ) : (
            <Block flex={0} marginVertical={20}>
              <Button
                width={sizes.width * 0.9}
                height={sizes.height * 0.08}
                bgcolor={colors.primaryDark}
                radius={25}
                style={{
                  borderWidth: 3
                }}
                onPress={() => {
                  setIsOpenCheckPayment(false),
                    navigation.navigate("TabScreens")
                }}
              >
                <Text bold h7 white>กลับไปหน้าแรก</Text>
              </Button>
            </Block>
          )}

          <Block />
        </Block>


        {/* Modal show successfully payment */}
        <Modal
          transparent
          visible={modalShowStatusPayment}
          onRequestClose={() => setModalShowStatusPayment(false)}
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
              <Text h8 bold>ชำระเงินเสร็จแล้ว</Text>
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
                  setModalShowStatusPayment(false),
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

export default PayPurchaseTicket