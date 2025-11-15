// components/skeletons/OrderCardItemSkeleton.js
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

export default function OrderCardItemSkeleton() {
  // 🖥 Web version
  if (Platform.OS === "web") {
    return (
      <div className="bg-body p-4 rounded-xl">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-3 gap-3">
              {/* Image */}
              <WebSkeleton
                height={100}
                width={100}
                style={{ borderRadius: 20 }}
              />

              {/* Text & Price */}
              <div className="col-span-2 flex justify-between items-center">
                <div className="pe-2 max-w-32">
                  <WebSkeleton width={150} height={16} />
                  <WebSkeleton width={120} height={14} className="mt-2" />
                  <WebSkeleton width={80} height={14} className="mt-1" />
                </div>

                <div className="text-right">
                  <WebSkeleton width={60} height={14} />
                  <WebSkeleton width={70} height={16} className="mt-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 📱 Native version
  return (
    <View
      style={{
        backgroundColor: "#f8f8f8",
        padding: scale(16),
        borderRadius: scale(12),
      }}
    >
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: scale(16),
          }}
        >
          <NativeContentLoader
            speed={1.5}
            width={300}
            height={100}
            backgroundColor="#e6e6e6"
            foregroundColor="#f5f5f5"
          >
            {/* Image */}
            <Rect x="0" y="0" rx="12" ry="12" width="100" height="100" />

            {/* Text (3 lines) */}
            <Rect x="110" y="10" rx="4" ry="4" width="150" height="16" />
            <Rect x="110" y="30" rx="4" ry="4" width="120" height="14" />
            <Rect x="110" y="50" rx="4" ry="4" width="80" height="14" />

            {/* Price area */}
            <Rect x="250" y="10" rx="4" ry="4" width="60" height="14" />
            <Rect x="240" y="30" rx="4" ry="4" width="70" height="16" />
          </NativeContentLoader>
        </View>
      ))}
    </View>
  );
}
