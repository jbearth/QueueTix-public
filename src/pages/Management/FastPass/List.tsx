import React, { useState } from 'react';

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
import { sentenceCase } from 'change-case';
import { useSelector } from 'react-redux';
import { useQuery, gql, useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import noDataForSerach from 'assets/img/illustrations/searching-data-3385493.png'

// project imports
import Label from 'components/label';
import Iconify from 'components/iconify';
import { UserListHead, UserListToolbar } from 'components/sections/dashboard/user/list';
import { IOSSwitch } from 'components/switch/iosSwitchStyle';
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { formatDateTime } from 'utils/convertDateAndTime';

// ----------------------------------------------------------------------

type AlignRight = 'left' | 'right' | 'center' | 'justify' | 'inherit';

interface TABLE_HEAD_PROPS {
  id?: string,
  label?: string,
  alignRight?: AlignRight
}

const TABLE_HEAD: readonly TABLE_HEAD_PROPS[] = [
  { id: 'orderid', label: 'Id Order', alignRight: 'left' },
  { id: 'starttime', label: 'Start Time', alignRight: 'left' },
  { id: 'endtime', label: 'End Time', alignRight: 'left' },
  { id: 'isused', label: 'Is Used', alignRight: 'left' },
  { id: 'action', label: 'Actions', alignRight: 'center' },
];

// ----------------------------------------------------------------------

type Order = 'asc' | 'desc';

type TableTicketProps = {
  id: string;
  orderId: never;
  startDateTime: any;
  endDateTime: any;
  isUsed: number;
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

type StateNavigateProps = {
  selectedRowId: string;
}

// ฟังก์ชันทำการเรียงตัวอักษร
function descendingComparator
  (
    a: any,
    b: any,
    orderBy: string | number
  ) {
  if ((a[orderBy] || b[orderBy]) === undefined) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
  } else {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
  }
  return 0;
}


// รับตัวเปรียบเทียบอักษร มากไปน้อย หรือ น้อยไปมาก
function getComparator(
  order: Order,
  orderBy: string,
): (
  a: { [x: string]: number },
  b: { [x: string]: number },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// ค้นหา ชื่อ หรือ อีเมลของผู้ใช้
function applySortFilter<T>(
  array: readonly any[],
  comparator: (a: T, b: T) => number,
  query: string,
) {
  const stabilizedThis = array?.slice()?.sort((a, b) => {
    const order = comparator(a, b);
    if (order !== 0) return order;
    return array.indexOf(a) - array.indexOf(b);
  });

  if (query) {
    return array.filter(
      (ticket) =>
        ticket.orderId.toLowerCase().includes(query.toLowerCase())
    );
  }
  return stabilizedThis;
}

const FastPassALL = gql`
   query GetFastpassAll2 {
    GetFastpassAll2 {
      id
      orderId
      startDateTime
      endDateTime
      isUsed
      purchasefastpassofrides {
        PurchaseTicketTypes {
          types
        }
      }
    }
  }
`;

// ==============================|| หน้า FASTPASS LISTS ||============================== //

export default function FastPassListPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(0);
  const [order, setOrder] = useState<Order>('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState<string>('title');
  const [filterSearch, setFilterSearch] = useState<string>('');
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [dense, setDense] = React.useState<boolean>(false);
  const [anchorElActions, setAnchorElActions] = React.useState<HTMLButtonElement | null>(null);
  const [stateNavigate, setStateNavigate] = useState<StateNavigateProps>({
    selectedRowId: ""
  });
  const drawerOpen = useSelector((state: any) => state.customization.opened);

  // Query
  const {
    loading: queryTicketAllLoading,
    error: queryTicketAllError,
    data: queryTicketAllData,
    refetch
  } = useQuery(FastPassALL);

  if (queryTicketAllLoading) {
    return (
      <Box display={"flex"} height={"100%"} justifyContent={'center'} alignItems={'center'} >
        <CircularProgress size={80} disableShrink />
      </Box >
    )
  }

  if (queryTicketAllError) {
    return `Error! ${queryTicketAllError.message}`
  };

  const updateSelectedState = (newRowId: string) => {
    setStateNavigate(prevState => ({
      ...prevState,
      selectedRowId: newRowId,
    }));
  };

  // Popper Actions & Export Table ------------------------------------------------------
  const handleOpenActions = (event: React.MouseEvent<HTMLButtonElement>, id: number | string) => {
    updateSelectedState(id.toString())
    setAnchorElActions(event.currentTarget);
  };

  const handleCloseActions = () => {
    setAnchorElActions(null);
  };

  const openActions = Boolean(anchorElActions);
  const idActions = openActions ? 'popover-actions' : undefined;
  // ------------------------------------------------------------------------------------

  // 
  const handleRequestSort = (_event: any, property: React.SetStateAction<string>) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // เลือก employee ทั้งหมด
  const handleSelectAllClick = (event: { target: { checked: any; }; }) => {
    if (event.target.checked) {
      const newSelecteds: any = queryTicketAllData.GetFastpassAll2.map((ticket: any) => ticket.title);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // ลบข้อมูลที่เลือก
  const handleDeleteRow = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      setAnchorElActions(null); // ปิด popover
      // await deleteRowTable({ variables: { deleteAccountId: stateNavigate.selectedRowId! } });
      await refetch();// ดึงข้อมูล query DELETE_ROW_TABLE ใหม่ หลังลบข้อมูลเสร็จ
    } catch (error) {
      // Handle error
      console.error('Error deleting row:', error);
    }
  }

  // เลือก employee ที่ต้องการ
  const handleClick = (_event: React.ChangeEvent<HTMLInputElement>, name: never) => {
    const selectedIndex = selected.indexOf(name); // คือการหาตำแหน่งที่เลือก
    let newSelected: never[] = [];

    if (selectedIndex === -1) { // เงื่อนไขคือ ถ้าตำแหน่งที่เลือกไม่มีข้อมูลใน state selected[]
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) { // เงื่อนไขคือ ถ้าตำแหน่งที่เลือก
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) { // เงื่อนไขคือ ถ้าตำแหน่งที่เลือกอยู่ตำแหน่งเดียวกับความยาวของ state selected[]
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) { // เงื่อนไขคือ ถ้าตำแหน่งที่เลือกมากกว่า 0
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  // ฟังก์ชันเปลี่ยนจำนวนหน้า ex. 1-10 > 11-20
  const handleChangePage = (_event: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  // ฟังก์ชันเปลี่ยนจำนวนแถวต่อ 1 หน้า
  const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterBySearch = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setPage(0);
    setFilterSearch(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - queryTicketAllData?.GetFastpassAll2?.length) : 0;


  const filteredRides = applySortFilter(queryTicketAllData.GetFastpassAll2, getComparator(order, orderBy), filterSearch)

  const isNotFound = !filteredRides?.length && !!filterSearch;

  // เปลี่ยนความหนาแน่นของ table
  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  // Tool การแบ่งหน้าตาราง
  function TablePaginationActions(props: TablePaginationActionsProps) {
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          <Iconify icon="fluent:arrow-previous-20-filled" />
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          <Iconify icon="material-symbols:chevron-left-rounded" />
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          <Iconify icon="material-symbols:chevron-right-rounded" />
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          <Iconify icon="fluent:arrow-next-20-filled" />
        </IconButton>
      </Box>
    );
  }

  return (
    <>
      {/* Hot Toaster popup */}
      <Toaster containerStyle={{ position: 'absolute' }} />

      {/* Title Tab on Web */}
      <Helmet>
        <title> List FastPass | Management </title>
      </Helmet>

      <Container maxWidth={drawerOpen ? "lg" : "xl"}>

        <Card
          sx={{
            borderRadius: 5,
            boxShadow: theme.palette.customShadow
          }}
        >

          {/* เครื่องมือจัดการ Table User Filter */}
          <UserListToolbar
            theme={theme}
            numSelected={selected.length}
            filterSearch={filterSearch}
            onFilterSearch={handleFilterBySearch}
          />

          {/* ตาราง User Lists */}
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 800, bgcolor: '#fff' }}
              aria-labelledby="Table title"
              size={dense ? 'small' : 'medium'}
            >
              {/* ส่วนหัวของแต่ละคอลัมน์ */}
              <UserListHead
                theme={theme}
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={queryTicketAllData.GetFastpassAll2?.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody sx={{ '& .Mui-selected': { bgcolor: theme.palette.primaryAlpha } }}>
                {filteredRides.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: TableTicketProps) => {
                  const { id, orderId, startDateTime, endDateTime, isUsed } = row;
                  // console.log(row.rides?.nameThai)
                  const selectedUser = selected.indexOf(orderId) !== -1;

                  return (
                    <TableRow
                      hover
                      key={id}
                      // tabIndex={-1}
                      role="checkbox"
                      selected={selectedUser}
                    >
                      {/* คอลัมน์ Checkbox */}
                      <TableCell padding="checkbox">
                        <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, orderId)} />
                      </TableCell>

                      {/* คอลัมน์ title */}
                      <TableCell scope="row" padding="none" sx={{ paddingLeft: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Stack>
                            <Typography variant="h6" noWrap>
                              {orderId}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>

                      {/* คอลัมน์ description */}
                      <TableCell align="left">
                        <Typography variant="h6" >
                          {formatDateTime(startDateTime, "DD/", "MM/", "YYYY ")}
                        </Typography>
                      </TableCell>

                      {/* คอลัมน์ types */}
                      <TableCell align="left" sx={{ paddingLeft: 1.8 }}>
                        <Stack direction={'row'} alignItems={'center'}>
                          {formatDateTime(endDateTime, "DD/", "MM/", "YYYY ")}
                        </Stack>
                      </TableCell>

                      {/* คอลัมน์ priceofchild */}
                      <TableCell align="left">
                        <Label color={"successCustom"}
                        >
                          {isUsed}
                        </Label>
                      </TableCell>

                      {/* คอลัมน์  Actions */}
                      <TableCell align="center" sx={{ paddingRight: 5 }}>
                        <IconButton
                          aria-describedby={idActions}
                          size="large"
                          color="inherit"
                          onClick={(e) => handleOpenActions(e, id)}
                        >
                          <Iconify icon={'eva:more-vertical-fill'} />
                        </IconButton>
                      </TableCell>

                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>

              {/* ถ้าค้นหาผู้ใช้แล้วไม่พบข้อมูลจะแสดงโค้ดส่วนนี้ */}
              {isNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
                      <Paper sx={{ py: 5 }}>
                        <img
                          src={noDataForSerach}
                          alt="noDataForSearch"
                          width={400}
                          height={300}
                          style={{
                            filter: 'grayscale(100%)'
                          }}
                        />
                        <Typography
                          variant="h3"
                          paragraph
                          fontFamily={'Sarabun-Bold'}
                          color={theme.palette.grey[500]}
                        >
                          No Data
                        </Typography>
                      </Paper>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>

          <Stack
            width={'100%'}
            direction={'row'}
            justifyContent={'space-between'}
            bgcolor={'#fff'}
            pl={3}
            pr={1}
          >
            <FormControlLabel
              control={
                <IOSSwitch
                  checked={dense}
                  onChange={handleChangeDense}
                  sx={{ marginRight: 2 }}
                />
              }
              label="Dense"
            />

            <TablePagination
              rowsPerPageOptions={[10, 25, 50, { label: 'All', value: -1 }]}
              component="div"
              count={queryTicketAllData.GetFastpassAll2.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </Stack>
        </Card>
      </Container>

      <Popover
        id={idActions}
        open={openActions}
        anchorEl={anchorElActions}
        onClose={handleCloseActions}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            p: 0.5,
            width: 130,
            boxShadow: theme.palette.customShadow,
            backgroundImage: `linear-gradient(35deg,
              ${theme.palette.secondary.light} 0%,
              #fff 30%,
              #fff 70%,
              ${theme.palette.orange.light} 100%)
            `,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >

        <MenuItem
          onClick={handleDeleteRow}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon={'solar:trash-bin-trash-bold-duotone'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
