import React from "react";
import { View } from "react-native";
import { scale } from "react-native-size-matters";
import { useAuth } from "../../../context/auth";
import { MemoizedImageCard } from "./CompanyCard";
import Attributes from "./Attributes"; // ✅ ADD THIS
import PricePlanSummary from "../../kitchensink-components/cart/InvoiceSummary";
import PricePlansSection from "./PricePlansSection";

export default function SuggestCard({
  item,
  imageScale = scale(90),
  fieldsType,
  schemaActions,
}) {
  const { userGust } = useAuth();

  return (
    <View className="rounded-lg overflow-hidden">
      {/* Card */}
      <View className="relative">
        <MemoizedImageCard
          item={item}
          fieldsType={fieldsType}
          imageSize={imageScale}
          schemaActions={schemaActions}
        />

        {/* Attributes */}
        <View className="absolute bottom-1 w-full p-2">
          <Attributes
            attributes={
              item?.[fieldsType?.attributes] || item?.["attributes"] || []
            }
            isCompact={true} // ✅ FIXED
          />
        </View>
      </View>
      <PricePlansSection item={item} />
    </View>
  );
}
