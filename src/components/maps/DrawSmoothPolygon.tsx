import React, { useRef, useEffect, useState } from "react";
import { Platform, View } from "react-native";
import WebView from "react-native-webview";
import schema from "../../Schemas/Map/PolygonSchema.json";
import Sheet from "../../utils/component/Sheet";
import { ScrollView } from "react-native";
import { initCompanyRows } from "../company-components/tabsData";
import SheetCard from "../../kitchensink-components/compare/SheetCard";
import MapDrawer from "./MapDrawer";
import DrawerComponent from "./DrawerComponent";
import { store } from "../../store/reduxStore";

const PolygonMapEmbed = ({
  location = store.getState().location.currentLocation,
  clickable = false,
  fields = [
    {
      dashboardFormSchemaParameterID: "bbc47b3c-baba-4c80-8a8e-50d9875a15d6",
      dashboardFormSchemaID: "270f513b-1788-4c01-879e-4526c990f898",
      isEnable: true,
      parameterType: "areaMapLatitudePoint",
      parameterField: "latitude",
      parameterTitel: "locationLatitudePoint",
      isIDField: false,
      lookupID: null,
      lookupReturnField: null,
      lookupDisplayField: null,
      indexNumber: 0,
    },
    {
      dashboardFormSchemaParameterID: "bbc47b3c-baba-4c80-8a8e-50d9875a15d6",
      dashboardFormSchemaID: "270f513b-1788-4c01-879e-4526c990f898",
      isEnable: true,
      parameterType: "areaMapLongitudePoint",
      parameterField: "longitude",
      parameterTitel: "longitude",
      isIDField: false,
      lookupID: null,
      lookupReturnField: null,
      lookupDisplayField: null,
      indexNumber: 0,
    },
  ],
  haveRadius = false,
  clickAction = "pin",
  host = "https://ihs-solutions.com:7552", // your web app host,"https://ihs-solutions.com:7552",
  onLocationChange,
  setNewPolygon,
}) => {
  const webRef = useRef(null);
  const iframeRef = useRef(null);
  const locationRef = useRef(JSON.stringify(location));
  const [polygonObj, setPolygonObj] = useState({});
  const [openDrawer, setOpenDrawer] = useState(false);

  const drawerComponent = openDrawer && (
    <DrawerComponent
      polygonObj={polygonObj}
      openDrawer={openDrawer}
      setOpenDrawer={setOpenDrawer}
    />
  );
  useEffect(() => {
    if (Object.keys(polygonObj).length > 0) {
      setOpenDrawer(true);
    }
  }, [polygonObj]);

  // Build query params to pass all values via URL
  const params = new URLSearchParams({
    location: locationRef.current,
    clickable,
    fields: JSON.stringify(fields),
    haveRadius,
    findServerContainer: JSON.stringify(schema),
    clickAction,
  });

  const url = `${host}/displayMap?${params.toString()}`;
  console.log("====================================");
  console.log(
    location,
    store.getState().location.currentLocation,
    fields,
    url,
    "store.getState().location.currentLocation,",
  );
  console.log("====================================");
  const switchFun = (data) =>
    windowMessageSwitch(data, onLocationChange, setNewPolygon, setPolygonObj);
  // ✅ React Native (Mobile)
  if (Platform.OS !== "web") {
    return (
      <View style={{ width: "100%", height: 400 }}>
        <WebView
          ref={webRef}
          originWhitelist={["*"]}
          source={{ uri: url }}
          style={{ flex: 1 }}
          javaScriptEnabled
          domStorageEnabled
          onMessage={async (event) => {
            const data = JSON.parse(event.nativeEvent.data);

            switchFun(data);
          }}
        />

        {drawerComponent}
      </View>
    );
  }

  // ✅ WEB (iframe)
  useEffect(() => {
    const handleMessage = (event) => {
      // Optional: secure origin check
      // if (event.origin !== "https://yourdomain.com") return;

      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        switchFun(data);
      } catch (error) {
        console.log("Invalid message received:", error);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onLocationChange, setNewPolygon]);

  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <iframe
        ref={iframeRef}
        src={url}
        title="Polygon Map"
        scrolling="no"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />

      {drawerComponent}
    </div>
  );
};

const windowMessageSwitch = (
  data,
  onLocationChange,
  setNewPolygon,
  setClickedPolygon,
) => {
  if (data.type === "locationChange") {
    const { lat, lng } = data.payload;
    console.log("Received new coordinates:", lat, lng, data.payload);
    onLocationChange(data.payload);
  } else if (data.type === "newPolygonChange") {
    setNewPolygon(data.payload);
  } else if (data.type === "clickedPolygon") {
    setClickedPolygon(data.payload);
    console.log("Selected Polygon Object:", data.payload);
  }
};

export default PolygonMapEmbed;
