import React from "react";
import { View, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { FontAwesome5, FontAwesome, MaterialIcons } from "@expo/vector-icons";

// Convert to string safely
const toStr = (v) => (v == null ? "" : String(v).trim());

const buildHref = (codeNumber, raw) => {
  const v = toStr(raw);
  if (!v) return null;

  switch (codeNumber) {
    case 0: // Mobile
    case 2: // Landline
      return `tel:${v.replace(/[^\d+]/g, "")}`;

    case 1: // Email
      return `mailto:${v}`;

    case 3: // Location
      return v.startsWith("http")
        ? v
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v)}`;

    case 4: {
      // WhatsApp
      if (v.startsWith("http")) return v;
      const digits = v.replace(/\D/g, "");
      const without00 = digits.startsWith("00") ? digits.slice(2) : digits;
      return without00 ? `https://wa.me/${without00}` : null;
    }

    // Socials
    case 5: // Facebook
    case 6: // Instagram
    case 7: // TikTok
    case 8: // LinkedIn
    case 9: // X/Twitter
    case 10: // YouTube
      return v.startsWith("http") ? v : `https://${v}`;

    default:
      return null;
  }
};

export const GetIconContact = (codeNumber, size, contact) => {
  const href = buildHref(codeNumber, contact);

  const iconMap = {
    0: <FontAwesome5 name="mobile-alt" size={size} color="#000" />,
    1: <MaterialIcons name="email" size={size} color="#000" />,
    2: <FontAwesome5 name="phone" size={size} color="#000" />,
    3: <MaterialIcons name="location-on" size={size} color="#000" />,
    4: <FontAwesome5 name="whatsapp" size={size} color="#25D366" />,
    5: <FontAwesome5 name="facebook" size={size} color="#1877F2" />,
    6: <FontAwesome5 name="instagram" size={size} color="#E4405F" />,
    7: <FontAwesome5 name="tiktok" size={size} color="#000" />,
    8: <FontAwesome5 name="linkedin" size={size} color="#0A66C2" />,
    9: <FontAwesome5 name="twitter" size={size} color="#1DA1F2" />,
    10: <FontAwesome5 name="youtube" size={size} color="#FF0000" />,
  };

  const icon = iconMap[codeNumber] ?? null;
  if (!icon) return null;

  const handlePress = async () => {
    if (href) {
      const supported = await Linking.canOpenURL(href);
      if (supported) {
        await Linking.openURL(href);
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.iconButton}
      activeOpacity={0.7}
    >
      {icon}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
});
