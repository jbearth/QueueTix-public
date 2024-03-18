import React, { memo } from 'react';

// material-ui
import { Box } from '@mui/material';

// project imports
import { StyledRootScrollbar, StyledScrollbar } from './stylesScrollbar';
import useResponsive from 'hooks/useResponsive';

// ----------------------------------------------------------------------

interface ScrollbarProps {
  sx?: object,
  children: React.ReactNode
};

function Scrollbar({ children, sx, ...other }: ScrollbarProps) {

  const isMobile = useResponsive('down', 'lg');

  if (isMobile) {
    return (
      <Box sx={{ overflowX: 'auto', ...sx }} {...other}>
        {children}
      </Box>
    );
  }

  return (
    <StyledRootScrollbar>
      <StyledScrollbar timeout={500} clickOnTrack={false} sx={sx} {...other}>
        {children}
      </StyledScrollbar>
    </StyledRootScrollbar>
  );
}

export default memo(Scrollbar);


// export const renderTrack = ({ style, ...props }: any) => {
//   const trackStyle = {
//     position: "absolute",
//     maxWidth: "100%",
//     width: 6,
//     transition: "opacity 200ms ease 0s",
//     opacity: 0,
//     background: "transparent",
//     bottom: 2,
//     top: 2,
//     borderRadius: 3,
//     right: 0,
//   };
//   return <div style={{ ...style, ...trackStyle }} {...props} />;
// };
// export const renderThumb = ({ style, ...props }: any) => {
//   const thumbStyle = {
//     borderRadius: 15,
//     background: "rgba(222, 222, 222, .1)",
//   };
//   return <div style={{ ...style, ...thumbStyle }} {...props} />;
// };
// export const renderView = ({ style, ...props }: any) => {
//   const viewStyle = {
//     marginBottom: -22,
//   };
//   return (
//     <Box
//       // sx={{ base: "0px !important", lg: "-16px !important" }}
//       sx={{ ...style, ...viewStyle }}
//       {...props}
//     />
//   );
// };