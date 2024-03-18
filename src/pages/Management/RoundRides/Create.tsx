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
  CircularProgress,
} from '@mui/material'
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

// thirds-party
import * as Yup from 'yup';
import { useQuery, gql, useMutation } from "@apollo/client";
import { Helmet } from 'react-helmet-async';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

// project imports
import MainCard from 'components/cards/MainCard';
import toast, { Toaster, ToastPosition } from 'react-hot-toast';

interface Values {
  rides: string;
  startTime: string;
  endTime: string;
  lunchStartTime: string;
  lunchEndTime: string;
  playRidesMin: number;
  breakRidesMin: number;
  submit: any;
}

const RIDESALL = gql`
  query GetRidesAll($idAmusementpark: String!) {
    GetRidesAll(id_amusementpark: $idAmusementpark) {
      id
      nameEng
      nameThai
      picture
      maxseats
      isSpecial
      usedFastpassAvailable
      roundrides {
        id
        ridesId
        startTime
        endTime
      }
    }
  }
`;

const CREATE_NEW_ROUNDRIDES = gql`
  mutation CreateRoundRides($roundRidesInputCreate: RoundRidesInput!) {
    CreateRoundRides(RoundRidesInputCreate: $roundRidesInputCreate) {
      success {
        message
      }
      error {
        message
      }
    }
  }
`;

export default function CreateRidesPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [ridesNameThai, setRidesNameThai] = useState<string>("");

  // Query
  const {
    loading: queryRidesAllLoading,
    error: queryRidesAllError,
    data: queryRidesAllData,
  } = useQuery(RIDESALL, {
    variables: {
      idAmusementpark: localStorage.getItem("id_amusementpark")
    }
  });

  // Mutation
  const [createRoundRides] = useMutation(CREATE_NEW_ROUNDRIDES);

  const formik = useFormik({
    initialValues: {
      rides: '',
      startTime: '',
      endTime: '',
      lunchStartTime: '00:00',
      lunchEndTime: '00:00',
      playRidesMin: 0,
      breakRidesMin: 0,
      submit: null
    },
    validationSchema: Yup.object().shape({
      rides: Yup.string().required('คุณยังไมไ่ด้กำหนดเครื่องเล่น'),
      startTime: Yup.string().required('คุณยังไม่ได้กำหนดเวลาเริ่มรอบเครื่องเล่น'),
      endTime: Yup.string().required('คุณยังไม่ได้กำหนดเวลาสิ้นสุดรอบเครื่องเล่น'),
      lunchStartTime: Yup.string().notRequired(),
      lunchEndTime: Yup.string().notRequired(),
      playRidesMin: Yup.number().required('คุณยังไม่ได้กำหนดเวลาเล่นเครื่องเล่น'),
      breakRidesMin: Yup.number().required('คุณยังไม่ได้กำหนดเวลาพักเครื่องเล่น'),
    }),
    onSubmit: async (
      values: Values,
      { setErrors, setStatus, setSubmitting }
    ) => {
      try {

        const rides = [];
        const lunchStartTime = dayjs(values.lunchStartTime).format("HH:mm");
        const lunchEndTime = dayjs(values.lunchEndTime).format("HH:mm");
        let currentTime = dayjs(values.startTime).format("HH:mm");

        while (currentTime < dayjs(values.endTime).format("HH:mm")) {
          if (currentTime >= lunchStartTime && currentTime < lunchEndTime) {
            // During lunch break, skip the time
            currentTime = lunchEndTime;
          } else {
            const rideStartTime = currentTime;

            // Add 5 minutes to the current time for the ride
            const [hours, minutes] = currentTime.split(":");
            const date = new Date();
            date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
            date.setMinutes(date.getMinutes() + values.playRidesMin);
            const nextTime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
            currentTime = nextTime;

            // Add ride end time to the rides array
            // rides.push(`${rideStartTime}-${currentTime}`);
            rides.push({
              id_rides: values.rides,
              startTime: rideStartTime,
              endTime: currentTime
            })

            // Add 10 minutes to the current time for the break
            const breakDate = new Date(date);
            breakDate.setMinutes(breakDate.getMinutes() + values.breakRidesMin);
            currentTime = `${String(breakDate.getHours()).padStart(2, "0")}:${String(breakDate.getMinutes()).padStart(2, "0")}`;
          }
        }

        // console.log(rides);


        setOpenModal(true)

        const result = await createRoundRides({
          variables: {
            roundRidesInputCreate: {
              roundridesinputcreate: rides
            }
          }
        });


        if (result.data.CreateRoundRides.success !== null) {
          setOpenModal(false)
          notifyToastSuccess(`เพิ่มรอบเครื่องเล่น ${ridesNameThai} สำเร็จ`, 2000)
          navigate("/dashboard/management/roundrides/list")
        } else {
          setOpenModal(false)
          notifyToastError(`เพิ่มรอบเครื่องเล่น ${ridesNameThai} ไม่สำเร็จ`)
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
        <title> Create Employee | Management </title>
      </Helmet>

      <Stack direction={{ sm: "column", md: "row" }} gap={5} justifyContent={"center"}>

        {!queryRidesAllLoading ? (
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
                    id="outlined-select-rides"
                    value={formik.values.rides}
                    name="rides"
                    onBlur={formik.handleBlur}
                    onChange={(event) => {
                      const rideName = queryRidesAllData?.GetRidesAll?.find((item: any) => item.id == event.target.value)
                      formik.setFieldValue('rides', event.target.value),
                        setRidesNameThai(rideName.nameThai)
                    }}
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
                    helperText={formik.values.rides === "" && "กรุณาเลือกเครื่องเล่น"}
                  >
                    {queryRidesAllData?.GetRidesAll?.map((option: any) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.nameThai}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid xs={6}>
                  <FormControl fullWidth error={Boolean(formik.touched.startTime && formik.errors.startTime)}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        className="startTime"
                        value={dayjs(formik.values.startTime)}
                        onChange={(time: any) =>
                          formik.setFieldValue('startTime', time)
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
                        label="Start Round Time Of Rides"
                      />
                    </LocalizationProvider>
                    {formik.touched.startTime && formik.errors.startTime && (
                      <FormHelperText error id="standard-weight-helper-text-openinghour">
                        {/* {formik.errors.dateOfBirth} */}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid xs={6}>
                  <FormControl fullWidth error={Boolean(formik.touched.endTime && formik.errors.endTime)}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        className="endTime"
                        value={dayjs(formik.values.endTime)}
                        onChange={(time: any) =>
                          formik.setFieldValue('endTime', time)
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
                        label="End Round Time Of Rides"
                      />
                    </LocalizationProvider>
                    {formik.touched.endTime && formik.errors.endTime && (
                      <FormHelperText error id="standard-weight-helper-text-openinghour">
                        {/* {formik.errors.dateOfBirth} */}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Break Lunch */}
                <Grid xs={6}>
                  <FormControl fullWidth error={Boolean(formik.touched.lunchStartTime && formik.errors.lunchStartTime)}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        className="lunchStartTime"
                        value={dayjs(formik.values.lunchStartTime)}
                        onChange={(time: any) =>
                          formik.setFieldValue('lunchStartTime', time)
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
                        label="Lunch Start Time Of Rides"
                      />
                    </LocalizationProvider>
                    {formik.touched.lunchStartTime && formik.errors.lunchStartTime && (
                      <FormHelperText error id="standard-weight-helper-text-openinghour">
                        {/* {formik.errors.dateOfBirth} */}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid xs={6}>
                  <FormControl fullWidth error={Boolean(formik.touched.lunchEndTime && formik.errors.lunchEndTime)}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        className="lunchEndTime"
                        value={dayjs(formik.values.lunchEndTime)}
                        onChange={(time: any) =>
                          formik.setFieldValue('lunchEndTime', time)
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
                        label="Lunch End Time Of Rides"
                      />
                    </LocalizationProvider>
                    {formik.touched.lunchEndTime && formik.errors.lunchEndTime && (
                      <FormHelperText error id="standard-weight-helper-text-openinghour">
                        {/* {formik.errors.dateOfBirth} */}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>


                {/* Play & Break Rides */}
                <Grid xs={6}>
                  <TextField
                    id="outlined-playRidesMin"
                    type="number"
                    value={formik.values.playRidesMin}
                    name="playRidesMin"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    fullWidth
                    error={Boolean(formik.touched.playRidesMin && formik.errors.playRidesMin)}
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
                    label="Time Play Of Rides (minutes)"
                    helperText={formik.touched.playRidesMin && formik.errors.playRidesMin}
                  />
                </Grid>
                <Grid xs={6}>
                  <TextField
                    id="outlined-breakRidesMin"
                    type="number"
                    value={formik.values.breakRidesMin}
                    name="breakRidesMin"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    fullWidth
                    error={Boolean(formik.touched.breakRidesMin && formik.errors.breakRidesMin)}
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
                    label="Time Break Of Rides (minutes)"
                    helperText={formik.touched.breakRidesMin && formik.errors.breakRidesMin}
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
                        // formik.errors.nameEng
                        // || formik.errors.nameThai
                        // || formik.errors.maxseats
                        // || formik.errors.isSpecial
                        // || formik.errors.usedFastpassAvailable
                        // ||
                        formik.isSubmitting
                      )
                    }
                  >
                    Create Round Rides
                  </Button>
                </Grid>
              </Grid>
            </form>
          </MainCard>
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
            <Typography variant="h4" mt={5}>กำลังเพิ่มพนักงาน...</Typography>
          </MainCard>
        </Modal>
      </Stack>
    </ >
  )
}