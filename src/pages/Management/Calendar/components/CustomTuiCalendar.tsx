import React, {
  useRef,
  useLayoutEffect,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle
} from "react";
import TuiCalendar from "tui-calendar";

// import Cal
import moment from "moment";

import "tui-calendar/dist/tui-calendar.css";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from "@mui/material";

const CustomTuiCalendar = forwardRef(
  (
    {
      height = "800px",
      defaultView = "month",
      calendars = [],
      schedules = [],
      isReadOnly = true,
      showSlidebar = false,
      showMenu = false,
      onCreate,
      createText = "New schedule",
      onBeforeCreateSchedule = () => false,
      onBeforeUpdateSchedule = () => false,
      onBeforeDeleteSchedule = () => false,
      ...rest
    }: any,
    ref
  ) => {
    const calendarInstRef = useRef<any>(null);
    const tuiRef = useRef<any>(null);
    const wrapperRef = useRef<any>(null);
    const [open, setOpen] = useState(false);
    const [renderRange, setRenderRange] = useState("");
    const [workweek, setWorkweek] = useState(true);
    const [narrowWeekend, setNarrowWeekend] = useState(true);
    const [startDayOfWeek, setStartDayOfWeek] = useState(1);
    const [type, setType] = useState("Month");
    const [checkedCalendars, setCheckedCalendars] = useState(
      calendars.map((element: any) => ({ ...element, isChecked: true }))
    );
    const [filterSchedules, setFilterSchedules] = useState(schedules);

    useImperativeHandle(ref, () => ({
      getAlert() {
        alert("getAlert from Child");
      },
      createSchedule,
      updateSchedule,
      deleteSchedule
    }));

    useEffect(() => {
      calendarInstRef.current = new TuiCalendar(tuiRef.current, {
        useDetailPopup: true,
        useCreationPopup: true,
        defaultView,
        template: {
          milestone: function (schedule) {
            return (
              '<span class="calendar-font-icon ic-milestone-b"></span> <span style="background-color: ' +
              schedule.bgColor +
              '">' +
              schedule.title +
              "</span>"
            );
          },
          milestoneTitle: function () {
            return '<span class="tui-full-calendar-left-content">MILESTONE</span>';
          },
          task: function (schedule) {
            return "#" + schedule.title;
          },
          taskTitle: function () {
            return '<span class="tui-full-calendar-left-content">TASK</span>';
          },
          allday: function (schedule) {
            return _getTimeTemplate(schedule, true);
          },
          alldayTitle: function () {
            return '<span class="tui-full-calendar-left-content">ALL DAY</span>';
          },
          time: function (schedule) {
            return _getTimeTemplate(schedule, false);
          },
          goingDuration: function (schedule) {
            return (
              '<span class="calendar-icon ic-travel-time"></span>' +
              schedule.goingDuration +
              "min."
            );
          },
          comingDuration: function (schedule) {
            return (
              '<span class="calendar-icon ic-travel-time"></span>' +
              schedule.comingDuration +
              "min."
            );
          },
          monthMoreTitleDate: function (date, dayname) {
            var day = date.split(".")[2];

            return (
              '<span class="tui-full-calendar-month-more-title-day">' +
              day +
              '</span> <span class="tui-full-calendar-month-more-title-day-label">' +
              dayname +
              "</span>"
            );
          },
          monthMoreClose: function () {
            return '<span class="tui-full-calendar-icon tui-full-calendar-ic-close"></span>';
          },
          monthGridHeader: function (dayModel) {
            var date = parseInt(dayModel.date.split("-")[2], 10);
            var classNames = ["tui-full-calendar-weekday-grid-date "];

            if (dayModel.isToday) {
              classNames.push("tui-full-calendar-weekday-grid-date-decorator");
            }

            return (
              '<span class="' + classNames.join(" ") + '">' + date + "</span>"
            );
          },
          monthGridHeaderExceed: function (hiddenSchedules) {
            return (
              '<span class="weekday-grid-more-schedules">+' +
              hiddenSchedules +
              "</span>"
            );
          },
          monthGridFooter: function () {
            return "";
          },
          monthGridFooterExceed: function (hiddenSchedules) {
            return "";
          },
          monthDayname: function (model) {
            return model.label.toString().toLocaleUpperCase();
          },
          weekDayname: function (model) {
            return (
              '<span class="tui-full-calendar-dayname-date">' +
              model.date +
              '</span>&nbsp;&nbsp;<span class="tui-full-calendar-dayname-name">' +
              model.dayName +
              "</span>"
            );
          },
          weekGridFooterExceed: function (hiddenSchedules) {
            return "+" + hiddenSchedules;
          },
          dayGridTitle: function (viewName) {
            // use another functions instead of 'dayGridTitle'
            // milestoneTitle: function() {...}
            // taskTitle: function() {...}
            // alldayTitle: function() {...}

            var title = "";
            switch (viewName) {
              case "milestone":
                title =
                  '<span class="tui-full-calendar-left-content">MILESTONE</span>';
                break;
              case "task":
                title =
                  '<span class="tui-full-calendar-left-content">TASK</span>';
                break;
              case "allday":
                title =
                  '<span class="tui-full-calendar-left-content">ALL DAY</span>';
                break;
              default:
                break;
            }

            return title;
          },
          // schedule: function(schedule) {
          //   // use another functions instead of 'schedule'
          //   // milestone: function() {...}
          //   // task: function() {...}
          //   // allday: function() {...}

          //   var tpl;

          //   switch (category) {
          //     case "milestone":
          //       tpl =
          //         '<span class="calendar-font-icon ic-milestone-b"></span> <span style="background-color: ' +
          //         schedule.bgColor +
          //         '">' +
          //         schedule.title +
          //         "</span>";
          //       break;
          //     case "task":
          //       tpl = "#" + schedule.title;
          //       break;
          //     case "allday":
          //       tpl = _getTimeTemplate(schedule, true);
          //       break;
          //     default:
          //       break;
          //   }

          //   return tpl;
          // },
          collapseBtnTitle: function () {
            return '<span class="tui-full-calendar-icon tui-full-calendar-ic-arrow-solid-top"></span>' + "222";
          },
          // timezoneDisplayLabel: function(timezoneOffset, displayLabel) {
          //   var gmt, hour, minutes;

          //   if (!displayLabel) {
          //     gmt = timezoneOffset < 0 ? "-" : "+";
          //     hour = Math.abs(parseInt(timezoneOffset / 60, 10));
          //     minutes = Math.abs(timezoneOffset % 60);
          //     displayLabel = gmt + getPadStart(hour) + ":" + getPadStart(minutes);
          //   }

          //   return displayLabel;
          // },
          timegridDisplayPrimayTime: function (time) {
            // will be deprecated. use 'timegridDisplayPrimaryTime'
            var meridiem = "am";
            var hour = time.hour;

            if (time.hour > 12) {
              meridiem = "pm";
              hour = time.hour - 12;
            }

            return hour + " " + meridiem;
          },
          timegridDisplayPrimaryTime: function (time) {
            var meridiem = "am";
            var hour = time.hour;

            if (time.hour > 12) {
              meridiem = "pm";
              hour = time.hour - 12;
            }

            return hour + " " + meridiem;
          },
          // timegridDisplayTime: function(time) {
          //   return getPadStart(time.hour) + ":" + getPadStart(time.hour);
          // },
          timegridCurrentTime: function (timezone: any) {
            var templates = [];

            if (timezone.dateDifference) {
              templates.push(
                "[" +
                timezone.dateDifferenceSign +
                timezone.dateDifference +
                "]<br>"
              );
            }

            templates.push(moment(timezone.hourmarker).format("HH:mm "));

            return templates.join("");
          },
          popupIsAllDay: function () {
            return "All Day";
          },
          popupStateFree: function () {
            return "Free";
          },
          popupStateBusy: function () {
            return "Busy";
          },
          titlePlaceholder: function () {
            return "Subject";
          },
          locationPlaceholder: function () {
            return "Location";
          },
          startDatePlaceholder: function () {
            return "Start date";
          },
          endDatePlaceholder: function () {
            return "End date";
          },
          popupSave: function () {
            return "บันทึก";
          },
          popupUpdate: function () {
            return "อัพเดท";
          },
          popupDetailTitle: function (schedule: any) {
            return "title : " + schedule.title;
          },
          popupDetailDate: function (isAllDay, start: any, end: any) {
            var isSameDate = moment(start).isSame(end);
            var endFormat = (isSameDate ? "" : "DD/MM/YYYY ") + "HH:mm";

            if (isAllDay) {
              return (
                moment(start).format("DD/MM/YYYY") +
                (isSameDate ? "" : " - " + moment(end).format("DD/MM/YYYY"))
              );
            }

            return (
              moment(start.toDate()).format("DD/MM/YYYY HH:mm") +
              " - " +
              moment(end.toDate()).format(endFormat)
            );
          },
          popupDetailState: function (schedule) {
            return "State : " + schedule.state || "Busy";
          },
          popupDetailRepeat: function (schedule) {
            return "Repeat : " + schedule.recurrenceRule;
          },
          popupDetailBody: function (schedule) {
            return "รายละเอียด : " + schedule.body;
          },
          popupEdit: function () {
            return "แก้ไข";
          },
          popupDelete: function () {
            return "ลบ";
          }
        },
        // template: {
        //   time: function(schedule) {
        //     // console.log(schedule);
        //     return _getTimeTemplate(schedule, false);
        //   }
        // },
        calendars,
        ...rest
      });
      setRenderRangeText();
      // render schedules
      calendarInstRef.current.clear();
      calendarInstRef.current.createSchedules(filterSchedules, true);
      calendarInstRef.current.render();

      calendarInstRef.current.on("beforeCreateSchedule", function (event: any) {
        onBeforeCreateSchedule(event);
        console.log("1111")
      });
      calendarInstRef.current.on("beforeUpdateSchedule", function (event: any) {
        onBeforeUpdateSchedule(event);
        console.log("2222")
      });
      calendarInstRef.current.on("beforeDeleteSchedule", function (event: any) {
        onBeforeDeleteSchedule(event);
        console.log("3333")
      });
      calendarInstRef.current.on("clickSchedule", function (event: any) {
        console.log("4444")
        // var schedule = event.schedule;
        // console.log("clickSchedule", event);
        // if (lastClickSchedule) {
        //   calendarInstRef.current.updateSchedule(
        //     lastClickSchedule.id,
        //     lastClickSchedule.calendarId,
        //     {
        //       isFocused: false
        //     }
        //   );
        // }
        // calendarInstRef.current.updateSchedule(schedule.id, schedule.calendarId, {
        //   isFocused: true
        // });
        // lastClickSchedule = schedule;
        // open detail view
      });
      calendarInstRef.current.on("clickDayname", function (event: any) {
        // console.log("clickDayname", event);
        if (calendarInstRef.current.getViewName() === "week") {
          calendarInstRef.current.setDate(new Date(event.date));
          calendarInstRef.current.changeView("day", true);
        }
      });

      calendarInstRef.current.on("clickMore", function (event: any) {
        // console.log("clickMore", event.date, event.target);
      });

      calendarInstRef.current.on("clickTimezonesCollapseBtn", function (
        timezonesCollapsed: any
      ) {
        console.log(timezonesCollapsed);
      });

      calendarInstRef.current.on("afterRenderSchedule", function (event: any) {
        // var schedule = event.schedule;
        // var element = calendarInstRef.current.getElement(
        //   schedule.id,
        //   schedule.calendarId
        // );
        // use the element
        // console.log(element);
      });

      return () => {
        calendarInstRef.current.destroy();
      };
    }, [tuiRef, schedules]);

    useLayoutEffect(() => {
      // console.log("before render");
    });

    function currentCalendarDate(format: any) {
      var currentDate = moment([
        calendarInstRef.current.getDate().getFullYear(),
        calendarInstRef.current.getDate().getMonth(),
        calendarInstRef.current.getDate().getDate()
      ]);

      return currentDate.format(format);
    }

    function setRenderRangeText() {
      var options = calendarInstRef.current.getOptions();
      var viewName = calendarInstRef.current.getViewName();

      var html = [];
      if (viewName === "day") {
        html.push(currentCalendarDate("DD.MM.YYYY"));
      } else if (
        viewName === "month" &&
        (!options.month.visibleWeeksCount ||
          options.month.visibleWeeksCount > 4)
      ) {
        html.push(currentCalendarDate("MM.YYYY"));
      } else {
        html.push(
          moment(calendarInstRef.current.getDateRangeStart().getTime()).format(
            "DD.MM.YYYY"
          )
        );
        html.push(" ~ ");
        html.push(
          moment(calendarInstRef.current.getDateRangeEnd().getTime()).format(
            " DD.MM"
          )
        );
      }
      setRenderRange(html.join(""));
    }

    function _getTimeTemplate(schedule: any, isAllDay: boolean) {
      var html = [];

      if (!isAllDay) {
        html.push(
          "<strong>" +
          moment(schedule.start.toDate()).format("HH:mm") +
          "</strong> "
        );
      }
      if (schedule.isPrivate) {
        html.push('<span class="calendar-font-icon ic-lock-b"></span>');
        html.push(" Private");
      } else {
        if (schedule.isReadOnly) {
          html.push('<span class="calendar-font-icon ic-readonly-b"></span>');
        } else if (schedule.recurrenceRule) {
          html.push('<span class="calendar-font-icon ic-repeat-b"></span>');
        } else if (schedule.attendees.length) {
          html.push('<span class="calendar-font-icon ic-user-b"></span>');
        } else if (schedule.location) {
          html.push('<span class="calendar-font-icon ic-location-b"></span>');
        }

        html.push(" " + schedule.title);
      }

      return html.join("");
    }

    useEffect(() => {
      document.addEventListener("click", handleClick, false);

      return () => {
        document.removeEventListener("click", handleClick, false);
      };
    });

    const handleClick = (e: any) => {
      if (wrapperRef.current?.contains(e.target)) {
        // inside click
        // console.log("inside");
        return;
      }
      // outside click
      // ... do whatever on click outside here ...
      // console.log("outside");
      setOpen(false);
    };

    const handleAllChecked = (event: any) => {
      const cloneCheckedCalendars = [...checkedCalendars];
      cloneCheckedCalendars.forEach(
        (element) => (element.isChecked = event.target.checked)
      );
      setCheckedCalendars(cloneCheckedCalendars);
      filterCalendar(cloneCheckedCalendars);
    };

    const handleCheckChildElement = (event: any) => {
      const cloneCheckedCalendars = [...checkedCalendars];
      cloneCheckedCalendars.forEach((element) => {
        if (element.id === event.target.value)
          element.isChecked = event.target.checked;
      });
      setCheckedCalendars(cloneCheckedCalendars);
      filterCalendar(cloneCheckedCalendars);
    };

    const filterCalendar = (cloneCheckedCalendars: any[]) => {
      const filterCalendars = cloneCheckedCalendars
        .filter((element) => element.isChecked === false)
        .map((item) => item.id);
      const cloneSchedules = filterSchedules.filter((element: { calendarId: any; }) => {
        return filterCalendars.indexOf(element.calendarId) === -1;
      });

      // rerender
      calendarInstRef.current.clear();
      calendarInstRef.current.createSchedules(cloneSchedules, true);
      calendarInstRef.current.render();
    };

    // const capitalizeFirstLetter = (value = "") => {
    //   return [...value[0].toUpperCase(), ...value.slice(1)].join("");
    // };

    function createSchedule(schedule: any) {
      console.log("createSchedule");

      calendarInstRef.current.createSchedules([schedule]);
      const cloneFilterSchedules = [...filterSchedules];
      setFilterSchedules((prevState: any) => [...cloneFilterSchedules, schedule]);
    }

    function updateSchedule(schedule: { id: any; calendarId: any; }, changes: any) {
      console.log("updateSchedule");

      calendarInstRef.current.updateSchedule(
        schedule.id,
        schedule.calendarId,
        changes
      );
      const cloneFilterSchedules = [...filterSchedules];
      setFilterSchedules((prevState: any) =>
        cloneFilterSchedules.map((item) => {
          if (item.id === schedule.id) {
            return { ...item, ...changes };
          }
          return item;
        })
      );
    }

    function deleteSchedule(schedule: { id: any; calendarId: any; }) {
      console.log("deleteSchedule");

      calendarInstRef.current.deleteSchedule(schedule.id, schedule.calendarId);
      const cloneFilterSchedules = [...filterSchedules];
      setFilterSchedules((prevState: any) =>
        cloneFilterSchedules.filter((item) => item.id !== schedule.id)
      );
    }

    const handleChangeCalendar = (event: SelectChangeEvent) => {
      setType(event.target.value);
    };

    const modecalendar = [
      {
        value: 'Daily',
        label: 'รายวัน',
        mode: 'day'
      },
      {
        value: 'Weekly',
        label: 'รายสัปดาห์',
        mode: 'week'
      },
      {
        value: 'Month',
        label: 'รายเดือน',
        mode: 'month'
      },
    ];

    const optionscalendar = [
      {
        value: 'WorkWeek',
        label: 'แสดงวันหยุด',
      },
      {
        value: 'StartDayofWeek',
        label: 'เริ่มต้นสัปดาห์ในวันจันทร์',
      },
      {
        value: 'NarrowWeekEnd',
        label: 'ขนาดความกว้างสุดสัปดาห์แคบลง',
      },
    ];

    return (
      <Box>
        {/* {showSlidebar && (
          <Box>
            {onCreate && (
              <div className="lnb-new-schedule">
                <button
                  id="btn-new-schedule"
                  type="button"
                  className="btn btn-default btn-block lnb-new-schedule-btn"
                  data-toggle="modal"
                  onClick={onCreate}
                >
                  {createText}
                </button>
              </div>
            )}
            <div id="lnb-calendars" className="lnb-calendars">
              <div>
                <div className="lnb-calendars-item">
                  <label>
                    <input
                      className="tui-full-calendar-checkbox-square"
                      type="checkbox"
                      defaultValue="all"
                      checked={checkedCalendars.every(
                        (element: { isChecked: boolean; }) => element.isChecked === true
                      )}
                      onChange={handleAllChecked}
                    />
                    <span />
                    <strong>View all</strong>
                  </label>
                </div>
              </div>
              <div id="calendarList" className="lnb-calendars-d1">
                {checkedCalendars.map((element: any, i: React.Key | null | undefined) => {
                  return (
                    <div key={i} className="lnb-calendars-item">
                      <label>
                        <input
                          type="checkbox"
                          className="tui-full-calendar-checkbox-round"
                          defaultValue={element.id}
                          checked={element.isChecked}
                          onChange={handleCheckChildElement}
                        />
                        <span
                          style={{
                            borderColor: element.bgColor,
                            backgroundColor: element.isChecked
                              ? element.bgColor
                              : "transparent"
                          }}
                        />
                        <span>{element.name}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </Box>
        )} */}

        <Box>
          {showMenu && (
            <Box id="menu">
              <Box
                ref={wrapperRef}
                style={{ marginRight: "4px" }}
              >
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <Select
                    value={type}
                    onChange={handleChangeCalendar}
                    defaultValue="Month"
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    {modecalendar.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Button
                          sx={{ height: 20 }}
                          onClick={(e) => {
                            e.preventDefault();
                            calendarInstRef.current.changeView(option.mode, true);
                            setType(option.value);
                            setOpen(false);
                          }}
                        >
                          {option.label}
                        </Button>
                      </MenuItem>
                    ))}
                    {/* {optionscalendar.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                defaultChecked
                                onChange={(e) => {
                                  e.preventDefault();
                                  calendarInstRef.current.setOptions(
                                    { month: { workweek } },
                                    true
                                  );
                                  calendarInstRef.current.setOptions(
                                    { week: { workweek } },
                                    true
                                  );
                                  calendarInstRef.current.changeView(
                                    calendarInstRef.current.getViewName(),
                                    true
                                  );
                                  setWorkweek(!workweek);
                                  setOpen(false);
                                }}
                              />
                            }
                            label={option.label}
                          />
                        </FormGroup>
                      </MenuItem>
                    ))} */}
                  </Select>
                </FormControl>
                {/* <ul
                  className="dropdown-menu"
                  role="menu"
                  aria-labelledby="dropdownMenu-calendarType"
                >
                                  
                  <li role="presentation">
                    <a
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        calendarInstRef.current.setOptions(
                          { month: { visibleWeeksCount: 2 } },
                          true
                        ); // or null
                        calendarInstRef.current.changeView("month", true);
                        setType("2 weeks");
                        setOpen(false);
                      }}
                      className="dropdown-menu-title"
                      role="menuitem"
                      data-action="toggle-weeks2"
                    >
                      <i className="calendar-icon ic_view_week" />2 weeks
                    </a>
                  </li>
                  <li role="presentation">
                    <a
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        calendarInstRef.current.setOptions(
                          { month: { visibleWeeksCount: 3 } },
                          true
                        ); // or null
                        calendarInstRef.current.changeView("month", true);
                        setType("3 weeks");
                        setOpen(false);
                      }}
                      className="dropdown-menu-title"
                      role="menuitem"
                      data-action="toggle-weeks3"
                    >
                      <i className="calendar-icon ic_view_week" />3 weeks
                    </a>
                  </li>
                  <li role="presentation">
                    <a
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        calendarInstRef.current.setOptions(
                          { month: { workweek } },
                          true
                        );
                        calendarInstRef.current.setOptions(
                          { week: { workweek } },
                          true
                        );
                        calendarInstRef.current.changeView(
                          calendarInstRef.current.getViewName(),
                          true
                        );
                        setWorkweek(!workweek);
                        setOpen(false);
                      }}
                      role="menuitem"
                      data-action="toggle-workweek"
                    >
                      <input
                        type="checkbox"
                        className="tui-full-calendar-checkbox-square"
                        checked={workweek}
                        onChange={() => { }}
                      />
                      <span className="checkbox-title" />
                      Show weekends
                    </a>
                  </li>
                  <li role="presentation">
                    <a
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        calendarInstRef.current.setOptions(
                          { week: { startDayOfWeek } },
                          true
                        );
                        calendarInstRef.current.setOptions(
                          { month: { startDayOfWeek } },
                          true
                        );
                        calendarInstRef.current.changeView(
                          calendarInstRef.current.getViewName(),
                          true
                        );
                        setStartDayOfWeek(startDayOfWeek === 1 ? 0 : 1);
                        setOpen(false);
                      }}
                      role="menuitem"
                      data-action="toggle-start-day-1"
                    >
                      <input
                        type="checkbox"
                        className="tui-full-calendar-checkbox-square"
                        checked={startDayOfWeek !== 1 ? true : false}
                        onChange={() => { }}
                      />
                      <span className="checkbox-title" />
                      Start Week on Monday
                    </a>
                  </li>
                  <li role="presentation">
                    <a
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        calendarInstRef.current.setOptions(
                          { month: { narrowWeekend } },
                          true
                        );
                        calendarInstRef.current.setOptions(
                          { week: { narrowWeekend } },
                          true
                        );
                        calendarInstRef.current.changeView(
                          calendarInstRef.current.getViewName(),
                          true
                        );
                        setNarrowWeekend(!narrowWeekend);
                        setOpen(false);
                      }}
                      role="menuitem"
                      data-action="toggle-narrow-weekend"
                    >
                      <input
                        type="checkbox"
                        className="tui-full-calendar-checkbox-square"
                        checked={narrowWeekend}
                        onChange={() => { }}
                      />
                      <span className="checkbox-title" />
                      Narrower than weekdays
                    </a>
                  </li>
                </ul> */}
              </Box>

              {/* <span id="menu-navi">
                <button
                  type="button"
                  className="btn btn-default btn-sm move-today"
                  style={{ marginRight: "4px" }}
                  data-action="move-today"
                  onClick={() => {
                    // console.log("today");
                    calendarInstRef.current.today();
                    setRenderRangeText();
                  }}
                >
                  Today
                </button>
                <button
                  type="button"
                  className="btn btn-default btn-sm move-day"
                  style={{ marginRight: "4px" }}
                  data-action="move-prev"
                  onClick={() => {
                    // console.log("pre");
                    calendarInstRef.current.prev();
                    setRenderRangeText();
                  }}
                >
                  <i
                    className="calendar-icon ic-arrow-line-left"
                    data-action="move-prev"
                  />
                </button>
                <button
                  type="button"
                  className="btn btn-default btn-sm move-day"
                  style={{ marginRight: "4px" }}
                  data-action="move-next"
                  onClick={() => {
                    // console.log("next");
                    calendarInstRef.current.next();
                    setRenderRangeText();
                  }}
                >
                  <i
                    className="calendar-icon ic-arrow-line-right"
                    data-action="move-next"
                  />
                </button>
              </span> */}
              <Typography variant="h5">
                {renderRange}
              </Typography>
            </Box>
          )}
          {/* <Box sx={{ height: 800 }}> */}
          <Box ref={tuiRef} sx={{ height: 'auto' }} />
          {/* </Box> */}
        </Box>
      </Box>
    );
  }
);

export default CustomTuiCalendar;
