import { Box } from "@/components/ui/box";
import React, { useEffect } from "react";
import { Platform, StatusBar, View } from "react-native";
import Explorepage from "./ExplorePage";
import AddLocation from "../components/addressLocation/AddLocation";
import { theme } from "../Theme";
import {
  configureAppContext,
  request,
  connectWS,
} from "@ahmedashrafdev/shared-utils";
import DrawSmoothPolygon from "../components/maps/DrawSmoothPolygon";
import PolygonMapParameter from "../components/maps/DrawSmoothPolygon";
import { PolygonForm } from "../components/maps/PolygonForm";
const HomePage = () => {
  useEffect(() => {
    if (Platform.OS === "web") {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
    }
  }, []);
  return (
    <>
      <Box className="flex-1">
        <StatusBar
          backgroundColor={theme.body} // Android
          barStyle="dark-content" // or "light-content" based on your text color
        />
        <Box className="flex-1">
          <PolygonForm enable={false} setNewPolygon={() => {}} />
          <Explorepage />
        </Box>
      </Box>
    </>
  );
};
export default HomePage;
