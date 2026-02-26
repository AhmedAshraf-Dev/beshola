import { updateOrderStatus } from "../../reducers/LocationReducer";
import { convertUTCToLocalTime, getMinutesFromTime } from "./handleLocalTime";

export const updateOrderStatusLive = (
  workingHours,
  dispatch,
  setMinutesToClose,
) => {
  if (!workingHours) {
    console.log("No working hours available");
    dispatch(updateOrderStatus("closed"));
    return;
  }

  const todayIndex = new Date().getDay();
  const prevIndex = (todayIndex + 6) % 7; // yesterday
  const now = new Date();
  let nowMinutes = now.getHours() * 60 + now.getMinutes();

  const getLocalMinutes = (timeStr) => {
    const [hh, mm] = convertUTCToLocalTime(timeStr).split(":").map(Number);
    return hh * 60 + mm;
  };

  let activeShift = workingHours.find((w) => w.dayIndex === todayIndex);

  // 🔹 Check previous day's overnight shift
  const prevWorkHour = workingHours.find((w) => w.dayIndex === prevIndex);

  if (prevWorkHour) {
    const prevStart = getLocalMinutes(prevWorkHour.startTime);
    let prevEnd = getLocalMinutes(prevWorkHour.endTime);
    const crossesMidnight = prevEnd < prevStart;
    if (crossesMidnight) prevEnd += 1440;

    let adjNow = nowMinutes;
    if (crossesMidnight && nowMinutes < prevEnd - 1440) {
      adjNow += 1440; // adjust for after-midnight time
    }

    if (adjNow >= prevStart && adjNow <= prevEnd) {
      activeShift = prevWorkHour;
      nowMinutes = adjNow;
    }
  }

  let orderStatus = "closed";

  if (activeShift) {
    const startMinutes = getLocalMinutes(activeShift.startTime);
    let endMinutes = getLocalMinutes(activeShift.endTime);
    const crosses = endMinutes < startMinutes;
    if (crosses) endMinutes += 1440;

    let adjNow = nowMinutes;
    if (crosses && nowMinutes < startMinutes) adjNow += 1440;

    const remaining = endMinutes - adjNow;
    setMinutesToClose(remaining);
    // 🔹 Logs for debugging
    console.log("Active Shift:", activeShift);
    console.log("Now minutes:", nowMinutes);
    console.log("Start minutes:", startMinutes);
    console.log("End minutes:", endMinutes);
    console.log("Remaining minutes:", remaining);

    if (adjNow >= startMinutes && adjNow <= endMinutes) {
      orderStatus = remaining <= 30 ? "nearClosed" : "open";
    }
  }

  console.log("Order Status:", orderStatus);
  dispatch(updateOrderStatus(orderStatus));
};
