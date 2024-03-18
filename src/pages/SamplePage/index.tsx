import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// material-ui
import { Box, Button, Typography } from '@mui/material';

import { useQuery, gql, useMutation } from "@apollo/client";

// project imports
import MainCard from 'components/cards/MainCard';


// ==============================|| SAMPLE PAGE ||============================== //

const QRCODE_PAYMENT = gql`
  query Query($amount: String!, $verify: Boolean!) {
    QRCodePayment(Amount: $amount, Verify: $verify) {
      success {
        message
      }
      error {
        message
      }
      data
    }
  }
`;

const SamplePage = () => {
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState<string | null>(null);

  // Query
  // const {
  //   loading: queryLoading,
  //   error: queryError,
  //   data: queryData,
  //   refetch
  // } = useQuery(QRCODE_PAYMENT, {
  //   variables: {
  //     amount: "8000",
  //     verify: false
  //   }
  // });

  // if (queryLoading) return "loading...";
  // if (queryError) {
  //   return `Error! ${queryError.message}`
  // };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
  };
  // console.log(queryData.QRCodePayment.data)

  return (
    <MainCard content contentSX={{ bgcolor: 'red' }}>
      {/* <img src={`data:image/png;base64,${queryData.QRCodePayment.data}`} alt="qrcode" /> */}
    </MainCard>
  );
}

export default SamplePage;
