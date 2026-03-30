// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Platform,
//   StyleSheet,
// } from "react-native";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import moment from "moment";
// import { Controller } from "react-hook-form";
// import DatepickerComponent from "./DatepickerComponent";
// import { useSelector } from "react-redux";
// import { theme } from "../../../Theme";

// export default function DateParameter({
//   fieldName: name,
//   control,
//   value: defaultValue,
//   enable,
//   placeholder,
//   ...props
// }) {
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//   const localization = useSelector((state) => state.localization.localization);
//   const languageRow = useSelector((state) => state.localization.languageRow);
//   const dateTime = localization.dateTime;

//   const isBirthday = props.type === "birthday";
//   const isPushTime = props.type === "pushTime";
//   const isDateTime = props.type === "datetime";

//   const mode = isPushTime ? "time" : isDateTime ? "datetime" : "date";

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   function safeUTCDate(y, m, d) {
//     return new Date(Date.UTC(y, m, d, 12, 0, 0));
//   }

//   const y = today.getUTCFullYear();
//   const m = today.getUTCMonth();
//   const d = today.getUTCDate();

//   let minDate, maxDate;

//   if (isBirthday) {
//     // oldest year must be fully visible
//     minDate = safeUTCDate(y - 60, 0, 1); // Jan 1 1965
//     maxDate = safeUTCDate(y - 14, m, d); // Dec 29 2011
//   } else if (isPushTime) {
//     minDate = safeUTCDate(y, m, d);
//   }

//   const formatValue = (val) => {
//     if (!val) return placeholder;

//     const date = new Date(val);
//     const hours = date.getHours();
//     const minutes = date.getMinutes().toString().padStart(2, "0");
//     const isPM = hours >= 12;
//     const displayHours = isPM ? hours - 12 || 12 : hours || 12;

//     const day = date.getDate();
//     const monthName = dateTime?.dxDateBox?.months[date.getMonth()];
//     const year = date.getFullYear();
//     const time = `${displayHours}:${minutes} ${
//       isPM ? dateTime?.dxDateBox?.pm : dateTime?.dxDateBox?.am
//     }`;

//     if (isPushTime) return time;
//     if (isDateTime) return `${monthName} ${day}, ${year} - ${time}`;
//     return `${monthName} ${day}, ${year}`;
//   };

//   const showDatePicker = () => setDatePickerVisibility(true);
//   const hideDatePicker = () => setDatePickerVisibility(false);

//   const styles = StyleSheet.create({
//     touchable: {
//       borderWidth: 1,
//       padding: 12,
//       borderRadius: 8,
//     },
//     text: {
//       fontSize: 16,
//     },
//   });

//   return (
//     <Controller
//       control={control}
//       disabled={!enable}
//       name={name}
//       rules={{
//         required: true,
//       }}
//       defaultValue={defaultValue}
//       render={({ field: { onChange, value } }) =>
//         Platform.OS === "web" ? (
//           <DatepickerComponent
//             name={name}
//             value={value}
//             onChange={onChange}
//             placeholder={placeholder}
//             type={props.type}
//             minDate={minDate}
//             maxDate={maxDate}
//           />
//         ) : (
//           <View>
//             <TouchableOpacity
//               onPress={showDatePicker}
//               // style={styles.touchable}
//               style={{
//                 backgroundColor: theme.body,
//                 paddingVertical: 14,
//                 paddingHorizontal: 18,
//                 borderRadius: 14,
//                 borderWidth: 1,
//                 borderColor: theme.accent,
//                 shadowColor: theme.overlay,
//                 shadowOpacity: 0.08,
//                 shadowRadius: 6,
//                 shadowOffset: { width: 0, height: 2 },
//                 elevation: 3,
//               }}
//               {...props}
//             >
//               <Text style={styles.text}>
//                 {formatValue(value) || placeholder}
//               </Text>
//             </TouchableOpacity>

//             <DateTimePickerModal
//               isVisible={isDatePickerVisible}
//               mode={mode}
//               locale={"ar"}
//               onConfirm={(selectedDate) => {
//                 onChange(selectedDate);
//                 hideDatePicker();
//               }}
//               onCancel={hideDatePicker}
//               minimumDate={minDate}
//               maximumDate={maxDate}
//               display={Platform.OS === "ios" ? "spinner" : "default"}
//             />
//           </View>
//         )
//       }
//     />
//   );
// }
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Controller } from "react-hook-form";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { theme } from "../../../Theme";

export default function DateParameter({
  fieldName: name,
  control,
  value: defaultValue,
  enable,
  placeholder,
  type,
  availability = [], // array of days with slots
}) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const styles = StyleSheet.create({
    chip: {
      padding: 10,
      borderWidth: 1,
      borderRadius: 10,
      margin: 4,
    },
    touchable: {
      backgroundColor: theme.body,
      padding: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.accent,
    },
    text: {
      color: theme.text,
    },
  });

  const formatDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    return moment(date).format("MMM D, YYYY");
  };

  const formatTimeLabel = (time) => {
    const [h, m] = time.split(":");
    const hours = parseInt(h);
    const isPM = hours >= 12;
    const displayHours = isPM ? hours - 12 || 12 : hours;
    return `${displayHours}:${m} ${isPM ? "PM" : "AM"}`;
  };

  return (
    <Controller
      control={control}
      disabled={!enable}
      name={name}
      defaultValue={defaultValue}
      render={({ field: { onChange, value } }) => {
        // 🌐 Web platform
        if (Platform.OS === "web") {
          if (type === "appointment") {
            return (
              <div>
                {/* DAYS */}
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {availability.map((item) => (
                    <div
                      key={item.date}
                      onClick={() => {
                        setSelectedDate(item.date);
                        onChange(null);
                      }}
                      style={{
                        padding: 10,
                        border: "1px solid #ccc",
                        borderRadius: 8,
                        margin: 4,
                        cursor: "pointer",
                        backgroundColor:
                          selectedDate === item.date ? "#3b82f6" : "#fff",
                        color: selectedDate === item.date ? "#fff" : "#000",
                      }}
                    >
                      {formatDateLabel(item.date)}
                    </div>
                  ))}
                </div>

                {/* TIMES */}
                {selectedDate &&
                  availability
                    .find((d) => d.date === selectedDate)
                    ?.slots.map((slot) => (
                      <div
                        key={slot}
                        onClick={() => onChange(`${selectedDate} ${slot}`)}
                        style={{
                          padding: 10,
                          border: "1px solid #ccc",
                          borderRadius: 8,
                          margin: 4,
                          cursor: "pointer",
                          display: "inline-block",
                          backgroundColor:
                            value === `${selectedDate} ${slot}`
                              ? "#3b82f6"
                              : "#fff",
                          color:
                            value === `${selectedDate} ${slot}`
                              ? "#fff"
                              : "#000",
                        }}
                      >
                        {formatTimeLabel(slot)}
                      </div>
                    ))}
              </div>
            );
          }

          // fallback: normal date picker
          return (
            <DatePicker
              selected={value}
              onChange={onChange}
              placeholderText={placeholder}
              showTimeSelect={type === "datetime" || type === "pushTime"}
              timeIntervals={15}
              dateFormat={
                type === "datetime"
                  ? "MMMM d, yyyy h:mm aa"
                  : type === "pushTime"
                    ? "h:mm aa"
                    : "MMMM d, yyyy"
              }
              minDate={new Date()}
            />
          );
        }

        // 📱 Mobile platform
        if (type === "appointment") {
          return (
            <View>
              {/* DAYS */}
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {availability.map((item) => (
                  <TouchableOpacity
                    key={item.date}
                    onPress={() => {
                      setSelectedDate(item.date);
                      onChange(null);
                    }}
                    style={[
                      styles.chip,
                      {
                        backgroundColor:
                          selectedDate === item.date
                            ? theme.accent
                            : theme.body,
                      },
                    ]}
                  >
                    <Text style={styles.text}>
                      {formatDateLabel(item.date)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* TIMES */}
              {selectedDate && (
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {availability
                    .find((d) => d.date === selectedDate)
                    ?.slots.map((slot) => (
                      <TouchableOpacity
                        key={slot}
                        onPress={() => onChange(`${selectedDate} ${slot}`)}
                        style={[
                          styles.chip,
                          {
                            backgroundColor:
                              value === `${selectedDate} ${slot}`
                                ? theme.accent
                                : theme.body,
                          },
                        ]}
                      >
                        <Text style={styles.text}>{formatTimeLabel(slot)}</Text>
                      </TouchableOpacity>
                    ))}
                </View>
              )}
            </View>
          );
        }

        // fallback: normal mobile date picker
        return (
          <View>
            <TouchableOpacity
              onPress={() => setDatePickerVisibility(true)}
              style={styles.touchable}
            >
              <Text style={styles.text}>
                {value ? moment(value).format("MMM D, YYYY") : placeholder}
              </Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode={type === "datetime" ? "datetime" : "date"}
              onConfirm={(selectedDate) => {
                onChange(selectedDate);
                setDatePickerVisibility(false);
              }}
              onCancel={() => setDatePickerVisibility(false)}
              minimumDate={new Date()}
            />
          </View>
        );
      }}
    />
  );
}
