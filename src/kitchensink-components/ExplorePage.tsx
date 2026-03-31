import React from "react";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import { Box, VStack } from "../../components/ui";
import { useSchemas } from "../../context/SchemaProvider";
import PolygonMapEmbed from "../components/maps/DrawSmoothPolygon";
import SuggestCardContainer from "../components/suggest/SuggestCardContainer";
import AssetsSchemaActions from "../Schemas/MenuSchema/AssetsSchemaActions.json";
import Pro3DViewerModal from "../utils/component/Pro3DViewer";
import { useDeviceInfo } from "../utils/component/useDeviceInfo";
import AdditionalInfoScreen from "./auth/signup/AddtionInfo";
import HomeCarousel from "./main-content/HomeCarousel.native";
import HomeCarouselWeb from "./main-content/HomeCarousel.web";

const Explorepage = () => {
  const { os } = useDeviceInfo();
  const { recommendedState } = useSchemas();
  const localization = useSelector((state) => state.localization.localization);
  return (
    <>
      <ScrollView>
        <Box>
          <VStack space="sm">
            {os === "web" && <HomeCarouselWeb />}
            {os !== "web" && <HomeCarousel />}
            {/* <PolygonForm enable={false} setNewPolygon={() => {}} /> */}
            <PolygonMapEmbed
              clickable={false}
              onLocationChange={() => {}}
              setNewPolygon={() => {}}
            />
            <Pro3DViewerModal />
            <View className="flex-col">
              <SuggestCardContainer
                row={{ onlyDiscountItems: true }}
                suggestContainerType={0}
                schemaActions={AssetsSchemaActions}
                shownNodeMenuItemIDs={[]}
                header={localization.Hum_screens.home.discountItems}
              />
            </View>
            <View className="flex-col">
              <SuggestCardContainer
                suggestContainerType={0}
                schemaActions={AssetsSchemaActions}
                shownNodeMenuItemIDs={[]}
                header={localization.Hum_screens.home.suggestItems}
              />
            </View>
          </VStack>
        </Box>
        <AdditionalInfoScreen />
      </ScrollView>
    </>
  );
};

export default Explorepage;
