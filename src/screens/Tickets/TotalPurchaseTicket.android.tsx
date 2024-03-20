import React, { useCallback, useState } from 'react';
import { useNavigation, RouteProp } from '@react-navigation/core';
import { FlatList } from 'react-native';

// thirds-party
import { SvgUri } from 'react-native-svg';

// thirds-party
import { gql, useQuery, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// project imports
import { useData, useTheme } from '@src/hooks';
import { Block, Button, Image, Text } from '@src/components';
import { convertToCurrencyTHB } from '@src/utils/covertToCurrency';
import { formatDate } from '@src/utils/customDateAndTime';
import { TypesOfTicket, storePurchaseTicketProps } from './typePurchaseTicket';

const CREATEPURCHASETICKET = gql`
  mutation CreatePurchaseTicket($createPurchaseTicketInput: PurchaseTicketInput!) {
    CreatePurchaseTicket(CreatePurchaseTicketInput: $createPurchaseTicketInput) {
      success {
        message
      }
      error {
        message
      }
      data
    }
  }
`;

function getSortTypesOfTicket(array: any[]) {
  // กำหนดเรียงลำดับประเภทของตั๋ว
  const desiredTypesTicketSort: TypesOfTicket[] = ["Entrance", "IncludeRides", "DreamWorldVisa", "SuperVisa"];

  // function การเปรียบเทียบ 
  function sortComparator(a: { types_of_ticket: TypesOfTicket; }, b: { types_of_ticket: TypesOfTicket; }) {
    const typeA = a.types_of_ticket;
    const typeB = b.types_of_ticket;
    const indexA = desiredTypesTicketSort.indexOf(typeA);
    const indexB = desiredTypesTicketSort.indexOf(typeB);

    // เปรียบเทียบ index 
    return indexA - indexB;
  }

  // จัดเรียงข้อมูลตามที่กำหนด
  array.sort(sortComparator);

  console.log(array);
  return array
}

const TotalPurchaseTicket = ({ route }: any) => {
  const { state }: any = useData();
  const { colors, sizes, icons } = useTheme();
  const { picture, ticketColor, promotion } = route.params;
  const navigation: { replace: (arg0: string, arg1?: any) => void, goBack: () => void, setOptions: any } = useNavigation();

  const [mutationPurchaseTicket] = useMutation(CREATEPURCHASETICKET);

  const purchaseTicket = getSortTypesOfTicket(state.cart);

  const totalsummary = (purchaseTicket[0]?.totalprice || 0)
    + (purchaseTicket[1]?.totalprice || 0)
    + (purchaseTicket[2]?.totalprice || 0)
    + (purchaseTicket[3]?.totalprice || 0);

  return (
    <Block width={sizes.width} scroll hiddenScrollIndicator={false} bgcolor={colors.white}>
      <Block width={sizes.width * 0.85} style={{ alignItems: 'center', alignSelf: 'center' }}>

        <Block
          flex={0}
          marginTop={15}
          style={{
            width: sizes.width * 0.9,
            height: sizes.height * 0.18,
            borderRadius: 25,
          }}
          card
        >
          <Image
            // radius={25}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: "stretch",
            }}
            alt='banner'
            source={{ uri: picture }}
          />
        </Block>

        <Text bold h7 marginVertical={8} style={{ alignSelf: 'flex-start' }}>Summary</Text>

        <Block
          width={"100%"}
          height={"70%"}
          radius={25}
          marginBottom={10}
          style={{
            borderWidth: 3
          }}
        >
          <Block paddingHorizontal={15} paddingTop={10}>
            {purchaseTicket.map((item: storePurchaseTicketProps, index: number) => (
              <Block key={index}>
                <Block
                  flex={0}
                  radius={8}
                  marginTop={10}
                  width={"auto"}
                  bgcolor={
                    colors[`${ticketColor[
                    item.types_of_ticket === "Entrance" ? 0
                      : item.types_of_ticket === "IncludeRides" ? 1
                        : item.types_of_ticket === "DreamWorldVisa" ? 2 : 3
                    ]}400`]
                  }
                >
                  <Text bold align='center'>{item.titleticket}</Text>
                </Block>
                <Block paddingLeft={5} paddingRight={10}>
                  {item.amountofchild !== 0 && (
                    <Block flex={0} row width={"100%"} justify='space-between' marginVertical={10}>
                      <Text h10 font='Sarabun-SemiBold'>บัตรเด็ก <Text color={colors.grey400} h10 font='Sarabun-SemiBold'>( จำนวน {item.amountofchild} ใบ ) </Text></Text>
                      {promotion === 1 ? (
                        <Block flex={0} row align='center'>
                          <Text h10 gray font='Sarabun-SemiBold' style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
                            ฿{item.priceofchild + (promotion.discountchild * item.amountofchild)}
                          </Text>
                          <Text marginLeft={3} h10 primary font='Sarabun-SemiBold'>฿{item.priceofchild}</Text>
                        </Block>
                      ) : (
                        <Text h10 primary font='Sarabun-SemiBold'>฿{item.priceofchild}</Text>
                      )}
                    </Block>
                  )}
                  {item.amountofadult !== 0 && (
                    <Block flex={0} row width={"100%"} justify='space-between' marginVertical={10}>
                      <Text h10 font='Sarabun-SemiBold'>บัตรผู้ใหญ่ <Text color={colors.grey400} h10 font='Sarabun-SemiBold'>( จำนวน {item.amountofadult} ใบ ) </Text></Text>
                      {promotion === 1 ? (
                        <Block flex={0} row align='center'>
                          <Text h10 gray font='Sarabun-SemiBold' style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
                            ฿{item.priceofadult + (promotion.discountadult * item.amountofadult)}
                          </Text>
                          <Text marginLeft={3} h10 primary font='Sarabun-SemiBold'>฿{item.priceofadult}</Text>
                        </Block>
                      ) : (
                        <Text h10 primary font='Sarabun-SemiBold'>฿{item.priceofadult}</Text>
                      )}
                    </Block>
                  )}
                </Block>
              </Block>
            ))}
          </Block>

          {/* line */}
          <Block flex={0} bgcolor={colors.black} width={"100%"} height={3} />

          {/* Total Price Ticket */}
          <Block
            flex={0}
            row
            width={"100%"}
            align='center'
            justify='space-between'
            marginTop={10}
            paddingHorizontal={15}
            paddingVertical={8}
          >
            <Text bold h9>Date of use</Text>
            <Text bold h10 align='center' color={colors.focus}>{formatDate(String(purchaseTicket[0]?.dateofuse), "dddd DD", "MMMM", "YYYY")}</Text>
          </Block>
          <Block
            flex={0}
            row
            width={"100%"}
            align='center'
            justify='space-between'
            marginBottom={10}
            paddingHorizontal={15}
            paddingVertical={8}
          >
            <Text bold h9>Total</Text>
            <Text bold h9>{convertToCurrencyTHB(totalsummary, "฿")}
            </Text>
          </Block>

        </Block>
        <Block row width={"100%"} align='center' marginVertical={8}>
          <SvgUri
            width="12%"
            height="80%"
            color={colors.primary700}
            strokeWidth={1.4}
            uri={icons.dollor_coin}
          />
          <Text bold h9>Payment Method</Text>
          <Block flex={1} justify='flex-end' row height={"100%"} align='center'>
            <Text h10 tertiary>
              QR Promptpay
            </Text>
            <SvgUri
              width="14%"
              height="100%"
              color={colors.tertiaryMain}
              style={{ marginHorizontal: 10 }}
              uri={icons.check_circle}
            />
          </Block>
        </Block>

        <Button
          flex={0}
          radius={15}
          marginTop={25}
          width={sizes.width * 0.8}
          height={sizes.height * 0.07}
          bgcolor={colors.secondary400}
          style={{ alignSelf: 'center' }}
          onPress={async () => {
            const foundUser = await AsyncStorage.getItem("user");
            const response = await mutationPurchaseTicket({
              variables: {
                createPurchaseTicketInput: {
                  email: foundUser ? JSON.parse(foundUser).email : null,
                  purchaseticket: purchaseTicket
                }
              }
            })
            console.log("result: ", response.data.CreatePurchaseTicket.data),
              navigation.replace("PayWithORPromptpay", {
                order_purchaseticket: response.data.CreatePurchaseTicket.data,
                totalsummary: totalsummary,
              })
          }}
        >
          <Text bold white h7>Pay Now</Text>
        </Button>

        <Button
          flex={0}
          radius={15}
          marginVertical={25}
          width={sizes.width * 0.8}
          height={sizes.height * 0.07}
          bgcolor={colors.error}
          style={{ alignSelf: 'center' }}
          onPress={() => navigation.goBack()}
        >
          <Text bold white h7>Edit Purchase</Text>
        </Button>

      </Block>
    </Block >
  )
}

export default TotalPurchaseTicket