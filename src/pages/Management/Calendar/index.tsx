import React, { useState, useRef } from "react";
import CustomTuiCalendar from "./components/CustomTuiCalendar";
import CustomTuiModal from "./components/CustomTuiModal";

const start = new Date();
const end = new Date(new Date().setMinutes(start.getMinutes() + 60));
const authorities = [
  {
    id: "1",
    name: "best"
  },
  { id: "2", name: "arm" },
  { id: "3", name: "pop" },
  { id: "4", name: "earth" }
];
const schedules = [
  {
    id: "1",
    title: "คอนเสิร์ต BlackPink",
    body: "คอนเสิร์ตจัดที่สนามไกปู",
    category: "time",
    isVisible: true,
    start,
    end
  },
  {
    id: "2",
    title: "ฮาโลวีน",
    body: "วันฮาโลวีนแห่งโลกก",
    category: "time",
    isVisible: true,
    start: new Date(new Date().setHours(start.getHours() + 5)),
    end: new Date(new Date().setDate(start.getDate() + 2))
  },
  {
    id: "3",
    title: "เทศกาลตี๋น้อย",
    body: "โปรโมชั่นลด 50%",
    category: "time",
    isVisible: true,
    start: new Date(new Date().setHours(start.getHours() + 2)),
    end: new Date(new Date().setHours(start.getHours() + 4))
  },
  {
    id: "4",
    title: "ฉลองครบรอบ 60 ปี",
    body: "แจกเงิน 1,000,000 บาท",
    category: "time",
    isVisible: true,
    start: new Date(new Date().setHours(start.getHours() + 2)),
    end: new Date(new Date().setHours(start.getHours() + 6))
  }
];

const colors = [
  {
    id: "1",
    color: "#ffffff",
    bgColor: "#34C38F",
    dragBgColor: "#34C38F",
    borderColor: "#34C38F"
  },
  {
    id: "2",
    color: "#ffffff",
    bgColor: "#F4696A",
    dragBgColor: "#F4696A",
    borderColor: "#F4696A"
  },
  {
    id: "3",
    color: "#ffffff",
    bgColor: "#00a9ff",
    dragBgColor: "#00a9ff",
    borderColor: "#00a9ff"
  },
  {
    id: "4",
    color: "#ffffff",
    bgColor: "#F2B34C",
    dragBgColor: "#F2B34C",
    borderColor: "#F2B34C"
  },
  {
    id: "5",
    color: "#ffffff",
    bgColor: "#74788D",
    dragBgColor: "#74788D",
    borderColor: "#74788D"
  },
  {
    id: "6",
    color: "#ffffff",
    bgColor: "#343A40",
    dragBgColor: "#343A40",
    borderColor: "#343A40"
  },
  {
    id: "7",
    color: "#000000",
    bgColor: "#FFFFFF",
    dragBgColor: "#FFFFFF",
    borderColor: "#FFFFFF"
  }
];

const calendars = [
  {
    id: "1",
    name: "โปรโมชั่น"
  },
  {
    id: "2",
    name: "การแสดง"
  },
  {
    id: "3",
    name: "ฉลองครบรอบ"
  },
  {
    id: "4",
    name: "คอนเสิร์ต"
  },
  // {
  //   id: "5",
  //   name: "Luxury 6 Management"
  // },
  // {
  //   id: "6",
  //   name: "Aqua 3 Management"
  // },
  // {
  //   id: "7",
  //   name: "Aqua 2 Management"
  // }
];

export default function Calendar() {
  const [modal, setModal] = useState<any>(false);
  const [event, setEvent] = useState<any>(null);
  const childRef = useRef<any>();

  const handleModalClose = () => {
    setModal(false);
    setEvent(null);
  };

  function onBeforeCreateSchedule(event: any) {
    console.log('onBeforeCreateSchedule', event)
    event.guide.clearGuideElement();
    setModal(true);
    setEvent(event);
  }

  function handleCreateSchedule(newEvent: any) {
    // call api
    const result = true;

    if (result) {
      const newSchedule = {
        ...event,
        id: schedules.length,
        title: newEvent.title,
        description: newEvent.description,
        // calendarId: newEvent.calendarId,
        category: event.isAllDay ? "allday" : "time",
        // authorities: newEvent.authorities,
        isVisible: true,
        start: newEvent.start,
        end: newEvent.end,

        isAllDay: event.isAllDay,
        dueDateClass: "",
        location: event.location,
        // raw: {
        //   class: event.raw["class"]
        // },
        state: event.state,
        body: event.body
      };

      childRef.current.createSchedule(newSchedule);
      setModal(false);
    }
  }

  function onBeforeUpdateSchedule(event: any) {
    // console.log('onBeforeUpdateSchedule', event)

    const { schedule, changes } = event;

    // resize & drag n drop
    if (changes) {
      // call api
      const result = true;
      if (result) {
        return childRef.current.updateSchedule(schedule, changes);
      }
    }

    setModal(true);
    setEvent(event);
  }

  async function handleUpdateSchedule(updateEvent: any) {
    // call api
    const result = true;

    if (result) {
      const { schedule } = event;

      // way 1: library not support
      // update api fail with authorities
      // childRef.current.updateSchedule(schedule, updateEvent)

      // way 2: stupid
      await childRef.current.deleteSchedule(schedule);

      const newSchedule = {
        ...event,
        id: schedules.length + 2,
        title: updateEvent.title,
        description: updateEvent.description,
        // calendarId: updateEvent.calendarId,
        category: event.isAllDay ? "allday" : "time",
        // authorities: updateEvent.authorities,
        isVisible: true,
        start: updateEvent.start,
        end: updateEvent.end,

        isAllDay: event.isAllDay,
        dueDateClass: "",
        location: event.location,
        // raw: {
        //   class: event.raw["class"]
        // },
        state: event.state,
        body: event.body
      };

      await childRef.current.createSchedule(newSchedule);

      setModal(false);
    }
  }

  function onBeforeDeleteSchedule(event: any) {
    // console.log('onBeforeDeleteSchedule', event)

    // call api
    const result = true;

    if (result) {
      const { schedule } = event;
      childRef.current.deleteSchedule(schedule);
    }

    return true;
  }

  const formatCalendars = calendars.map((element) => ({
    ...colors.find((element2) => element2.id === element.id),
    ...element
  }));

  return (
    <>
      <CustomTuiCalendar
        ref={childRef}
        {...{
          isReadOnly: false,
          showSlidebar: true,
          showMenu: true,
          useCreationPopup: false,
          // onCreate: () => {
          //   console.log("create that!!!");
          //   childRef.current.getAlert();
          // },
          // createText: "Tao moi",
          calendars: formatCalendars,
          schedules,
          onBeforeCreateSchedule,
          onBeforeUpdateSchedule,
          onBeforeDeleteSchedule
        }}
      />
      <CustomTuiModal
        {...{
          isOpen: modal,
          handleModalClose,
          onSubmit:
            event?.triggerEventName === "mouseup"
              ? handleCreateSchedule
              : handleUpdateSchedule,
          submitText: event?.triggerEventName === "mouseup" ? "Save" : "Update",
          calendars: formatCalendars,
          authorities,
          schedule: event?.schedule,
          startDate: event?.start,
          endDate: event?.end
        }}
      />
    </>
  );
}
