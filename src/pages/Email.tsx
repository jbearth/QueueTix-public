import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const Email = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 10,
        width: '100vw',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Box
        position={'absolute'}
        marginBottom={'20%'}
      >
        <Typography fontSize={100} fontFamily={'monospace'}>
          404
        </Typography>
      </Box>
      <img src={'https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif'} alt="404" />
      <Box
        position={'absolute'}
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        marginTop={'30%'}
      >

        <Typography fontSize={34} fontFamily={'Sarabun-SemiBold'}>
          Look like you're lost
        </Typography>

        <Typography marginTop={'5px'} marginBottom={5} variant='h5' fontFamily={'monospace'}>
          the page you are looking for not avaible!
        </Typography>

        <Button sx={{ bgcolor: 'limegreen', paddingX: '15px', paddingY: '8px', width: 'auto' }}>
          <Typography variant="h5" color={'white'}>Go Home</Typography>
        </Button>
      </Box>
    </Box>
  )
}

export default Email;