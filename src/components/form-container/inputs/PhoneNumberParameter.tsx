import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  Dimensions,
  I18nManager,
  TouchableWithoutFeedback,
} from "react-native";
import { Controller } from "react-hook-form";
import { theme } from "../../../Theme";
import { useSelector } from "react-redux";
import { useSchemas } from "../../../../context/SchemaProvider";
import FlagIcon from "../../../utils/component/DrawFlag";

const screenWidth = Dimensions.get("window").width;

const PhoneNumberParameter = ({
  control,
  value,
  fieldName,
  enable = true,
  setError,
  clearErrors,
  formSchemaParameters,
}) => {
  const localization = useSelector((state) => state.localization.localization);
  const countryCodes = localization.inputs.phoneNumber.countryCodes;
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef(null);
  const isRTL = I18nManager.isRTL;

  const { signupState } = useSchemas();

  const countryCodeParam =
    formSchemaParameters.find((param) => param.parameterType === "hidden") ??
    signupState.schema.dashboardFormSchemaParameters.find(
      (param) => param.parameterType === "hidden"
    );

  const handleSelectCode = (item) => {
    setSelectedCountry(item);
    setShowDropdown(false);
    clearErrors && clearErrors(fieldName);
  };

  const openDropdown = () => {
    if (buttonRef.current) {
      buttonRef.current.measureInWindow((x, y, width, height) => {
        setDropdownPos({ top: y + height, left: x, width });
        setShowDropdown(true);
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        {/* Country Selector Button */}
        <TouchableOpacity
          ref={buttonRef}
          style={styles.codeButton}
          onPress={openDropdown}
          disabled={!enable}
        >
          <View
            style={[
              styles.flagWrapper,
              isRTL && { flexDirection: "row-reverse" },
            ]}
          >
            <FlagIcon code={selectedCountry.iso} />
            <Text style={styles.codeText}>{selectedCountry.code}</Text>
            <Text style={styles.arrow}>▼</Text>
          </View>
        </TouchableOpacity>

        {/* Dropdown */}
        <Modal
          visible={showDropdown}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDropdown(false)}
        >
          <View style={styles.modalOverlay}>
            {/* Dropdown box (touchable inside) */}
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.dropdown,
                  {
                    top: dropdownPos.top,
                    left: dropdownPos.left,
                    width:
                      dropdownPos.width > 0
                        ? dropdownPos.width
                        : screenWidth * 0.8,
                  },
                ]}
              >
                <FlatList
                  data={countryCodes}
                  keyExtractor={(item) => item.code}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.dropdownItem,
                        isRTL && { flexDirection: "row-reverse" },
                      ]}
                      onPress={() => handleSelectCode(item)}
                    >
                      <FlagIcon code={item.iso} />
                      <Text
                        style={[
                          styles.dropdownText,
                          {
                            textAlign: isRTL ? "right" : "left",
                            writingDirection: isRTL ? "rtl" : "ltr",
                          },
                        ]}
                      >
                        {item.country} ({item.code})
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>

            {/* Overlay to close modal */}
            <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
              <View style={StyleSheet.absoluteFill} />
            </TouchableWithoutFeedback>
          </View>
        </Modal>

        {/* Phone Input */}
        <Controller
          control={control}
          name={fieldName}
          defaultValue={value || ""}
          rules={{
            required: true,
            validate: (val) => {
              const regexPattern = selectedCountry.regex;
              const regex =
                typeof regexPattern === "string"
                  ? new RegExp(regexPattern)
                  : regexPattern;
              const cleaned = val.replace(/\D/g, "");

              if (!regex.test(cleaned)) {
                return `${localization.inputs.phoneNumber.error} ${selectedCountry.country}`;
              }

              return true; // Valid
            },
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <View style={{ flex: 1 }}>
              <TextInput
                style={[
                  styles.input,
                  !enable && styles.disabledInput,
                  error && { borderColor: "red" },
                  isRTL && { textAlign: "right" },
                ]}
                className="p-3"
                placeholder="123-456-7890"
                value={value}
                editable={enable}
                keyboardType="phone-pad"
                onChangeText={onChange}
                onBlur={onBlur}
              />
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          )}
        />

        {/* Hidden Country Code Sync */}
        <Controller
          key={countryCodeParam?.parameterField}
          control={control}
          rules={{ required: true }}
          name={countryCodeParam?.parameterField}
          render={({ field: { onChange } }) => {
            useEffect(() => {
              onChange(selectedCountry.code);
            }, [selectedCountry]);
            return null;
          }}
        />
      </View>
    </View>
  );
};

export default PhoneNumberParameter;

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  inputGroup: { flexDirection: "row", alignItems: "center" },

  flagWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  codeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.body,
    borderColor: theme.border,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  codeText: { fontSize: 16, fontWeight: "bold", marginHorizontal: 6 },
  arrow: { fontSize: 12, color: theme.text },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.2)" },

  dropdown: {
    position: "absolute",
    backgroundColor: theme.body,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    maxHeight: 250,
    zIndex: 9999,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownText: {
    color: theme.text,
    fontSize: 14,
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.border,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 10,
    height: 60,
    backgroundColor: theme.body,
    color: theme.text,
  },
  disabledInput: { backgroundColor: theme.body },
  errorText: { color: theme.error, fontSize: 12, marginTop: 4 },
});
