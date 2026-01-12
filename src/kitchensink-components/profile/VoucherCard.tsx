import React from "react";
import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { getField } from "../../utils/operation/getField";
import ScratchVoucherCard from "../../Schemas/MenuSchema/ScratchVoucherCard.json";
import { scale } from "react-native-size-matters";
import { setdateTime } from "../../utils/operation/dateutilies";
import { theme } from "../../Theme";

export default function VoucherCard({ item }) {
  const parameters = ScratchVoucherCard?.dashboardFormSchemaParameters ?? [];

  const voucherFieldsType = {
    voucherCardCode: getField(parameters, "voucherCardCodeWithBgImage"),
    usedAt: getField(parameters, "datetime"),
    idField: ScratchVoucherCard.idField,
    proxyRoute: ScratchVoucherCard.projectProxyRoute,
  };

  return (
    // <View style={styles.container}>
    //   <ImageBackground
    //     source={require("../../../assets/display/VoucherCard.jpeg")}
    //     style={styles.card}
    //     imageStyle={styles.image}
    //   >
    //     <View style={styles.overlay}>
    //       <Text style={styles.code}>{item[voucherFieldsType.voucherCardCode]}</Text>
    //       <Text style={styles.date}>{item[voucherFieldsType.usedAt]}</Text>
    //     </View>
    //   </ImageBackground>
    // </View>
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/display/VoucherCard.jpg")}
        style={styles.card}
        imageStyle={styles.image}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {/* Centered Voucher Code */}
          <View style={styles.codeContainer}>
            <Text style={styles.code}>
              {item[voucherFieldsType.voucherCardCode]}
            </Text>
          </View>

          {/* Date at Bottom */}
          <View style={styles.dateContainer}>
            <Text style={styles.date}>
              {setdateTime(item[voucherFieldsType.usedAt])}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  card: {
    width: 320,
    height: 160,
    borderRadius: 20,
    overflow: "hidden",
  },
  image: {
    resizeMode: "cover",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    padding: 16,
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },

  /* CENTER CODE PROPERLY */
  codeContainer: {
    flex: 1,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  code: {
    fontSize: 16, // 🔴 scale(6) is TOO SMALL on mobile
    fontWeight: "bold",
    color: theme.body,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  /* BOTTOM DATE */
  dateContainer: {
    alignItems: "center",
    // paddingBottom: 6,
  },

  date: {
    fontSize: 14,
    color: theme.body,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
