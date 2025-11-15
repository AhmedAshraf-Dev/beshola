import { Platform } from "react-native";
import { getField } from "./getField";

/**
 * Performs reverse geocoding using OpenStreetMap (Nominatim API)
 * Works for all platforms: Web, iOS, Android (Expo / React Native)
 */
export async function reverseGeocode(lat, lng, fields) {
  try {
    // Get the relevant field mapping for the form
    const fieldsType = {
      streetName: getField(fields, "streetName"),
      zoneName: getField(fields, "zoneName"),
      buildNumber: getField(fields, "float"),
      flagMark: getField(fields, "textarea"),
    };

    // OpenStreetMap Nominatim endpoint
    const endpoint = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;

    // ✅ Use fetch for all platforms (Expo supports it natively)
    const response = await fetch(endpoint, {
      headers: {
        "User-Agent": "YourAppName/1.0 (expo)",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.warn("Reverse geocoding failed:", response.status);
      return buildEmptyResult(fieldsType);
    }

    const data = await response.json();

    // ✅ Extract address data safely for all platforms
    const address = data.address || {};

    return {
      [fieldsType.streetName]: address.road || address.street || "",
      [fieldsType.zoneName]:
        address.city || address.town || address.village || address.suburb || "",
      [fieldsType.buildNumber]: address.house_number || "",
      [fieldsType.flagMark]: address.display_name || data.display_name || "",
    };
  } catch (error) {
    const fieldsType = {
      streetName: getField(fields, "streetName"),
      zoneName: getField(fields, "zoneName"),
      buildNumber: getField(fields, "float"),
      flagMark: getField(fields, "textarea"),
    };
    console.error("Reverse geocoding error:", error);
    return buildEmptyResult(fieldsType);
  }
}

/**
 * Helper: returns empty address structure
 */
function buildEmptyResult(fieldsType) {
  return {
    [fieldsType.streetName]: "",
    [fieldsType.zoneName]: "",
    [fieldsType.buildNumber]: "",
    [fieldsType.flagMark]: "",
  };
}
