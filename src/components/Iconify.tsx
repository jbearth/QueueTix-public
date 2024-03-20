import React from 'react'

// thirds-party
import { SvgUri } from 'react-native-svg'

// project imports
import { IIconifyProps } from '@src/constants/types'
import Block from './Block'

const Iconify = ({
  style,
  IconUri,
  IconWidth,
  IconHeight,
  IconColors,
  IconColorDuotone,
  IconColorStroke
}: IIconifyProps) => {
  return (
    <Block flex={0} style={style}>
      {IconColorDuotone ? (
        <SvgUri
          uri={IconUri + `?color=%23${String(IconColorDuotone).slice(1)}`}
          width={IconWidth}
          height={IconHeight}
          color={IconColors}
          stroke={IconColorStroke}
        />
      ) : (
        <SvgUri
          uri={IconUri}
          width={IconWidth}
          height={IconHeight}
          color={IconColors}
          stroke={IconColorStroke}
        />
      )}
    </Block>
  )
}

export default React.memo(Iconify);