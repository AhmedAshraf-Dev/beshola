import React from "react";
import { Image } from "react-native";

export default function FlagIcon({ code, size = 24, style }) {
  // ensure lowercase for flagcdn URLs
  const countryCode = code?.toLowerCase();

  return (
    <Image
      source={{ uri: `https://flagcdn.com/w40/${countryCode}.png ` }}
      style={{
        width: size * 1.3, // width proportional to height
        height: size,
        marginRight: 6,
        borderRadius: 2,
        ...style, // allow overrides
      }}
      resizeMode="contain"
    />
  );
}
