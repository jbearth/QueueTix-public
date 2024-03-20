import React, { useEffect, useState } from 'react'
import { Text } from '@src/components';

const CountTimeOfFastpass = ({ handleShowQRFastpass }: any) => {
  const [countdown, setCountdown] = useState(60); // 1 minutes in seconds
  // let countdownInterval: any;

  useEffect(() => {
    let countdownInterval: any;

    if (countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else {
      // Countdown has reached zero, perform necessary actions here
      clearInterval(countdownInterval);
      handleShowQRFastpass(false);
    }

    // Clean up the interval when the component unmounts or when countdown reaches zero
    return () => {
      clearInterval(countdownInterval);
    };
  }, [countdown, handleShowQRFastpass]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <Text primary>
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </Text>
  )
}

export default CountTimeOfFastpass