import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/core';

// thirds-party
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';

// project imports
import { useTheme } from '@src/hooks';
import { Block, Button, Image, Modal, Text, Iconify } from '@src/components';
import { ticketColor } from '@src/constants/mocks';
import { formatDateTime } from '@src/utils/customDateAndTime';
import { convertToCurrencyTHB, convertToCurrencyTHBVat } from '@src/utils/covertToCurrency';

const OrderDetails = ({ route }: any) => {
  const { purchaseTicketData, totalAllTicketPrice, orderID, timeCreateAt, status }: any = route.params;
  const { colors, sizes, icons } = useTheme();
  const navigation: { navigate: (arg0: string, arg1?: any) => void } = useNavigation();

  return (
    <Block width={sizes.width} style={{ alignSelf: 'center' }} bgcolor={colors.white}>

      {/* Order Bar Status */}
      <Block
        flex={0}
        row
        height={"10%"}
        marginTop={10}
        marginBottom={25}
        paddingHorizontal={35}
        align='center'
        bgcolor={status === "Unused" ? colors.fourthMain : colors.tertiaryMain}
      >
        <Block>
          <Text bold white h9>{status}</Text>
          <Text white>{status === "Unused" ? "Your order is unused" : "Your order is complete"}</Text>
        </Block>
        <Iconify
          IconUri={status === "Unused" ? icons.pause_circle : icons.check_circle}
          IconWidth={"55"}
          IconHeight={"55"}
          IconColors={colors.white}
        />
      </Block>

      {/* <Button onPress={() => console.log(purchaseTicketData)}><Text>PRess</Text></Button> */}

      {/* Tickets Detail Status */}
      <Block width={sizes.width} scroll hiddenScrollIndicator={false} bgcolor={colors.white}>
        {purchaseTicketData.map((item: any, index: number) => {

          return item.orderId === orderID && (
            <Block key={index}>
              {item.purchasetickettypes.map((item2: any, indexInside: number) => (
                <Button
                  key={indexInside}
                  flex={0}
                  row
                  align='center'
                  justify='space-between'
                  paddingLeft={20}
                  paddingRight={10}
                  height={sizes.height * 0.09}
                  bgcolor={colors[`${ticketColor[item.ticket.title === "บัตรผ่านประตู" ? 0 : item.ticket.title === "บัตรรวมเครื่องเล่น" ? 1 : item.ticket.title === "บัตรดรีมเวิลด์วีซ่า" ? 2 : 3]}Light`]}
                  style={{
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                  }}
                  onPress={() => {
                    navigation.navigate("SelectRidesForTicket", {
                      id_amusementpark: item.amusementpark.id,
                      amusementparkname: item.amusementpark.name,
                      purchaseoftypesId: item2.id,
                      dateofuse: item.dateofuse,
                      nameticket: item.ticket.title,
                      statusofticket: item2.statusTicket,
                      typeofpurchaseticket: item2.types,
                      purchaseticketofrides: item2.purchaseticketofrides,
                    })
                  }}
                >
                  <Text bold h9>{item.ticket.title} - {item2.types === "Child" ? "บัตรเด็ก" : "บัตรผู้ใหญ่"}</Text>
                  <Block flex={0} row align='center'>
                    <Text bold h9 primary>{item2.statusTicket === 1 ? "Completed" : item2.statusTicket === 2 ? "Expired" : "Unused"}</Text>
                    <Iconify
                      IconUri={icons.chevron_right_rounded}
                      IconWidth={"45"}
                      IconHeight={"45"}
                      IconColors={colors.grey300}
                    />
                  </Block>
                </Button>
              ))}
            </Block>
          )
        })}

        {/* Term and Condition */}
        <Block
          flex={0}
          justify='center'
          paddingHorizontal={45}
          height={sizes.height * 0.3}
        >
          <Text bold h8 primary>Term and Condition</Text>
          <Text h10>
            • โปรดรับบัตรที่ห้องประชาสัมพันธ์{"\n"}
            • ราคานี้ รวมภาษีมูลค่าเพิ่ม 7% แล้ว{"\n"}
            • บัตรนี้ใช้บริการได้ 1 ครั้งภายในวันที่ระบุไว้เท่านั้น ไม่สามารถเลื่อนวัน ยกเลิก หรือคืนเงินได้
          </Text>
        </Block>

        {/* Create Time Bar */}
        <Block
          flex={0}
          row
          marginBottom={20}
          align='center'
          justify='space-around'
          height={sizes.height * 0.06}
          bgcolor={colors.secondaryMain}
        >
          <Text bold h9 white>Create Time</Text>
          <Text bold h9 white>{formatDateTime(timeCreateAt, "DD", "MMM", "YYYY", "HH:mm:ss")}</Text>
        </Block>

        {/* Payment Info */}
        <Block
          flex={0}
          row
          align='center'
          paddingLeft={20}
          height={70}
          style={{
            borderTopWidth: 2,
            borderTopColor: colors.grey300,
            borderBottomWidth: 2,
            borderBottomColor: colors.grey300
          }}
        >
          <Iconify
            IconUri={icons.dollor_coin}
            IconWidth={"30"}
            IconHeight={"30"}
            IconColors={colors.black}
          />
          <Text bold h9 marginLeft={15}>Payment Info</Text>
        </Block>
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
            borderBottomWidth: 2,
            borderColor: colors.grey300
          }}
        >
          <Block flex={0}>
            <Text bold h9>ราคาตั๋วทั้งหมด</Text>
            <Text bold h9>Vat 7.0%</Text>
            <Text bold h9>ยอดเงินที่ชำระเงินทั้งหมด</Text>
          </Block>
          <Block flex={0}>
            <Text bold h9 primary>{convertToCurrencyTHB(totalAllTicketPrice, "฿")}</Text>
            <Text bold h9 primary>{convertToCurrencyTHBVat(String(totalAllTicketPrice * 0.07), "฿")}</Text>
            <Text bold h9 primary>{convertToCurrencyTHBVat(String(totalAllTicketPrice + totalAllTicketPrice * 0.07), "฿")}</Text>
          </Block>
        </Block>

        <Button primary marginTop={20} radius={20} width={200} height={60} style={{ alignSelf: 'center' }}>
          <Text white bold>Buy Again</Text>
        </Button>

        <Block flex={0} height={sizes.height * 0.15} />

      </Block>
    </Block>
  )
}

export default OrderDetails