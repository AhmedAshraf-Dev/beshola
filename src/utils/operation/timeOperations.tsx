export const combineDateTime = (date, time) => {
  if (!date || !time) return null;

  const [hours, minutes] = time.split(":").map(Number);

  const newDate = new Date(date);
  newDate.setHours(hours);
  newDate.setMinutes(minutes);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);

  return newDate.toISOString(); // ✅ important for backend
};
