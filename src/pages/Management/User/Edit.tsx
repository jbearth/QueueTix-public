import React, { useCallback, useState, useMemo } from 'react'

// material-ui
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  MenuItem,
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
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// project imports
import MainCard from 'components/cards/MainCard';
import { email, phone } from 'constants/regex';
import UploadAvatar from 'components/sections/dashboard/user/create/UploadAvatar';
import { fData } from 'utils/formatNumber';
import CircularProgress from '@mui/material/CircularProgress';
import toast, { Toaster, ToastPosition } from 'react-hot-toast';

const maxLength = 50; // Max length name file upload
const maxSizeBytes = 3 * 1024 * 1024; // 3MB in bytes

type LabelRole = "Manager" | "Employee" | "User"
type LabelGender = "Male" | "Female"

interface DataRoleProps {
  id: string;
  label: LabelRole;
}
interface DataGenderProps {
  id: string;
  label: LabelGender;
}

const GET_USER2 = gql`
  mutation GetOneUser2($email: String!) {
    getOneUser2(email: $email) {
      user {
        id
        email
        role
        profile {
          fullname
          firstname
          lastname
          gender
          dateOfBirth
          phone
          profilePicture
        }
      }
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($userInput: UserCreateInputSignUp!) {
    UpdateUser(UserInput: $userInput) {
      success {
        message
      }
      error {
        message
      }
    }
  }
`;

export default function EditUserPage() {
  const { id } = useParams();
  const { state } = useLocation()
  const navigate = useNavigate();
  const theme = useTheme();
  const [uploadedFile, setUploadedFile] = useState<Blob | null>(null);
  const [base64Data, setBase64Data] = useState<string>("");

  //  Mutation
  const [mutationetOneUser, {
    loading: mutationetOneUserLoading,
    error: mutationetOneUserError,
    data: mutationetOneUserData
  }] = useMutation(GET_USER2);

  const [updateUser] = useMutation(UPDATE_USER);

  if (mutationetOneUserLoading) {
    return (
      <Box display={"flex"} height={"100%"} justifyContent={'center'} alignItems={'center'} >
        <CircularProgress size={80} disableShrink />
      </Box >
    )
  }

  if (mutationetOneUserError) {
    return `Error! ${mutationetOneUserError.message}`
  };

  React.useMemo(() => {
    (async () => {
      if (id === ":id") navigate("/dashboard/management/users/list")

      let result: any
      if (!mutationetOneUserData) {
        result = await mutationetOneUser({
          variables: {
            email: state?.email
          }
        })
      }

      // console.log("=======================")
      // console.log(id)
      // console.log(result)

      const user = await result.data?.getOneUser2.user;
      formik.setFieldValue("firstname", user.profile.firstname);
      formik.setFieldValue("lastname", user.profile.lastname);
      formik.setFieldValue("email", user.email);
      const selectedRole = dataRole.find((option) => option.label === user.role);
      const selectedGender = dataGender.find((option) => option.label === user.profile.gender);
      formik.setFieldValue("role", selectedRole?.id);
      formik.setFieldValue("gender", selectedGender?.id);
      formik.setFieldValue("dateOfBirth", dayjs(user.profile.dateOfBirth));
      formik.setFieldValue("phone", user.profile.phone);
      formik.setFieldValue("profilePicture", user.profile.profilePicture);
    })();
  }, [id, state]);

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

  const dataRole: readonly DataRoleProps[] = [
    {
      id: '1',
      label: 'Manager',
    },
    {
      id: '2',
      label: 'Employee',
    },
    {
      id: '3',
      label: 'User',
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
    }
  ]

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      role: "",
      gender: "",
      dateOfBirth: null,
      phone: "",
      profilePicture: null,
      submit: null
    },
    validationSchema: Yup.object().shape({
      firstname: Yup.string().max(50).required('คุณยังไม่ได้ใส่ชื่อ'),
      lastname: Yup.string().max(50).required('คุณยังไม่ได้ใส่นามสกุล'),
      role: Yup.string().required('คุณยังไม่ได้ใส่ตำแหน่ง'),
      gender: Yup.string().required('คุณยังไม่ได้ใส่เพศ'),
      dateOfBirth: Yup.string().required('คุณยังไม่ได้ใส่วันเกิด'),
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
        console.log("email: ", values.email)

        const result = await updateUser({
          variables: {
            userInput: {
              email: values.email,
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
                data: base64Data,
              }
            }
          },
        });

        if (result.data.UpdateUser.success !== null) {
          notifyToastSuccess(`แก้ไขข้อมูลผู้ใช้ ${values.firstname} สำเร็จ`)
        } else {
          notifyToastError(`แก้ไขข้อมูลผู้ใช้ ${values.firstname} ไม่สำเร็จ`)
        }

        console.log(result);
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
      {/* Hot Toaster popup */}
      <Toaster containerStyle={{ position: 'absolute' }} />

      {/* @ts-ignore */}
      <Helmet>
        <title> Create Users | Management </title>
      </Helmet>

      <Stack direction={"column"} mb={7} pl={3}>
        <Typography variant="h3" fontFamily={"Sarabun-Bold"} gutterBottom>
          Edit User
        </Typography>
        <Stack direction={{ sm: "column", md: "row" }} mt={8} gap={5} justifyContent={"center"}>
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
                        formik.errors.firstname
                        || formik.errors.lastname
                        || formik.errors.role
                        || formik.errors.gender
                        // || formik.errors.dateOfBirth
                        || formik.errors.phone
                        || !uploadedFile
                        || formik.isSubmitting
                      )
                    }
                  >
                    Edit User
                  </Button>
                </Grid>
              </Grid>
            </form>
          </MainCard>
        </Stack>
      </Stack>
    </ >
  )
}