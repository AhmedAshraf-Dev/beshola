export const convertUTCToLocalTime = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);

  // Convert "HH:mm" UTC into minutes
  let totalMinutes = hours * 60 + minutes;

  // Local timezone offset (in minutes)
  // Example Cairo: -120 → local time = UTC + 2 hours
  const timezoneOffset = new Date().getTimezoneOffset(); // POSITIVE = behind UTC

  // Apply offset correctly
  totalMinutes = (totalMinutes - timezoneOffset + 1440) % 1440;

  const localHours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const localMinutes = String(totalMinutes % 60).padStart(2, "0");

  return `${localHours}:${localMinutes}`;
};
export const getMinutesFromTime = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};
export const getRemainingMinutes = (nowMinutes, endMinutes) => {
  let diff = endMinutes - nowMinutes;
  if (diff < 0) diff += 1440; // next day rollover
  return diff;
};
