import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveSecureValue = async (
  key,
  value,
  expiresAt = null,
  sessionOnly = false,
) => {
  try {
    const payload = JSON.stringify({
      value,
      expiresAt: sessionOnly ? null : expiresAt,
    });

    await AsyncStorage.setItem(key, payload);
  } catch (error) {
    console.log("Save error:", error);
  }
};

export const retrieveSecureValue = async (key) => {
  try {
    const stored = await AsyncStorage.getItem(key);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) {
      await deleteKey(key);
      return null;
    }

    return parsed.value;
  } catch (error) {
    console.log("Retrieve error:", error);
    await deleteKey(key);
    return null;
  }
};

export const deleteKey = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log("Delete error:", error);
  }
};
