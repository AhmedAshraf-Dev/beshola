import * as Font from "expo-font";

if (typeof Font?.default !== "function" && typeof Font?.default !== "object") {
  console.warn("Patching expo-font for web: providing fallback class");
  class ExpoFontWebMock {}
  Font.default = ExpoFontWebMock;
}
