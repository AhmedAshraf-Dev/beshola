export function drawTimeLine(
  focusTime,
  timeParam,
  bookedParam,
  availableSlotsParam,
  previewTimeParam,
  dataset,
) {
  const { startTime, endTime, duration } = timeParam;

  const slots = [];

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let current = new Date();
  current.setHours(startHour, startMinute, 0, 0);

  const end = new Date();
  end.setHours(endHour, endMinute, 0, 0);

  // 👉 Convert dataset into map for fast lookup
  const datasetMap = {};

  dataset.forEach((item) => {
    const date = new Date(item[previewTimeParam]);

    const key = `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    datasetMap[key] = item;
  });

  while (current <= end) {
    const hours = current.getHours().toString().padStart(2, "0");
    const minutes = current.getMinutes().toString().padStart(2, "0");

    const timeKey = `${hours}:${minutes}`;

    const matched = datasetMap[timeKey];

    slots.push({
      time: timeKey,
      isSelected: focusTime === timeKey,
      isBooked: matched ? matched[bookedParam] : false,
      availableSlots: matched ? matched[availableSlotsParam] : null,

      raw: matched || null,
    });

    current = new Date(current.getTime() + duration * 60000);
  }

  return slots;
}
