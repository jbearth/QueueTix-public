import React, { useState } from 'react';
import {
  CssBaseline,
  Box,
  Button,
  // Image
} from '@mui/material';
import {
  Post,
  // Product,
} from '../components';
import RefreshAccessToken from '../components/RefreshToken/RefreshAccessToken';

import Navbar from 'layout/MainLayout/Header';
import Sidebar from 'layout/MainLayout/Sidebar';
import MainLayout from 'layout/MainLayout';


export default function Home() {
  return (
    <Box sx={{ backgroundColor: '#F4F5FA' }}>
      <RefreshAccessToken />
      <MainLayout />
      {/* <Post /> */}
    </Box>
  );
}