// components/skeletons/SuggestCardSkeleton.js
import React from "react";
import { View, Platform } from "react-native";
import { scale } from "react-native-size-matters";

// ✅ Conditional imports
let WebSkeleton = null;
let NativeContentLoader = null;
let Rect = null;

if (Platform.OS === "web") {
  WebSkeleton = require("react-loading-skeleton").default;
  require("react-loading-skeleton/dist/skeleton.css");
} else {
  const contentLoader = require("react-content-loader/native");
  NativeContentLoader = contentLoader.default;
  Rect = contentLoader.Rect;
}

export default function SuggestCardSkeleton({ boxScale = 400 }) {
  const dynamicScale = boxScale / 100;
  const imageWidth = scale(120);
  const imageHeight = scale(120);

  // 💻 Web version
  if (Platform.OS === "web") {
    return (
      <View
        style={{
          padding: 3 * dynamicScale,
          borderRadius: 5 * dynamicScale,
          backgroundColor: "#f3f3f3",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <WebSkeleton width={imageWidth} height={imageHeight} borderRadius={8} />
        <View style={{ marginTop: -10, alignSelf: "center" }}>
          <WebSkeleton width={80} height={20} borderRadius={4} />
        </View>
        <View
          style={{
            marginTop: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <WebSkeleton width={60} height={20} borderRadius={4} />
        </View>
        <View
          style={{
            marginTop: 10,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <WebSkeleton width={100} height={40} borderRadius={8} />
        </View>
      </View>
    );
  }

  // 📱 Native (iOS/Android) version
  return (
    <NativeContentLoader
      speed={1.5}
      width={200}
      height={220}
      backgroundColor="#e6e6e6"
      foregroundColor="#f5f5f5"
    >
      <Rect x="40" y="10" rx="8" ry="8" width="120" height="120" />
      <Rect x="60" y="140" rx="4" ry="4" width="80" height="20" />
      <Rect x="70" y="170" rx="4" ry="4" width="60" height="20" />
      <Rect x="50" y="200" rx="8" ry="8" width="100" height="40" />
    </NativeContentLoader>
  );
}
