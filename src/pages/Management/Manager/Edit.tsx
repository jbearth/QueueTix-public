import React, { useCallback, useState, useMemo } from 'react'

// material-ui
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

// thirds-party
import { gql, useMutation } from "@apollo/client";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useFormik } from 'formik';
import * as Yup from 'yup';


// project imports
import MainCard from 'components/cards/MainCard';
import { email } from 'constants/regex';
import CircularProgress from '@mui/material/CircularProgress';
import toast, { Toaster, ToastPosition } from 'react-hot-toast';

const GETMANAGER = gql`
  mutation GetOneManager($email: String!) {
  getOneManager(email: $email) {
    manager {
      id
      adminId
      amusementparkId
      email
      firstname
      lastname
      role
    }
    success {
      message
    }
    error {
      message
    }
  }
}
`;

const UPDATE_MANAGER = gql`
  mutation UpdateManager($managerInput: ManagerInputUpdate!) {
    UpdateManager(ManagerInput: $managerInput) {
      success {
        message
      }
      error {
        message
      }
    }
  }
`;

export default function EditManagerPage() {
  const { id } = useParams();
  const { state } = useLocation()
  const navigate = useNavigate();
  const theme = useTheme();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [oldEmail, setOldEmail] = useState<string>("");


  const [mutationManager, {
    loading: mutationManagerloading,
    error: mutationManagerError,
    data: mutationManagerData,
  }] = useMutation(GETMANAGER)

  //  Mutation
  const [updateManager] = useMutation(UPDATE_MANAGER);

  if (mutationManagerError) {
    return (
      <Box display={"flex"} height={"100%"} justifyContent={'center'} alignItems={'center'} >
        <Typography variant='h5'>เกิดข้อผิดพลาดทางระบบเซิร์ฟเวอร์ !!</Typography>
      </Box >
    )
  };

  React.useMemo(() => {

    (async () => {
      // const dataAmusementparkId = getAmusementParkId()
      // setAmusementParkId(dataAmusementparkId)

      console.log(state?.email)

      if (id === ":id") navigate("/dashboard/management/manager/list");
      let result: any
      if (!mutationManagerData) {
        result = await mutationManager({
          variables: {
            email: state?.email
          }
        })
      }

      const manager = await result?.data?.getOneManager?.manager;
      formik.setFieldValue("firstname", manager.firstname);
      formik.setFieldValue("lastname", manager.lastname);
      formik.setFieldValue("email", manager.email);
      setOldEmail(manager.email)
    })();
  }, [id, state]);

  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      submit: null
    },
    validationSchema: Yup.object().shape({
      firstname: Yup.string().max(20).required('คุณยังไม่ได้ใส่ชื่อ'),
      lastname: Yup.string().max(20).required('คุณยังไม่ได้ใส่นามสกุล'),
      email: Yup.string()
        .matches(email, { message: "ใส่อีเมลให้ถูกต้อง" })
        .max(100)
        .required('คุณยังไม่ได้ใส่อีเมล'),
    }),
    onSubmit: async (
      values,
      { setErrors, setStatus, setSubmitting }
    ) => {
      try {

        // console.log({
        //   oldEmail: oldEmail,
        //   newEmail: values.email,
        //   fullname: values.firstname + " " + values.lastname,
        //   firstname: values.firstname,
        //   lastname: values.lastname,
        // })

        setOpenModal(true)

        const result = await updateManager({
          variables: {
            managerInput: {
              oldEmail: oldEmail,
              newEmail: values.email,
              fullname: values.firstname + " " + values.lastname,
              firstname: values.firstname,
              lastname: values.lastname,
            },
          }
        });


        if (result.data.UpdateManager.success !== null) {
          setOpenModal(false)
          notifyToastSuccess(`แก้ไขผู้จัดการ ${values.firstname} สำเร็จ`, 2000)
          navigate("/dashboard/management/manager/list", {
            state: {
              edit: true
            }
          })
        } else {
          setOpenModal(false)
          notifyToastError(`แก้ไขผู้จัดการ ${values.firstname} ไม่สำเร็จ`)
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
        <title> Edit Manager | Management </title>
      </Helmet>

      <Stack direction={"column"} mb={7} pl={3}>
        <Typography variant="h3" fontFamily={"Sarabun-Bold"} gutterBottom>
          Edit Manager
        </Typography>
        {/* {!mutationManagerloading ? ( */}
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
                    id="outlined-firstname"
                    type="text"
                    value={formik.values.firstname}
                    name="firstname"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    fullWidth
                    error={Boolean(formik.touched.firstname && formik.errors.firstname)}
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
                    label="First Name"
                    helperText={formik.touched.firstname && formik.errors.firstname}
                  />
                </Grid>
                <Grid xs={6}>
                  <TextField
                    id="outlined-lastname"
                    type="text"
                    value={formik.values.lastname}
                    name="lastname"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    fullWidth
                    error={Boolean(formik.touched.lastname && formik.errors.lastname)}
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
                    label="Last Name"
                    helperText={formik.touched.lastname && formik.errors.lastname}
                  />
                </Grid>
                <Grid xs={6}>
                  <TextField
                    id="outlined-email"
                    type="email"
                    value={formik.values.email}
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    fullWidth
                    error={Boolean(formik.touched.email && formik.errors.email)}
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
                    label="Email Address"
                    autoComplete="username"
                    helperText={formik.touched.email && formik.errors.email}
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
                        formik.errors.firstname
                        || formik.errors.lastname
                        || formik.errors.email
                        || formik.isSubmitting
                      )
                    }
                  >
                    Edit Manager
                  </Button>
                </Grid>

              </Grid>
            </form>
          </MainCard>
        </Stack>
        {/* ) : (
          <Box display={"flex"} height={"100%"} justifyContent={'center'} alignItems={'center'} >
            <CircularProgress size={80} disableShrink />
          </Box >
        )} */}
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
            <Typography variant="h4" mt={5}>กำลังอัพเดทผู้จัดการ...</Typography>
          </MainCard>
        </Modal>
      </Stack>
    </ >
  )
}