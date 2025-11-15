// components/skeletons/OrderCardSkeleton.js
import React from "react";
import { Platform, View } from "react-native";
import { scale } from "react-native-size-matters";

// Conditional imports
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

export default function OrderCardSkeleton({ cartItemCount = 3 }) {
  // 🖥 Web version
  if (Platform.OS === "web") {
    return (
      <div
        className="rounded-xl overflow-hidden mb-4 shadow-md mx-1"
        style={{ backgroundColor: "#f8d7da" }}
      >
        <div className="bg-white p-4 rounded-xl">
          {/* Order header */}
          <div className="mb-2">
            <WebSkeleton width={120} height={24} className="mb-2" />
            <WebSkeleton width={60} height={16} />
          </div>

          {/* Step header */}
          <div className="flex justify-between items-center mb-4">
            <WebSkeleton width={80} height={16} />
            <WebSkeleton width={80} height={16} />
            <WebSkeleton width={80} height={16} />
          </div>

          {/* Details button */}
          <div className="mt-3">
            <WebSkeleton width={100} height={40} />
          </div>
        </div>
      </div>
    );
  }

  // 📱 Native version
  return (
    <View
      style={{
        backgroundColor: "#f8d7da",
        borderRadius: scale(12),
        marginBottom: scale(12),
        marginHorizontal: scale(4),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: scale(12),
          padding: scale(16),
        }}
      >
        <NativeContentLoader
          speed={1.5}
          width={300}
          height={160}
          backgroundColor="#e6e6e6"
          foregroundColor="#f5f5f5"
        >
          {/* Order header */}
          <Rect x="10" y="10" rx="4" ry="4" width="120" height="24" />
          <Rect x="10" y="40" rx="4" ry="4" width="60" height="16" />

          {/* Step header */}
          <Rect x="10" y="70" rx="4" ry="4" width="80" height="16" />
          <Rect x="110" y="70" rx="4" ry="4" width="80" height="16" />
          <Rect x="210" y="70" rx="4" ry="4" width="80" height="16" />

          {/* Details button */}
          <Rect x="10" y="110" rx="8" ry="8" width="100" height="40" />
        </NativeContentLoader>
      </View>
    </View>
  );
}
