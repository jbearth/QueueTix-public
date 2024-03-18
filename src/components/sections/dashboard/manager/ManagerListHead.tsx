import React from 'react';

// material-ui
import {
  Checkbox,
  TableRow,
  TableCell,
  TableHead,
  TableSortLabel,
  Typography,
  Tooltip,
  IconButton
} from '@mui/material';

// project imports
import Iconify from 'components/iconify';

// ----------------------------------------------------------------------

export interface DataUserLists {
  id: string,
  avatarUrl: string,
  name: string,
  email: string,
  role: string
}

interface EmployeeListHeadProps {
  theme: any,
  order: any,
  orderBy: string,
  rowCount: number,
  headLabel: readonly any[],
  numSelected: number,
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof DataUserLists) => void,
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void,
};

export default function EmployeeListHead(props: EmployeeListHeadProps) {
  const {
    theme,
    order,
    orderBy,
    rowCount,
    headLabel,
    numSelected,
    onRequestSort,
    onSelectAllClick
  } = props;

  const createSortHandler = (
    property: keyof DataUserLists
  ) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead >
      <TableRow>
        <TableCell
          padding="checkbox"
          sx={{
            bgcolor: numSelected > 0 ? theme.palette.primary[100] : theme.palette.grey[200],
            paddingRight: 1
          }}
        >
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headLabel.map((headCell, index) => (
          numSelected > 0 ? (
            <TableCell
              key={headCell.id}
              align={headCell.alignRight}
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{ bgcolor: theme.palette.primary[100] }}
            >
              {index === 0 ? (
                <Typography
                  component="div"
                  variant="h5"
                  color={theme.palette.primary.main}
                  fontFamily={'Sarabun-SemiBold'}
                >
                  {numSelected} selected
                </Typography>
              ) : (headLabel.length - 1 === index &&
                <Tooltip title="Delete" sx={{ padding: 0 }}>
                  <IconButton color='primary'>
                    <Iconify icon="solar:trash-bin-trash-bold-duotone" width={25} />
                  </IconButton>
                </Tooltip>
              )}
            </TableCell>
          ) : (
            <TableCell
              key={headCell.id}
              align={headCell.alignRight}
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{ bgcolor: theme.palette.grey[200] }}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                sx={{ fontFamily: 'Sarabun-SemiBold' }}
              >
                {headCell.label}
              </TableSortLabel>
            </TableCell>
          )
        ))}
      </TableRow>
    </TableHead>
  );
}
