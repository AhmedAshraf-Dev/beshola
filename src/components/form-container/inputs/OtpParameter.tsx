import { View, Text, Dimensions, StyleSheet } from "react-native";
import React, { useState } from "react";
import OTPTextInput from "react-native-otp-textinput";
import { Controller } from "react-hook-form";

export default function OtpParameter({ ...props }) {
  const { width } = Dimensions.get("window"); // get screen width

  let {
    value: defaultValue,
    enable,
    title,
    fieldName,
    control,
    type,
    placeholder,
    mustConfirmed = type === "confirmPassword",
    clearErrors,
  }: any = props;
  return (
    <Controller
      control={control}
      rules={{
        required: true,
      }}
      name={fieldName}
      render={({ field: { onChange, onBlur, value } }) => (
        <View
          className="items-center flex-row justify-center"
          style={{ alignSelf: "anchor-center" }}
        >
          <OTPTextInput
            inputCount={6}
            handleTextChange={onChange}
            tintColor="#6200ee"
            offTintColor="#ccc"
            textInputStyle={[
              styles.otpInput,
              { width: width < 640 ? (width - 60) / 10 : 50 }, // dynamically divide width
            ]}
          />
        </View>
      )}
    />
  );
}
const styles = StyleSheet.create({
  otpInput: {
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
  },
});
