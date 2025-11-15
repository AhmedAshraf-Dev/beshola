import React, { FC, ReactNode } from "react";
import { View, Image } from "react-native";
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
    <View className="flex-1 bg-body justify-center items-center">
      {!LoadingComponent && showLogo ? (
        <Image
          source={require("../../../assets/display/logo.webp")}
          style={{
            width: scale(160), // Responsive logo width
            height: moderateScale(140), // Responsive logo height
            resizeMode: "cover",
          }}
        />
      ) : (
        LoadingComponent
      )}
    </View>
  );
};

export default LoadingScreen;
