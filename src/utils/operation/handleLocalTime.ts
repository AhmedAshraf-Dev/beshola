export const convertUTCToLocalTime = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  let totalMinutes = hours * 60 + minutes;
  const timezoneOffset = -new Date().getTimezoneOffset();
  totalMinutes = (totalMinutes + timezoneOffset + 1440) % 1440;
  const localHours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const localMinutes = String(totalMinutes % 60).padStart(2, "0");
  return `${localHours}:${localMinutes}`;
};

export const getMinutesFromTime = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};
