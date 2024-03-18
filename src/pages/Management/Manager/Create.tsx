import React, { useCallback, useState } from 'react'

// material-ui
import {
  Button,
  Stack,
  TextField,
  Typography,
  Modal,
  CircularProgress,
} from '@mui/material'
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

// thirds-party
import * as Yup from 'yup';
import { gql, useMutation } from "@apollo/client";
import { Helmet } from 'react-helmet-async';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/cards/MainCard';
import { email } from 'constants/regex';
import toast, { Toaster, ToastPosition } from 'react-hot-toast';

const CREATE_NEW_MANAGER = gql`
  mutation CreateManager($managerInput: ManagerCreateInputSignUp!) {
    CreateManager(ManagerInput: $managerInput) {
      success {
        message
      }
      error {
        message
      }
    }
  }
`;

function getAmusementParkId() {
  const amusementparkid = localStorage.getItem("id_amusementpark")
  // console.log(jsonValue)
  return amusementparkid ? amusementparkid : ""
};

export default function CreateEmployeePage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [amusementParkId, setAmusementParkId] = useState<string>("");

  // Mutation
  const [createManager] = useMutation(CREATE_NEW_MANAGER);

  const formik = useFormik({
    initialValues: {
      rides: '',
      firstname: '',
      lastname: '',
      email: '',
      submit: null
    },
    validationSchema: Yup.object().shape({
      adminId: Yup.string(),
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

        const admin = JSON.parse(localStorage.getItem("users") || "")
        // console.log(admin)
        // console.log({
        //   employeeInput: {
        //     id_admin: admin.id,
        //     id_amusementpark: amusementParkId,
        //     email: values.email,
        //     firstname: values.firstname,
        //     lastname: values.lastname,
        //   }
        // })


        setOpenModal(true)

        const result = await createManager({
          variables: {
            managerInput: {
              id_admin: admin.id,
              id_amusementpark: amusementParkId,
              email: values.email,
              firstname: values.firstname,
              lastname: values.lastname,
            }
          },
        });

        if (result.data.CreateManager.success !== null) {
          setOpenModal(false)
          notifyToastSuccess(`เพิ่มผู้จัดการ ${values.firstname} สำเร็จ`, 2000)
          navigate("/dashboard/management/employee/list", {
            state: {
              edit: true
            }
          })
        } else {
          setOpenModal(false)
          notifyToastError(`เพิ่มผู้จัดการ ${values.firstname} ไม่สำเร็จ`)
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

  React.useMemo(() => {
    const dataAmusementparkId = getAmusementParkId()
    setAmusementParkId(dataAmusementparkId)
  }, [])

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
        <title> Create Manager | Management </title>
      </Helmet>

      <Stack direction={{ sm: "column", md: "row" }} gap={5} justifyContent={"center"}>

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
          <form noValidate onSubmit={formik.handleSubmit}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid xs={12}>
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
              <Grid xs={12}>
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
              <Grid xs={12}>
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
                  Create Manager
                </Button>
              </Grid>
            </Grid>
          </form>
        </MainCard>
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
            <Typography variant="h4" mt={5}>กำลังเพิ่มผู้จัดการ...</Typography>
          </MainCard>
        </Modal>
      </Stack>
    </ >
  )
}