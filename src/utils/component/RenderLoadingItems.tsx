import { View, Text } from "react-native";
import React, { useMemo } from "react";
import SkeletonWrapper from "./SkeletonLoading.web";
import { getItemsLoadingCount } from "../operation/getItemsLoadingCount";
import LoadingScreen from "../../kitchensink-components/loading/LoadingScreen";
import { Chase } from "react-native-animated-spinkit";

export default function RenderLoadingItems({
  loading,
  SkeletonComponent,
  rows,
  classNameContainer = "",
}) {
  const itemsLoadingCount = useMemo(() => getItemsLoadingCount(), []);
  if (rows.length > 0 && loading) {
    return (
      <View className="p-8">
        <LoadingScreen LoadingComponent={<Chase size={40} />} />
      </View>
    );
  }
  return (
    loading && (
      <View className={classNameContainer}>
        {Array.from({ length: itemsLoadingCount }).map((_, i) => (
          <SkeletonWrapper
            key={i}
            isLoading={loading}
            SkeletonComponent={SkeletonComponent}
            skeletonProps={{ width: "100%", height: 200 }}
          />
        ))}
      </View>
    )
  );
}
