import React from 'react';
import { Block } from '@src/components';
import { useNavigation } from '@react-navigation/core';
// import loading from '../assets/img/loading.json'
import loadingpercet from '@src/assets/images/animation/laodingpercent.json'

import Lottie from 'lottie-react-native';

const SplashScreen = () => {
  const navigation = useNavigation();
  return (
    <Block flex={1}>
      {/* <Box flex={3}>
            <Lottie 
                source={loading}
                autoPlay 
                loop={true}
                speed={1}
                renderMode={'AUTOMATIC'}
            />
            </Box> */}
      <Block flex={1}>
        <Lottie
          source={loadingpercet}
          autoPlay
          loop={false}
          speed={2}
          style={{ marginTop: 10 }}
        // onAnimationFinish={() => navigation.replace('IntroScreen')}
        />
      </Block>
    </Block>

  )
}

export default SplashScreen