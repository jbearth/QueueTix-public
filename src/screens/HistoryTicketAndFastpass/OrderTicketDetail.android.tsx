import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/core';

// thirds-party
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// project imports
import { useTheme } from '@src/hooks';
import { Block, Button, Image, Modal, Text, Iconify } from '@src/components';
import QRCode from 'react-native-qrcode-svg';
import SwipeButton from '@src/components/SlideButton';
import { formatDate } from '@src/utils/customDateAndTime';

const OrderTicketDetail = ({ route }: any) => {
  const {
    userEmail,
    purchaseoftypesId,
    dateofuse,
    nameticket,
    typeofpurchaseticket
  } = route.params;
  const { assets, colors, sizes, icons } = useTheme();
  const navigation: any = useNavigation();
  const [showQRCodeTicket, setShowQRCodeTicket] = useState(false);

  const handleShowQRTicket = (isShow: any) => setShowQRCodeTicket(isShow)

  console.log("test: ", {
    user_email: userEmail,
    purchaseoftypesId,
    dateofuse,
  })

  return (
    <Block width={sizes.width} align='center' style={{ alignSelf: 'center' }} bgcolor={colors.white}>

      {/* background ticket */}
      <Block
        width={sizes.width * 0.9}
      >
        <Image
          source={assets.bgticket}
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
        justify='space-between'
        style={{
          position: 'absolute',
          width: sizes.width * 0.8,
          height: sizes.height * 0.5,
          top: 50,
          left: 40,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      >

        <Block
          flex={0}
          row
          height={"25%"}
          align='center'
        >
          <Image
            source={{ uri: "https://queuetix.s3.ap-southeast-2.amazonaws.com/amusementpark01.png" }}
            style={{
              width: "25%",
              height: "80%",
              marginHorizontal: 15
            }}
          />
          <Block
            height={"100%"}
            justify='space-evenly'
          >
            <Text bold h10>{nameticket} - {typeofpurchaseticket}</Text>
            <Text font='Sarabun-SemiBold'>
              Date Used: <Text font='Sarabun-SemiBold' primary>{formatDate(dateofuse, "DD", "MMM", "YYYY")}</Text>
            </Text>
          </Block>
        </Block>
        <Block
          flex={0}
          width={"100%"}
          align='center'
        >
          <Block
            flex={0}
            width={"80%"}
            align='center'
          >
            <QRCode
              value={JSON.stringify({
                user_email: userEmail,
                purchaseoftypesId,
                dateofuse,
              })}
              size={sizes.width * 0.5}
              logo={assets.logowithbg}
              logoSize={40}
            />
          </Block>
          <Text marginTop={20} center>
            <Text primary h10>** กรุณาเปิดใช้บัตรต่อหน้าพนักงานเท่านั้น **</Text>
          </Text>
        </Block>
      </Block>

      {/* Lower Detail Section */}
      <Block
        align='center'
        justify='space-between'
        style={{
          position: 'absolute',
          width: sizes.width * 0.7,
          height: sizes.height * 0.5,
          bottom: -170,
          left: 60,
          right: 0,
          zIndex: 1,
          // backgroundColor: colors.fourth300
        }}
      >
        <Text h10 font='Sarabun-Medium'>
          ยืนยันใช้บัตรที่ห้องประชาสัมพันธ์ดรีมเวิลด์{"\n"}
          ในวันที่กำหนดไว้เท่านั้น{"\n"}
          <Text primary>**</Text>บัตรผ่านเมื่อทำการชำระเงินเเล้วไม่สามารถ
          ขอคืนเงินได้ทุกกรณี
        </Text>
      </Block>

      <Block flex={0} marginTop={100} />

      <Button
        width={sizes.width * 0.9}
        height={sizes.height * 0.08}
        bgcolor={colors.primaryDark}
        radius={25}
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 0,
          zIndex: 1,
          // position: 'relative',
          borderWidth: 3
        }}
        onPress={() => navigation.navigate("TabScreens")}
      >
        <Text bold h7 white>กลับไปหน้าแรก</Text>
      </Button>

    </Block>
  )
}

export default OrderTicketDetail