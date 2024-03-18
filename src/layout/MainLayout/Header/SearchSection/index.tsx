import React, { useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Card, Grid, InputAdornment, OutlinedInput, Popper, IconButton, Typography } from '@mui/material';

// third-party
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

// project imports
import Transitions from 'components/extended/Transitions';

// assets
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons-react';
import { Icon } from '@iconify/react';
// import { shouldForwardProp } from '@mui/system';

// styles
// const PopperStyle = styled(Popper, { shouldForwardProp })(({ theme }) => ({
//   zIndex: 1100,
//   width: '99%',
//   top: '-55px !important',
//   padding: '0 12px',
//   [theme.breakpoints.down('sm')]: {
//     padding: '0 10px'
//   }
// }));

// const IconButtonStyle = styled(IconButton, { shouldForwardProp })(({ theme }) => ({
//   width: 50,
//   // marginLeft: 16,
//   borderRadius: '50%',
//   [theme.breakpoints.down('md')]: {
//     width: '100%',
//     marginLeft: 4,
//     background: '#fff'
//   }
// }));

// const HeaderAvatarStyle = styled(Avatar, { shouldForwardProp })(({ theme }) => ({
//   ...theme.typography.commonAvatar,
//   ...theme.typography.mediumAvatar,
//   background: theme.palette.secondary.light,
//   color: theme.palette.secondary.dark,
//   '&:hover': {
//     background: theme.palette.secondary.dark,
//     color: theme.palette.secondary.light
//   }
// }));

// ==============================|| SEARCH INPUT - MOBILE||============================== //

type PopupState = any

interface MobileSearchProps {
  value: string,
  setValue: Function,
  popupState: PopupState
}
// const MobileSearch = ({ value, setValue, popupState }: MobileSearchProps) => {
//   const theme = useTheme();

//   return (
//     <OutlineInputStyle
//       id="input-search-header"
//       value={value}
//       onChange={(e) => setValue(e.target.value)}
//       placeholder="Search"
//       startAdornment={
//         <InputAdornment position="start">
//           <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
//         </InputAdornment>
//       }
//       endAdornment={
//         <InputAdornment position="end">
//           <ButtonBase sx={{ borderRadius: '12px' }}>
//             <HeaderAvatarStyle variant="rounded">
//               <IconAdjustmentsHorizontal stroke={1.5} size="1.3rem" />
//             </HeaderAvatarStyle>
//           </ButtonBase>
//           <Box sx={{ ml: 2 }}>
//             <ButtonBase sx={{ borderRadius: '12px' }}>
//               <Avatar
//                 variant="rounded"
//                 sx={{
//                   ...theme.typography.commonAvatar,
//                   ...theme.typography.mediumAvatar,
//                   background: theme.palette.orange.light,
//                   color: theme.palette.orange.dark,
//                   '&:hover': {
//                     background: theme.palette.orange.dark,
//                     color: theme.palette.orange.light
//                   }
//                 }}
//                 {...bindToggle(popupState)}
//               >
//                 <IconX stroke={1.5} size="1.3rem" />
//               </Avatar>
//             </ButtonBase>
//           </Box>
//         </InputAdornment>
//       }
//       aria-describedby="search-helper-text"
//       inputProps={{ 'aria-label': 'weight' }}
//     />
//   );
// };

// ==============================|| SEARCH INPUT ||============================== //

const SearchSection = () => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          display: 'inline-flex',
          // display: { xs: 'none', md: 'inline-flex' },
          alignItems: 'center',
        }}
      >
        <IconButton aria-label="delete">
          <Icon icon={"eva:search-fill"} width={25} height={25} />
        </IconButton>
        <Typography
          variant={"h4"}
          sx={{
            color: theme.palette.grey[400],
            ml: 1,
            cursor: 'pointer',
            display: { xs: 'none', sm: 'block' }
          }}
        >
          Search (Ctrl+/)
        </Typography>
      </Box>
    </>
  );
};

export default SearchSection;
