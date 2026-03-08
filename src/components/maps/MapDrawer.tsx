import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";

const MapDrawer = ({ data, onClose }) => {
  return (
    <View className="bg-white rounded-t-3xl h-[80%]">
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <Text className="text-lg font-semibold"></Text>

        <TouchableOpacity onPress={onClose}>
          <Image
            source={{
              uri: "https://www.nawy.com/assets/icons/new/circle-close-icon.svg",
            }}
            className="w-7 h-7"
          />
        </TouchableOpacity>
      </View>

      {/* BODY */}
      <ScrollView showsVerticalScrollIndicator={false} className="px-4">
        {/* IMAGE */}
        <View className="mt-4">
          <Image
            source={{
              uri: "https://prod-images.nawy.com/processed/compound/cover_image/1632/high.webp",
            }}
            className="w-full h-[230px] rounded-lg"
            resizeMode="cover"
          />

          {/* LOCATION BADGE */}
          <View className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-full flex-row items-center">
            <Text className="text-white text-sm ml-1">Sidi Abdel Rahman</Text>
          </View>
        </View>

        {/* TITLE + DEVELOPER */}
        <View className="flex-row items-center justify-between mt-4">
          <View>
            <Text className="text-xl font-bold">Telal Soul</Text>
          </View>

          <Image
            source={{
              uri: "https://prod-images.nawy.com/processed/developer/logo_image/25/medium.webp",
            }}
            className="w-12 h-12 rounded-full"
          />
        </View>

        {/* EMPTY STATE */}
        <View className="items-center justify-center mt-10">
          <Image
            source={{
              uri: "https://www.nawy.com/assets/images/common/no-results.webp",
            }}
            className="w-[180px] h-[90px]"
          />

          <Text className="text-lg font-semibold mt-4">No Results To Show</Text>

          <Text className="text-gray-500 text-center mt-2">
            Try adjusting some filters to show more results
          </Text>

          <TouchableOpacity className="mt-5 bg-black px-6 py-3 rounded-lg">
            <Text className="text-white font-semibold">Reset Filters</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default MapDrawer;
