import React, { useEffect, useRef, useState } from "react";
import { View, Platform } from "react-native";
import { Chase } from "react-native-animated-spinkit";
import { reverseGeocode } from "../../utils/operation/getlocationInfo";

const LocationMap = ({
  location,
  onLocationChange,
  clickable,
  fields,
  haveRadius,
}) => {
  const [MapComponents, setMapComponents] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === "web") return;

      const {
        default: MapView,
        Marker,
        Circle,
      } = await import("react-native-maps");
      setMapComponents({ MapView, Marker, Circle });
      setLoading(false);
    })();
  }, []);

  if (loading || !MapComponents) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Chase size={30} color="#007bff" />
      </View>
    );
  }

  const { MapView, Marker, Circle } = MapComponents;
  const lat =
    +location[
      fields.find(
        (f) =>
          f.parameterType ===
          (haveRadius ? "areaMapLatitudePoint" : "mapLatitudePoint")
      )?.parameterField
    ] || 30.031041;
  const lng =
    +location[
      fields.find(
        (f) =>
          f.parameterType ===
          (haveRadius ? "areaMapLongitudePoint" : "mapLongitudePoint")
      )?.parameterField
    ] || 31.24066;
  const radius =
    location[
      fields.find((f) => f.parameterType === "areaMapRadius")?.parameterField
    ] || 100;

  return (
    <View style={{ width: "100%", height: 400 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={async (e) => {
          if (!clickable) return;
          const { latitude: newLat, longitude: newLng } =
            e.nativeEvent.coordinate;
          const locationInfo = await reverseGeocode(newLat, newLng, fields);
          const newLocation = {
            [fields.find(
              (f) =>
                f.parameterType ===
                (haveRadius ? "areaMapLatitudePoint" : "mapLatitudePoint")
            )?.parameterField]: newLat,
            [fields.find(
              (f) =>
                f.parameterType ===
                (haveRadius ? "areaMapLongitudePoint" : "mapLongitudePoint")
            )?.parameterField]: newLng,
          };
          if (haveRadius)
            newLocation[
              fields.find(
                (f) => f.parameterType === "areaMapRadius"
              )?.parameterField
            ] = radius;
          onLocationChange(newLocation, locationInfo);
        }}
      >
        <Marker coordinate={{ latitude: lat, longitude: lng }} />
        {haveRadius && (
          <Circle
            center={{ latitude: lat, longitude: lng }}
            radius={radius}
            strokeColor="#007bff"
            fillColor="rgba(0,123,255,0.2)"
          />
        )}
      </MapView>
    </View>
  );
};

export default LocationMap;
