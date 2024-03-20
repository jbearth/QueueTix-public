import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import { ActivityIndicator } from 'react-native';

// thirds-party
import { gql, useQuery } from '@apollo/client';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import QRCode from 'react-native-qrcode-svg';


// project imports
import { useData, useTheme } from '@src/hooks';
import { Block, Button, Image, Modal, Text, Iconify } from '@src/components';
import SwipeButton from '@src/components/SlideButton';
import { formatDate, formatDateTime, getTime } from '@src/utils/customDateAndTime';
import CounttTime from './CountTimeOfFastpass';

const GETPURCHASEFASTPASS = gql`
  query GetFastpass($idFastpass: String!) {
    GetFastpass(id_fastpass: $idFastpass) {
      data {
        purchasefastpassofrides {
          id
        }
        startDateTime
        endDateTime
        isUsed
      }
    }
  }
`;

const ShowFastpassDetail = ({ route }: any) => {
  const { id_purchasefastpass, nameamusementpark_booking, namerides_booking, picturerides_booking } = route.params;

  const { assets, colors, sizes, icons } = useTheme();
  const navigation: { navigate: (arg0: string, arg1?: any) => void } = useNavigation();
  const [showQRCodeFastpass, setShowQRCodeFastpass] = useState(false);


  const {
    loading: queryPurchaseFastPassLoading,
    error: queryPurchaseFastPassError,
    data: queryPurchaseFastPassData,
  } = useQuery(GETPURCHASEFASTPASS, {
    variables: { idFastpass: id_purchasefastpass },
  });

  const handleShowQRFastpass = (isShow: any) => setShowQRCodeFastpass(isShow)

  let purchaseFastpass: any = null
  if (!queryPurchaseFastPassLoading) {
    purchaseFastpass = queryPurchaseFastPassData?.GetFastpass.data
    console.log({
      id_purchasefastpass: purchaseFastpass.purchasefastpassofrides[0].id,
      startDateTime: purchaseFastpass.startDateTime,
      endDateTime: purchaseFastpass.endDateTime,
      isUsed: purchaseFastpass.isUsed,
    })
  }


  return (
    <Block width={sizes.width} align='center' style={{ alignSelf: 'center' }} bgcolor={colors.white}>

      {/* background ticket */}
      <Block
        flex={0}
        marginTop={20}
        width={sizes.width * 0.98}
        height={sizes.height * 0.74}
      >
        <Image
          source={assets.bgfastpass}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "contain"
          }}
        />
      </Block>

      {/* Upper Detail Section */}
      <Block
        align='center'
        style={{
          position: 'absolute',
          width: sizes.width * 0.8,
          height: sizes.height * 0.7,
          top: 100,
          left: 40,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      >
        <Text h1 white lineHeight={80} font={"Galada-Regular"}>FastPass</Text>

        <Block
          flex={0}
          row
          marginTop={15}
          height={"25%"}
          // bgcolor={'red'}
          align='center'
        >
          <Image
            source={{ uri: picturerides_booking }}
            style={{
              width: "30%",
              height: "60%",
              marginHorizontal: 13
            }}
          />
          <Block
            height={"100%"}
            justify='center'
          >
            <Text bold h10>{namerides_booking}</Text>
            <Block flex={0} row width={"100%"} height={"25%"} align='center'>
              <Block flex={0} height={"50%"} width={"15%"}>
                <Iconify
                  IconUri={"https://api.iconify.design/solar:map-point-bold-duotone.svg"}
                  IconWidth="100%"
                  IconHeight="100%"
                  IconColorDuotone={colors.primaryMain}
                />
              </Block>
              <Text bold h9>
                {nameamusementpark_booking}
              </Text>
            </Block>
            {showQRCodeFastpass && <Text font='Sarabun-SemiBold'>
              Date Used: <Text font='Sarabun-SemiBold' primary>{formatDate(String(purchaseFastpass?.startDateTime), "DD", "MMM", "YYYY")}</Text>
            </Text>}
          </Block>
        </Block>

        {!showQRCodeFastpass ? (
          <Block
            flex={0}
            marginTop={50}
            width={"100%"}
            align='center'
          >
            <GestureHandlerRootView>
              <SwipeButton
                onToggle={handleShowQRFastpass}
              />
            </GestureHandlerRootView>
            <Text marginTop={50} font='Sarabun-SemiBold' h9>
              Datetime Used: <Text font='Sarabun-SemiBold' h9 primary>{formatDateTime(String(purchaseFastpass?.startDateTime), "DD", "MMM", "YYYY", "HH:mm")}</Text>
            </Text>
          </Block>
        ) : (
          <Block
            flex={0}
            width={"80%"}
            align='center'
          >
            {!queryPurchaseFastPassLoading ? (
              <QRCode
                value={JSON.stringify({
                  id_purchasefastpass: purchaseFastpass.purchasefastpassofrides[0].id,
                  startDateTime: purchaseFastpass.startDateTime,
                  endDateTime: purchaseFastpass.endDateTime,
                  isUsed: purchaseFastpass.isUsed,
                })}
                size={sizes.width * 0.45}
                logo={assets.logowithbg}
                logoSize={40}
              />
            ) : (
              <Block align='center' justify='center'>
                <ActivityIndicator size={100} color={colors.secondary800} />
              </Block>
            )}
            <Block flex={0} align='center' marginTop={10}>
              <Text bold h10>
                Reservation Time: {getTime(purchaseFastpass?.startDateTime)} - {getTime(purchaseFastpass?.endDateTime)}
              </Text>
              <Text bold h10>
                Remaining Time: <CounttTime handleShowQRFastpass={handleShowQRFastpass} />
              </Text>
            </Block>
          </Block>
        )}
      </Block>

      {/* Lower Detail Section */}
      <Block
        align='center'
        justify='space-between'
        style={{
          position: 'absolute',
          width: sizes.width * 0.85,
          height: sizes.height * 0.5,
          bottom: -280,
          left: 33,
          right: 0,
          zIndex: 1,
          // backgroundColor: colors.fourth300
        }}
      >
        <Text h10 font='Sarabun-Medium' center>
          กรุณาเปิดใช้บัตรต่อหน้าพนักงานเท่านั้น{"\n"}
          <Text primary>**บัตร fastpass เมื่อทำการจองเเล้ว
            จะไม่สามารถเปลี่ยนจองได้ทุกกรณี</Text>
        </Text>
      </Block>

    </Block >
  )
}

export default ShowFastpassDetail