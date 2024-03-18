import React, { forwardRef } from 'react';
// material-ui
import { Box, SxProps } from '@mui/material';
// thirds-party
import { Icon, IconifyIcon } from '@iconify/react';

// ----------------------------------------------------------------------

interface IconifyProps {
  icon: IconifyIcon | string,
  color?: string,
  width?: number | string,
  sx?: SxProps
}

const Iconify = forwardRef(
  (
    {
      icon = "",
      color = "#aaa",
      width = 20,
      sx = {},
      ...other
    }: IconifyProps,
    ref
  ) => (
    <Box ref={ref} component={Icon} icon={icon} sx={{ width, height: width, color, ...sx }} {...other} />
  ));

export default Iconify;
