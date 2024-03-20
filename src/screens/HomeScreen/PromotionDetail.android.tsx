import React from 'react';

// project imports
import { useTheme, useTranslation } from '../../hooks';
import { Block, Image, Text } from '../../components';

const PromotionDetail = ({ route }: any) => {
  const { t } = useTranslation();

  const { assets, colors, sizes } = useTheme();

  return (
    // <Block width={sizes.width * 0.9}>
    <Block width={sizes.width} scroll hiddenScrollIndicator={false} bgcolor={colors.white}>
      <Image
        source={{ uri: route.params.picture }}
        width={sizes.width * 0.8}
        height={sizes.height * 0.4}
        marginTop={10}
        resizeMode='contain'
        style={{ alignSelf: 'center' }}
      />
      <Block
        marginTop={10}
        width={sizes.width * 0.85}
        style={{ alignSelf: 'center' }}
      >
        <Text
          bold
          h8
        >
          {route.params.title}
        </Text>
        <Block width={"75%"} height={5} radius={10} marginBottom={5} bgcolor={colors.fourth400} />
        <Text
          h10
          lineHeight={25}
        >
          {route.params.description}
        </Text>
      </Block>
    </Block>
    // </Block >
  )
}

export default PromotionDetail