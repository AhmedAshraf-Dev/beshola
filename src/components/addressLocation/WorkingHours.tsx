import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { theme } from "../../Theme";
import { convertUTCToLocalTime } from "../../utils/operation/handleLocalTime";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { isRTL } from "../../utils/operation/isRTL";
import { toAmPm } from "../../utils/operation/toAmPm";
export default function WorkingHours() {
  const localization = useSelector((state) => state.localization.localization);

  const workingHours = useSelector((state) => state.location.workingHours);

  const [expanded, setExpanded] = useState(false);

  if (!workingHours || !Array.isArray(workingHours)) {
    return null;
  }

  const todayIndex = new Date().getDay(); // Sunday = 0

  const todayWorkHour = workingHours.find((w) => w.dayIndex === todayIndex);

  // ✅ Component (hooks allowed)
  const WorkHourItem = ({ workHour, isTodayHighlight }) => {
    const status = useSelector((state) => state.location.orderStatus);

    const localStartTime = convertUTCToLocalTime(workHour.startTime);
    const localEndTime = convertUTCToLocalTime(workHour.endTime);

    const renderStatusIcon = () => {
      switch (status) {
        case "open":
          return <Ionicons name="checkmark-circle" size={20} color="green" />;
        case "nearClosed":
          return <MaterialIcons name="access-time" size={20} color="orange" />;
        default:
          return <Ionicons name="time" size={20} color="red" />;
      }
    };

    return (
      <View
        style={{
          paddingVertical: 6,
          marginBottom: 2,
          paddingHorizontal: 10,
          backgroundColor: isTodayHighlight ? theme.dark_card : theme.primary,
          borderRadius: 8,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {/* Day */}
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              color: theme.body,
              fontWeight: isTodayHighlight ? "bold" : "normal",
            }}
          >
            {workHour.dayName}
          </Text>
        </View>

        {/* Time */}
        <View
          style={{
            flex: 3,
            flexDirection: isRTL() ? "row-reverse" : "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="checkmark-circle" size={18} color="green" />
          <Text style={{ color: theme.body, marginLeft: 4 }}>
            {toAmPm(localStartTime)} -
          </Text>

          <Ionicons
            name="time"
            size={18}
            color="red"
            style={{ marginLeft: 4 }}
          />
          <Text style={{ color: theme.body, marginLeft: 4 }}>
            {toAmPm(localEndTime)}
          </Text>
        </View>

        {/* Status */}
        <View style={{ flex: 1, alignItems: "center" }}>
          {isTodayHighlight ? (
            renderStatusIcon()
          ) : (
            <MaterialIcons name="access-time" size={20} color={theme.body} />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={{ marginVertical: 10 }}>
      {/* Today */}
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        {todayWorkHour ? (
          <WorkHourItem workHour={todayWorkHour} isTodayHighlight={true} />
        ) : (
          <View
            style={{
              paddingVertical: 6,
              marginBottom: 2,
              paddingHorizontal: 10,
              backgroundColor: theme.dark_card,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: theme.body }}>
              {localization.workingHours.todayIsVacation}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Other days */}
      {expanded && (
        <FlatList
          data={workingHours.filter((w) => w.dayIndex !== todayIndex)}
          keyExtractor={(item) => item.companyBranchDayWorkHoursID.toString()}
          renderItem={({ item }) => (
            <WorkHourItem workHour={item} isTodayHighlight={false} />
          )}
        />
      )}
    </View>
  );
}
