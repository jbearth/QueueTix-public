import React, {
  useRef,
  useState,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle
} from "react";
import {
  Box,
  Typography,
} from "@mui/material";

// project imports
import { Icon } from "@iconify/react";

// third party
import dayjs from 'dayjs';
import 'dayjs/locale/th'
// import { th } from 'date-fns/locale'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { PickersLocaleText } from "@mui/x-date-pickers";

const TuiDateRangePicker = forwardRef((props: any, ref: any) => {

  const start = new Date();
  const end = new Date(new Date().setDate(start.getDate() + 1));
  const { startdateupdate, enddateupdate, onChange, orientation, ampm } = props;
  const [rangePicker, setRangePicker] = useState<any>({
    startdate: null,
    enddate: null
  });
  const startPickerInputRef = useRef<any>(null);
  const endPickerInputRef = useRef<any>(null);

  function handlerCreateEvent(inputIdentifier: string, enteredValue: any) {
    setRangePicker((curInputValues: any) => {
      return {
        ...curInputValues,
        [inputIdentifier]: enteredValue,
      }
    })
  }

  useLayoutEffect(() => {
    if ((rangePicker.startdate && rangePicker.enddate) != "") {
      // console.log("save onchange")
      onChange([rangePicker.startdate, rangePicker.enddate])
    }
  })

  // Set translations locally
  const thTHPickers: PickersLocaleText<any> = {
    // Calendar navigation
    previousMonth: 'Previous month',
    nextMonth: 'Next month',

    // View navigation
    openPreviousView: 'open previous view',
    openNextView: 'open next view',
    calendarViewSwitchingButtonAriaLabel: (view) =>
      view === 'year'
        ? 'year view is open, switch to calendar view'
        : 'calendar view is open, switch to year view',

    // DateRange placeholders
    start: 'Start',
    end: 'End',

    // Action bar
    cancelButtonLabel: 'ยกเลิก',
    clearButtonLabel: 'Clear',
    okButtonLabel: 'OK',
    todayButtonLabel: 'Today',

    // Toolbar titles
    datePickerToolbarTitle: 'Select date',
    dateTimePickerToolbarTitle: 'เลือกวันที่และเวลา',
    timePickerToolbarTitle: 'Select time',
    dateRangePickerToolbarTitle: 'Select date range',

    // Clock labels
    clockLabelText: (view, time, adapter) =>
      `Select ${view}. ${time === null ? 'No time selected' : `Selected time is ${adapter.format(time, 'fullTime')}`
      }`,
    hoursClockNumberText: (hours) => `${hours} hours`,
    minutesClockNumberText: (minutes) => `${minutes} minutes`,
    secondsClockNumberText: (seconds) => `${seconds} seconds`,

    // Digital clock labels
    selectViewText: (view) => `Select ${view}`,

    // Calendar labels
    calendarWeekNumberHeaderLabel: 'Week number',
    calendarWeekNumberHeaderText: '#',
    calendarWeekNumberAriaLabelText: (weekNumber) => `Week ${weekNumber}`,
    calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

    // Open picker labels
    openDatePickerDialogue: (value, utils) =>
      value !== null && utils.isValid(value)
        ? `Choose date, selected date is ${utils.format(value, 'fullDate')}`
        : 'Choose date',
    openTimePickerDialogue: (value, utils) =>
      value !== null && utils.isValid(value)
        ? `Choose time, selected time is ${utils.format(value, 'fullTime')}`
        : 'Choose time',

    // Table labels
    timeTableLabel: 'pick time',
    dateTableLabel: 'pick date',

    // Field section placeholders
    fieldYearPlaceholder: (params) => 'Y'.repeat(params.digitAmount),
    fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'MMMM' : 'MM'),
    fieldDayPlaceholder: () => 'DD',
    fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'EEEE' : 'EE'),
    fieldHoursPlaceholder: () => 'hh',
    fieldMinutesPlaceholder: () => 'mm',
    fieldSecondsPlaceholder: () => 'ss',
    fieldMeridiemPlaceholder: () => 'aa',
  };

  const styleSection = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    my: 2,
    mx: 3
  }

  return (
    <>
      <Box sx={{ ...styleSection }}>
        <Typography variant="h4" fontFamily={'Sarabun-Medium'} >Start</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={thTHPickers} adapterLocale="th">
          <MobileDateTimePicker
            // inputRef={ref}
            orientation={orientation}
            defaultValue={dayjs(startdateupdate) || dayjs(start)}
            format={'DD/MM/YYYY HH:mm'}
            ampm={ampm}
            onAccept={(e) => handlerCreateEvent("startdate", e)}
            sx={{
              maxWidth: '32ch',
              width: '100%',
              ml: 7.5,
              borderRadius: 5,
            }}
            slots={{}}
            slotProps={{
              tabs: {
                dateIcon: <Icon icon="icon-park-twotone:calendar" width={30} />,
                timeIcon: <Icon icon="icon-park-twotone:time" width={30} />,
              }
            }}
          />
        </LocalizationProvider>
      </Box>
      <Box sx={{ ...styleSection }}>
        <Typography variant="h4" fontFamily={'Sarabun-Medium'} >End</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDateTimePicker
            inputRef={endPickerInputRef}
            orientation={orientation}
            defaultValue={dayjs(enddateupdate) || dayjs(end)}
            format={'DD/MM/YYYY HH:mm'}
            ampm={ampm}
            onAccept={(e) => handlerCreateEvent("enddate", e)}
            sx={{
              maxWidth: '32ch',
              width: '100%',
              ml: 8.5,
              borderRadius: 5,
              p: 0
            }}
            slots={{}}
            slotProps={{
              tabs: {
                hidden: false,
                dateIcon: <Icon icon="icon-park-twotone:calendar" width={30} />,
                timeIcon: <Icon icon="icon-park-twotone:time" width={30} />,
              }
            }}
          />
        </LocalizationProvider>
      </Box>
    </>
  );
});

export default TuiDateRangePicker;
