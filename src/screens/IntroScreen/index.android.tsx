import React, { useState } from "react";

import { Block, Button, Image, Text } from "@src/components";

import { useNavigation } from "@react-navigation/native";
import { useTheme } from '@src/hooks';
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

const Introscreens = () => {
  const navigation: any = useNavigation();
  const { assets, sizes, colors, fonts } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  const [steps] = useState([
    {
      id: "1",
      bgcolor: colors.tertiaryMain,
      image: assets.intro1,
      title: "Buy a Ticket",
      description: "คุณสามารถซื้อตั๋วและเลือกประเภทตั๋วได้ตามที่คุณต้องการ",
    },
    {
      id: "2",
      bgcolor: colors.fourthMain,
      image: assets.intro2,
      title: "Reserve FastPass",
      description: "FastPass จะช่วยให้คุณลดระยะเวลาในการรอคิวที่จะช่วยให้คุณได้รับประสบการณ์กาารเล่นและได้เล่นเครื่องเล่นครบทุกเครื่องเล่น",
    },
    {
      id: "3",
      bgcolor: colors.primaryMain,
      image: assets.intro3,
      title: "Notification",
      description: "การแจ้งเตือนที่จะช่วยให้เตือนคุณเมื่อใกล้ถึงคิวของคุณที่จองบัตร fastpass ไว้",
    },
    {
      id: "4",
      bgcolor: colors.secondaryMain,
      image: assets.intro4,
      title: "Payment",
      description: "สแกน QR Code พร้อมเพย์ และมีการยืนยันการชำระเงินอัตโนมัติ",
    }
  ])

  // const resetSteps = () => {
  //   setCurrentStep(0)
  // }

  const nextStep = () => {
    currentStep === 3 ?
      navigation.navigate('Signin')
      :
      setCurrentStep(currentStep + 1)
  }

  return (
    <Block
      bgcolor={steps[currentStep].bgcolor}
      flex={1}
      align="center"
    >

      <Block safe flex={0} align="center">
        <Text
          black
          h1
          lineHeight={90}
          font={"Galada-Regular"}
        >
          QueueTix
        </Text>
        <Image
          width={sizes.width}
          height={sizes.height * 0.38}
          style={{ resizeMode: 'contain' }}
          source={steps[currentStep].image}
        />
      </Block>


      <Block
        card
        top={20}
        width={sizes.width}
        align="center"
        justify="space-around"
        style={{
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
        }}
      >
        <Block align="center">
          <Block flex={0} row marginTop={30}>
            {steps.map((step, index) => {
              return (
                <Block
                  key={step.id}
                  flex={0}
                  style={
                    {
                      height: 8,
                      marginHorizontal: 8,
                      borderRadius: 10,
                      width: currentStep === index ? 25 : 7,
                      backgroundColor: currentStep === index ? steps[currentStep].bgcolor : "#CED1D6"
                    }
                  }
                />
              )
            })}
          </Block>

          <Text
            black
            h3
            marginVertical={20}
          >
            {steps[currentStep].title}
          </Text>
          <Text
            black
            h8
            align="center"
            paddingHorizontal={30}
          >
            {steps[currentStep].description}
          </Text>
        </Block>

        <Button
          onPress={() => nextStep()}
          row
          white
          width={80}
          height={80}
          marginBottom={50}
          radius={50}
          bgcolor={steps[currentStep].bgcolor}
        >
          <Ionicons name="arrow-forward-outline" size={50} color={"white"} />
        </Button>

      </Block>

    </Block >
  )
}

export default Introscreens