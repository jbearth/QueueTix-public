import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  InputBase,
  MenuItem,
  Modal,
  TextField,
  Typography
} from "@mui/material";

// third party
import * as Yup from 'yup';
import { useFormik } from 'formik';


// project imports
import DateRangePicker from "./DateRangePicker";
import { useTheme } from '@mui/material/styles';
// import dayjs from 'dayjs';

// assets
import { Icon } from "@iconify/react";

const CustomTuiModal = (
  {
    isOpen = false,
    handleModalClose,
    onSubmit,
    submitText = "Save",
    calendars = [],
    schedule,
    startDate,
    endDate
  }: any) => {
  // console.log(schedule)

  const theme: any = useTheme();
  // const dateRangePickerRef = useRef<ChildRef>(null);

  const [calendarId, setCalendarId] = useState(calendars[0].id);
  const [valuesschedule, setValuesSchedule] = useState<any>({
    title: "",
    description: ""
  });
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);

  const formik: any = useFormik({
    initialValues: {
      category: calendars[0].name,
      title: valuesschedule.title,
      description: valuesschedule.description,
      startdate: null,
      allday: null,
      color: null,
      submit: null
    },
    validationSchema: Yup.object().shape({
      category: Yup.string(),
      title: Yup.string().max(40).required('กรุณากรอกชื่อหัวข้อกิจกรรม'),
      description: Yup.string().max(100).required('กรุณากรอกรายละเอียด'),
    }),
    onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
      try {
        // console.log("value: ", values)
        setStatus({ success: true });
        setSubmitting(false);
        const event = {
          calendarId,
          title: values.title,
          body: values.description,
          start,
          end,
          ...calendars.find((element: { id: any; }) => element.id === calendarId)
        };
        console.log("event", event);
        onSubmit(event);

      } catch (err: any) {
        console.error(err);
        setStatus({ success: false });
        setErrors({ submit: err.message });
        setSubmitting(false);
      }
    }
  });

  function handlerSetSchedule(inputIdentifier: string, enteredValue: any) {
    setValuesSchedule((curInputValues: any) => {
      return {
        ...curInputValues,
        [inputIdentifier]: enteredValue,
      }
    })
  }

  // const handleClick = (e: { target: any; }) => {
  // if (wrapperSelectCategoryRef.current?.contains(e.target)) {
  //   // inside click
  //   // console.log("inside");
  //   return;
  // }
  // if (wrapperSelectAttendeesRef.current?.contains(e.target)) {
  //   // inside click
  //   // console.log("inside");
  //   return;
  // }
  // outside click
  // ... do whatever on click outside here ...
  // console.log("outside");
  // };

  // useEffect(() => {
  // document.addEventListener("click", handleClick, false);

  // return () => {
  //   document.removeEventListener("click", handleClick, false);
  // };
  // });

  useLayoutEffect(() => {
    if (schedule) {
      setCalendarId(schedule.calendarId);
      // setAuthoritiesId(
      //   authorities.find((element: any) => schedule.authorities.includes(element.name)).id
      // );
      // console.log(schedule.start.toDate(), schedule.end.toDate())
      // console.log(schedule.title, schedule.body)
      formik.setFieldValue("title", schedule.title)
      formik.setFieldValue("description", schedule.body)
      setStart(schedule.start.toDate());
      setEnd(schedule.end.toDate());
    }
    return () => { };
  }, [schedule, startDate, endDate]);

  function reset() {
    setCalendarId(calendars[0].id);

    // setAuthoritiesId(authorities[0].id);
    setStart(new Date());
    setEnd(new Date());
  }

  const styleInputBase = {
    maxWidth: '32ch',
    width: '100%',
    lineHeight: 10,
    borderRadius: 2,
    bgcolor: theme.palette.grey[50],
    '& .MuiInputBase-input': {
      textAlign: 'center',
      lineHeight: 8,
      py: 1
    }
  }

  const styleSection = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => {
          handleModalClose();
          reset();
        }}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        disableAutoFocus
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: 450,
          [theme.breakpoints.down('lg')]: {
            minWidth: 400
          },
          [theme.breakpoints.down('sm')]: {
            minWidth: '80%'
          },
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          borderColor: 'red',
          boxShadow: 24,
        }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >

            <form noValidate onSubmit={formik.handleSubmit}>
              {/* header event modal */}
              <Box
                sx={{
                  display: 'flex',
                  bgcolor: theme.palette.grey[50],
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  boxShadow: '0px 0px 1px #000',
                }}
              >
                <Button
                  sx={{
                    fontSize: theme.typography.h4,
                    fontFamily: 'Sarabun-Medium',
                    color: theme.palette.primary.main
                  }}
                  onClick={() => {
                    handleModalClose();
                    reset();
                  }}
                >ยกเลิก</Button>
                <Typography variant="h4" fontFamily={'Sarabun-Bold'}>Create Event</Typography>
                <Button
                  sx={{
                    fontSize: theme.typography.h4,
                    fontFamily: 'Sarabun-Medium',
                    color: theme.palette.primary.main
                  }}
                  type="submit"
                  disabled={formik.isSubmitting}
                >{submitText}</Button>
              </Box>

              {/* content event modal */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  my: 2,
                  px: 3,
                  borderRadius: 1
                }}
              >
                <Typography variant="h4" fontFamily={'Sarabun-Medium'} >Category</Typography>
                <TextField
                  id="outlined-select-currency"
                  select
                  name={"category"}
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  sx={{
                    width: '50%',
                  }}
                >
                  {calendars.map((element: any, i: React.Key | null | undefined) => (
                    <MenuItem key={i} value={element.name}>
                      <Button
                        sx={{ height: 20, color: '#000000' }}
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <Icon icon={"mdi:checkbox-blank-circle"} width={14} color={element.bgColor} style={{ marginRight: 12 }} />
                        {element.name}
                      </Button>
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Divider variant="middle" />

              {/* title event */}
              <FormControl
                fullWidth
                error={Boolean(formik.touched.title && formik.errors.title)}
                sx={{ my: 2, px: 3 }}
              >
                <Box sx={{ ...styleSection }}>
                  <Typography variant="h4" fontFamily={'Sarabun-Medium'} >Title</Typography>
                  <InputBase
                    id="outlined-adornment-title-event"
                    type="text"
                    value={formik.values.title}
                    name="title"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    sx={{ ...styleInputBase }}
                    placeholder="ชื่อหัวข้อกิจกรรม"
                    inputProps={{ 'aria-label': 'Title Event' }}
                  />
                </Box>
                {formik.touched.title && formik.errors.title && (
                  <FormHelperText error id="standard-weight-helper-text-title-event" sx={{ ml: 15.5 }}>
                    {formik.errors.title}
                  </FormHelperText>
                )}
              </FormControl>

              {/* description event */}
              <FormControl
                fullWidth
                error={Boolean(formik.touched.description && formik.errors.description)}
                sx={{ my: 2, px: 3 }}
              >
                <Box sx={{ ...styleSection }}>
                  <Typography variant="h4" fontFamily={'Sarabun-Medium'} >Description</Typography>
                  <InputBase
                    id="outlined-adornment-description-event"
                    type="text"
                    value={formik.values.description}
                    name="description"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    sx={{ ...styleInputBase }}
                    placeholder="รายละเอียดกิจกรรม"
                    inputProps={{ 'aria-label': 'Title Event' }}
                  />
                </Box>
                {formik.touched.description && formik.errors.description && (
                  <FormHelperText error id="standard-weight-helper-text-description-event" sx={{ ml: 15.5 }}>
                    {formik.errors.description}
                  </FormHelperText>
                )}
              </FormControl>
              <Divider variant="middle" />
            </form>

            {/* Date Range Picker */}
            <DateRangePicker
              // ref={dateRangePickerRef}
              startdateupdate={start}
              enddateupdate={end}
              // start={start}
              // end={end}
              onChange={(e: any[]) => {
                // console.log("event range", e[0], e[1])
                setStart(e[0]);
                setEnd(e[1]);
              }}
              ampm={false}
              orientation="landscape"
              language='th'
            />

            <Divider variant="middle" />
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default CustomTuiModal
