import { useDispatch, useSelector } from "react-redux";
import { updateOrderStatus } from "../../reducers/LocationReducer";
import { convertUTCToLocalTime, getMinutesFromTime } from "./handleLocalTime";

export const updateOrderStatusLive = (workingHours, dispatch) => {
  const todayIndex = new Date().getDay();
  const currentTime = new Date();

  const todayWorkHour = workingHours?.companyBranchWorkHours?.find(
    (w) => w.dayIndex === todayIndex
  );

  let orderStatus = "closed";

  if (todayWorkHour) {
    const localStartTime = convertUTCToLocalTime(todayWorkHour.startTime);
    const localEndTime = convertUTCToLocalTime(todayWorkHour.endTime);

    const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const startMinutes = getMinutesFromTime(localStartTime);
    const endMinutes = getMinutesFromTime(localEndTime);

    if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
      const minutesToClose = endMinutes - nowMinutes;
      orderStatus = minutesToClose <= 30 ? "nearClosed" : "open";
    }
  }

  dispatch(updateOrderStatus(orderStatus));
};
