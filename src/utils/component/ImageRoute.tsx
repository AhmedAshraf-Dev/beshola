import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { GetMediaUrl } from "../operation/GetMediaUrl";
import { useMenu } from "../../../context/MenuProvider";

export default function ImageRoute({ item }) {
  const fieldsType = useSelector((state) => state.menuItem.fieldsType);
  const route = item?.[fieldsType.imageView];

  const [imageSrc, setImageSrc] = useState(null);
  const [hasError, setHasError] = useState(false);
  const imageUrlRef = useRef(null);

  // ✅ Generate valid image URL
  useEffect(() => {
    if (!route) {
      setImageSrc(require("../../../assets/display/icon.webp"));
      return;
    }

    const url = GetMediaUrl(route, "publicImage");
    imageUrlRef.current = url;
    setHasError(false);
    setImageSrc({ uri: url });
  }, [route]);

  // ✅ Clean route for key stability
  const key = route?.replace(/[^\w-]/g, "_") || "no_route";

  // ✅ Wait until imageSrc is ready before rendering Image
  if (!imageSrc) {
    return <View style={styles.placeholder} />;
  }

  return (
    <View style={styles.container}>
      <Image
        key={key}
        source={
          hasError
            ? require("../../../assets/display/icon.webp")
            : `https://www.nawy.com/blog/wp-content/uploads/2022/12/%D8%B9%D9%82%D8%A7%D8%B1%D8%A7%D8%AA-%D9%84%D9%84%D8%A8%D9%8A%D8%B9-%D9%81%D9%8A-%D8%A7%D9%84%D8%B4%D9%8A%D8%AE-%D8%B2%D8%A7%D9%8A%D8%AF.png`
        }
        style={styles.image}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={300}
        alt={item?.[fieldsType.text] ?? "image"}
        placeholder={require("../../../assets/display/icon.webp")}
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
