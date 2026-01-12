import { I18nManager, Platform } from "react-native";

export const isRTL = (): boolean => {
  if (Platform.OS === "web") {
    return document?.dir === "rtl";
  }
  return I18nManager.isRTL; // ✅ only read
};
