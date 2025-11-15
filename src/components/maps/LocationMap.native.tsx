import React, { useEffect, useRef, useState } from "react";
import { Platform, View } from "react-native";
import { useSelector } from "react-redux";
import { Chase } from "react-native-animated-spinkit";
import { locationMap } from "../form-container/inputs/styles";
import { reverseGeocode } from "../../utils/operation/getlocationInfo";
import { getField } from "../../utils/operation/getField";

const defaultZoom = 13;

// --- Load Google Maps (Web only)
function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }

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

const LocationMapEmbed = ({
  location,
  onLocationChange,
  clickable,
  fields,
  haveRadius,
}) => {
  const localization = useSelector((state) => state.localization.localization);
  const latitudeField = fields.find(
    (param) =>
      param.parameterType ===
      (haveRadius ? "areaMapLatitudePoint" : "mapLatitudePoint")
  )?.parameterField;
  const longitudeField = fields.find(
    (param) =>
      param.parameterType ===
      (haveRadius ? "areaMapLongitudePoint" : "mapLongitudePoint")
  )?.parameterField;
  const radiusField = haveRadius
    ? fields.find((param) => param.parameterType === "areaMapRadius")
        ?.parameterField
    : null;

  const lat =
    +location[latitudeField] || location.latitude || 30.03104122832516;
  const lng =
    +location[longitudeField] || location.longitude || 31.240659768561887;
  const [radius, setRadius] = useState(location[radiusField] || 100);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  // 🌐 --- Web Version
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
            [latitudeField]: newLat,
            [longitudeField]: newLng,
            ...(radiusField && { [radiusField]: radius }),
          };
          onLocationChange(newLocation, locationInfo);
        });
      }

      setLoading(false);
    });
  }, []);

  // 📱 --- Mobile Version (dynamic import)
  if (Platform.OS !== "web") {
    const [MapComponents, setMapComponents] = useState(null);

    useEffect(() => {
      (async () => {
        const maps = await import("react-native-maps");
        setMapComponents(maps);
        setLoading(false);
      })();
    }, []);

    if (loading || !MapComponents) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Chase size={30} color="#007bff" />
        </View>
      );
    }

    const { default: MapView, Marker, Circle } = MapComponents;

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
              [latitudeField]: newLat,
              [longitudeField]: newLng,
              ...(radiusField && { [radiusField]: radius }),
            };
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
  }

  // 🌐 --- Web Render
  return (
    <div className={locationMap.container}>
      {loading && (
        <div className="flex-row justify-center items-center">
          <Chase size={20} />
        </div>
      )}
      <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
    </div>
  );
};

export default LocationMapEmbed;
