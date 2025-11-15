import React from "react";
import { View, Text } from "react-native";
import { scale } from "react-native-size-matters";
import { Box } from "../../../components/ui";
import { theme } from "../../Theme";
import ImageRoute from "../../utils/component/ImageRoute";
import CardInteraction from "./CardInteraction";
import FaovertCardIcon from "./FaovertCardIcon";
import { useSelector } from "react-redux";

function ImageCardActions({
  item,
  fieldsType,
  style = { width: scale(135) },
  showFaovertIcon = true,
  children,
  className = "",
}) {
  const localization = useSelector((state) => state.localization.localization);

  return (
    <View className="size-full items-center">
      {item[fieldsType.imageView] && (
        <Box
          key={`${fieldsType.imageView}-${item[fieldsType.imageView]}`}
          style={{
            width: scale(135),
            height: scale(180),
            borderRadius: scale(16),
            overflow: "hidden",
            backgroundColor: theme.body || "#fff",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
            position: "relative",
            ...style,
          }}
          className={className}
        >
          {/* Image */}
          <ImageRoute item={item} />

          {/* Floating Heart Icon
          {showFaovertIcon && (
            <FaovertCardIcon fieldsType={fieldsType} item={item} />
          )} */}

          {/* Top overlay for interaction */}
          {children}
        </Box>
      )}
    </View>
  );
}

// ✅ Wrap the whole component in React.memo
export default React.memo(ImageCardActions, (prevProps, nextProps) => {
  // custom comparison to avoid re-render if props haven't changed
  return (
    prevProps.item === nextProps.item &&
    prevProps.fieldsType === nextProps.fieldsType &&
    prevProps.showFaovertIcon === nextProps.showFaovertIcon &&
    prevProps.className === nextProps.className &&
    JSON.stringify(prevProps.style) === JSON.stringify(nextProps.style)
  );
});
