// import React from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "../../Theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { isRTL } from "../operation/isRTL";
export default function StarsIcons({ value, customKey, size = 10 }) {
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.25 && value % 1 < 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  return (
    <View style={styles.starRow} key={customKey}>
      {[...Array(fullStars)].map((_, i) => (
        <AntDesign
          key={`full-${i}-${customKey}`}
          name="star"
          className="!text-[#f59e0b]"
          size={size}
        />
      ))}
      {hasHalfStar && (
        <View
          style={{
            width: 18,
            height: 18,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 1,
            position: "relative",
          }}
        >
          {/* Empty star outline - background */}
          <AntDesign name="staro" size={size} className="!text-[#f59e0b]" />

          {/* Half star - clipped to only show left half */}
          <View
            style={{
              position: "absolute",
              width: "50%",
              height: "100%",
              overflow: "hidden",
              left: isRTL() ? 0 : 1,
              right: isRTL() ? 0 : 1,
              top: 1,
              transform: [{ scaleX: isRTL() ? -1 : 1 }],
            }}
          >
            {/* <FontAwesome name="star" size={16} className="!text-[#f59e0b]" /> */}
            <AntDesign name="star" className="!text-[#f59e0b]" size={size} />
          </View>
        </View>
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <AntDesign
          name="staro"
          key={`empty-${i}-${customKey}`}
          className="!text-[#f59e0b]"
          size={size}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  starRow: {
    flexDirection: "row",
  },
});
