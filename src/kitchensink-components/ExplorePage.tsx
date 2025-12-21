import React, { useState } from "react";
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
import LocationMap from "../components/maps/NawyMapBrowser";

const Explorepage = () => {
  const { os } = useDeviceInfo();
  const { recommendedState } = useSchemas();
  const localization = useSelector((state) => state.localization.localization);
  //
  const [location, setLocation] = useState({
    lat: 30.0305,
    lng: 31.0215,
  });

  const fields = [
    { parameterType: "mapLatitudePoint", parameterField: "lat" },
    { parameterType: "mapLongitudePoint", parameterField: "lng" },
  ];

  const handleLocationChange = (newLoc, info) => {
    console.log("NEW LOCATION =>", newLoc);
    console.log("REVERSE GEO INFO =>", info);
    setLocation({ ...location, ...newLoc });
  };
  return (
    <>
      <ScrollView>
        <Box>
          <VStack space="sm">
            {os === "web" && <HomeCarouselWeb />}
            {os !== "web" && <HomeCarousel />}
            <View className="w-full my-4">
              {/* <LocationMap
                location={{ lat: 30.05, lng: 31.25 }}
                clickable={false}
                haveRadius={true}
                mapType="satellite"
                fields={[
                  { parameterType: "mapLatitudePoint", parameterField: "lat" },
                  { parameterType: "mapLongitudePoint", parameterField: "lng" },
                  { parameterType: "areaMapRadius", parameterField: "radius" },
                ]}
              /> */}
            </View>
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
