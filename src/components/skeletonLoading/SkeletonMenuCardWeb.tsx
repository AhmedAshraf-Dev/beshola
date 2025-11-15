// components/skeletons/SkeletonMenuCard.js
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

export default function SkeletonMenuCard({
  imageSize = 100,
  showRating = true,
  showOrders = true,
  showPoints = true,
}) {
  // 🖥 Web version
  if (Platform.OS === "web") {
    return (
      <div className="size-full grid grid-rows-[75%_25%] md:!flex border p-2 rounded-2xl shadow-sm">
        {/* Image Section */}
        <div className="relative grid grid-cols-2 overflow-hidden w-full">
          <div className="w-full flex flex-col">
            <div className="w-full flex justify-center items-center overflow-hidden rounded-2xl mb-2">
              <WebSkeleton width={imageSize} height={imageSize} />
            </div>

            {/* Rating and Orders */}
            <div
              className="flex flex-row items-center justify-center mt-2 w-full"
              style={{ flexWrap: "wrap" }}
            >
              {showRating && (
                <WebSkeleton width={80} height={20} className="me-4" />
              )}
              {showOrders && <WebSkeleton width={50} height={20} />}
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full flex flex-col justify-between">
            <div className="min-h-28 mb-2">
              <WebSkeleton width={`80%`} height={24} className="mb-1" />
              <WebSkeleton count={3} width={`90%`} height={14} />
            </div>
            <WebSkeleton width={`60%`} height={20} />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-row justify-between items-center px-2 mt-2">
          {showPoints && <WebSkeleton width={24} height={24} />}
          <WebSkeleton width={`40%`} height={36} />
        </div>
      </div>
    );
  }

  // 📱 Native version
  return (
    <View
      style={{
        width: "95%",
        backgroundColor: "#f2f2f2",
        borderRadius: scale(10),
        padding: scale(10),
        marginVertical: scale(5),
      }}
    >
      <NativeContentLoader
        speed={1.5}
        width={300}
        height={220}
        backgroundColor="#e6e6e6"
        foregroundColor="#f5f5f5"
      >
        {/* Image */}
        <Rect
          x="10"
          y="10"
          rx="8"
          ry="8"
          width={imageSize}
          height={imageSize}
        />

        {/* Rating */}
        {showRating && (
          <Rect x="10" y="120" rx="4" ry="4" width="80" height="20" />
        )}

        {/* Orders */}
        {showOrders && (
          <Rect x="100" y="120" rx="4" ry="4" width="50" height="20" />
        )}

        {/* Text lines */}
        <Rect x="170" y="20" rx="4" ry="4" width="100" height="20" />
        <Rect x="170" y="50" rx="4" ry="4" width="120" height="15" />
        <Rect x="170" y="70" rx="4" ry="4" width="100" height="15" />
        <Rect x="170" y="90" rx="4" ry="4" width="110" height="15" />

        {/* Bottom section */}
        {showPoints && (
          <Rect x="20" y="170" rx="4" ry="4" width="24" height="24" />
        )}
        <Rect x="70" y="170" rx="8" ry="8" width="120" height="36" />
      </NativeContentLoader>
    </View>
  );
}
