import React, { useState } from "react";
import { StatusBar, View } from "react-native";
import { useSelector } from "react-redux";
import StepBody from "./StepBody";
import StepFooter from "./StepFooter";
import StepHeader from "./StepHeader";
import { styles } from "./styles";
import { theme } from "../../Theme";

const SplashScreen = () => {
  const [stepNum, setStepNum] = useState(0);
  const languageRow = useSelector((state) => state.localization.languageRow);
  const localization = useSelector((state) => state.localization.localization);
  return (
    <View style={styles.splash}>
      <StatusBar
        backgroundColor={theme.notification} // Android
        barStyle="dark-content" // or "light-content" based on your text color
      />
      <StepHeader
        currentPosition={stepNum}
        labels={localization.Hum_screens.splash.headerLabels}
        customKey={1}
        withIcons={false}
      />

      {/* Body in the center */}
      <View style={styles.splashBody}>
        <StepBody stepNum={stepNum} />
      </View>

      {/* Footer always at bottom */}
      <View style={styles.splashFooter}>
        <StepFooter
          stepNum={stepNum}
          withSkip={Object.keys(languageRow).length > 0 && stepNum === 3}
          setStepNum={setStepNum}
        />
      </View>
    </View>
  );
};

export default SplashScreen;
