import {
  AntDesign,
  Feather,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { default as React } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { scale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import { Box, VStack } from "../../../components/ui";
import { useAuth } from "../../../context/auth";
import { AddToCartPrimaryButton } from "../../kitchensink-components/cart/AddToCartButton";
import { theme } from "../../Theme";
import CardPriceDiscount from "../../utils/component/CardPriceDiscount";
import GetIconMenuItem from "../../utils/component/GetIconMenuItem";
import { getResponsiveImageSize } from "../../utils/component/getResponsiveImageSize";
import StarsIcons from "../../utils/component/StarsIcons";
import { formatCount } from "../../utils/operation/formatCount";
import { getPaddedText } from "../../utils/operation/getPaddedText";
import { isRTL } from "../../utils/operation/isRTL";
import CardInteraction from "./CardInteraction";
import ImageCardActions from "./ImageCardActions";
import PricePlansSection from "./PricePlansSection";

export const CompanyCardWeb = ({ item, fieldsType, schemaActions }) => {
  const imageSize = getResponsiveImageSize(0.3, { min: 80, max: 100 });
  const localization = useSelector((state) => state.localization.localization);
  const { userGust } = useAuth();

  return (
    <View className="size-full grid md:!flex relative">
      {/* Image + Top Right Buttons */}
      <View className="relative grid grid-cols-2 overflow-hidden w-full">
        {/* Left: Image Section */}
        <View
          className="w-full flex flex-col relative 
          "
        >
          <MemoizedImageCard
            item={item}
            fieldsType={fieldsType}
            imageSize={imageSize}
            schemaActions={schemaActions}
          />

          {/* Rating and Orders (if needed later) */}
          <View className="flex-row items-center justify-center mt-2 w-full flex-wrap"></View>
        </View>

        {/* Right: Content Section */}
        <View className="w-full flex flex-col justify-between ps-2">
          <VStack>
            <View
              className={isRTL() ? "items-start" : "items-start" + " min-h-28"}
            >
              <View>
                {/* Company Name + Verified + Stars */}
                {fieldsType.companyName && item[fieldsType.companyName] && (
                  <Text
                    numberOfLines={2}
                    key={`${item[fieldsType.idField]}-${
                      fieldsType.companyName
                    }-${item[fieldsType.companyName]}`}
                    className="text-lg font-bold mb-1"
                    style={{ color: theme.secondary, direction: "inherit" }}
                  >
                    {" "}
                    {item.verified && (
                      <View className="flex-row items-center">
                        {" "}
                        <MaterialCommunityIcons
                          name="check-decagram"
                          size={18}
                          color={theme.accentHover}
                        />{" "}
                      </View>
                    )}{" "}
                    {item.companyName}{" "}
                  </Text>
                )}
                {fieldsType.rate && item[fieldsType.rate] && (
                  <View
                    className="flex-row items-center justify-center w-full mb-1"
                    key={`${item[fieldsType.idField]}-${fieldsType.rate}-${
                      item[fieldsType.rate]
                    }`}
                  >
                    <StarsIcons
                      key={`${item[fieldsType.idField]}-${fieldsType.rate}-${
                        item[fieldsType.rate]
                      }`}
                      customKey={`${item[fieldsType.idField]}-${
                        fieldsType.rate
                      }-${item[fieldsType.rate]}`}
                      value={parseFloat(item[fieldsType.rate])}
                      size={14}
                    />
                  </View>
                )}
                {/* Property Info */}
                {fieldsType.propertyType && item[fieldsType.propertyType] && (
                  <View
                    className="flex-row items-center justify-center w-full mb-1"
                    key={`${item[fieldsType.idField]}-${
                      fieldsType.propertyType
                    }-${item[fieldsType.propertyType]}`}
                  >
                    <Text className="text-body text-sm mb-1 ps-4">
                      {item.propertyType} • {item.bedrooms} Beds
                    </Text>
                  </View>
                )}
                {fieldsType.bathrooms && item[fieldsType.bathrooms] && (
                  <View
                    className="flex-row items-center justify-center w-full mb-1"
                    key={`${item[fieldsType.idField]}-${fieldsType.bathrooms}-${
                      item[fieldsType.bathrooms]
                    }`}
                  >
                    <Text className="text-body text-sm mb-1 ps-4">
                      {item.bathrooms} Baths • {item.area} m²
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </VStack>
        </View>
      </View>

      {/* Bottom Row: Location, Views, Contact */}
      <View
        className="flex-row justify-between items-center mt-1 gap-1"
        style={{ gap: 3 }}
      >
        {/* in search location-views-chat */}
        {fieldsType.location && item[fieldsType.location] && (
          <TouchableOpacity
            className="bg-accentHover px-3 py-1 rounded-full shadow flex-row items-center"
            onPress={() => console.log("Redirect to map:", item.location)}
          >
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={18}
              color={theme.body}
            />
            <Text className="text-body text-sm font-semibold ml-1">
              {item.location}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="bg-accent p-2 rounded-xl flex-1 flex-row justify-center items-center"
          onPress={() => console.log("Contact icon pressed")}
        >
          {/* <MaterialCommunityIcons
            name="phone-outline"
            size={20}
            color="white"
          /> */}
          <FontAwesome6 name="sack-dollar" size={24} color={theme.body} />
          <Text className="text-md text-body ml-1">Booked</Text>
        </TouchableOpacity>
        {/* <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="eye-outline"
            size={18}
            color={theme.accent}
          />
          <Text className="text-body text-xs ml-1">
            {item.viewers} viewing now
          </Text>
        </View> */}

        <TouchableOpacity
          className="bg-body p-2 rounded-xl"
          onPress={() => console.log("Contact icon pressed")}
        >
          {/* <MaterialCommunityIcons
            name="phone-outline"
            size={20}
            color="white"
          /> */}
          <AntDesign name="wechat" size={24} color={theme.accent} />
        </TouchableOpacity>
      </View>

      {/* Reward Points */}
      {/* <View className="flex flex-row justify-between items-center px-2">
        {fieldsType.rewardPoints && item[fieldsType.rewardPoints] && (
          <View
            className="relative w-6 h-6 justify-center items-center"
            key={`${item[fieldsType.idField]}-${fieldsType.rewardPoints}-${
              item[fieldsType.rewardPoints]
            }`}
          >
            <MaterialCommunityIcons
              name="gift-outline"
              size={24}
              color={theme.accent}
            />
            <View className="absolute -top-1 -end-2 bg-green-600 rounded-full px-1">
              <Text className="text-xs text-white font-bold">
                {item[fieldsType.rewardPoints] ?? 0}
              </Text>
            </View>
          </View>
        )}
      </View> */}

      {/* Out of Stock Banner */}
      {fieldsType.isAvailable && !item[fieldsType.isAvailable] && (
        <View
          key={`${item[fieldsType.idField]}-${fieldsType.isAvailable}-${
            item[fieldsType.isAvailable]
          }`}
          style={{
            backgroundColor: theme.error,
            paddingHorizontal: 30,
            paddingVertical: 4,
            zIndex: 200,
            overflow: "hidden",
          }}
          className={`${
            isRTL() ? "-left-[50px] -rotate-45" : "-right-[50px] rotate-45"
          } absolute`}
        >
          <Text style={{ color: theme.body, fontWeight: "bold", fontSize: 12 }}>
            {localization.Hum_screens.menu.outOfStock}
          </Text>
        </View>
      )}
    </View>
  );
};
const MemoizedImageCard = React.memo(
  function MemoizedImageCard({ item, fieldsType, imageSize, schemaActions }) {
    return (
      <Box className="w-full flex justify-center items-center overflow-hidden rounded-0">
        <ImageCardActions
          fieldsType={fieldsType}
          item={item}
          showFaovertIcon={fieldsType.isFav}
          style={{ width: imageSize, height: imageSize }}
          className="!w-[100%] !h-40 md:!size-40"
        >
          <></>
        </ImageCardActions>
      </Box>
    );
  },
  (prevProps, nextProps) => {
    // only re-render if item or fieldsType change
    return (
      prevProps.item === nextProps.item &&
      prevProps.fieldsType === nextProps.fieldsType &&
      prevProps.imageSize === nextProps.imageSize
    );
  }
);
