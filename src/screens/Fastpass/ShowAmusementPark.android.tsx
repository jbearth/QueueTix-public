import React, { useState } from 'react';
import { ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/core';

// thirds-party
import { gql, useQuery } from '@apollo/client';

// project imports
import { useTheme } from '@src/hooks';
import { Block, Button, Image, Modal, Text, Iconify } from '@src/components';

const GETAMUSEMENTSTICKETALL = gql`
  query GetAmusementParkAll {
    GetAmusementParkAll {
      id
      name
      picture
      amusementparkmaps {
        city
        country
      }
    }
  }
`;

const ShowAmusementPark = () => {
  const { colors, sizes, icons } = useTheme();
  const navigation: { navigate: (arg0: string, arg1?: any) => void } = useNavigation();

  const {
    loading: queryAmusementLoading,
    error: queryAmusementError,
    data: queryAmusementData,
    refetch: refetchAmusementData
  } = useQuery(GETAMUSEMENTSTICKETALL);

  if (queryAmusementError) {
    return <Text margin={50} bold h7>เกิดข้อผิดพลาดทางระบบเซิร์ฟเวอร์ !!</Text>
  }

  const onRefreshAmusementData = () => {
    // ใช้ฟังก์ชันการดึงข้อมูลจาก useQuery เพื่อดึงข้อมูลอีกครั้ง
    refetchAmusementData();
  };

  return (
    <Block width={sizes.width} bgcolor={colors.white}>
      <Block width={sizes.width * 0.9} safe style={{ alignSelf: 'center' }}>

        <Block flex={0} marginVertical={20}>
          <Text bold h6 center>Select Amusement Park</Text>
        </Block>


        <Block
          flex={0}
          scroll
          hiddenScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={queryAmusementLoading}
              onRefresh={onRefreshAmusementData}
            />
          }
        >
          {!queryAmusementLoading ? (
            queryAmusementData.GetAmusementParkAll?.map((item: any) => (
              <Block flex={0} key={item.id}>
                <Button
                  row
                  flex={0}
                  marginTop={15}
                  style={{
                    width: sizes.width * 0.9,
                    height: sizes.height * 0.18,
                    borderRadius: 25,
                    borderWidth: 3,
                    borderColor: colors.black,
                  }}
                  onPress={() => navigation.navigate("ShowFastpassToUse", {
                    id_amusementpark: item?.id,
                    name: item?.name,
                  })}
                >
                  <Image
                    radius={0}
                    style={{
                      width: '50%',
                      height: '100%',
                      resizeMode: "cover",
                      borderTopLeftRadius: 22,
                      borderBottomLeftRadius: 22
                    }}
                    alt='banner'
                    source={{ uri: item.picture }}
                  />
                  <Block
                    padding={8}
                    height={sizes.height * 0.18}
                    justify='space-between'
                    style={{
                      borderTopRightRadius: 22,
                      borderBottomRightRadius: 22,
                    }}
                  >
                    <Text
                      h9
                      black
                      bold
                    >
                      {item.name}
                    </Text>
                    <Text
                      h11
                      black
                    >
                      สถานที่:{'\n'}
                      {item.amusementparkmaps.country}, {item.amusementparkmaps.city}
                    </Text>
                  </Block>
                </Button>
              </Block>
            ))
          ) : (
            <ActivityIndicator size={100} color={colors.secondary800} />
          )}
        </Block>
      </Block>
    </Block>
  )
}

export default ShowAmusementPark