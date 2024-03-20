import React, { useState } from 'react';
import { Linking, ToastAndroid } from 'react-native'
import { useNavigation } from '@react-navigation/core';

// thirds-party
import { gql, useMutation, useQuery } from '@apollo/client';
// import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';

// project imports
import { useData, useTheme } from '@src/hooks';
import { addToCart, removeToCart, removeToCartAll, addPurchaseDetail } from '@src/hooks/myActions';
import { Block, Button, Image, Modal, Text, Iconify } from '@src/components';
import { TypesOfTicket, storePurchaseTicketProps } from './typePurchaseTicket';
import { ticketColor } from '@src/constants/mocks';
import { formatDate } from '@src/utils/customDateAndTime';

const GETTICKETALL = gql`
  query GetTicketAll($idAmusementpark: String!) {
    GetTicketAll(id_amusementpark: $idAmusementpark) {
      id
      amusementparkId
      title
      description
      typesticket {
        id
        types
        priceofchild
        priceofadult
      }
      promotion {
        id
        amusementparkId
        title
        description
        discountchild
        discountadult
      }
      ridesofTicket {
        maxRound
      }
    }
  }
`;

// =============================== hanlde function =================================

// handling ticket counts
function useTicketCounter(initialCount = 0) {
  const [ticketsCounts, setTicketCounts] = useState([
    {
      initialCount,
      typesticket: "Entrance"
    },
    {
      initialCount,
      typesticket: "IncludeRides"
    },
    {
      initialCount,
      typesticket: "DreamWorldVisa"
    },
    {
      initialCount,
      typesticket: "SuperVisa"
    }
  ]);

  const increment = (typesticket: TypesOfTicket) => {
    setTicketCounts((prevCounts) => {
      return prevCounts.map((ticket) => {
        if (ticket.typesticket === typesticket) {
          return {
            ...ticket,
            initialCount: ticket.initialCount + 1
          };
        }
        return ticket;
      });
    });
  };

  const decrement = (typesticket: TypesOfTicket) => {
    setTicketCounts((prevCounts) => {
      return prevCounts.map((ticket) => {
        if (ticket.typesticket === typesticket && ticket.initialCount > 0) {
          return {
            ...ticket,
            initialCount: ticket.initialCount - 1
          };
        }
        return ticket;
      });
    });
  };

  const reset = (typesticket: TypesOfTicket) => {
    setTicketCounts((prevCounts) => {
      return prevCounts.map((ticket) => {
        if (ticket.typesticket === typesticket && ticket.initialCount > 0) {
          return {
            ...ticket,
            initialCount: 0
          };
        }
        return ticket;
      });
    });
  };

  const setInitalCount = (typesticket: TypesOfTicket, count: number) => {
    setTicketCounts((prevCounts) => {
      return prevCounts.map((ticket) => {
        if (ticket.typesticket === typesticket) {
          return {
            ...ticket,
            initialCount: count
          };
        }
        return ticket;
      });
    });
  };

  return { ticketsCounts, increment, decrement, reset, setInitalCount };
}

function getMinimumDateInFeture() {
  // Get the current date
  const currentDate = new Date();

  // Calculate the date 2 days in the future
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + 2);

  return futureDate
}

const PurchaseTicket = ({ route }: any) => {
  // const dispatch = useDispatch();
  const { state, dispatch }: any = useData();
  const { colors, sizes, icons } = useTheme();
  const navigation: { navigate: (arg0: string, arg1?: any) => void } = useNavigation();
  const [modalSelectTicket, setModalSelectTicket] = useState(false);
  const [indexTicketModal, setIndexTicketModal] = useState(0);
  const [dateTicket, setDateTicket] = useState(null);
  const [showDateTicket, setShowDateTicket] = useState(false);
  const ticketCounter = useTicketCounter();
  const adultTicketCounter = useTicketCounter();

  const purchaseTicket: storePurchaseTicketProps[] = state.cart;

  // update ticket data
  const updateTicketData = (ticketData: storePurchaseTicketProps) => {
    dispatch(addToCart(ticketData));
  };

  // remove ticket all data
  const removeTicketData = (ticketData: storePurchaseTicketProps) => {
    dispatch(removeToCart(ticketData));
  }

  const addPurchaseAmusementDeatil = (detailAmusementPark: any) => {
    dispatch(addPurchaseDetail(detailAmusementPark));
  }


  React.useEffect(() => {
    dispatch(removeToCartAll());
    if (state.purchaseticketdetail?.id_amusementpark !== route.params.id_amusementpark) {
      addPurchaseAmusementDeatil({
        id_amusementpark: route.params.id_amusementpark,
        picture: route.params.picture,
        name: route.params.name,
        description: route.params.description
      })
    }
  }, [])

  const {
    loading: queryTicketAllLoading,
    error: queryTicketAllError,
    data: queryTicketAllData,
    // refetch
  } = useQuery(GETTICKETALL, {
    variables: { idAmusementpark: route.params.id_amusementpark },
  });


  if (queryTicketAllLoading) return <Text margin={50} bold h7>loading...</Text>;
  if (queryTicketAllError) {
    return <Text margin={50} bold h7>Error! {queryTicketAllError.message}</Text>
  }

  // Select date tickets
  const onChange = (_event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShowDateTicket(false);
    setDateTicket(currentDate);
  };
  const showToastWithGravityAndOffset = () => {
    ToastAndroid.showWithGravityAndOffset(
      "กรุณาเลือกวันที่จะใช้ตั๋ว",
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      55,
      20,
    );
  };

  return (
    <Block width={sizes.width} scroll hiddenScrollIndicator={false} bgcolor={colors.white}>
      <Block width={sizes.width * 0.85} style={{ alignSelf: 'center' }}>

        {/* AmusemnetPark Image */}
        <Block
          flex={0}
          marginTop={20}
          justify='center'
          style={{
            height: sizes.height * 0.22,
            borderRadius: 25,
            borderWidth: 2,
            borderColor: colors.black,
          }}
        >
          <Image
            radius={25}
            style={{
              width: '95%',
              height: '90%',
              resizeMode: "stretch",
              alignSelf: "center",
            }}
            alt='banner'
            source={{ uri: route.params.picture }}
          />
        </Block>

        {/* title & button call/direction */}
        <Block row marginVertical={10} justify='space-between'>
          <Text font='Sarabun-ExtraBold' h7>
            {route.params.name}
          </Text>
          <Block flex={0} row>
            <Button
              flex={0}
              align='center'
              marginRight={20}
              onPress={() => Linking.openURL(`tel:0928894210`)}
            >
              <Iconify
                IconUri={icons.phone}
                IconWidth={"25"}
                IconHeight={"25"}
                IconColors={colors.white}
                style={{
                  padding: 8,
                  borderRadius: 50,
                  backgroundColor: colors.primaryDark
                }}
              />
              <Text font='Sarabun-SemiBold' h11>
                Call
              </Text>
            </Button>
            <Button
              flex={0}
              align='center'
              onPress={() => {
                const deepLink: string = `https://www.google.com/maps/dir/?api=1&destination=${route.params.latitude},${route.params.longitude}`
                Linking.openURL(deepLink)
                  .then((supported) => {
                    if (!supported) {
                      console.error("Can't handle url: " + deepLink);
                    } else {
                      console.log('Opened URL: ' + deepLink);
                    }
                  })
                  .catch((err) => console.error('An error occurred', err))
              }}
            >
              <Iconify
                IconUri={icons.direction}
                IconWidth={"25"}
                IconHeight={"25"}
                IconColors={colors.white}
                style={{
                  padding: 8,
                  borderRadius: 50,
                  backgroundColor: colors.secondaryDark
                }}
              />
              <Text font='Sarabun-SemiBold' h11>
                Direction
              </Text>
            </Button>
          </Block>
        </Block>

        {/* Description */}
        <Block>
          <Text bold h9>
            Description:
          </Text>
          <Text h10>
            {route.params.description}
          </Text>
        </Block>

        {/* Select Date */}
        <Block align='center' marginTop={15}>
          <Text font='Sarabun-SemiBold' h7>เลือกวันที่ใช้ตั๋ว: </Text>
          <Button
            row
            width={"80%"}
            height={60}
            radius={10}
            justify='space-around'
            style={{
              borderWidth: 2,
              borderColor: dateTicket === null ? colors.primaryDark : colors.black
            }}
            endAdornmentIcon
            endIconUri={icons.calendar}
            endIconWidth={"25"}
            endIconHeight={"25"}
            endIconColors={colors.tertiaryDark}
            onPress={() => setShowDateTicket(true)}
          >
            {dateTicket === null ? (
              <Text font='Sarabun-Medium' h9>ยังไม่ได้เลือกวันที่ใช้</Text>
            )
              : (
                <Text font='Sarabun-Medium' h9>{formatDate(String(dateTicket), "DD", "MMM", "YYYY")}</Text>
              )}
          </Button>
          {showDateTicket &&
            <DateTimePicker
              testID="datePicker"
              value={dateTicket || new Date()}
              mode={"date"}
              onChange={onChange}
              minimumDate={getMinimumDateInFeture()}
              positiveButton={{ label: 'ตกลง', textColor: colors.tertiaryMain }}
              negativeButton={{ label: 'ยกเลิก', textColor: colors.primaryMain }}
            />
          }
        </Block>

        {/* Tickets */}
        {queryTicketAllData.GetTicketAll.map((item: any, index: number) => (
          <Button
            key={index}
            row
            marginTop={20}
            height={sizes.height * 0.2}
            radius={15}
            style={{
              borderWidth: 3,
              borderColor: colors.black
            }}
            onPress={() => { setModalSelectTicket(true), setIndexTicketModal(index) }}
          >
            <Block
              flex={0}
              width={"60%"}
              height={"100%"}
              radius={10}
              style={{
                borderRightWidth: 3,
                borderColor: colors.black
              }}
            >
              <Block
                flex={0}
                height={"25%"}
                radius={0}
                paddingLeft={15}
                align='flex-start'
                justify='center'
                bgcolor={colors[`${ticketColor[index]}Main`]}
                style={{
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 9,
                  borderBottomWidth: 3,
                  borderColor: colors.black
                }}
              >
                <Text bold white>{item.title}</Text>
              </Block>
              <Text h11 font='Sarabun-SemiBold' paddingHorizontal={8}>
                {item.description}
              </Text>
            </Block>
            {/* Show price and amount ticket */}
            <Block
              height={"100%"}
              align='center'
              justify='space-evenly'
            >
              <Block flex={0}>
                {item.promotion !== null ? (
                  <>
                    <Text h11 gray font='Sarabun-SemiBold' style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
                      {"\t\t\t\t\t\t\t\t\t"}{item.typesticket.priceofchild}
                    </Text>
                    <Text h10 font='Sarabun-SemiBold'>
                      🔥 Child{"\t\t"}{item.typesticket.priceofchild - item.promotion.discountchild} -- {item.typesticket.types == ticketCounter.ticketsCounts[index].typesticket ? ticketCounter.ticketsCounts[index].initialCount : 0}
                    </Text>
                    <Text h11 gray font='Sarabun-SemiBold' style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
                      {"\t\t\t\t\t\t\t\t\t"}{item.typesticket.priceofadult}
                    </Text>
                    <Text h10 font='Sarabun-SemiBold'>
                      🔥 Adult  {item.typesticket.priceofadult - item.promotion.discountadult} --  {item.typesticket.types == adultTicketCounter.ticketsCounts[index].typesticket ? adultTicketCounter.ticketsCounts[index].initialCount : 0}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text h10 font='Sarabun-SemiBold'>
                      Child{"\t\t"}{item.typesticket.priceofchild} --  {item.typesticket.types == ticketCounter.ticketsCounts[index].typesticket ? ticketCounter.ticketsCounts[index].initialCount : 0}
                    </Text>
                    <Text h10 font='Sarabun-SemiBold'>
                      Adult  {item.typesticket.priceofadult} --  {item.typesticket.types == adultTicketCounter.ticketsCounts[index].typesticket ? adultTicketCounter.ticketsCounts[index].initialCount : 0}
                    </Text>
                  </>
                )}
              </Block>
              <Block
                flex={0}
                width={"80%"}
                bgcolor={colors[`${ticketColor[index]}Main`]}
                radius={8}
              >
                <Text black bold align='center'>Select</Text>
              </Block>
            </Block>
          </Button>
        ))}

        {/* Button Buy */}
        <Button
          flex={0}
          radius={15}
          marginVertical={25}
          width={sizes.width * 0.8}
          height={sizes.height * 0.07}
          bgcolor={colors.secondary400}
          style={{ alignSelf: 'center' }}
          disabled={purchaseTicket.length === 0}
          onPress={async () => {
            if (dateTicket === null) {
              showToastWithGravityAndOffset()
            } else {
              navigation.navigate("TotalPurchaseTicket", {
                ticketColor,
                // haspromotion: queryTicketAllData.GetTicketAll[indexTicketModal].purchaseticket.hasPromotion,
                promotion: queryTicketAllData.GetTicketAll[indexTicketModal].promotion,
                id_amusementpark: route.params.id_amusementpark,
                picture: route.params.picture,
                name: route.params.name,
                description: route.params.description
              })
            }
          }}
        >
          <Text bold white h7>Check Out</Text>
        </Button>

        {/* Modal Select Ticket */}
        <Modal
          transparent
          visible={modalSelectTicket}
          onRequestClose={() => setModalSelectTicket(false)}
        >
          <Block align='center' justify='center' blur>

            {/* Header */}
            <Block
              flex={0}
              align='center'
              justify='center'
              bgcolor={colors.white}
              width={sizes.width * 0.9}
              height={sizes.height * 0.55}
              paddingVertical={15}
              radius={20}
              style={{
                borderWidth: 2,
                borderStyle: "dashed"
              }}
            >
              <Block
                flex={0}
                width={"85%"}
                height={"16%"}
                bgcolor={colors[`${ticketColor[indexTicketModal]}Main`]}
                align='center'
                justify='center'
                radius={25}
                style={{
                  borderWidth: 3
                }}
              >
                <Text bold h8>{queryTicketAllData.GetTicketAll[indexTicketModal].typesticket.types} Ticket</Text>
              </Block>

              {/* Body */}
              <Block
                flex={0}
                width={"85%"}
                height={"70%"}
                align='center'
                justify='center'
                radius={25}
                marginBottom={10}
                style={{
                  borderWidth: 3
                }}
              >
                {/* Select amount tickets */}
                <Block flex={0} row width={"100%"} height={"25%"} align='center' justify='center'>
                  <Text h10>
                    Child ticket{"\n"}
                    (price <Text bold primary>{queryTicketAllData.GetTicketAll[indexTicketModal].typesticket.priceofchild - (queryTicketAllData?.GetTicketAll[indexTicketModal]?.promotion?.discountchild || 0)}</Text> baht)
                  </Text>
                  <Button
                    padding={10}
                    endAdornmentIcon
                    endIconUri={icons.minus_rounded}
                    endIconWidth={"25"}
                    endIconHeight={"25"}
                    endIconColors={colors.black}
                    onPress={() => ticketCounter.decrement(queryTicketAllData.GetTicketAll[indexTicketModal].typesticket.types)}
                  />
                  <Block
                    flex={0}
                    width={"15%"}
                    height={"55%"}
                    align='center'
                    justify='center'
                    radius={12}
                    marginHorizontal={8}
                    style={{
                      borderWidth: 3
                    }}
                  >
                    <Text>
                      {ticketCounter.ticketsCounts[indexTicketModal].initialCount}
                    </Text>
                  </Block>
                  <Button
                    padding={10}
                    endAdornmentIcon
                    endIconUri={icons.add_rounded}
                    endIconWidth={"25"}
                    endIconHeight={"25"}
                    endIconColors={colors.black}
                    onPress={() => ticketCounter.increment(queryTicketAllData.GetTicketAll[indexTicketModal].typesticket.types)}
                  />
                </Block>
                <Block
                  flex={0}
                  row
                  marginBottom={10}
                  width={"100%"}
                  height={"25%"}
                  align='center'
                  justify='center'
                >
                  <Text h10>
                    Adult ticket{"\n"}
                    (price <Text bold primary>{queryTicketAllData.GetTicketAll[indexTicketModal].typesticket.priceofadult - (queryTicketAllData?.GetTicketAll[indexTicketModal]?.promotion?.discountadult || 0)}</Text> baht)
                  </Text>
                  <Button
                    padding={10}
                    endAdornmentIcon
                    endIconUri={icons.minus_rounded}
                    endIconWidth={"25"}
                    endIconHeight={"25"}
                    endIconColors={colors.black}
                    onPress={() => adultTicketCounter.decrement(queryTicketAllData.GetTicketAll[indexTicketModal].typesticket.types)}
                  />
                  <Block
                    flex={0}
                    width={"15%"}
                    height={"55%"}
                    align='center'
                    justify='center'
                    radius={12}
                    marginHorizontal={8}
                    style={{
                      borderWidth: 3
                    }}
                  >
                    <Text>{adultTicketCounter.ticketsCounts[indexTicketModal].initialCount}</Text>
                  </Block>
                  <Button
                    padding={10}
                    endAdornmentIcon
                    endIconUri={icons.add_rounded}
                    endIconWidth={"25"}
                    endIconHeight={"25"}
                    endIconColors={colors.black}
                    onPress={() => adultTicketCounter.increment(queryTicketAllData.GetTicketAll[indexTicketModal].typesticket.types)}
                  />
                </Block>

                {/* line */}
                <Block flex={0} bgcolor={colors.black} width={"100%"} height={3} />

                {/* show date to use ticket */}
                <Block
                  flex={0}
                  width={"100%"}
                  padding={8}
                  style={{
                    borderBottomLeftRadius: 22,
                    borderBottomRightRadius: 22,
                  }}
                >
                  <Text h11 font='Sarabun-Medium'>Date of use of ticket:</Text>
                </Block>
                <Text bold h8 align='center' color={colors.focus}>{formatDate(String(dateTicket), "dddd DD", "MMMM", "YYYY")}</Text>
              </Block>

              {/* Footer */}
              <Block row height={"10%"}>
                <Button
                  flex={0}
                  width={"35%"}
                  bgcolor={colors[`${ticketColor[indexTicketModal]}Main`]}
                  radius={8}
                  marginRight={20}
                  disabled={(ticketCounter.ticketsCounts[indexTicketModal].initialCount || adultTicketCounter.ticketsCounts[indexTicketModal].initialCount) === 0 && purchaseTicket.length === 0}
                  onPress={() => {
                    let priceofchild = 0
                    let priceofadult = 0
                    let haspromotion = 0

                    // if that ticket have promotion
                    if (queryTicketAllData.GetTicketAll[indexTicketModal].promotion !== null && ticketCounter.ticketsCounts[indexTicketModal].initialCount !== 0) {
                      priceofchild -= (queryTicketAllData.GetTicketAll[indexTicketModal].promotion.discountchild * ticketCounter.ticketsCounts[indexTicketModal].initialCount)
                      haspromotion = 1
                    }
                    if (queryTicketAllData.GetTicketAll[indexTicketModal].promotion !== null && adultTicketCounter.ticketsCounts[indexTicketModal].initialCount !== 0) {
                      priceofadult -= (queryTicketAllData.GetTicketAll[indexTicketModal].promotion.discountadult * adultTicketCounter.ticketsCounts[indexTicketModal].initialCount)
                      haspromotion = 1
                    }

                    // set initialdata 
                    priceofchild += queryTicketAllData.GetTicketAll[indexTicketModal].typesticket.priceofchild * ticketCounter.ticketsCounts[indexTicketModal].initialCount;
                    priceofadult += queryTicketAllData.GetTicketAll[indexTicketModal].typesticket.priceofadult * adultTicketCounter.ticketsCounts[indexTicketModal].initialCount;
                    console.log(priceofchild + " | " + priceofadult);
                    let totalprice = priceofchild + priceofadult


                    // if ticketCounter or adultTicketCounter had already initalCount value given remove that ticket
                    if ((ticketCounter.ticketsCounts[indexTicketModal].initialCount || adultTicketCounter.ticketsCounts[indexTicketModal].initialCount) === 0 && purchaseTicket.length !== 0) {
                      console.log("Remove");
                      removeTicketData({
                        id_ticket: queryTicketAllData.GetTicketAll[indexTicketModal].id,
                        id_amusementpark: queryTicketAllData.GetTicketAll[indexTicketModal].amusementparkId,
                        titleticket: queryTicketAllData.GetTicketAll[indexTicketModal].title,
                        priceofchild: priceofchild,
                        amountofchild: ticketCounter.ticketsCounts[indexTicketModal].initialCount,
                        priceofadult: priceofadult,
                        amountofadult: adultTicketCounter.ticketsCounts[indexTicketModal].initialCount,
                        totalprice: totalprice,
                        types_of_ticket: queryTicketAllData.GetTicketAll[indexTicketModal].typesticket.types,
                        maxround: queryTicketAllData.GetTicketAll[indexTicketModal].ridesofTicket[0].maxRound,
                        dateofuse: dateTicket || new Date(),
                        haspromotion: haspromotion
                      })
                      ToastAndroid.showWithGravityAndOffset(
                        "ลบตั๋วออกจากระบบเรียบร้อย",
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER,
                        55,
                        20,
                      );
                    } else {
                      console.log("update");
                      updateTicketData({
                        id_ticket: queryTicketAllData.GetTicketAll[indexTicketModal].id,
                        id_amusementpark: queryTicketAllData.GetTicketAll[indexTicketModal].amusementparkId,
                        titleticket: queryTicketAllData.GetTicketAll[indexTicketModal].title,
                        priceofchild: priceofchild,
                        amountofchild: ticketCounter.ticketsCounts[indexTicketModal].initialCount,
                        priceofadult: priceofadult,
                        amountofadult: adultTicketCounter.ticketsCounts[indexTicketModal].initialCount,
                        totalprice: totalprice,
                        types_of_ticket: queryTicketAllData.GetTicketAll[indexTicketModal].typesticket.types,
                        maxround: queryTicketAllData.GetTicketAll[indexTicketModal].ridesofTicket[0].maxRound,
                        dateofuse: dateTicket || new Date(),
                        haspromotion: haspromotion
                      })
                      ToastAndroid.showWithGravityAndOffset(
                        "เพิ่มตั๋วเข้าไปในระบบเรียบร้อย",
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER,
                        55,
                        20,
                      );
                    }
                    setModalSelectTicket(false)
                  }}
                >
                  <Text bold h9 white>Confirm</Text>
                </Button>

                <Button
                  flex={0}
                  width={"35%"}
                  radius={8}
                  style={{
                    borderWidth: 3
                  }}
                  onPress={() => {
                    if ((ticketCounter.ticketsCounts[indexTicketModal].initialCount || adultTicketCounter.ticketsCounts[indexTicketModal].initialCount) > 0 && purchaseTicket.length === 0) {
                      console.log("1")
                      ticketCounter.reset(queryTicketAllData.GetTicketAll[indexTicketModal].typesticket.types)
                      adultTicketCounter.reset(queryTicketAllData.GetTicketAll[indexTicketModal].typesticket.types)

                    } else if (ticketCounter.ticketsCounts[indexTicketModal].initialCount !== (purchaseTicket[purchaseTicket.findIndex((item) => item?.types_of_ticket === purchaseTicket[indexTicketModal]?.types_of_ticket)]?.amountofchild || 0)
                      || adultTicketCounter.ticketsCounts[indexTicketModal].initialCount !== (purchaseTicket[purchaseTicket.findIndex((item) => item?.types_of_ticket === purchaseTicket[indexTicketModal]?.types_of_ticket)]?.amountofadult || 0)) {

                      console.log("Test ", ticketCounter.ticketsCounts[indexTicketModal].initialCount + " | " + purchaseTicket[purchaseTicket.findIndex((item) => item?.types_of_ticket === purchaseTicket[indexTicketModal]?.types_of_ticket)]?.amountofchild || 0)
                      console.log("Test2 ", adultTicketCounter.ticketsCounts[indexTicketModal].initialCount + " | " + purchaseTicket[purchaseTicket.findIndex((item) => item?.types_of_ticket === purchaseTicket[indexTicketModal]?.types_of_ticket)]?.amountofadult || 0)
                      ticketCounter.setInitalCount(queryTicketAllData.GetTicketAll[indexTicketModal].typesticket.types, purchaseTicket[purchaseTicket.findIndex((item) => item?.types_of_ticket === purchaseTicket[indexTicketModal]?.types_of_ticket)]?.amountofchild || 0)
                      adultTicketCounter.setInitalCount(queryTicketAllData.GetTicketAll[indexTicketModal].typesticket.types, purchaseTicket[purchaseTicket.findIndex((item) => item?.types_of_ticket === purchaseTicket[indexTicketModal]?.types_of_ticket)]?.amountofadult || 0)

                    }
                    setModalSelectTicket(false)
                  }}
                >
                  <Text bold h9>Cancel</Text>
                </Button>
              </Block>

            </Block>
          </Block>
        </Modal>

      </Block>
    </Block >
  )
}

export default PurchaseTicket