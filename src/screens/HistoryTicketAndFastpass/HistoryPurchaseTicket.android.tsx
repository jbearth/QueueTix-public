import React, { useState } from 'react';
import { FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/core';

// thirds-party
import { gql, useQuery, NetworkStatus } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// project imports
import { useTheme } from '@src/hooks';
import { Block, Button, Image, Modal, Text, Iconify } from '@src/components';
import { convertToCurrencyTHB } from '@src/utils/covertToCurrency';
import { formatDate, getTime } from '@src/utils/customDateAndTime';
import { TypesOfTicket } from '@src/screens/Tickets/typePurchaseTicket';

const GETPURCHASETICKETALL = gql`
  query GetPurchaseTicket($email: String!) {
    getPurchaseTicket(email: $email) {
      id
      orderId
      types
      dateofuse
      hasPromotion
      status
      createdAt
      ticket {
        title
      }
      purchasetickettypes {
        id
        types
        amount
        price
        statusTicket
        purchaseticketofrides {
          ridesId
          usedLimit
          usedCount
        }
      }
      amusementpark {
        id
        name
      }
    }
  }
`;

const GETFASTPASSALL = gql`
  query GetFastpassAll($email: String!) {
    GetFastpassAll(email: $email) {
      id
      startDateTime
      endDateTime
      isUsed
      purchasefastpassofrides {
        PurchaseTicketTypes {
          purchaseticket {
            orderId
          }
        }
        rides {
          nameThai
          nameEng
          picture
          amusementpark {
            name
          }
        }
      }
    }
  }
`;

function getSortTypesOfTicket(array: any[]) {
  // กำหนดเรียงลำดับประเภทของตั๋ว
  const desiredTypesTicketSort: TypesOfTicket[] = ["Entrance", "IncludeRides", "DreamWorldVisa", "SuperVisa"];

  // function การเปรียบเทียบ 
  function sortComparator(a: { types: TypesOfTicket; }, b: { types: TypesOfTicket; }) {
    const typeA = a.types;
    const typeB = b.types;
    const indexA = desiredTypesTicketSort.indexOf(typeA);
    const indexB = desiredTypesTicketSort.indexOf(typeB);

    // เปรียบเทียบ index 
    return indexA - indexB;
  }

  // จัดเรียงข้อมูลตามที่กำหนด
  array.sort(sortComparator);

  // console.log(array);
  return array
}

function getUniqueOrderId(array: readonly any[], steps: any, currentStep: number) {
  // สร้าง array ว่างเพื่อจัดเก็บ orderId และ dateofuse ที่ไม่ซ้ำกัน
  const uniquePairs: {
    orderId: string;
    dateofuse: any;
    status: string
    amusement_name: string
  }[] = [];

  array.forEach((item, index) => {
    const { orderId, dateofuse, status, amusementpark } = item;

    // ตรวจสอบว่า orderId ไม่ได้อยู่ใน uniquePairs array หรือไม่
    const existingPair = uniquePairs.find(pair => pair.orderId === orderId);

    if (!existingPair) {
      uniquePairs.push({ orderId, dateofuse, status, amusement_name: amusementpark.name });
    }
  });

  const filterPurchaseTicketStatus = uniquePairs.filter((item) => steps[currentStep].title === item.status)

  // console.log(filterPurchaseTicketStatus);
  return filterPurchaseTicketStatus;
}

function getUniqueTicketTitle(array: readonly any[]) {
  const groupedByOrderId: any = {};

  array.forEach(item => {
    const { orderId, ticket } = item;
    if (!groupedByOrderId[orderId]) {
      groupedByOrderId[orderId] = [ticket.title];
    } else {
      groupedByOrderId[orderId].push(ticket.title);
    }
  });
  let result: any
  result = Object.entries(groupedByOrderId).map(([orderId, types]) => ({
    orderId,
    types
  }));
  console.log(result[0]?.types)
  return result;
}

function getSumTotalPrice(array: readonly any[], orderID: string) {
  let totalPrice = 0;

  // ผลรวมของ totalprice
  array.forEach(item => {
    if (item.orderId === orderID) {
      item.purchasetickettypes.forEach((itemprice: any) => {
        totalPrice += itemprice.price;
      });
    }
  });
  // console.log(totalPrice)
  return totalPrice
}

function getAmountOfTicket(array: readonly any[], orderID: string) {
  let totalAmountTicketOfTypes = 0;

  // ผลรวมของ totalprice
  array.forEach(item => {
    const totaltypes = parseInt(item.purchasetickettypes.length);
    if (item.orderId === orderID) totalAmountTicketOfTypes += totaltypes;
  });
  return totalAmountTicketOfTypes
}

async function getUserEmail() {
  const jsonValue = await AsyncStorage.getItem("user");
  // console.log(jsonValue)
  return jsonValue ? JSON.parse(jsonValue).email : null;
};

// ============================================== HistoryPurchaseTicket Screen ==============================================

const HistoryPurchaseTicket = () => {
  const { colors, sizes, icons } = useTheme();
  const navigation: { navigate: (arg0: string, arg1?: any) => void, replace: (arg0: string, arg1?: any) => void } = useNavigation();
  const [steps] = useState([
    {
      id: 1,
      title: "Pending",
    },
    {
      id: 2,
      title: "Unused",
    },
    {
      id: 3,
      title: "Completed",
    },
  ])
  const [currentStepTicket, setCurrentStepTicket] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [userEmail, setUserEmail] = useState("");


  const {
    loading: queryPurchaseTicketAllLoading,
    error: queryPurchaseTicketAllError,
    data: queryPurchaseTicketAllData,
    refetch: refecthPurchaseTicketAll,
  } = useQuery(GETPURCHASETICKETALL, {
    variables: { email: userEmail },

  });

  const {
    loading: queryFastpassAllLoading,
    error: queryFastpassAllError,
    data: queryFastpassAllData,
    refetch: refecthFastpassAll,
  } = useQuery(GETFASTPASSALL, {
    variables: { email: userEmail },
  });

  if (queryPurchaseTicketAllError || queryFastpassAllError) {
    return <Text margin={50} bold h7>เกิดข้อผิดพลาดทางระบบเซิร์ฟเวอร์ !!!</Text>
  }


  React.useMemo(async () => {
    console.log("getEmail");
    const email = await getUserEmail();
    setUserEmail(email)
    onRefreshPurchaseTicket()
    refecthFastpassAll();
  }, [])

  const onRefreshPurchaseTicket = () => {
    // ใช้ฟังก์ชันการดึงข้อมูลจาก useQuery เพื่อดึงข้อมูลอีกครั้ง
    refecthPurchaseTicketAll();
  };

  const onRefreshFastpass = () => {
    // ใช้ฟังก์ชันการดึงข้อมูลจาก useQuery เพื่อดึงข้อมูลอีกครั้ง
    refecthFastpassAll();
  };

  let purchaseTicketData: readonly any[] = []
  let fastpassData: any[] = [];

  if (!queryPurchaseTicketAllLoading) {
    const modifiedDatTicket = [...queryPurchaseTicketAllData?.getPurchaseTicket];
    purchaseTicketData = getSortTypesOfTicket(modifiedDatTicket)
  }

  if (!queryFastpassAllLoading) {
    const modifiedDataFastpass = [...queryFastpassAllData?.GetFastpassAll]
    fastpassData = modifiedDataFastpass.filter((item) => (item.isActive === 1 ? "Completed" : "Unused") === steps[currentStep].title)
  }

  const filteredOrderId: any = getUniqueOrderId(purchaseTicketData, steps, currentStep);
  const filteredTicketTitle: any = getUniqueTicketTitle(purchaseTicketData);

  const renderItemShowTickets = ({ item, index }: any) => {
    return item.status === "Pending" ? (
      <Button
        key={index}
        marginTop={5}
        marginBottom={15}
        height={sizes.height * 0.22}
        radius={15}
        style={{
          borderWidth: 2
        }}
        // bgcolor={colors}
        onPress={() => navigation.replace("PayWithORPromptpay", {
          order_purchaseticket: item.orderId,
          totalsummary: getSumTotalPrice(purchaseTicketData, item.orderId),
        })}
      >
        <Block
          row
          width={"100%"}
          align='center'
        >
          <Iconify
            IconUri={icons.amusemnetpark}
            IconWidth={"25"}
            IconHeight={"25"}
            IconColors={colors.white}
            style={{
              width: "10%",
              height: "80%",
              alignItems: 'center',
              justifyContent: 'center',
              // padding: 5,
              marginHorizontal: 15,
              borderRadius: 50,
              backgroundColor: colors.secondaryDark,
            }}
          />
          <Text bold h8>{item?.amusement_name} {">"} </Text>
        </Block>

        <Block
          flex={0}
          row
          align='center'
          height={"50%"}
          bgcolor={colors.fourth300}
        >
          <Image
            source={{ uri: "https://queuetix.s3.ap-southeast-2.amazonaws.com/amusementpark01.png" }}
            style={{
              width: "25%",
              height: "75%",
              marginHorizontal: 15
            }}
          />
          <Block>
            <Text bold h10 lineHeight={20}>Ticket</Text>
            <Text h11 lineHeight={20}>
              {filteredTicketTitle[index]?.orderId == item?.orderId && filteredTicketTitle[index]?.types + ", "}
            </Text>
            <Text h11 lineHeight={18}>Date of use: <Text font={"Sarabun-Medium"}>{String(item.dateofuse).split("T")[0]}</Text></Text>
          </Block>
        </Block>

        <Block row paddingHorizontal={15} width={"100%"} align='center' justify='space-between'>
          <Text font={"Sarabun-Medium"}>{getAmountOfTicket(purchaseTicketData, item.orderId)} item(s)</Text>
          <Text bold>Total Payment: <Text primary>{convertToCurrencyTHB(getSumTotalPrice(purchaseTicketData, item.orderId), "฿")}</Text></Text>
        </Block>
      </Button>
    ) : (
      <Button
        key={index}
        marginTop={5}
        marginBottom={15}
        height={sizes.height * 0.22}
        radius={15}
        style={{
          borderWidth: 2
        }}
        // bgcolor={colors}
        onPress={() => navigation.navigate("OrderDetails", {
          purchaseTicketData,
          totalAllTicketPrice: getSumTotalPrice(purchaseTicketData, item.orderId),
          orderID: item.orderId,
          timeCreateAt: purchaseTicketData[index].orderId === item.orderId && purchaseTicketData[index].createdAt,
          status: item.status
        })}
      >
        <Block
          row
          width={"100%"}
          align='center'
        >
          <Iconify
            IconUri={icons.amusemnetpark}
            IconWidth={"25"}
            IconHeight={"25"}
            IconColors={colors.white}
            style={{
              width: "10%",
              height: "80%",
              alignItems: 'center',
              justifyContent: 'center',
              // padding: 5,
              marginHorizontal: 15,
              borderRadius: 50,
              backgroundColor: colors.secondaryDark,
            }}
          />
          <Text bold h8>{item?.amusement_name} {">"} </Text>
        </Block>

        <Block
          flex={0}
          row
          align='center'
          height={"50%"}
          bgcolor={colors.fourth300}
        >
          <Image
            source={{ uri: "https://queuetix.s3.ap-southeast-2.amazonaws.com/amusementpark01.png" }}
            style={{
              width: "25%",
              height: "75%",
              marginHorizontal: 15
            }}
          />
          <Block>
            <Text bold h10 lineHeight={20}>Ticket</Text>
            <Text h11 lineHeight={20}>
              {filteredTicketTitle[index]?.orderId == item?.orderId && filteredTicketTitle[index]?.types + ", "}
            </Text>
            <Text h11 lineHeight={18}>Date of use: <Text font={"Sarabun-Medium"}>{String(item.dateofuse).split("T")[0]}</Text></Text>
          </Block>
        </Block>

        <Block row paddingHorizontal={15} width={"100%"} align='center' justify='space-between'>
          <Text font={"Sarabun-Medium"}>{getAmountOfTicket(purchaseTicketData, item?.orderId)} item(s)</Text>
          <Text bold>Total Payment: <Text primary>{convertToCurrencyTHB(getSumTotalPrice(purchaseTicketData, item?.orderId), "฿")}</Text></Text>
        </Block>
      </Button>
    )
  }

  const renderItemShowFastpass = ({ item, index }: any) => {

    const namerides_booking = `${item.purchasefastpassofrides[0]?.rides.nameEng} - ${item?.purchasefastpassofrides[0].rides.nameThai}`

    return (
      <Button
        key={index}
        marginTop={5}
        marginBottom={15}
        height={sizes.height * 0.22}
        radius={15}
        justify='center'
        style={{
          borderWidth: 2
        }}
        onPress={() => navigation.navigate("ShowFastpassDetail", {
          id_purchasefastpass: item.id,
          nameamusementpark_booking: item?.purchasefastpassofrides[0]?.rides.amusementpark.name,
          namerides_booking: namerides_booking,
          picturerides_booking: item?.purchasefastpassofrides[0].rides.picture
        })}
      >
        <Block
          flex={1}
          row
          width={"100%"}
          align='center'
        >
          <Iconify
            IconUri={icons.amusemnetpark}
            IconWidth={"25"}
            IconHeight={"25"}
            IconColors={colors.white}
            style={{
              width: "10%",
              height: "80%",
              alignItems: 'center',
              justifyContent: 'center',
              // padding: 5,
              marginHorizontal: 15,
              borderRadius: 50,
              backgroundColor: colors.secondaryDark,
            }}
          />
          <Text bold h8>{item?.purchasefastpassofrides[0]?.rides.amusementpark.name} {">"} </Text>
        </Block>

        <Block
          flex={0}
          row
          align='center'
          height={"50%"}
          paddingHorizontal={10}
          bgcolor={colors.primary400}
        >
          <Block>
            <Text bold h10>Fastpass</Text>
            <Text bold h9 white>{namerides_booking}</Text>
          </Block>
          <Block
            flex={0}
            white
            paddingHorizontal={10}
            paddingVertical={4}
            radius={10}
          >
            <Text bold h10 font='Sarabun-ExtraBold'>{getTime(item.startDateTime)} - {getTime(item.endDateTime)}</Text>
          </Block>
        </Block>

        <Block row paddingHorizontal={12} width={"100%"} align='center' justify='space-between'>
          <Text h11 color={colors.secondaryMain}>Queue Ticket Id: {item.purchasefastpassofrides[0]?.PurchaseTicketTypes.purchaseticket?.orderId}</Text>
          <Text h11>Date: {formatDate(item.startDateTime, "DD", "MMM", "YYYY")}</Text>
        </Block>
      </Button>
    )
  }

  return (
    <Block width={sizes.width} bgcolor={colors.white}>
      <Block width={sizes.width * 0.9} style={{ alignSelf: 'center' }}>

        <Block flex={0} marginTop={50}>
          <Text bold h6 center>{currentStepTicket === 0 ? "My Tickets" : "My Fastpass"}</Text>
        </Block>
        <Button
          flex={0}
          card
          padding={8}
          radius={15}
          width={45}
          height={45}
          position={"absolute"}
          top={40}
          right={15}
          onPress={() => navigation.navigate("Home", {
            chnageCurrentCategory: 1
          })}
        >
          <Block flex={0} width={"100%"}>
            <Iconify
              IconUri={`https://api.iconify.design/ic:twotone-shopping-cart.svg`}
              IconWidth={"100%"}
              IconHeight={"100%"}
              IconColorDuotone={colors.secondary700}
            />
          </Block>
        </Button>

        <Block flex={0} row height={sizes.height * 0.06} justify='center'>
          {steps.map((item, index) => (
            currentStepTicket === 0 ? (
              <Button
                key={index}
                width={"33.5%"}
                style={{
                  borderBottomWidth: currentStep == index ? 4 : 2,
                  borderBottomColor: currentStep == index ? colors.primaryMain : colors.grey400
                }}
                onPress={() => setCurrentStep(index)}
              >
                <Text h8 font={currentStep == index ? "Sarabun-SemiBold" : "Sarabun-Medium"}>{item.title}</Text>
              </Button>
            ) : currentStepTicket === 1 && item.title !== "Pending" && (
              <Button
                key={index}
                width={"50%"}
                style={{
                  borderBottomWidth: currentStep == index ? 4 : 2,
                  borderBottomColor: currentStep == index ? colors.primaryMain : colors.grey400
                }}
                onPress={() => setCurrentStep(index)}
              >
                <Text h8 font={currentStep == index ? "Sarabun-SemiBold" : "Sarabun-Medium"}>{item.title}</Text>
              </Button>
            )
          ))}
        </Block>

        <Block safe>

          <Block flex={0} row height={sizes.height * 0.06} radius={14} bgcolor={colors.grey300}>
            <Button
              bgcolor={currentStepTicket === 0 ? colors.fourthMain : "transparent"}
              width={"50%"}
              radius={14}
              onPress={() => setCurrentStepTicket(0)}
            >
              <Text bold h8 color={currentStepTicket === 0 ? colors.white : colors.black}>
                Tickets
              </Text>
            </Button>

            <Button
              bgcolor={currentStepTicket === 1 ? colors.primaryMain : "transparent"}
              width={"50%"}
              radius={14}
              onPress={() => {
                setCurrentStepTicket(1),
                  currentStep === 0 && setCurrentStep(1)
              }}
            >
              <Text bold h8 color={currentStepTicket === 1 ? colors.white : colors.black}>
                Fastpass
              </Text>
            </Button>
          </Block>

          {!queryPurchaseTicketAllLoading && currentStepTicket === 0 ? (
            <Block marginTop={20}>
              <FlatList
                data={filteredOrderId}
                renderItem={renderItemShowTickets}
                keyExtractor={(_, index) => String(index)}
                refreshControl={
                  <RefreshControl
                    refreshing={queryPurchaseTicketAllLoading}
                    onRefresh={onRefreshPurchaseTicket}
                  />
                }
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              />
            </Block>
          ) : queryPurchaseTicketAllLoading && (
            <Block align='center' justify='center'>
              <ActivityIndicator size={100} color={colors.secondary800} />
            </Block>
          )}

          {!queryFastpassAllLoading && currentStepTicket === 1 ? (
            <Block marginTop={20}>
              <FlatList
                data={fastpassData}
                renderItem={renderItemShowFastpass}
                keyExtractor={item => item.id}
                refreshControl={
                  <RefreshControl
                    refreshing={queryFastpassAllLoading}
                    onRefresh={onRefreshFastpass}
                  />
                }
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              />
            </Block>
          ) : queryFastpassAllLoading && (
            <Block align='center' justify='center'>
              <ActivityIndicator size={100} color={colors.secondary800} />
            </Block>
          )}


        </Block>


      </Block>
    </Block>
  )
}

export default HistoryPurchaseTicket