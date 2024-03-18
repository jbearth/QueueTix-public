import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import MainCard from 'components/cards/MainCard';

const CardWarpperStyled: any = styled(MainCard)(({ theme }: any) => ({
  backgroundColor: theme.palette.background.paper,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: 20,
  boxShadow: `0px 0px 15px 1px ${theme.palette.grey[100]}`,
  '&>div': {
    position: 'relative',
    zIndex: 5
  },
}));

type MyProps = {
  children: React.ReactNode;
  content: boolean;
};

const CardWarpper: React.FC<MyProps> = ({ children, content }) => {
  return (
    <CardWarpperStyled content={content}>
      <Box sx={{ px: 3.25, py: 3 }}>
        {children}
      </Box>
    </CardWarpperStyled>
  )
}

export default CardWarpper;