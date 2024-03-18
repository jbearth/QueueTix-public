import React, { useState, useEffect, useContext } from 'react';

// material-ui
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Paper,
  Box,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// thirds-party
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import toast, { Toaster, ToastPosition } from 'react-hot-toast';

// project imports
import { useAuth } from '../../data/Auth';
import Logo from 'assets/img/logo.png'
import MainCard from 'components/cards/MainCard';
import Iconify from 'components/iconify';
import { email, password, phone } from 'constants/regex';

const ADMINSIGNIN = gql`
  mutation AdminLogin($inputSignin: CreateInputSignIn!) {
    AdminLogin(InputSignin: $inputSignin) {
      admin {
        id
        email
        role
        firstname
        lastname
      }
      token {
        access_token
        refresh_token
      }
      error {
        message
      }
      success {
        message
      }
    }
  }
`;
const MANAGERSIGNIN = gql`
  mutation ManagerLogin($inputSignin: CreateInputSignIn!) {
    ManagerLogin(InputSignin: $inputSignin) {
      manager {
        id
        adminId
        amusementparkId
        firstname
        lastname
        email
        role
      }
      token {
        access_token
        refresh_token
      }
      error {
        message
      }
      success {
        message
      }
    }
  }
`;
const EMPLOYEESIGNIN = gql`
  mutation EmployeeLogin($inputSignin: CreateInputSignIn!) {
    EmployeeLogin(InputSignin: $inputSignin) {
      employee {
        id
        ridesId
        email
        firstname
        lastname
        gender
        role
        types
        profilePicture
      }
      token {
        access_token
        refresh_token
      }
      error {
        message
      }
      success {
        message
      }
    }
  }
`;

const SignIn = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { login } = useAuth();


  const [mutationAdminSignIn, { data: mutationAdminSignInData }] = useMutation(ADMINSIGNIN);
  const [mutationManagerSignIn, { data: mutationManagerSignInData }] = useMutation(MANAGERSIGNIN);
  const [mutationEmployeeSignIn, { data: mutationEmployeeSignInData }] = useMutation(EMPLOYEESIGNIN);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

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

  // useEffect(() => {
  //   if (data?.Login.error != null) {
  //     notifyToastError('Login Failed 😢 ');
  //   } else if (data?.Login.success != null) {
  //     // login(data?.Login)
  //     notifyToastSuccess('Login Success 😊 ');
  //     // navigate('/')
  //   }
  // }, [data]);

  // const handleSubmit = async (e: React.SyntheticEvent) => {
  //   e.preventDefault();
  //   login("SongMAMA001")
  //   await Mutation({
  //     variables: { email: email!, password: password! },
  //   });
  // };

  const formik = useFormik({
    initialValues: {
      email: "jatuphat@gmail.com",
      password: "123456789",
      submit: null
    },
    validationSchema: Yup.object().shape({
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
        let dataSignIn;
        let dataToken;
        const adminSignin = await mutationAdminSignIn({
          variables: {
            inputSignin: {
              email: values.email!,
              password: values.password!
            }
          },
        });

        if (adminSignin.data.AdminLogin.success !== null) {
          dataSignIn = adminSignin.data.AdminLogin.admin
          dataToken = adminSignin.data.AdminLogin.token
          notifyToastSuccess('Login Success 😊 ');
        } else {
          const managerSignin = await mutationManagerSignIn({
            variables: {
              inputSignin: {
                email: values.email!,
                password: values.password!
              }
            },
          });

          if (managerSignin.data.ManagerLogin.success !== null) {
            dataSignIn = adminSignin.data.ManagerLogin.manager
            dataToken = adminSignin.data.ManagerLogin.token
            notifyToastSuccess('Login Success 😊 ');
          } else {
            const employeeSignin = await mutationEmployeeSignIn({
              variables: {
                inputSignin: {
                  email: values.email!,
                  password: values.password!
                }
              },
            });

            if (employeeSignin.data.EmployeeLogin.success !== null) {
              dataSignIn = adminSignin.data.EmployeeLogin.employee
              dataToken = adminSignin.data.EmployeeLogin.token
              notifyToastSuccess('Login Success 😊 ');
            } else {
              notifyToastError('อีเมลหรือรหัสผ่านไม่ถูกต้อง ', 2000);
              notifyToastError('Login Failed 😢 ', 1800);
            }
          }
        }

        console.log("dataToken ", dataToken)


        login(dataSignIn, dataToken)

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

  return (
    <>
      {/* Hot Toaster popup */}
      <Toaster containerStyle={{ position: 'absolute' }} />

      {/* Image on background */}
      <Box
        sx={{
          position: 'absolute',
          WebkitBackdropFilter: "blur(18px)", // For Safari support
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          zIndex: -1,
          width: "100%",
          height: "100%",
          overflow: "hidden"
        }}
      />
      <img
        src={"https://img.freepik.com/free-vector/amusement-park-with-circus-tent-fireworks_107791-832.jpg?w=1380&t=st=1693408553~exp=1693409153~hmac=8189ba6efed9bfe99c09726eadfae5cb08d481d463a8a74112844d67a4c7600a"}
        alt="Logo"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: 'absolute',
          zIndex: -2,
        }}
      />

      {/* Signin card */}
      <Box
        display={"flex"}
        minHeight={"100vh"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <MainCard
          sx={{
            padding: 3,
            bgcolor: "#fff",
            width: "100%",
            maxWidth: 350,
            maxHeight: { xs: 350, md: 420 },
            borderRadius: 10,
          }}
        >
          <form noValidate onSubmit={formik.handleSubmit}>
            <Stack gap={3}>

              <Typography
                variant="h1"
                sx={{
                  textAlign: "center",
                  fontFamily: 'Sarabun-Bold',
                  background: "-webkit-linear-gradient(-45deg, #2196f3 30%, #3f51b5 60%, #673ab7 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                QUEUETIX
              </Typography>

              <Typography
                variant='h5'
                textAlign={"center"}
                fontFamily={"Sarabun-Medium"}
              >
                Enter your credentials to signin
              </Typography>

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
                helperText={formik.touched.email && formik.errors.email}
              />

              <FormControl fullWidth error={Boolean(formik.touched.password && formik.errors.password)}>
                <InputLabel
                  htmlFor="outlined-adornment-password"
                  sx={{
                    color: theme.palette.icon.drawer,
                    fontFamily: 'Sarabun-Medium'
                  }}
                >Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formik.values.password}
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  sx={{
                    '& fieldset': {
                      borderColor: theme.palette.grey[300],
                      borderRadius: 2
                    },
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        size="large"
                      >
                        {showPassword ? <Iconify icon="ic:twotone-visibility-off" /> : <Iconify icon="ic:twotone-visibility" />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                {formik.touched.password && formik.errors.password && (
                  <FormHelperText error id="standard-weight-helper-password-login">
                    {formik.errors.password}
                  </FormHelperText>
                )}
              </FormControl>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  fontSize: 16,
                  fontFamily: 'Sarabun-Bold'
                }}
                onClick={() => { formik.handleSubmit(), formik.handleChange('submit') }}
              >
                Submit
              </Button>
            </Stack>
          </form>

        </MainCard>
      </Box>
    </>
  );
}

export default SignIn;