import React, { useCallback, useState, useMemo } from 'react'

// material-ui
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

// thirds-party
import { useQuery, gql, useMutation } from "@apollo/client";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// project imports
import MainCard from 'components/cards/MainCard';
import { email, password } from 'constants/regex';
import UploadAvatar from 'components/sections/dashboard/user/create/UploadAvatar';
import { fData } from 'utils/formatNumber';
import CircularProgress from '@mui/material/CircularProgress';
import toast, { Toaster, ToastPosition } from 'react-hot-toast';
import Iconify from 'components/iconify';

const maxLength = 50; // Max length name file upload
const maxSizeBytes = 3 * 1024 * 1024; // 3MB in bytes

type typesticket = "DreamWorldVisa" | "SuperVisa" | "Entrance" | "IncludeRides" | ""

type DataTypesProps = {
  id: string;
  label: typesticket;
}
type Values = {
  title: string,
  description: string,
  types: typesticket,
  priceofchild: number,
  priceofadult: number,
  submit: any
}

const GETTICKETMUTATION = gql`
  mutation GetTicketMutation($idTicket: String!) {
  GetTicketMutation(id_ticket: $idTicket) {
    success {
      message
    }
    error {
      message
    }
    data {
      title
      description
      typesticket {
        types
        priceofadult
        priceofchild
      }
    }
  }
}
`;


const UPDATE_TICKET = gql`
  mutation UpdateTicket($ticketInputUpdate: TicketInputUpdate!) {
  UpdateTicket(TicketInputUpdate: $ticketInputUpdate) {
    success {
      message
    }
    error {
      message
    }
  }
}
`;

export default function EditRidesPage() {
  const { id } = useParams();
  const { state } = useLocation()
  const navigate = useNavigate();
  const theme = useTheme();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [mutationTicket, {
    loading: mutationTicketloading,
    error: mutationTicketError,
    data: mutationTicketData,
  }] = useMutation(GETTICKETMUTATION)

  //  Mutation
  const [updateTicket] = useMutation(UPDATE_TICKET);

  if (mutationTicketError) {
    return (
      <Box display={"flex"} height={"100%"} justifyContent={'center'} alignItems={'center'} >
        <Typography variant='h5'>เกิดข้อผิดพลาดทางระบบเซิร์ฟเวอร์ !!</Typography>
      </Box >
    )
  };

  React.useMemo(() => {

    (async () => {

      if (id === ":id") navigate("/dashboard/management/ticket/list");
      let result: any
      if (!mutationTicketData) {
        result = await mutationTicket({
          variables: {
            idTicket: state?.id
          }
        })
      }

      const ticket = await result?.data?.GetTicketMutation?.data;
      formik.setFieldValue("title", ticket?.title);
      formik.setFieldValue("description", ticket?.description);
      const selectedtypes = dataTypes.find((option) => option.label === ticket.typesticket.types);
      formik.setFieldValue("types", selectedtypes?.id);
      formik.setFieldValue("priceofchild", ticket?.typesticket.priceofchild);
      formik.setFieldValue("priceofadult", ticket?.typesticket.priceofadult);
    })();
  }, [id, state]);

  const dataTypes: readonly DataTypesProps[] = [
    {
      id: '0',
      label: 'Entrance',
    },
    {
      id: '1',
      label: 'IncludeRides',
    },
    {
      id: '2',
      label: 'DreamWorldVisa',
    },
    {
      id: '3',
      label: 'IncludeRides',
    },
  ]

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      types: "",
      priceofchild: 0,
      priceofadult: 0,
      submit: null
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().max(100).required('คุณยังไม่ได้ใส่ชื่อตั๋ว'),
      description: Yup.string().max(500).required('คุณยังไม่ได้ใส่รายละเอียดตั๋ว'),
      types: Yup.number().required('คุณยังไม่ได้ใส่ประเภทตั๋ว'),
      priceofchild: Yup.number().required('คุณยังไม่ได้ใส่ราคาบัตรเด็ก'),
      priceofadult: Yup.number().required('คุณยังไม่ได้ใส่ราคาบัตรผู้ใหญ่'),
    }),
    onSubmit: async (
      values: Values,
      { setErrors, setStatus, setSubmitting }
    ) => {
      try {

        const selectedtypes = dataTypes.find((option) => option.id === values.types);

        // console.log({
        //   id_ticket: state?.id,
        //   title: values.title,
        //   description: values.description,
        //   types: selectedtypes?.label,
        //   priceofchild: values.priceofchild,
        //   priceofadult: values.priceofadult,
        // })

        setOpenModal(true)

        const result = await updateTicket({
          variables: {
            ticketInputUpdate: {
              id_ticket: state?.id,
              title: values.title,
              description: values.description,
              typesofticket: selectedtypes?.label,
              priceofchild: values.priceofchild,
              priceofadult: values.priceofadult,
            }
          }
        });


        if (result.data.UpdateTicket.success !== null) {
          setOpenModal(false)
          notifyToastSuccess(`แก้ไขบัตรผ่าน ${values.title} สำเร็จ`, 2000)
          navigate("/dashboard/management/ticket/list")
        } else {
          setOpenModal(false)
          console.log(result.data.UpdateTicket.error)
          notifyToastError(`แก้ไขบัตรผ่าน ${values.title} ไม่สำเร็จ`)
        }


        setStatus({ success: true });
        setSubmitting(false);
      } catch (err: any) {
        console.error(err);
        setStatus({ success: false });
        setErrors({ submit: err.message });
        setSubmitting(false);
      }
    }
  });

  const notifyToastSuccess = (
    message: string,
    duration: number = 1500,
    position: ToastPosition = "top-center",
    style: any = {}
  ) => toast.success(message, {
    duration: duration,
    position: position,

    // Styling
    style: style,

    // Aria
    ariaProps: {
      role: 'status',
      'aria-live': 'polite',
    },
  });

  const notifyToastError = (
    message: string,
    duration: number = 1500,
    position: ToastPosition = "top-center",
    style: any = {}
  ) => toast.error(message, {
    duration: duration,
    position: position,

    // Styling
    style: style,

    // Aria
    ariaProps: {
      role: 'status',
      'aria-live': 'polite',
    },
  });


  return (
    <>
      {/* Hot Toaster popup */}
      <Toaster containerStyle={{ position: 'absolute' }} />

      {/* @ts-ignore */}
      <Helmet>
        <title> Edit Rides | Management </title>
      </Helmet>

      <Stack direction={"column"} mb={7} pl={3}>
        <Typography variant="h3" fontFamily={"Sarabun-Bold"} gutterBottom>
          Edit Rides Detail
        </Typography>
        {!mutationTicketloading ? (
          <Stack direction={{ sm: "column", md: "row" }} mt={8} gap={5} justifyContent={"center"}>

            <MainCard
              sx={{
                p: 3,
                pb: 0,
                bgcolor: "#fff",
                width: '100%',
                maxWidth: 800,
                minHeight: { xs: 380, md: 450 },
                maxHeight: { xs: 440, md: 500 },
                borderRadius: 10
              }}
            >
              <form onSubmit={formik.handleSubmit}>
                <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid xs={6}>
                    <TextField
                      id="outlined-title"
                      type="text"
                      value={formik.values.title}
                      name="title"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      variant="outlined"
                      fullWidth
                      error={Boolean(formik.touched.title && formik.errors.title)}
                      sx={{
                        '& label': {
                          color: theme.palette.icon.drawer,
                          fontFamily: 'Sarabun-Medium'
                        },
                        '& fieldset': {
                          borderColor: theme.palette.grey[300],
                          borderRadius: 2
                        },
                      }}
                      label="Title"
                      helperText={formik.touched.title && formik.errors.title}
                    />
                  </Grid>
                  <Grid xs={6}>
                    <TextField
                      id="outlined-description"
                      type="text"
                      value={formik.values.description}
                      name="description"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      variant="outlined"
                      fullWidth
                      multiline
                      maxRows={6}
                      error={Boolean(formik.touched.description && formik.errors.description)}
                      sx={{
                        '& label': {
                          color: theme.palette.icon.drawer,
                          fontFamily: 'Sarabun-Medium'
                        },
                        '& fieldset': {
                          borderColor: theme.palette.grey[300],
                          borderRadius: 2
                        },
                      }}
                      label="description"
                      helperText={formik.touched.description && formik.errors.description}
                    />
                  </Grid>
                  <Grid xs={6}>
                    <TextField
                      id="outlined-select-types"
                      value={formik.values.types}
                      name="types"
                      onBlur={formik.handleBlur}
                      onChange={(event) => {
                        formik.setFieldValue('types', event.target.value)
                      }}
                      variant="outlined"
                      fullWidth
                      select
                      error={Boolean(formik.touched.types && formik.errors.types)}
                      sx={{
                        '& label': {
                          color: theme.palette.icon.drawer,
                          fontFamily: 'Sarabun-Medium'
                        },
                        '& fieldset': {
                          borderColor: theme.palette.grey[300],
                          borderRadius: 2
                        },
                      }}
                      label="Types"
                      helperText={formik.touched.types && formik.errors.types}
                    >
                      {dataTypes.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid xs={6}>
                    <TextField
                      id="outlined-priceofchild"
                      type="number"
                      value={formik.values.priceofchild}
                      name="priceofchild"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      variant="outlined"
                      fullWidth
                      error={Boolean(formik.touched.priceofchild && formik.errors.priceofchild)}
                      sx={{
                        '& label': {
                          color: theme.palette.icon.drawer,
                          fontFamily: 'Sarabun-Medium'
                        },
                        '& fieldset': {
                          borderColor: theme.palette.grey[300],
                          borderRadius: 2
                        },
                      }}
                      label="Price of Child"
                      helperText={formik.touched.priceofchild && formik.errors.priceofchild}
                    />
                  </Grid>
                  <Grid xs={6}>
                    <TextField
                      id="outlined-priceofadult"
                      type="number"
                      value={formik.values.priceofadult}
                      name="priceofadult"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      variant="outlined"
                      fullWidth
                      error={Boolean(formik.touched.priceofadult && formik.errors.priceofadult)}
                      sx={{
                        '& label': {
                          color: theme.palette.icon.drawer,
                          fontFamily: 'Sarabun-Medium'
                        },
                        '& fieldset': {
                          borderColor: theme.palette.grey[300],
                          borderRadius: 2
                        },
                      }}
                      label="Price of Adult"
                      helperText={formik.touched.priceofadult && formik.errors.priceofadult}
                    />
                  </Grid>


                  {/* Button Submit */}
                  <Grid xs={12} display={'flex'} justifyContent={'flex-end'}>
                    <Button
                      variant="contained"
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        fontSize: 16,
                        fontFamily: 'Sarabun-Bold'
                      }}
                      onClick={() => { formik.handleSubmit(), formik.handleChange('submit') }}
                      disabled={
                        Boolean(
                          formik.errors.title
                          || formik.errors.description
                          || formik.errors.types
                          || formik.errors.priceofchild
                          || formik.errors.priceofadult
                          || formik.isSubmitting
                        )
                      }
                    >
                      Edit Rides
                    </Button>
                  </Grid>

                </Grid>
              </form>
            </MainCard>
          </Stack>
        ) : (
          <Box display={"flex"} height={"100%"} justifyContent={'center'} alignItems={'center'} >
            <CircularProgress size={80} disableShrink />
          </Box >
        )}
        <Modal onClose={() => setOpenModal(false)} open={openModal} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <MainCard
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: "#fff",
              width: "100%",
              maxWidth: 350,
              height: { sm: 350, md: 350 },
              borderRadius: 3
            }}
          >
            <CircularProgress size={80} disableShrink />
            <Typography variant="h4" mt={5}>กำลังอัพเดทบัตรผ่าน...</Typography>
          </MainCard>
        </Modal>
      </Stack>
    </ >
  )
}