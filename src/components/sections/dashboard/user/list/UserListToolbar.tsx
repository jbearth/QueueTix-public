import React from 'react';

// material-ui
import { styled, alpha } from '@mui/material/styles';
import {
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
  Stack,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  SelectChangeEvent,
  Paper,
  Chip,
} from '@mui/material';

// project imports
import Iconify from 'components/iconify';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  display: 'block',
  padding: theme.spacing(3, 1, 3, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: '100%',
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    boxShadow: theme.palette.customShadow,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

interface UserListToolbarProps {
  theme?: any,
  numSelected: number,
  filterSearch: string,
  onFilterSearch: any,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

export default function UserListToolbar(
  {
    theme,
    numSelected,
    filterSearch,
    onFilterSearch,
  }: UserListToolbarProps
) {


  return (
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
        }),
        bgcolor: '#fff'
      }}
    >
      <Stack direction={'column'}>
        <Stack direction={'row'} alignItems={'center'} gap={2}>

          {/* ค้นหาชื่อหรืออีเมลข้อมูลผู้ใช้ */}
          <StyledSearch
            value={filterSearch}
            onChange={onFilterSearch}
            placeholder="Search user..."
            sx={{ borderRadius: 3 }}
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" width={20} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
          />
        </Stack>
      </Stack>
    </StyledRoot >
  );
}
