import React, { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/core';

// thirds-party
import { gql, useMutation, useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// project imports
import { useData, useTheme } from '@src/hooks';
import { Block, Button, Image, Modal, Text, Iconify } from '@src/components';
import { addToBooking, removeToBooking, removeToBookingAll } from '@src/hooks/myActions';
import { ticketColor } from '@src/constants/mocks';

type SelectIdsProps = {
  id_purchasetickettypes: string;
  orderId: string;
}

const GETPURCHASETICKET = gql`
  query GetPurchaseTicket($email: String!) {
    getPurchaseTicket(email: $email) {
      id
      orderId
      types
      dateofuse
      ticket {
        title
      }
      purchasetickettypes {
        id
        types
        amount
        price
        statusTicket
        ticketforentrance {
          statusEntrance
        }
      }
      amusementpark {
        name
      }
    }
  }
`;

async function getUserEmail() {
  const jsonValue = await AsyncStorage.getItem("user");
  // console.log(jsonValue)
  return jsonValue ? JSON.parse(jsonValue).email : null;
};
async function getAmusementParkId() {
  const amusementparkid = await AsyncStorage.getItem("amusementparkIds");
  // console.log(jsonValue)
  return amusementparkid ? amusementparkid : ""
};

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
const day = String(today.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;

const ShowFastpassToUse = ({ route }: any) => {
  const { state, dispatch }: any = useData();
  const { colors, sizes, icons } = useTheme();
  // const { id_amusementpark, name } = route?.params;
  const navigation: { navigate: (arg0: string, arg1?: any) => void } = useNavigation();
  const [userEmail, setUserEmail] = useState("");
  const [amusementParkId, setAmusementParkId] = useState("");
  const [selectedIds, setSelectedIds] = useState<SelectIdsProps[]>([]);

  const addBookingFastpass = (booking: any) => {
    dispatch(addToBooking(booking));
  }
  const removeBookingFastpass = (booking: any) => {
    dispatch(removeToBooking(booking));
  }

  React.useMemo(async () => {
    // console.log("getEmail");
    const email = await getUserEmail();
    const amusementparkid = await getAmusementParkId();
    setUserEmail(email)
    // console.log(amusementparkid)
    setAmusementParkId(amusementparkid)
    dispatch(removeToBookingAll())
  }, [])

  const {
    loading: queryPurchaseTicketAllLoading,
    error: queryPurchaseTicketAllError,
    data: queryPurchaseTicketAllData,
    refetch: refetchPurchaseTicketAll
  } = useQuery(GETPURCHASETICKET, {
    variables: { email: userEmail },
  });

  React.useEffect(() => {
    onRefreshPurchaseTicket()
  }, [])



  const onRefreshPurchaseTicket = () => {
    console.log("Test")
    // ใช้ฟังก์ชันการดึงข้อมูลจาก useQuery เพื่อดึงข้อมูลอีกครั้ง
    refetchPurchaseTicketAll();
  };

  if (queryPurchaseTicketAllError) {
    return <Text margin={50} bold h7>เกิดข้อผิดพลาดทางระบบเซิร์ฟเวอร์ !!</Text>
  }

  let purchaseTicketFilteredData: any = [];

  if (!queryPurchaseTicketAllLoading) {
    // กรองเฉพาะตั๋วประเภท SuperVisa
    purchaseTicketFilteredData = queryPurchaseTicketAllData?.getPurchaseTicket.filter((item: any) => item.types === "SuperVisa");
  }

  const toggleSelect = (id: string, orderId: string) => {
    if (selectedIds.some((item) => item?.orderId !== orderId)) {
      ToastAndroid.showWithGravity(
        "กรุณาเลือกตั๋วที่จะใช้ใน Order เดียวกัน",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      )
    } else if (selectedIds.some((item) => item?.id_purchasetickettypes === id)) {
      console.log("del")

      // ถ้าตั๋วถูกเลือกไว้แล้ว ก็จะลบตั๋วที่เลือกออก
      setSelectedIds(selectedIds.filter((itemId) => itemId?.id_purchasetickettypes !== id));
      removeBookingFastpass({
        id_purchasetickettypes: id
      })
    } else {
      console.log("add")
      // ถ้าตั๋วยังไม่ถูกเลือก ก็จะเพิ่มตั๋วที่เลือกไป
      setSelectedIds((prevData) => [...prevData, { id_purchasetickettypes: id, orderId: orderId }]);
      addBookingFastpass({
        id_amusementpark: state?.amusementparkId,
        id_purchasetickettypes: id,
      })
    }

  };

  const renderItemTicketsSuperVisa = (itemFromParent: any, indexFromParent: number) => ({ item, index }: any) => {
    const statusEntrance = item.ticketforentrance?.some((item: any) => item?.statusEntrance === 0)
    // console.log("statusEntrance: ", statusEntrance)

    return String(itemFromParent.dateofuse).split("T")[0] === formattedDate && statusEntrance ? (
      <Button
        row
        marginBottom={20}
        padding={10}
        radius={15}
        height={sizes.height * 0.15}
        justify='space-between'
        bgcolor={colors[`${ticketColor[3]}200`]}
        style={{
          borderWidth: 2
        }}
        onPress={() => toggleSelect(item.id, purchaseTicketFilteredData[indexFromParent]?.orderId)}
      >
        <Block flex={0}>
          <Text h9 bold>Amusement park: <Text h10>{"\t"}{purchaseTicketFilteredData[0].amusementpark.name}</Text></Text>
          <Text h9 bold>Order Id: <Text h10>{"\t"}{purchaseTicketFilteredData[indexFromParent]?.orderId}</Text></Text>
          <Text h9 bold>Types of ticket: <Text h10>{"\t"}{purchaseTicketFilteredData[indexFromParent].ticket?.title}</Text></Text>
        </Block>
        <Block flex={0} width={sizes.width * 0.1} height={sizes.height * 0.05}>
          <Iconify
            IconUri={selectedIds.some((itemSelectedIds) => itemSelectedIds?.id_purchasetickettypes === item.id) ? icons.check_box : icons.check_box_blank}
            IconWidth={"100%"}
            IconHeight={"100%"}
            IconColors={colors.white}
          />
        </Block>
      </Button>
    ) : (<></>)
  }
  let countOrder = 0
  let countprevOrder = 0
  let prevOrder = "";
  const renderItemPurchaseTicketTypes = ({ item, index }: any) => {
    // console.log(String(item.dateofuse).split("T")[0] === formattedDate)
    if (String(item.dateofuse).split("T")[0] === formattedDate) {
      // console.log("test")
      if (prevOrder === "") {
        countOrder = countOrder + 1
        countprevOrder = countOrder
        prevOrder = item.orderId
      } else if (prevOrder !== item.orderId) {
        countprevOrder = countOrder + 1
        prevOrder = item.orderId
      } else {
        countOrder = countOrder + 1
      }
    }
    return String(item.dateofuse).split("T")[0] === formattedDate ? (
      <Block flex={0}>
        {prevOrder === item.orderId && countprevOrder === countOrder && <Block flex={0} row align='center' marginBottom={20}>
          <Block flex={0} width={"40%"} height={3} bgcolor={colors.black} />
          <Text bold secondary marginHorizontal={5}>Order at {countOrder}</Text>
          <Block flex={0} width={"40%"} height={3} bgcolor={colors.black} />
        </Block>}
        <FlatList
          data={item.purchasetickettypes}
          renderItem={renderItemTicketsSuperVisa(item, index)}
          keyExtractor={itemkey => itemkey.id}
          extraData={selectedIds}
          scrollEnabled={false}
          refreshControl={
            <RefreshControl
              refreshing={queryPurchaseTicketAllLoading}
              onRefresh={onRefreshPurchaseTicket}
            />
          }
        />
      </Block >
    ) : (<></>)
  }

  return (
    <Block width={sizes.width} bgcolor={colors.white}>
      <Block width={sizes.width * 0.9} style={{ alignItems: 'center', alignSelf: 'center' }}>

        <Block flex={0} marginTop={50}>
          <Text bold h6 lineHeight={30} center>Select Your Ticket</Text>
          <Text bold h9 center>to booking fastpass</Text>
        </Block>

        <Block flex={0} width={sizes.width * 0.9} height={sizes.height * 0.8}>
          {!queryPurchaseTicketAllLoading ? (
            <FlatList
              data={purchaseTicketFilteredData}
              renderItem={renderItemPurchaseTicketTypes}
              keyExtractor={item => item.id}
              refreshControl={
                <RefreshControl
                  refreshing={queryPurchaseTicketAllLoading}
                  onRefresh={onRefreshPurchaseTicket}
                />
              }
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <ActivityIndicator size={100} color={colors.secondary800} />
          )}

          {selectedIds.length > 0 ?
            <Button
              marginVertical={8}
              width={sizes.width * 0.8}
              height={sizes.height * 0.08}
              bgcolor={colors.tertiary400}
              radius={25}
              style={{
                alignSelf: 'center',
                borderWidth: 2
              }}
              onPress={() => navigation.navigate("SelectRidesForFastpass", {
                user_email: userEmail,
                id_amusementpark: amusementParkId,
                amusementparkname: route.params?.name,
              })}
            >
              <Text bold h7 white>Next</Text>
            </Button> : <Block flex={0} bgcolor={colors.black} height={0} />}
        </Block>

      </Block>
    </Block>
  )
}

export default ShowFastpassToUse