import React, { useEffect, useState } from 'react'
import { Text } from '@src/components';

const CounttTime = ({
  calFetchData
}: any) => {
  const [countdown, setCountdown] = useState<number>(600); // 10 minutes in seconds

  useEffect(() => {
    // let countdownInterval: any;
    // let actionInterval: any;

    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
      if (countdown % 3 == 0) {
        console.log("show every 3 seconds")
        calFetchData();
      }
    }, 1000);

    // Clean up the interval when the component unmounts or when countdown reaches zero
    return () => {
      clearInterval(countdownInterval);
    };
  }, [countdown, calFetchData]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <Text bold h9 primary>{formatTime(countdown)} นาที</Text>
  )
}

export default CounttTime