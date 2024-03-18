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
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useQuery, gql, useMutation } from "@apollo/client";
import { Helmet } from 'react-helmet-async';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/cards/MainCard';
import UploadAvatar from 'components/sections/dashboard/user/create/UploadAvatar';
import { fData } from 'utils/formatNumber';
import toast, { Toaster, ToastPosition } from 'react-hot-toast';


const maxLength = 50; // Max length name file upload
const maxSizeBytes = 3 * 1024 * 1024; // 3MB in bytes

interface Values {
  title: string,
  description: string,
  discountchild: number,
  discountadult: number,
  startDate: any,
  endDate: any,
  profilePicture: any;
  typeticketId: string;
  submit: any;
}

const GETTICKETALL = gql`
   query GetTicketAll($idAmusementpark: String!) {
    GetTicketAll(id_amusementpark: $idAmusementpark) {
      id
      typesticket {
        types
      }
    }
  }
`;

const CREATE_NEW_PROMOTION = gql`
  mutation CreatePromotion($promotionInput: PromotionCreateInput!) {
    CreatePromotion(PromotionInput: $promotionInput) {
      success {
        message
      }
      error {
        message
      }
    }
  }
`;

export default function CreatePromotionPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string>("");
  const [ticketId, setTicketId] = useState<string>("");

  //  Query
  const {
    loading: queryTicketAllloading,
    error: queryTicketAllError,
    data: queryTicketAllData
  } = useQuery(GETTICKETALL, {
    variables: {
      idAmusementpark: localStorage.getItem("id_amusementpark")
    }
  })

  // Mutation
  const [createPromotion] = useMutation(CREATE_NEW_PROMOTION);

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
      title: '',
      description: '',
      discountchild: 0,
      discountadult: 0,
      startDate: null,
      endDate: null,
      profilePicture: null,
      typeticketId: '',
      submit: null
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().max(100).required('คุณยังไม่ได้ใส่ชื่อโปรโมชั่น'),
      description: Yup.string().max(500).required('คุณยังไม่ได้ใส่รายละเอียดโปรโมชั่น'),
      discountchild: Yup.number().required('คุณยังไม่ได้ใส่ส่วนลดราคาบัตรเด็ก'),
      discountadult: Yup.number().required('คุณยังไม่ได้ใส่ส่วนลดราคาบัตรผู้ใหญ่'),
      typeticketId: Yup.string().required('คุณยังไม่ได้เลือกโปรโมชั่นประเภทตั๋ว'),
      // endDate: Yup.string().required('คุณยังไม่ได้ใส่วันหมดโปรโมชั่น'),
    }),
    onSubmit: async (
      values: Values,
      { setErrors, setStatus, setSubmitting }
    ) => {
      try {


        // console.log({
        //   id_amusementpark: localStorage.getItem("id_amusementpark"),
        //   id_ticket: ticketId,
        //   title: values.title,
        //   description: values.description,
        //   discountchild: values.discountchild,
        //   discountadult: values.discountadult,
        //   startDate: values.startDate,
        //   endDate: values.endDate,
        //   profilePicture: {
        //     filename: values?.profilePicture?.name || "",
        //     mimeType: values?.profilePicture?.type || "",
        //     data: uploadedFile?.split(',')[1] || "",
        //   }
        // })

        setOpenModal(true)

        const result = await createPromotion({
          variables: {
            promotionInput: {
              id_amusementpark: localStorage.getItem("id_amusementpark"),
              id_ticket: ticketId,
              title: values.title,
              description: values.description,
              discountchild: values.discountchild,
              discountadult: values.discountadult,
              startDate: values.startDate,
              endDate: values.endDate,
              profilePicture: {
                filename: values?.profilePicture?.name || "",
                mimeType: values?.profilePicture?.type || "",
                data: uploadedFile?.split(',')[1] || "",
              }
            },
          }
        });


        if (result.data.CreatePromotion.success !== null) {
          setOpenModal(false)
          notifyToastSuccess(`เพิ่มโปรโมชั่น ${values.title} สำเร็จ`, 2000)
          navigate("/dashboard/management/promotion/list")
        } else {
          console.log(result.data.CreatePromotion)
          setOpenModal(false)
          notifyToastError(`เพิ่มปรโมชั่น ${values.title} ไม่สำเร็จ`)
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
        <title> Create Promotion | Management </title>
      </Helmet>

      {!queryTicketAllloading ? (
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
                    label="First Name"
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
                    id="outlined-discountchild"
                    type="number"
                    value={formik.values.discountchild}
                    name="discountchild"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    fullWidth
                    error={Boolean(formik.touched.discountchild && formik.errors.discountchild)}
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
                    label="Discount for child"
                    autoComplete="username"
                    helperText={formik.touched.discountchild && formik.errors.discountchild}
                  />
                </Grid>
                <Grid xs={6}>
                  <TextField
                    id="outlined-discountadult"
                    type="number"
                    value={formik.values.discountadult}
                    name="discountadult"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    fullWidth
                    error={Boolean(formik.touched.discountadult && formik.errors.discountadult)}
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
                    label="Discount for adult"
                    autoComplete="username"
                    helperText={formik.touched.discountadult && formik.errors.discountadult}
                  />
                </Grid>
                <Grid xs={6}>
                  <FormControl fullWidth error={Boolean(formik.touched.startDate && formik.errors.startDate)}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"th"}>
                      <DatePicker
                        className="startDate"
                        value={dayjs(formik.values.startDate)}
                        onChange={(time: any) =>
                          // console.log("time ", dayjs(time).format("YYYY-MM-DD"))
                          formik.setFieldValue('startDate', dayjs(time).format("YYYY-MM-DD"))
                        }
                        format='DD/MM/YYYY'
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
                        label="Start Date"
                      />
                    </LocalizationProvider>
                    {formik.touched.startDate && formik.errors.startDate && (
                      <FormHelperText error id="standard-weight-helper-text-startDate">
                        {formik.values?.startDate == null && "คุณยังไม่ได้ใส่วันเริ่มโปรโมชั่น"}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid xs={6}>
                  <FormControl fullWidth error={Boolean(formik.touched.endDate && formik.errors.endDate)}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"th"}>
                      <DatePicker
                        className="endDate"
                        value={dayjs(formik.values.endDate)}
                        onChange={(time: any) =>
                          // console.log("time ", time)
                          formik.setFieldValue('endDate', dayjs(time).format("YYYY-MM-DD"))
                        }
                        format='DD/MM/YYYY'
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
                        label="Start Date"
                      />
                    </LocalizationProvider>
                    {formik.touched.endDate && formik.errors.endDate && (
                      <FormHelperText error id="standard-weight-helper-text-endDate">
                        {formik.values?.endDate == null && "คุณยังไม่ได้ใส่วันเริ่มโปรโมชั่น"}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid xs={6}>
                  <TextField
                    id="outlined-select-typeticketId"
                    value={formik.values.typeticketId}
                    name="typeticketId"
                    onBlur={formik.handleBlur}
                    onChange={(event) => {
                      const ticketIds = queryTicketAllData.GetTicketAll.filter((item: any) => item.typesticket.types == event.target.value)
                      formik.setFieldValue('typeticketId', ticketIds[0].typesticket.types),
                        setTicketId(ticketIds[0].id)
                    }}
                    variant="outlined"
                    fullWidth
                    select
                    error={Boolean(formik.touched.typeticketId && formik.errors.typeticketId)}
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
                    label="Types of Ticket"
                    helperText={formik.touched.typeticketId && formik.errors.typeticketId}
                  >
                    {queryTicketAllData.GetTicketAll.map((option: any) => (
                      <MenuItem key={option.id} value={option.typesticket.types}>
                        {option.typesticket.types}
                      </MenuItem>
                    ))}
                  </TextField>
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
                        formik.errors?.title
                        || formik.errors.description
                        || formik.errors.discountchild
                        || formik.errors.discountadult
                        || formik.errors.startDate
                        || formik.errors.endDate
                        || formik.errors.typeticketId
                        || formik.isSubmitting
                      )
                    }
                  >
                    Create Promotion
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
              <Typography variant="h4" mt={5}>กำลังเพิ่มโปรโมชั่น...</Typography>
            </MainCard>
          </Modal>
        </Stack>
      ) : (
        <Box display={"flex"} height={"100%"} justifyContent={'center'} alignItems={'center'} >
          <CircularProgress size={80} disableShrink />
        </Box >
      )}
    </ >
  )
}