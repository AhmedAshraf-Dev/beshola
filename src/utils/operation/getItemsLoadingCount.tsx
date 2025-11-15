import React, { useMemo } from "react";
import { View, Dimensions } from "react-native";

export const getItemsLoadingCount = () => {
  const { width } = Dimensions.get("window");

  if (width >= 1280) return 6; // lg screens
  if (width >= 768) return 4; // md screens
  return 2; // sm screens
};
