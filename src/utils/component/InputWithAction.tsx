import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
} from "react-native";
import { isRTL } from "../operation/isRTL";
import { theme } from "../../Theme";

export default function InputWithAction({
  placeholder = "",
  inputType = "text",
  submitButtonText = "Submit",
  onSubmitFun,
}) {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputContainer}>
          {inputType === "textarea" ? (
            <TextInput
              placeholder={placeholder}
              onChangeText={setValue}
              value={value}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              style={[
                styles.textarea,
                isRTL() ? styles.rtlText : styles.ltrText,
              ]}
            />
          ) : (
            <TextInput
              placeholder={placeholder}
              onChangeText={setValue}
              value={value}
              style={[styles.input, isRTL() ? styles.rtlText : styles.ltrText]}
              placeholderTextColor="#999"
            />
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={async () => {
          setIsLoading(true);
          await onSubmitFun(value);
          setIsLoading(false);
        }}
        disabled={isLoading}
        style={[
          styles.button,
          { backgroundColor: isLoading ? theme.border : theme.accent },
          isRTL() ? styles.buttonLeft : styles.buttonRight,
        ]}
      >
        <Text style={styles.buttonText}>{submitButtonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  inputContainer: {
    flex: 1,
    minWidth: 200,
  },
  input: {
    height: 48,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  rtlText: {
    textAlign: "right",
    marginLeft: 8,
  },
  ltrText: {
    textAlign: "left",
    marginRight: 8,
  },
  button: {
    height: 48,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: ,
    borderRadius: 8,
  },
  buttonRight: {
    marginLeft: 8,
  },
  buttonLeft: {
    marginRight: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
