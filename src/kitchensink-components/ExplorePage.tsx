import React from "react";
import { ScrollView, View } from "react-native";
import { Box, Heading, VStack } from "../../components/ui";
import { useDeviceInfo } from "../utils/component/useDeviceInfo";
import FaovertMenuItems from "./main-content/FaovertMenuItems";
import HomeCarousel from "./main-content/HomeCarousel";
import HomeCarouselWeb from "./main-content/HomeCarousel.web";
import AddressLocationCollapsible from "../utils/component/AddressLocationCollapsible";
import { theme } from "../Theme";
import SuggestCardContainer from "../components/suggest/SuggestCardContainer";
import SuggestCardSchemaActions from "../Schemas/MenuSchema/SuggestCardSchemaActions.json";
import { useSchemas } from "../../context/SchemaProvider";
import { useSelector } from "react-redux";

const Explorepage = () => {
  const { os } = useDeviceInfo();
  const { recommendedState } = useSchemas();
  const localization = useSelector((state) => state.localization.localization);

  return (
    <>
      <ScrollView>
        <Box>
          <VStack space="sm">
            {/* <AddressLocationCollapsible /> */}
            <View
              style={{
                // backgroundColor: theme.card,
                // padding: 16,
                marginTop: 0,
                borderBottomWidth: 1,
                borderBottomColor: theme.border,
              }}
            >
              <AddressLocationCollapsible />
            </View>
            {os === "web" && <HomeCarouselWeb />}
            {os !== "web" && <HomeCarousel />}
            <View className="flex-col">
              <Heading className="text-text font-bold text-xl">
                {localization.Hum_screens.home.discountItems}
              </Heading>
              <SuggestCardContainer
                row={{ onlyDiscountItems: true }}
                suggestContainerType={0}
                schemaActions={SuggestCardSchemaActions}
                shownNodeMenuItemIDs={[]}
              />
            </View>
            <View className="flex-col">
              <Heading className="text-text font-bold text-xl">
                {localization.Hum_screens.home.suggestItems}
              </Heading>
              <SuggestCardContainer
                suggestContainerType={0}
                schemaActions={SuggestCardSchemaActions}
                shownNodeMenuItemIDs={[]}
              />
            </View>

            {/* <HomeContent /> */}
            <FaovertMenuItems />
          </VStack>
        </Box>
      </ScrollView>
    </>
  );
};

export default Explorepage;
