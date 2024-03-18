import React, { useCallback, useState } from 'react'

// material-ui
import {
  Box,
  Button,
  Dialog,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
  Modal,
} from '@mui/material'
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

// thirds-party
import * as Yup from 'yup';
import dayjs, { Dayjs } from 'dayjs';
import { useQuery, gql, useMutation } from "@apollo/client";
import { Helmet } from 'react-helmet-async';
import { useFormik } from 'formik';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// project imports
import MainCard from 'components/cards/MainCard';
import Iconify from 'components/iconify';
import { email, phone } from 'constants/regex';
import UploadAvatar from 'components/sections/dashboard/user/create/UploadAvatar';
import { fData } from 'utils/formatNumber';
import toast, { Toaster, ToastPosition } from 'react-hot-toast';


const maxLength = 50; // Max length name file upload
const maxSizeBytes = 3 * 1024 * 1024; // 3MB in bytes

type LabelRole = "Manager" | "Staff" | "User"
type LabelGender = "Male" | "Female"

interface DataRoleProps {
  id: string;
  label: LabelRole;
}
interface DataGenderProps {
  id: string;
  label: LabelGender;
}

const CREATE_NEW_USER = gql`
    mutation CreateUser($userInput: UserCreateInputSignUp!) {
      CreateUser(UserInput: $userInput) {
        success {
          message
        }
        error {
          message
        }
        user {
          email
          password
          role
          updatedAt
          profile {
            fullname
            firstname
            lastname
            gender
            dateOfBirth
            phone
            profilePicture
            status
          }
        }
      }
    }
  `

export default function CreateUserPage() {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<Blob | null>(null);
  const [base64Data, setBase64Data] = useState<string>("");

  // Mutation
  const [signUp] = useMutation(CREATE_NEW_USER);

  function Validator(file: { size: number; name: string | any[]; }) {
    if (file.size > maxSizeBytes) {
      return {
        code: "file-too-large-size",
        message: `The file size was too large`
      };
    } else if (file.name.length > maxLength) {
      return {
        code: "name-too-large",
        message: `The filename is too long.`
      };
    }

    return null
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
  };

  const dataRole: readonly DataRoleProps[] = [
    {
      id: '1',
      label: 'Manager',
    },
    {
      id: '2',
      label: 'Staff',
    },
  ]

  const dataGender: readonly DataGenderProps[] = [
    {
      id: "1",
      label: "Male"
    },
    {
      id: "2",
      label: "Female"
    },
  ]

  const formik = useFormik({
    initialValues: {
      firstname: 'Wanj',
      lastname: 'Hanz',
      email: 'asd@gmail.com',
      password: '123456789',
      role: '',
      gender: '',
      dateOfBirth: '',
      phone: '0998887777',
      profilePicture: null,
      submit: null
    },
    validationSchema: Yup.object().shape({
      firstname: Yup.string().max(20).required('คุณยังไม่ได้ใส่ชื่อ'),
      lastname: Yup.string().max(20).required('คุณยังไม่ได้ใส่นามสกุล'),
      email: Yup.string()
        .matches(email, { message: "ใส่อีเมลให้ถูกต้อง" })
        .max(100)
        .required('คุณยังไม่ได้ใส่อีเมล'),
      // password: Yup.string().test('password-format', 'Invalid Password', (value: any) => {
      //   return /^(?=.*[0-9])/.test(value) || /^(?=.*[a-z])/.test(value) || /^(?=.*[A-Z])/.test(value);
      // })
      //   .matches(password, 'Invalid password format')
      //   .required('คุณยังไม่ได้ใส่รหัสผ่าน'),
      role: Yup.string().required('คุณยังไม่ได้ใส่ตำแหน่ง'),
      gender: Yup.string().required('คุณยังไม่ได้ใส่เพศ'),
      // dateOfBirth: Yup.string().required('คุณยังไม่ได้ใส่วันเกิด'),
      phone: Yup.string().matches(phone, { message: "กรุณาใส่เบอร์มือถือให้ถูกต้อง" }).required('คุณยังไม่ได้ใส่เบอร์มือถือ'),
    }),
    onSubmit: async (
      values,
      { setErrors, setStatus, setSubmitting }
    ) => {
      try {
        if (!uploadedFile) {
          return false;
        }
        const reader = new FileReader();
        reader.onload = async (e: any) => {
          setBase64Data(e.target.result.split(',')[1]);
        }
        reader.readAsDataURL(uploadedFile);

        const selectedRole = dataRole.find((option) => option.id === values.role);
        const selectedGender = dataGender.find((option) => option.id === values.gender);

        const result = await signUp({
          variables: {
            userInput: {
              email: values.email,
              password: values.password,
              role: selectedRole?.label,
              fullname: `${values.firstname} ${values.lastname}`,
              firstname: values.firstname,
              lastname: values.lastname,
              gender: selectedGender?.label,
              dateOfBirth: values.dateOfBirth,
              phone: values.phone,
              profilePicture: {
                filename: uploadedFile.name,
                mimeType: uploadedFile.type,
                data: base64Data
              }
            }
          },
        });

        if (result.data.UpdateUser.success !== null) {
          notifyToastSuccess(`แก้ไขข้อมูลผู้ใช้ ${values.firstname} สำเร็จ`)
        } else {
          notifyToastError(`แก้ไขข้อมูลผู้ใช้ ${values.firstname} ไม่สำเร็จ`)
        }

        console.log(values.profilePicture);

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


  const handleDropAvatar = useCallback((acceptedFiles: any) => {
    const file = acceptedFiles[0];

    if (file) {
      setUploadedFile(file)
      formik.setFieldValue('profilePicture',
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
    }
  }, []);

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

      {/* @ts-ignore */}
      <Helmet>
        <title> Create Users | Management </title>
      </Helmet>

      <Stack direction={{ sm: "column", md: "row" }} gap={5} justifyContent={"center"}>
        <MainCard
          sx={{
            padding: 3,
            bgcolor: "#fff",
            width: "100%",
            maxWidth: 350,
            maxHeight: { xs: 350, md: 420 },
            borderRadius: 10
          }}
        >
          <UploadAvatar
            file={formik.values.profilePicture}
            onDrop={handleDropAvatar}
            accept={{
              'image/png': ['.png'],
              'image/jpeg': ['.jpeg', '.jpg'],
            }}
            validator={Validator}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            helperText={
              <Typography
                variant="h6"
                sx={{
                  mt: { xs: 1, lg: 2 },
                  mx: 'auto',
                  display: 'block',
                  textAlign: 'center',
                  color: 'text.secondary',
                  fontFamily: 'Sarabun-Medium'
                }}
              >
                Allowed *.jpeg, *.jpg, *.png
                <br /> max size of {fData(maxSizeBytes)}<br />
              </Typography>
            }
          />
        </MainCard>

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
              <Grid xs={6}>
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
                          onMouseDown={handleMouseDownPassword}
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
              </Grid>
              <Grid xs={6}>
                <TextField
                  id="outlined-select-role"
                  value={formik.values.role}
                  name="role"
                  onBlur={formik.handleBlur}
                  onChange={(event) => formik.setFieldValue('role', event.target.value)}
                  variant="outlined"
                  fullWidth
                  select
                  error={Boolean(formik.touched.role && formik.errors.role)}
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
                  label="Role"
                  helperText={formik.touched.role && formik.errors.role}
                >
                  {dataRole.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid xs={6}>
                <TextField
                  id="outlined-select-gender"
                  value={formik.values.gender}
                  name="gender"
                  onBlur={formik.handleBlur}
                  onChange={(event) => formik.setFieldValue('gender', event.target.value)}
                  variant="outlined"
                  fullWidth
                  select
                  error={Boolean(formik.touched.gender && formik.errors.gender)}
                  sx={{
                    '& label': {
                      color: theme.palette.icon.drawer,
                      fontFamily: 'Sarabun-Medium'
                    },
                    '& fieldset': {
                      borderColor: theme.palette.grey[300],
                      borderRadius: 2,
                    },
                  }}
                  label="Gender"
                  helperText={formik.touched.gender && formik.errors.gender}
                >
                  {dataGender.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid xs={6}>
                <FormControl fullWidth error={Boolean(formik.touched.dateOfBirth && formik.errors.dateOfBirth)}>

                  {/* <InputLabel
                        htmlFor="outlined-select-dateOfBirth"
                        sx={{
                          color: theme.palette.icon.drawer,
                          bgcolor: "#fff",
                          px: 1,
                          fontFamily: 'Sarabun-Medium'
                        }}
                        shrink
                      >Birthday</InputLabel>
                      <TextField
                        id="outlined-select-dateOfBirth"
                        name="dateOfBirth"
                        value={birthday}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{
                          '& label': {
                            color: theme.palette.icon.drawer,
                            fontFamily: 'Sarabun-Medium'
                          },
                          '& fieldset': {
                            borderColor: theme.palette.grey[300],
                            borderRadius: 2,
                          },
                        }}
                        InputProps={{
                          endAdornment: (
                            <IconButton onClick={handleToggleDialog}>
                              <Iconify icon="solar:calendar-add-bold-duotone" width={20} />
                            </IconButton>
                          ),
                        }}
                      /> */}

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      className="dateOfBirth"
                      value={formik.values.dateOfBirth}
                      onChange={(date) => formik.setFieldValue('dateOfBirth', date)}
                      sx={{
                        width: 1,
                        '& label': {
                          color: theme.palette.icon.drawer,
                          fontFamily: 'Sarabun-Medium'
                        },
                        '& fieldset': {
                          borderColor: theme.palette.grey[300],
                          borderRadius: 2,
                        },
                      }}
                      label="Birthday"
                    />
                  </LocalizationProvider>
                  {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                    <FormHelperText error id="standard-weight-helper-text-dateOfBirth">
                      {/* {formik.errors.dateOfBirth} */}
                    </FormHelperText>
                  )}
                </FormControl>
                {/* <Modal onClose={() => setOpen(false)} open={open} sx={{ display: 'flex', justifyContent: 'center', alignItems: center }}>
                      <MainCard
                        sx={{
                          // padding: 3,
                          bgcolor: "#fff",
                          width: "100%",
                          maxWidth: 350,
                          height: { sm: 350, md: 350 },
                          borderRadius: 3
                        }}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateCalendar
                            sx={{ width: 1 }}
                            // value={birthday}
                            // onChange={(value) => setBirthday(value)}
                            defaultValue={dayjs('2022-04-17')}
                          />
                        </LocalizationProvider>
                      </MainCard>
                    </Modal> */}
              </Grid>
              <Grid xs={6}>
                <TextField
                  id="outlined-phone"
                  type="text"
                  value={formik.values.phone}
                  name="phone"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  variant="outlined"
                  fullWidth
                  error={Boolean(formik.touched.phone && formik.errors.phone)}
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
                  label="Phone Number"
                  helperText={formik.touched.phone && formik.errors.phone}
                />
              </Grid>
              <Grid xs={12} display={'flex'} justifyContent={'flex-end'}>
                <Button
                  variant="contained"
                  sx={{
                    mt: formik.errors.phone ? 0 : 2,
                    borderRadius: 2,
                    fontSize: 16,
                    fontFamily: 'Sarabun-Bold'
                  }}
                  onClick={() => { formik.handleSubmit(), formik.handleChange('submit') }}
                  disabled={
                    Boolean(
                      formik.values.email === ''
                      || formik.errors.firstname
                      || formik.errors.lastname
                      || formik.errors.email
                      || formik.errors.password
                      || formik.errors.role
                      || formik.errors.gender
                      // || formik.errors.dateOfBirth
                      || formik.errors.phone
                      || !uploadedFile
                      || formik.isSubmitting
                    )
                  }
                >
                  Create User
                </Button>
              </Grid>
            </Grid>
          </form>
        </MainCard>
      </Stack>
    </ >
  )
}