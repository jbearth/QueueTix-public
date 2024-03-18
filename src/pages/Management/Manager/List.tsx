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
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import noDataForSerach from 'assets/img/illustrations/searching-data-3385493.png'

// project imports
import Label from 'components/label';
import Iconify from 'components/iconify';
import { UserListHead, UserListToolbar } from 'components/sections/dashboard/user/list';
import { IOSSwitch } from 'components/switch/iosSwitchStyle';
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

// ----------------------------------------------------------------------

type AlignRight = 'left' | 'right' | 'center' | 'justify' | 'inherit';

interface TABLE_HEAD_PROPS {
  id?: string,
  label?: string,
  alignRight?: AlignRight
}

const TABLE_HEAD: readonly TABLE_HEAD_PROPS[] = [
  { id: 'fullname', label: 'NAME', alignRight: 'left' },
  { id: 'email', label: 'EMAIL', alignRight: 'left' },
  { id: 'role', label: 'ROLE', alignRight: 'left' },
  { id: 'action', label: 'ACTIONS', alignRight: 'center' },
];

// ----------------------------------------------------------------------

type Order = 'asc' | 'desc';

type TableUserProps = {
  id: number;
  avatarUrl: string;
  email: string;
  role: string;
  fullname: string;
  firstname: never;
  lastname: string;
  types: string;
  gender: string;
  phone?: string;
  profilePicture: string;
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
  selectedEmail: string;
}

// ฟังก์ชันทำการเรียงตัวอักษร
function descendingComparator
  (
    a: any,
    b: any,
    orderBy: string | number
  ) {
  if ((a[orderBy] || b[orderBy]) === undefined) {
    if (b.profile[orderBy] < a.profile[orderBy]) {
      return -1;
    }
    if (b.profile[orderBy] > a.profile[orderBy]) {
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
  const stabilizedThis = array.slice().sort((a, b) => {
    const order = comparator(a, b);
    if (order !== 0) return order;
    return array.indexOf(a) - array.indexOf(b);
  });

  if (query) {
    return array.filter(
      (manager) =>
        manager.fullname.toLowerCase().includes(query.toLowerCase()) ||
        manager.email.toLowerCase().includes(query.toLowerCase())
    );
  }
  return stabilizedThis;
}

const MANAGERALL = gql`
  query GetManagerAll {
    getManagerAll {
      id
      adminId
      amusementparkId
      email
      password
      fullname
      firstname
      lastname
      role
    }
  }
`;

const DELETE_ACCOUNT = gql`
  mutation DeleteManager($idManager: String!) {
  deleteManager(id_manager: $idManager) {
    success {
      message
    }
    error {
      message
    }
  }
}
`;

// ==============================|| หน้า USER LISTS ||============================== //

export default function UserListPage() {
  const { state } = useLocation()
  const theme = useTheme();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(0);
  const [order, setOrder] = useState<Order>('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState<string>('fullname');
  const [filterSearch, setFilterSearch] = useState<string>('');
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [dense, setDense] = React.useState<boolean>(false);
  const [roleSelect, setSelectRole] = React.useState<string[]>([]);
  const [anchorElActions, setAnchorElActions] = React.useState<HTMLButtonElement | null>(null);
  const [stateNavigate, setStateNavigate] = useState<StateNavigateProps>({
    selectedRowId: "",
    selectedEmail: ""
  });
  const drawerOpen = useSelector((state: any) => state.customization.opened);

  // Query
  const {
    loading: queryManagerAllLoading,
    error: queryManagerAllError,
    data: queryManagerAllData,
    refetch
  } = useQuery(MANAGERALL);

  // Mutation
  const [deleteRowTable] = useMutation(DELETE_ACCOUNT);

  if (queryManagerAllLoading) {
    return (
      <Box display={"flex"} height={"100%"} justifyContent={'center'} alignItems={'center'} >
        <CircularProgress size={80} disableShrink />
      </Box >
    )
  }

  if (queryManagerAllError) {
    return `Error! ${queryManagerAllError.message}`
  };

  const updateSelectedState = (newRowId: string, newEmail: string) => {
    setStateNavigate(prevState => ({
      ...prevState,
      selectedRowId: newRowId,
      selectedEmail: newEmail
    }));
  };

  // Popper Actions & Export Table ------------------------------------------------------
  const handleOpenActions = (event: React.MouseEvent<HTMLButtonElement>, id: number, email: string) => {
    updateSelectedState(id.toString(), email)
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

  // เลือก manager ทั้งหมด
  const handleSelectAllClick = (event: { target: { checked: any; }; }) => {
    if (event.target.checked) {
      const newSelecteds: any = queryManagerAllData.getEmployeeAll.map((manager: any) => manager.firstname);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // เลือก manager ที่ต้องการ
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - queryManagerAllData.getManagerAll.length) : 0;


  const filteredManager = applySortFilter(queryManagerAllData.getManagerAll, getComparator(order, orderBy), filterSearch)

  const isNotFound = !filteredManager.length && !!filterSearch;

  const handleDeleteRow = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      setAnchorElActions(null); // ปิด popover
      await deleteRowTable({ variables: { idManager: stateNavigate.selectedRowId! } });
      await refetch();// ดึงข้อมูล query DELETE_ROW_TABLE ใหม่ หลังลบข้อมูลเสร็จ
    } catch (error) {
      // Handle error
      console.error('Error deleting row:', error);
    }
  }

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
        <title> List Manager | Management </title>
      </Helmet>

      <Container maxWidth={drawerOpen ? "lg" : "xl"}>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:plus-fill" width={25} />}
          sx={{
            position: 'absolute',
            top: 120,
            right: 60,
            fontSize: 16,
            fontFamily: 'Sarabun-Bold'
          }}
          onClick={() => navigate("/dashboard/management/manager/create")}
        >
          Add Manager
        </Button>

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
                rowCount={queryManagerAllData.getManagerAll.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody sx={{ '& .Mui-selected': { bgcolor: theme.palette.primaryAlpha } }}>
                {filteredManager.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: TableUserProps) => {
                  const { id, role, email, firstname, lastname } = row;
                  const selectedUser = selected.indexOf(firstname) !== -1;

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
                        <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, firstname)} />
                      </TableCell>

                      {/* คอลัมน์ Name */}
                      <TableCell scope="row" padding="none" sx={{ paddingLeft: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Stack>
                            <Typography variant="h6" noWrap>
                              {firstname} {lastname}
                            </Typography>
                            <Typography variant="h7" color={theme.palette.grey[500]} noWrap>
                              @{email.split('@')[0]}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>

                      {/* คอลัมน์ Email */}
                      <TableCell align="left">{email}</TableCell>

                      {/* คอลัมน์ Role */}
                      <TableCell align="left" sx={{ paddingLeft: 1.8 }}>
                        <Stack direction={'row'} alignItems={'center'}>
                          <Iconify icon={"uim:user-nurse"} sx={{ marginRight: 1, color: theme.palette.successCustom.main }} />
                          {role}
                        </Stack>
                      </TableCell>

                      {/* คอลัมน์  Actions */}
                      <TableCell align="center" sx={{ paddingRight: 5 }}>
                        <IconButton
                          aria-describedby={idActions}
                          size="large"
                          color="inherit"
                          onClick={(e) => handleOpenActions(e, id, email)}
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
              count={queryManagerAllData.getManagerAll.length}
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
          onClick={() => {
            navigate(`/dashboard/management/manager/edit/${stateNavigate.selectedRowId}`, {
              state: {
                email: stateNavigate.selectedEmail
              }
            }),
              console.log("Id: ", stateNavigate.selectedRowId)
            console.log("email: ", stateNavigate.selectedEmail)
          }}
        >
          <Iconify icon={'solar:pen-bold-duotone'} sx={{ mr: 2, color: theme.palette.grey[600] }} />
          Edit
        </MenuItem>

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
