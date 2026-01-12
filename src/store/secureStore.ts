import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import LZString from "lz-string";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Web cookie helpers
function setCookie(key, value, expires) {
  if (!expires) {
    // Session cookie: no expires attribute
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/`;
  } else {
    console.log("====================================");
    console.log(expires, key, "expires");
    console.log("====================================");
    document.cookie = `${key}=${encodeURIComponent(
      value,
    )}; expires=${expires}; path=/`;
  }
}

function getCookie(key) {
  const cookies = document.cookie.split("; ").reduce((acc, current) => {
    const [k, v] = current.split("=");
    acc[k] = decodeURIComponent(v);
    return acc;
  }, {});
  return cookies[key] ?? null;
}

function deleteCookie(key) {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Unified SecureStore function
export const saveSecureValue = async (
  key,
  value,
  expiresAt,
  sessionOnly = false,
) => {
  if (Platform.OS === "web") {
    if (typeof document === "undefined") return;

    if (sessionOnly) {
      // Session cookie
      document.cookie = `${key}=${encodeURIComponent(value)}; path=/`;
    } else {
      // Persistent cookie
      document.cookie = `${key}=${encodeURIComponent(
        value,
      )}; expires=${expiresAt}; path=/`;
    }

    return;
  }

  // 📱 Mobile SecureStore (JSON + compressed)
  const payload = JSON.stringify({
    value,
    expiresAt: sessionOnly ? null : expiresAt,
  });
  await AsyncStorage.setItem(key, payload);
};

export const retrieveSecureValue = async (key) => {
  let stored;
  if (Platform.OS === "web") {
    const value = getCookie(key);
    if (!value) return null;

    const expires = getCookie(`${key}_expires`);
    if (expires && new Date(expires) < new Date()) {
      deleteCookie(key);
      deleteCookie(`${key}_expires`);
      return null;
    }

    return value;
  }

  // MOBILE
  stored = await AsyncStorage.getItem(key);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) {
      await deleteKey(key);
      return null;
    }
    return parsed.value;
  } catch {
    await deleteKey(key);
    return null;
  }
};

export const deleteKey = async (key) => {
  if (Platform.OS === "web") {
    deleteCookie(key);
  } else {
    await AsyncStorage.removeItem(key);
  }
};
