import React, { useRef, useEffect } from "react";
import { Platform, View } from "react-native";
import WebView from "react-native-webview";
import schema from "../../Schemas/Map/PolygonSchema.json";

const PolygonMapEmbed = ({
  location = {},
  clickable = false,
  fields = [],
  haveRadius = false,
  findServerContainer = null,
  clickAction = "pin",
  host = "http://localhost:3000", // your web app host
}) => {
  const webRef = useRef(null);
  const iframeRef = useRef(null);

  // Build query params to pass all values via URL
  const params = new URLSearchParams({
    location: JSON.stringify(location),
    clickable,
    fields: JSON.stringify(fields),
    haveRadius,
    findServerContainer: JSON.stringify(schema),
    clickAction,
  });

  const url = `${host}/displayMap?${params.toString()}`;

  // Mobile WebView (Android + iOS)
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
        />
      </View>
    );
  }

  // Web iframe
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <iframe
        ref={iframeRef}
        src={url}
        title="Polygon Map"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />
    </div>
  );
};

export default PolygonMapEmbed;
