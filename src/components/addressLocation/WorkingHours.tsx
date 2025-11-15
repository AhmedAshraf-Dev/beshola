import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { theme } from "../../Theme";
import {
  convertUTCToLocalTime,
  getMinutesFromTime,
} from "../../utils/operation/handleLocalTime";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { toAmPm } from "../../utils/operation/toAmPm";
import { isRTL } from "../../utils/operation/isRTL";
export default function WorkingHours({}) {
  const localization = useSelector((state) => state.localization.localization);
  const [expanded, setExpanded] = useState(false);
  const masterBranch = useSelector((state) => state.location.workingHours);

  if (!masterBranch || !Array.isArray(masterBranch.companyBranchWorkHours)) {
    return null;
  }

  const todayIndex = new Date().getDay(); // Sunday = 0
  const currentTime = new Date();

  const renderWorkHour = (workHour, isTodayHighlight = false) => {
    const localStartTime = convertUTCToLocalTime(workHour.startTime);
    const localEndTime = convertUTCToLocalTime(workHour.endTime);

    const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const startMinutes = getMinutesFromTime(localStartTime);
    const endMinutes = getMinutesFromTime(localEndTime);

    let status = "closed"; // "open" | "nearClosed" | "closed"

    if (todayIndex === workHour.dayIndex) {
      if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
        const minutesToClose = endMinutes - nowMinutes;
        if (minutesToClose <= 30) {
          status = "nearClosed"; // ⚠️
        } else {
          status = "open"; // ✅
        }
      }
    }

    // Choose icon based on status
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
        key={workHour.companyBranchDayWorkHoursID}
        style={{
          paddingVertical: 6,
          marginBottom: 2,
          paddingHorizontal: 10,
          backgroundColor: isTodayHighlight ? theme.dark_card : theme.primary,
          borderRadius: 8,
          alignItems: "center",
          // justifyItems:'center'
        }}
        className="grid grid-cols-5 justify-items-center"
      >
        <Text
          style={{
            color: theme.body,
            fontWeight: isTodayHighlight ? "bold" : "normal",
          }}
        >
          {workHour.dayName}
        </Text>

        <View
          style={{
            flexDirection: isRTL() ? "row-reverse" : "row",
            alignItems: "center",
          }}
          className="col-span-3"
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

        {/* Status icon */}
        <View style={{ marginLeft: 8, color: theme.body, fontWeight: "bold" }}>
          {isTodayHighlight ? (
            <>{renderStatusIcon()}</>
          ) : (
            <MaterialIcons name="access-time" size={20} color={theme.body} />
          )}
        </View>
      </View>
    );
  };

  const todayWorkHour = masterBranch.companyBranchWorkHours.find(
    (w) => w.dayIndex === todayIndex
  );

  return (
    <View style={{ marginVertical: 10 }}>
      {/* Show only today */}
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        {todayWorkHour ? (
          renderWorkHour(todayWorkHour, true)
        ) : (
          <View
            style={{
              paddingVertical: 6,
              marginBottom: 2,
              paddingHorizontal: 10,
              backgroundColor: theme.dark_card,
              borderRadius: 8,
              alignItems: "center",
              // justifyItems:'center'
            }}
          >
            <Text style={{ color: theme.body }}>
              {localization.workingHours.todayIsVacation}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Show rest of days if expanded */}
      {expanded && (
        <FlatList
          data={masterBranch.companyBranchWorkHours.filter(
            (w) => w.dayIndex !== todayIndex
          )}
          keyExtractor={(item) => item.companyBranchDayWorkHoursID.toString()}
          renderItem={({ item }) => renderWorkHour(item)}
        />
      )}
    </View>
  );
}
