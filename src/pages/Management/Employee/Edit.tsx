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
// import dayjs from 'dayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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

type LabelGender = "Male" | "Female"

type DataTypesProps = {
  id: string;
  label: "EntranceEmployee" | "RidesEmployee";
}
interface DataGenderProps {
  id: string;
  label: LabelGender;
}

interface Values {
  rides: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  gender: string;
  types: string;
  profilePicture: any;
  submit: any;
}

const GETRIDESALL = gql`
  query GetRidesAll($idAmusementpark: String!) {
    GetRidesAll(id_amusementpark: $idAmusementpark) {
      id
      nameEng
      nameThai
    }
  }
`;

const GETEMPLOYEE = gql`
  mutation GetOneEmployee($email: String!) {
    getOneEmployee(email: $email) {
      employee {
        id
        ridesId
        amusementparkId
        email
        password
        fullname
        firstname
        lastname
        gender
        role
        types
        profilePicture
      }
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($employeeInput: EmployeeInputUpdate!) {
    UpdateEmployee(EmployeeInput: $employeeInput) {
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

export default function EditEmployeePage() {
  const { id } = useParams();
  const { state } = useLocation()
  const navigate = useNavigate();
  const theme = useTheme();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [amusementParkId, setAmusementParkId] = useState<string>("");
  const [oldEmail, setOldEmail] = useState<string>("");

  React.useMemo(() => {
    const dataAmusementparkId = getAmusementParkId()
    setAmusementParkId(dataAmusementparkId)
  }, [])

  //  Query
  const {
    loading: queryRidesAllloading,
    error: queryRidesAllError,
    data: queryRidesAllData
  } = useQuery(GETRIDESALL, {
    variables: {
      idAmusementpark: amusementParkId
    }
  })

  const [mutationEmployee, {
    loading: mutationEmployeeloading,
    error: mutationEmployeeError,
    data: mutationEmployeeData,
  }] = useMutation(GETEMPLOYEE)

  //  Mutation
  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE);

  if (queryRidesAllError) {
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

      if (id === ":id") navigate("/dashboard/management/employee/list");
      let result: any
      if (!mutationEmployeeData) {
        result = await mutationEmployee({
          variables: {
            email: state?.email
          }
        })
      }

      const employee = await result?.data?.getOneEmployee?.employee;
      formik.setFieldValue("firstname", employee.firstname);
      formik.setFieldValue("lastname", employee.lastname);
      formik.setFieldValue("email", employee.email);
      setOldEmail(employee.email)
      const selectedTypes = dataTypes.find((option) => option.label === employee.types);
      const selectedGender = dataGender.find((option) => option.label === employee.gender);
      formik.setFieldValue("gender", selectedGender?.id);
      formik.setFieldValue("types", selectedTypes?.id);
      formik.setFieldValue("rides", "");
      formik.setFieldValue("profilePicture", employee.profilePicture);
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

  const dataTypes: readonly DataTypesProps[] = [
    {
      id: '1',
      label: 'EntranceEmployee',
    },
    {
      id: '2',
      label: 'RidesEmployee',
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
      rides: '',
      firstname: '',
      lastname: '',
      email: '',
      role: '',
      gender: '',
      types: '',
      profilePicture: null,
      submit: null
    },
    validationSchema: Yup.object().shape({
      firstname: Yup.string().max(20).required('คุณยังไม่ได้ใส่ชื่อ'),
      lastname: Yup.string().max(20).required('คุณยังไม่ได้ใส่นามสกุล'),
      email: Yup.string()
        .max(100)
        .required('คุณยังไม่ได้ใส่อีเมล'),
      gender: Yup.string().required('คุณยังไม่ได้เลือกเพศ'),
    }),
    onSubmit: async (
      values: Values,
      { setErrors, setStatus, setSubmitting }
    ) => {
      try {

        const selectedGender = dataGender.find((option) => option.id === values.gender);
        const selectedTypes = dataTypes.find((option) => option.id === values.types);

        // console.log({
        //   id_rides: values?.rides || "",
        //   oldEmail: oldEmail,
        //   newEmail: values.email,
        //   firstname: values.firstname,
        //   lastname: values.lastname,
        //   gender: selectedGender?.label,
        //   role: "Employee",
        //   types: selectedTypes?.label,
        //   profilePicture: {
        //     filename: values?.profilePicture?.name || "",
        //     mimeType: values?.profilePicture?.type || "",
        //     data: uploadedFile?.split(',')[1] || "",
        //   }
        // })

        setOpenModal(true)

        const result = await updateEmployee({
          variables: {
            employeeInput: {
              id_rides: values?.rides || "",
              oldEmail: oldEmail,
              newEmail: values.email,
              firstname: values.firstname,
              lastname: values.lastname,
              gender: selectedGender?.label,
              role: "Employee",
              types: selectedTypes?.label,
              profilePicture: {
                filename: values?.profilePicture?.name || "",
                mimeType: values?.profilePicture?.type || "",
                data: uploadedFile?.split(',')[1] || "",
              }
            },
          }
        });


        if (result.data.UpdateEmployee.success !== null) {
          setOpenModal(false)
          notifyToastSuccess(`แก้ไขพนักงาน ${values.firstname} สำเร็จ`, 2000)
          navigate("/dashboard/management/employee/list", {
            state: {
              edit: true
            }
          })
        } else {
          setOpenModal(false)
          notifyToastError(`แก้ไขพนักงาน ${values.firstname} ไม่สำเร็จ`)
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

  const handleDropAvatar = useCallback((acceptedFiles: any) => {
    const file = acceptedFiles[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String: any = reader.result;
        setUploadedFile(base64String);
      };

      if (file) {
        reader.readAsDataURL(file);
      }
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
        <title> Edit Employee | Management </title>
      </Helmet>

      <Stack direction={"column"} mb={7} pl={3}>
        <Typography variant="h3" fontFamily={"Sarabun-Bold"} gutterBottom>
          Edit Employee
        </Typography>
        {!queryRidesAllloading || !mutationEmployeeloading ? (
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
                    <TextField
                      id="outlined-select-types"
                      value={formik.values.types}
                      name="types"
                      onBlur={formik.handleBlur}
                      onChange={(event) => {
                        formik.setFieldValue('types', event.target.value),
                          formik.setFieldValue("rides", "");
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
                  {formik.values.types !== "1" && <Grid xs={6}>
                    <TextField
                      id="outlined-select-rides"
                      value={formik.values.rides}
                      name="rides"
                      onBlur={formik.handleBlur}
                      onChange={(event) => formik.setFieldValue('rides', event.target.value)}
                      variant="outlined"
                      fullWidth
                      select
                      error={Boolean(formik.values.rides === "")}
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
                      label="Rides"
                      helperText={formik.values.rides === "" && "กรุณากำหนดประจำเครื่องเล่น"}
                    >
                      {queryRidesAllData?.GetRidesAll?.map((option: any) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.nameThai}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>}

                  {/* Button Submit */}
                  <Grid xs={12} display={'flex'} justifyContent={'flex-end'}>
                    <Button
                      variant="contained"
                      sx={{
                        mt: formik.errors.rides ? 0 : 2,
                        borderRadius: 2,
                        fontSize: 16,
                        fontFamily: 'Sarabun-Bold'
                      }}
                      onClick={() => { formik.handleSubmit(), formik.handleChange('submit') }}
                      disabled={
                        Boolean(
                          formik.errors?.firstname
                          || formik.errors.lastname
                          || formik.errors.email
                          || formik.errors.gender
                          || formik.errors.types
                          || (formik.values.rides === "" && formik.values.types !== "1")
                          || formik.isSubmitting
                        )
                      }
                    >
                      Edit Employee
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
            <Typography variant="h4" mt={5}>กำลังอัพเดทพนักงาน...</Typography>
          </MainCard>
        </Modal>
      </Stack>
    </ >
  )
}