import React, { useCallback, useState, useMemo } from 'react'

// material-ui
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

// thirds-party
import { gql, useMutation, useQuery } from "@apollo/client";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

// project imports
import MainCard from 'components/cards/MainCard';
import { email } from 'constants/regex';
import CircularProgress from '@mui/material/CircularProgress';
import toast, { Toaster, ToastPosition } from 'react-hot-toast';
import UploadAvatar from 'components/sections/dashboard/user/create/UploadAvatar';
import { fData } from 'utils/formatNumber';

const maxLength = 50; // Max length name file upload
const maxSizeBytes = 3 * 1024 * 1024; // 3MB in bytes

interface Values {
  name: string;
  description: string;
  email: string;
  phone: string;
  openinghours: any;
  closinghours: any;
  latitude: string;
  longitude: string;
  profilePicture: any;
  submit: any;
}

const GETAMUSEMENTPARK = gql`
  query GetAmusementPark($idAmusementpark: String!) {
    GetAmusementPark(id_amusementpark: $idAmusementpark) {
      data {
        id
        name
        description
        email
        phone
        picture
        openinghours
        closinghours
        status
        amusementparkmaps {
          latitude
          longitude
        }
      }
    }
  }
`;

const UPDATE_AMUSEMENTPARK = gql`
  mutation UpdateAmusementPark($updateAmusementParkInput: AmusementParkInputUpdate!) {
    UpdateAmusementPark(UpdateAmusementParkInput: $updateAmusementParkInput) {
      success {
        message
      }
      error {
        message
      }
    }
  }
`;

function convertTimeToDate(time: string) {
  const now = new Date(); // Get the current date and time
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Adding 1 as months are zero-indexed
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}T${time}`
}

export default function EditAmusementParkPage() {
  // const { id } = useParams();
  // const { state } = useLocation()
  const navigate = useNavigate();
  const theme = useTheme();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const {
    loading: queryAmusementParkloading,
    error: queryAmusementParkError,
    data: queryAmusementParkData
  } = useQuery(GETAMUSEMENTPARK, {
    variables: {
      idAmusementpark: localStorage.getItem("id_amusementpark")
    }
  })

  //  Mutation
  const [updateAmusementPark] = useMutation(UPDATE_AMUSEMENTPARK);

  if (queryAmusementParkError) {
    return (
      <Box display={"flex"} height={"100%"} justifyContent={'center'} alignItems={'center'} >
        <Typography variant='h5'>เกิดข้อผิดพลาดทางระบบเซิร์ฟเวอร์ !!</Typography>
      </Box >
    )
  };



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

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      email: '',
      phone: '',
      openinghours: null,
      closinghours: null,
      latitude: "",
      longitude: "",
      profilePicture: null,
      submit: null
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().max(20).required('คุณยังไม่ได้ใส่ชื่อ'),
      description: Yup.string().max(500).required('คุณยังไม่ได้ใส่คำอธิบาย'),
      email: Yup.string()
        .max(100)
        .required('คุณยังไม่ได้ใส่อีเมล'),
      phone: Yup.string().required('คุณยังไม่ได้ใส่เบอร์มือถือ'),
      openinghours: Yup.string().required('คุณยังไม่ได้ใส่เวลาเปิดสวนสนุก'),
      closinghours: Yup.string().required('คุณยังไม่ได้ใส่เวลาปิดสวนสนุก'),
      latitude: Yup.string().required('คุณยังไม่ได้ใส่ละติจูด'),
      longitude: Yup.string().required('คุณยังไม่ได้ใส่ลองติจูด'),
    }),
    onSubmit: async (
      values: Values,
      { setErrors, setStatus, setSubmitting }
    ) => {
      try {
        if (!uploadedFile) {
          return false
        }

        // console.log({
        // name: values.name,
        // description: values.description,
        // email: values.email,
        // phone: values.phone,
        // openinghours: dayjs(values.openinghours).format("HH:mm"),
        // closinghours: dayjs(values.closinghours).format("HH:mm"),
        // profilePicture: {
        //   filename: uploadedFile?.name || "",
        //   mimeType: uploadedFile?.type || "",
        // data: base64Data || ""
        // }
        // })

        setOpenModal(true)

        const result = await updateAmusementPark({
          variables: {
            updateAmusementParkInput: {
              id_amusementpark: localStorage.getItem("id_amusementpark"),
              title: values.name,
              description: values.description,
              email_contact: values.email,
              phone_contact: values.phone,
              opening_hours: dayjs(values.openinghours).format("HH:mm"),
              closing_hours: dayjs(values.closinghours).format("HH:mm"),
              profilePicture: {
                filename: values?.profilePicture?.name || "",
                mimeType: values?.profilePicture?.type || "",
                data: uploadedFile?.split(',')[1] || "",
              }
            },
          }
        });


        if (result.data.UpdateAmusementPark.success !== null) {
          setOpenModal(false)
          notifyToastSuccess(`แก้ไขรายละเอียดสวนสนุก ${values.name} สำเร็จ`, 2000)
          navigate("/dashboard/management/manager/list")
        } else {
          setOpenModal(false)
          notifyToastError(`แก้ไขรายละเอียดสวนสนุก ${values.name} ไม่สำเร็จ`)
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

  React.useEffect(() => {
    (async () => {
      console.log("first")
      if (!queryAmusementParkloading) {
        const amusementpark = await queryAmusementParkData?.GetAmusementPark.data;
        formik.setFieldValue("name", amusementpark?.name);
        formik.setFieldValue("description", amusementpark.description);
        formik.setFieldValue("email", amusementpark.email);
        formik.setFieldValue("phone", amusementpark.phone);
        formik.setFieldValue("openinghours", convertTimeToDate(amusementpark.openinghours));
        formik.setFieldValue("closinghours", convertTimeToDate(amusementpark.closinghours));
        formik.setFieldValue("latitude", amusementpark.amusementparkmaps.latitude);
        formik.setFieldValue("longitude", amusementpark.amusementparkmaps.longitude);
        formik.setFieldValue("profilePicture", amusementpark.picture);
      }
    })();
  }, [!queryAmusementParkloading])

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
        <title> Edit AmusementPark | Management </title>
      </Helmet>

      <Stack direction={"column"} mb={7} pl={3}>
        {!queryAmusementParkloading ? (
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
                maxHeight: { xs: 510, md: 570 },
                borderRadius: 10
              }}
            >
              <form onSubmit={formik.handleSubmit}>
                <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid xs={6}>
                    <TextField
                      id="outlined-name"
                      type="text"
                      value={formik.values.name}
                      name="name"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      variant="outlined"
                      fullWidth
                      error={Boolean(formik.touched.name && formik.errors.name)}
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
                      label="Name"
                      helperText={formik.touched.name && formik.errors.name}
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
                      id="outlined-email"
                      type="text"
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
                      label="Email"
                      helperText={formik.touched.email && formik.errors.email}
                    />
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
                      label="Phone"
                      helperText={formik.touched.phone && formik.errors.phone}
                    />
                  </Grid>
                  <Grid xs={6}>
                    <FormControl fullWidth error={Boolean(formik.touched.openinghours && formik.errors.openinghours)}>

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                          className="openinghours"
                          value={dayjs(formik.values.openinghours)}
                          onChange={(time: any) =>
                            formik.setFieldValue('openinghours', time)
                          }
                          ampm={false}
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
                          label="Opening Hours"
                        />
                      </LocalizationProvider>
                      {formik.touched.openinghours && formik.errors.openinghours && (
                        <FormHelperText error id="standard-weight-helper-text-openinghour">
                          {/* {formik.errors.dateOfBirth} */}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid xs={6}>
                    <FormControl fullWidth error={Boolean(formik.touched.openinghours && formik.errors.openinghours)}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                          className="closinghours"
                          value={dayjs(formik.values.closinghours)}
                          onChange={(time: any) => formik.setFieldValue('closinghours', time)}
                          ampm={false}
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
                          label="Opening Hours"
                        />
                      </LocalizationProvider>
                      {formik.touched.closinghours && formik.errors.closinghours && (
                        <FormHelperText error id="standard-weight-helper-text-openinghour">
                          {/* {formik.errors.dateOfBirth} */}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid xs={6}>
                    <TextField
                      id="outlined-latitude"
                      type="text"
                      value={formik.values.latitude}
                      name="latitude"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      variant="outlined"
                      fullWidth
                      error={Boolean(formik.touched.latitude && formik.errors.latitude)}
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
                      label="Latitude"
                      helperText={formik.touched.latitude && formik.errors.latitude}
                    />
                  </Grid>
                  <Grid xs={6}>
                    <TextField
                      id="outlined-longitude"
                      type="text"
                      value={formik.values.longitude}
                      name="longitude"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      variant="outlined"
                      fullWidth
                      error={Boolean(formik.touched.longitude && formik.errors.longitude)}
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
                      label="Longitude"
                      helperText={formik.touched.longitude && formik.errors.longitude}
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
                          formik.errors.name
                          || formik.errors.description
                          || formik.errors.email
                          || formik.errors.phone
                          || formik.errors.openinghours
                          || formik.errors.closinghours
                          || formik.errors.latitude
                          || formik.errors.longitude
                          || formik.isSubmitting
                        )
                      }
                    >
                      Edit AmusementPark
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
            <Typography variant="h4" mt={5}>กำลังอัพเดทรายละเอียดสวนสนุก...</Typography>
          </MainCard>
        </Modal>
      </Stack>
    </ >
  )
}