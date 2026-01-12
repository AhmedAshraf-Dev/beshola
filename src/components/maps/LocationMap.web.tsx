import React, { useEffect, useRef, useState } from "react";
import { View, Platform } from "react-native";
import { Chase } from "react-native-animated-spinkit";
import { reverseGeocode } from "../../utils/operation/getlocationInfo";

const defaultZoom = 13;

function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) return resolve(window.google.maps);
    const existingScript = document.getElementById("googleMaps");
    if (existingScript) {
      existingScript.onload = () => resolve(window.google.maps);
      return;
    }
    const script = document.createElement("script");
    script.id = "googleMaps";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

const LocationMap = ({
  location,
  onLocationChange,
  clickable,
  fields,
  haveRadius,
}) => {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const lat =
    +location[
      fields.find(
        (f) =>
          f.parameterType ===
          (haveRadius ? "areaMapLatitudePoint" : "mapLatitudePoint"),
      )?.parameterField
    ] || 30.031041;
  const lng =
    +location[
      fields.find(
        (f) =>
          f.parameterType ===
          (haveRadius ? "areaMapLongitudePoint" : "mapLongitudePoint"),
      )?.parameterField
    ] || 31.24066;
  const radius =
    location[
      fields.find((f) => f.parameterType === "areaMapRadius")?.parameterField
    ] || 100;

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
    loadGoogleMaps(apiKey).then((maps) => {
      if (!mapRef.current) return;
      const map = new maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: defaultZoom,
      });
      const marker = new maps.Marker({ position: { lat, lng }, map });
      let circle;
      if (haveRadius) {
        circle = new maps.Circle({
          map,
          center: { lat, lng },
          radius,
          fillColor: "#007bff33",
          strokeColor: "#007bff",
          strokeWeight: 1,
        });
      }
      if (clickable) {
        map.addListener("click", async (e) => {
          const newLat = e.latLng.lat();
          const newLng = e.latLng.lng();
          const locationInfo = await reverseGeocode(newLat, newLng, fields);
          marker.setPosition({ lat: newLat, lng: newLng });
          if (circle) circle.setCenter({ lat: newLat, lng: newLng });
          const newLocation = {
            [fields.find(
              (f) =>
                f.parameterType ===
                (haveRadius ? "areaMapLatitudePoint" : "mapLatitudePoint"),
            )?.parameterField]: newLat,
            [fields.find(
              (f) =>
                f.parameterType ===
                (haveRadius ? "areaMapLongitudePoint" : "mapLongitudePoint"),
            )?.parameterField]: newLng,
          };
          if (haveRadius)
            newLocation[
              fields.find(
                (f) => f.parameterType === "areaMapRadius",
              )?.parameterField
            ] = radius;
          onLocationChange(newLocation, locationInfo);
        });
      }
      setLoading(false);
    });
  }, []);

  return (
    <View style={{ width: "100%", height: 400 }}>
      {loading && <Chase size={20} />}
      <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
    </View>
  );
};

export default LocationMap;
