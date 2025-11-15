import React, { useEffect, useRef } from "react";
import { View, Platform } from "react-native";
import Barcode from "react-native-barcode-svg";
import JsBarcode from "jsbarcode";
import { Text } from "../../../components/ui";

export default function BarcodeComponent({ value, chiled }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (Platform.OS === "web" && svgRef.current) {
      JsBarcode(svgRef.current, value, {
        format: "CODE128",
        width: 2,
        height: 40,
        displayValue: false,
      });
    }
  }, [value]);

  if (Platform.OS === "web") {
    return (
      <View className="items-center mt-6">
        <svg ref={svgRef} textRendering={false}></svg>
        {chiled}
      </View>
    );
  }

  // Mobile rendering
  return (
    <View className="items-center mt-6">
      <Barcode value={value} format="CODE128" width={2} height={40} />
      {chiled}
    </View>
  );
}
