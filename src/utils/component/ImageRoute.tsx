import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { GetMediaUrl } from "../operation/GetMediaUrl";

export default function ImageRoute({ item }) {
  const fieldsType = useSelector((state) => state.menuItem.fieldsType);
  const route = item?.[fieldsType.imageView];

  const [imageSrc, setImageSrc] = useState(null);
  const [hasError, setHasError] = useState(false);
  const imageUrlRef = useRef(null);
  const [key, setKey] = useState(route?.replace(/[^\w-]/g, "_") || "no_route");
  const defaultImagePath = "../../../assets/display/adaptive-icon.png";
  //const key = ;
  // ✅ Generate valid image URL
  useEffect(() => {
    if (!route) {
      setImageSrc(require(defaultImagePath));
      return;
    }

    const url = GetMediaUrl(route, "publicImage");
    imageUrlRef.current = url;
    setHasError(false);
    setImageSrc({ uri: url });
    setKey(route?.replace(/[^\w-]/g, "_") || "no_route");
  }, [route]);

  // ✅ Clean route for key stability

  // ✅ Wait until imageSrc is ready before rendering Image
  if (!imageSrc) {
    return <View style={styles.placeholder} />;
  }

  return (
    <View style={styles.container}>
      <Image
        key={key}
        source={hasError ? require(defaultImagePath) : imageSrc}
        style={styles.image}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={300}
        alt={item?.[fieldsType.text] ?? "image"}
        placeholder={require(defaultImagePath)}
        onError={() => setHasError(true)}
        {...(Platform.OS === "web" ? { fetchPriority: "high" } : {})}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    backgroundColor: "#eee",
  },
});
