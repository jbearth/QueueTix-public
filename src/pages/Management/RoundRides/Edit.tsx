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

type DataIsSpecialProps = {
  id: string;
  label: "Yes" | "No";
}
type DataUsedFastPassProps = {
  id: string;
  label: "Use" | "No Use";
}

interface Values {
  id_amusementpark: string;
  nameThai: string;
  nameEng: string;
  maxseats: number;
  usedFastpassAvailable: number;
  isSpecial: number;
  profilePicture: any;
  submit: any;
}

const GETRIDESMUTATION = gql`
  mutation GetRidesMutation($idRides: String!) {
    GetRidesMutation(id_rides: $idRides) {
      data {
        id
        amusementparkId
        nameThai
        nameEng
        maxseats
        usedFastpassAvailable
        isSpecial
        picture
      }
    }
  }
`;


const UPDATE_RIDES = gql`
  mutation UpdateRides($ridesInputUpdate: RidesInputUpdate!) {
    UpdateRides(RidesInputUpdate: $ridesInputUpdate) {
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
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [ridesId, setRidesId] = useState<string>("");

  const [mutationRides, {
    loading: mutationRidesloading,
    error: mutationRidesError,
    data: mutationRidesData,
  }] = useMutation(GETRIDESMUTATION)

  //  Mutation
  const [updateRides] = useMutation(UPDATE_RIDES);

  if (mutationRidesError) {
    return (
      <Box display={"flex"} height={"100%"} justifyContent={'center'} alignItems={'center'} >
        <Typography variant='h5'>เกิดข้อผิดพลาดทางระบบเซิร์ฟเวอร์ !!</Typography>
      </Box >
    )
  };

  React.useMemo(() => {

    (async () => {

      if (id === ":id") navigate("/dashboard/management/Rides/list");
      let result: any
      if (!mutationRidesData) {
        result = await mutationRides({
          variables: {
            idRides: state?.id
          }
        })
      }

      const rides = await result?.data?.GetRidesMutation?.data;
      setRidesId(rides?.id)
      formik.setFieldValue("nameEng", rides?.nameEng);
      formik.setFieldValue("nameThai", rides?.nameThai);
      formik.setFieldValue("maxseats", rides?.maxseats);
      const selectedIsSpecial = dataIsSpecial.find((option) => option.id === String(rides?.isSpecial + 1));
      const selectedUsedFastPass = dataUsedFastPass.find((option) => option.id === String(rides?.usedFastpassAvailable + 1));
      formik.setFieldValue("isSpecial", selectedIsSpecial?.id);
      formik.setFieldValue("usedFastpassAvailable", selectedUsedFastPass?.id);
      formik.setFieldValue("rides", "");
      formik.setFieldValue("profilePicture", rides?.picture);
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

  const dataIsSpecial: readonly DataIsSpecialProps[] = [
    {
      id: '1',
      label: 'No',
    },
    {
      id: '2',
      label: 'Yes',
    },
  ]

  const dataUsedFastPass: readonly DataUsedFastPassProps[] = [
    {
      id: "1",
      label: "No Use"
    },
    {
      id: "2",
      label: "Use"
    },
  ]

  const formik = useFormik({
    initialValues: {
      id_amusementpark: '',
      nameEng: '',
      nameThai: '',
      maxseats: 0,
      usedFastpassAvailable: 0,
      isSpecial: 0,
      profilePicture: null,
      submit: null
    },
    validationSchema: Yup.object().shape({
      nameEng: Yup.string().max(20).required('คุณยังไม่ได้ใส่ชื่ออังกฤษ'),
      nameThai: Yup.string().max(20).required('คุณยังไม่ได้ใส่ชื่อไทย'),
      maxseats: Yup.number().required('คุณยังไม่ได้ใส่จำนวนที่นั่ง'),
      usedFastpassAvailable: Yup.number().required('คุณยังไม่ได้เลือกว่าใช้ FastPass ได้หรือไม่'),
      isSpecial: Yup.number().required('คุณยังไม่ได้เลือกว่าเป็นเครื่องพิเศษหรือไม่'),
    }),
    onSubmit: async (
      values: Values,
      { setErrors, setStatus, setSubmitting }
    ) => {
      try {

        // console.log({
        //   id_rides: ridesId,
        //   id_amusementpark: localStorage.getItem("id_amusementpark"),
        //   nameEng: values.nameEng,
        //   nameThai: values.nameThai,
        //   maxseats: values.maxseats,
        //   isSpecial: Number(values.isSpecial) - 1,
        //   usedFastpassAvailable: Number(values.usedFastpassAvailable) - 1,
        //   profilePicture: {
        //     filename: values?.profilePicture?.name || "",
        //     mimeType: values?.profilePicture?.type || "",
        //     data: uploadedFile?.split(',')[1] || "",
        //   }
        // })

        setOpenModal(true)

        const result = await updateRides({
          variables: {
            ridesInputUpdate: {
              id_rides: ridesId,
              id_amusementpark: localStorage.getItem("id_amusementpark"),
              nameEng: values.nameEng,
              nameThai: values.nameThai,
              maxseats: values.maxseats,
              isSpecial: Number(values.isSpecial) - 1,
              usedFastpassAvailable: Number(values.usedFastpassAvailable) - 1,
              profilePicture: {
                filename: values?.profilePicture?.name || "",
                mimeType: values?.profilePicture?.type || "",
                data: uploadedFile?.split(',')[1] || "",
              }
            }
          }
        });


        if (result.data.UpdateRides.success !== null) {
          setOpenModal(false)
          notifyToastSuccess(`แก้ไขเครื่องเล่น ${values.nameThai} สำเร็จ`, 2000)
          navigate("/dashboard/management/employee/list")
        } else {
          setOpenModal(false)
          notifyToastError(`แก้ไขเครื่องเล่น ${values.nameThai} ไม่สำเร็จ`)
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
        <title> Edit Rides | Management </title>
      </Helmet>

      <Stack direction={"column"} mb={7} pl={3}>
        <Typography variant="h3" fontFamily={"Sarabun-Bold"} gutterBottom>
          Edit Rides Detail
        </Typography>
        {!mutationRidesloading ? (
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
                variant='rounded'
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
                      id="outlined-nameEng"
                      type="text"
                      value={formik.values.nameEng}
                      name="nameEng"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      variant="outlined"
                      fullWidth
                      error={Boolean(formik.touched.nameEng && formik.errors.nameEng)}
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
                      label="Name Eng"
                      helperText={formik.touched.nameEng && formik.errors.nameEng}
                    />
                  </Grid>
                  <Grid xs={6}>
                    <TextField
                      id="outlined-nameThai"
                      type="text"
                      value={formik.values.nameThai}
                      name="nameThai"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      variant="outlined"
                      fullWidth
                      error={Boolean(formik.touched.nameThai && formik.errors.nameThai)}
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
                      label="Name Thai"
                      helperText={formik.touched.nameThai && formik.errors.nameThai}
                    />
                  </Grid>
                  <Grid xs={6}>
                    <TextField
                      id="outlined-maxseats"
                      type="number"
                      value={formik.values.maxseats}
                      name="maxseats"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      variant="outlined"
                      fullWidth
                      error={Boolean(formik.touched.maxseats && formik.errors.maxseats)}
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
                      label="Max seats"
                      helperText={formik.touched.maxseats && formik.errors.maxseats}
                    />
                  </Grid>
                  <Grid xs={6}>
                    <TextField
                      id="outlined-select-isSpecial"
                      value={formik.values.isSpecial}
                      name="isSpecial"
                      onBlur={formik.handleBlur}
                      onChange={(event) => formik.setFieldValue('isSpecial', event.target.value)}
                      variant="outlined"
                      fullWidth
                      select
                      error={Boolean(formik.touched.isSpecial && formik.errors.isSpecial)}
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
                      label="Is Special"
                      helperText={formik.touched.isSpecial && formik.errors.isSpecial}
                    >
                      {dataIsSpecial.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid xs={6}>
                    <TextField
                      id="outlined-select-usedFastpassAvailable"
                      value={formik.values.usedFastpassAvailable}
                      name="usedFastpassAvailable"
                      onBlur={formik.handleBlur}
                      onChange={(event) => formik.setFieldValue('usedFastpassAvailable', event.target.value)}
                      variant="outlined"
                      fullWidth
                      select
                      error={Boolean(formik.touched.usedFastpassAvailable && formik.errors.usedFastpassAvailable)}
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
                      label="Used Fastpass Available"
                      helperText={formik.touched.usedFastpassAvailable && formik.errors.usedFastpassAvailable}
                    >
                      {dataUsedFastPass.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
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
                          formik.isSubmitting
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
            <Typography variant="h4" mt={5}>กำลังอัพเดทเครื่องเล่น...</Typography>
          </MainCard>
        </Modal>
      </Stack>
    </ >
  )
}