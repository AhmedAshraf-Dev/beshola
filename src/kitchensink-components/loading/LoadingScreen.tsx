import React, { FC, ReactNode } from "react";
import { View, Image } from "react-native";
import { Chase } from "react-native-animated-spinkit";
import { moderateScale, scale } from "react-native-size-matters";

type LoadingScreenProps = {
  LoadingComponent?: ReactNode; // JSX element
  showLogo?: boolean; // controlled from outside
};

const LoadingScreen: FC<LoadingScreenProps> = ({
  LoadingComponent = null,
  showLogo = true,
}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!LoadingComponent && showLogo ? (
        <Chase
          size={40}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Image
            source={require("../../../assets/display/logo.jpeg")}
            style={{
              width: scale(160),
              height: moderateScale(140),
              resizeMode: "contain",
            }}
          />
        </Chase>
      ) : (
        LoadingComponent
      )}
    </View>
  );
};

export default LoadingScreen;
