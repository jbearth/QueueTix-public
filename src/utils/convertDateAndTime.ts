import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

export function formatDate(
  inputDate: string,
  formatDay: string = "DD",
  formatMonth: string = "MM",
  formatYear: string = "YYYY"
) {
  const date = dayjs(inputDate);
  const formattedDate = date.format(`${formatDay}${formatMonth}${formatYear}`);

  return formattedDate;
}

export function formatDateTime(
  inputDateTime: string,
  formatDay: string = "DD",
  formatMonth: string = "MM",
  formatYear: string = "YYYY",
  formatTime: string = "HH:mm:ss"
) {

  dayjs.extend(utc);

  const inputDate = dayjs(inputDateTime);

  // Set the UTC+7 offset (เวลาประเทศไทย)
  const utcPlus7Date = inputDate.utcOffset(7 * 60);

  // จัดรูปแบบวันที่ในรูปแบบที่ต้องการ
  const formattedDateTime = utcPlus7Date.format(`${formatDay}${formatMonth}${formatYear}${formatTime}`);

  // console.log(formattedDate); // Ex. Output: "09 Oct 2023 23:48:20"
  return formattedDateTime;
}

export function getTime(
  inputDateTime: string,
) {
  return dayjs(inputDateTime).format(`HH:mm`)
}

export function getCurrentTime() {
  // Get the current date
  let currentDate = new Date();

  // Get the current timestamp in milliseconds
  let currentTimestamp = currentDate.getTime();

  // Calculate the UTC+7 offset in milliseconds (UTC+7 is 7 hours * 60 minutes * 60 seconds * 1000 milliseconds)
  let utcOffset = 7 * 60 * 60 * 1000;

  // Create a new date adjusted to UTC+7 by adding the offset
  let dateWithUTCOffset = new Date(currentTimestamp + utcOffset);

  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function convertTimetoDateTimeNow(customTime: string) {
  // Get the current date
  let currentDate = new Date();

  // Get the current timestamp in milliseconds
  let currentTimestamp = currentDate.getTime();

  // Calculate the UTC+7 offset in milliseconds (UTC+7 is 7 hours * 60 minutes * 60 seconds * 1000 milliseconds)
  let utcOffset = 7 * 60 * 60 * 1000;

  // Create a new date adjusted to UTC+7 by adding the offset
  let dateWithUTCOffset = new Date(currentTimestamp + utcOffset);

  // Extract year, month, and day from the current date
  const year = dateWithUTCOffset.getFullYear();
  const month = dateWithUTCOffset.getMonth(); // Note: Months are zero-indexed (0-11)
  const day = dateWithUTCOffset.getDate();

  const [hours, minutes]: any = customTime.split(':');
  dateWithUTCOffset.setHours(hours);
  dateWithUTCOffset.setMinutes(minutes);
  dateWithUTCOffset.setSeconds(0);
  dateWithUTCOffset.setMilliseconds(0);

  // Create a new DateTime object with the extracted date and the specified time
  const customDateTime = new Date(year, month, day, dateWithUTCOffset.getHours(), dateWithUTCOffset.getMinutes(), 0);

  return customDateTime;
}