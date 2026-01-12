import React, { useState, useRef, useEffect } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { scale } from "react-native-size-matters";
import { HStack } from "../../../components/ui";
import GetIconMenuItem from "../../utils/component/GetIconMenuItem";
import { RunsSpacialAction } from "../../utils/operation/RunsSpacialAction";
import { theme } from "../../Theme";
import { Vibration } from "react-native";

export default function CardInteraction({ item, fieldsType, schemaActions }) {
  const [active, setActive] = useState(
    item[fieldsType.indexOfInteraction] ?? 0,
  ); // 1: like, -1: dislike, 0: none
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setActive(item[fieldsType.indexOfInteraction] ?? 0);
  }, [item[fieldsType.indexOfInteraction]]);
  // const likeAnim = useRef(
  //   new Animated.Value(item[fieldsType.indexOfInteraction] === 1 ? 1 : 0)
  // ).current;
  // const dislikeAnim = useRef(
  //   new Animated.Value(item[fieldsType.indexOfInteraction] === -1 ? 1 : 0)
  // ).current;

  // Re-initialize animations when active state changes
  const likeAnim = useRef(new Animated.Value(0)).current;
  const dislikeAnim = useRef(new Animated.Value(0)).current;
  const likeScale = useRef(new Animated.Value(1)).current;
  const dislikeScale = useRef(new Animated.Value(1)).current;

  const runScaleAnim = (animRef) => {
    Animated.sequence([
      Animated.spring(animRef, {
        toValue: 1.4, // scale up
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(animRef, {
        toValue: 1, // back to normal
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    // Reset animations based on current active state
    likeAnim.setValue(active === 1 ? 1 : 0);
    dislikeAnim.setValue(active === -1 ? 1 : 0);

    Animated.parallel([
      Animated.timing(likeAnim, {
        toValue: active === 1 ? 1 : 0,
        duration: 300,
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.timing(dislikeAnim, {
        toValue: active === -1 ? 1 : 0,
        duration: 300,
        useNativeDriver: Platform.OS !== "web",
      }),
    ]).start();
  }, [active, likeAnim, dislikeAnim]);

  const likeBackground = likeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(0,0,0,0)", theme.accent], // Changed from "transparent"
  });

  const dislikeBackground = dislikeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(0,0,0,0)", theme.accent], // Changed from "transparent"
  });

  const handlePress = async (type, field) => {
    const newIndex =
      type === "like" ? (active === 1 ? 0 : 1) : active === -1 ? 0 : -1;
    Vibration.vibrate(40);

    try {
      const req = await RunsSpacialAction(
        field,
        item[fieldsType.idField],
        newIndex !== 0,
        schemaActions,
        fieldsType.proxyRoute,
      );

      if (req) {
        // update active state
        setActive(newIndex);

        // clone the item so counts update in UI
        const updatedItem = { ...item };
        if (type === "like") {
          runScaleAnim(likeScale);

          if (active === 1) {
            updatedItem[fieldsType.likes] -= 1; // undo like
          } else {
            updatedItem[fieldsType.likes] += 1; // add like
            if (active === -1) updatedItem[fieldsType.dislikes] -= 1; // remove dislike if switching
          }
        } else {
          runScaleAnim(dislikeScale);

          if (active === -1) {
            updatedItem[fieldsType.dislikes] -= 1; // undo dislike
          } else {
            updatedItem[fieldsType.dislikes] += 1; // add dislike
            if (active === 1) updatedItem[fieldsType.likes] -= 1; // remove like if switching
          }
        }

        // force re-render with updated counts
        Object.assign(item, updatedItem);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {loading ? (
        <View
          className="flex justify-center items-center"
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: scale(28),
          }}
        >
          <ActivityIndicator size="small" color="black" />
        </View>
      ) : (
        <HStack
          space="lg"
          className="items-center w-full gap-0"
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: scale(28),
          }} // Simplified key
        >
          {/* LIKE */}
          <TouchableOpacity
            onPress={() => handlePress("like", fieldsType.likes)}
            style={{
              flex: 1,
              borderRadius: 8,
              overflow: "hidden",
              height: "100%",
            }}
          >
            <Animated.View
              style={{
                flex: 1,
                backgroundColor: likeBackground,
                justifyContent: "center",
                alignItems: "center",
                transform: [{ scale: likeScale }], // ✅ bounce effect
              }}
            >
              <GetIconMenuItem
                key={`${item[fieldsType.idField]}-happy-${
                  item[fieldsType.indexOfInteraction]
                }`}
                count={item[fieldsType.likes]}
                iconName="happy"
                size={18}
                style={{
                  color: active == 1 ? theme.text : theme.text,
                  backgroundColor: "transparent",
                }}
              />
            </Animated.View>
          </TouchableOpacity>
          {/* SPACER */}
          <Animated.View
            style={{
              width: scale(1),
              height: "100%",
              backgroundColor: theme.body,
              borderRadius: 1,
            }}
          />
          {/* DISLIKE */}
          <TouchableOpacity
            onPress={() => handlePress("dislike", fieldsType.dislikes)}
            style={{
              flex: 1,
              borderRadius: 8,
              overflow: "hidden",
              height: "100%",
            }}
          >
            <Animated.View
              style={{
                flex: 1,
                backgroundColor: dislikeBackground,
                justifyContent: "center",
                alignItems: "center",
                transform: [{ scale: dislikeScale }], // ✅ bounce effect
              }}
            >
              <GetIconMenuItem
                key={`${item[fieldsType.idField]}-normal-${
                  item[fieldsType.indexOfInteraction]
                }`}
                count={item[fieldsType.dislikes]}
                iconName="normal"
                size={18}
                style={{
                  color: active == -1 ? theme.text : theme.text,
                  backgroundColor: "transparent",
                }}
              />
            </Animated.View>
          </TouchableOpacity>
        </HStack>
      )}
    </View>
  );
}
