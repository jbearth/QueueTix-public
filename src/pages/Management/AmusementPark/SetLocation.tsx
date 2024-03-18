import React from 'react'

// material-ui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
  Box,
} from '@mui/material';

// thirds-party
import { Helmet } from 'react-helmet-async';
import { useQuery, gql, useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';

// project imports
import Label from 'components/label';
import Iconify from 'components/iconify';
import MainCard from 'components/cards/MainCard';
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import GoogleMaps from './GoogleMaps';


const SetLocation = () => {
  return (
    <>
      <Helmet>
        <title> Edit Rides | Management </title>
      </Helmet>

      <Stack direction={{ sm: "column", md: "row" }} mt={8} gap={5} justifyContent={"center"}>
        <MainCard
          sx={{
            p: 3,
            pb: 0,
            bgcolor: "#fff",
            width: '100%',
            maxWidth: 800,
            minHeight: { xs: 380, md: 450 },
            maxHeight: { xs: 440, md: 500 },
            borderRadius: 10
          }}
        >
          <GoogleMaps />
        </MainCard>
      </Stack>
    </>
  )
}

export default SetLocation