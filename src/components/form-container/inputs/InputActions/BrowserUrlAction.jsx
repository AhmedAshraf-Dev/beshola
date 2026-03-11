import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

const BrowserUrlAction = ({ onImageUpload }) => {
  // Only need one selector for localization
  const localization = useSelector((state) => state.localization.localization);

  const [modalOpen, setModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Guard against undefined localization to prevent crashes
  if (!localization) return null;

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    setError(false);
    setImageUrl("");
  };

  const handleTextChange = (text) => {
    setImageUrl(text); // This updates the state
    if (error) setError(false);
  };

  const validateAndFetch = async () => {
    try {
      new URL(imageUrl);
    } catch {
      setError(localization.browser.error.invalidUrl);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType?.startsWith("image")) {
          onImageUpload(imageUrl, contentType);
          toggleModal();
        } else {
          setError(localization.browser.error.notImage);
        }
      } else {
        setError(
          localization.browser.error.fetchFailed.replace(
            "{status}",
            response.status,
          ),
        );
      }
    } catch (err) {
      setError(localization.browser.error.fetchError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Pressable onPress={toggleModal} style={styles.actionButton}>
        <Ionicons name="link-outline" size={24} color="#555" />
      </Pressable>

      <Modal visible={modalOpen} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>
              {localization.browser.modal.header}
            </Text>

            <TextInput
              placeholder={localization.inputs.image.UrlPlaceholder}
              onChangeText={handleTextChange}
              value={imageUrl} // <--- CHANGED FROM defaultValue TO value
              // autoCapitalize="none"
              // keyboardType="url"
              // autoCorrect={false} // Recommended for URLs
              style={[styles.input, error && styles.errorInput]}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.buttons}>
              <Pressable onPress={toggleModal} style={styles.btn}>
                <Text style={styles.cancelText}>
                  {localization.browser.modal.button.cancel}
                </Text>
              </Pressable>

              <Pressable
                onPress={validateAndFetch}
                disabled={loading || !imageUrl}
                style={[
                  styles.btn,
                  (!imageUrl || loading) && styles.disabledBtn,
                ]}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="blue" />
                ) : (
                  <Text style={styles.fetchText}>
                    {localization.browser.modal.button.fetch}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    padding: 10,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)", // Darker overlay for better focus
  },
  modal: {
    width: "85%",
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
  },
  errorInput: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    marginTop: 8,
    fontSize: 14,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  btn: {
    padding: 10,
    minWidth: 80,
    alignItems: "center",
  },
  disabledBtn: {
    opacity: 0.5,
  },
  cancelText: {
    color: "#666",
    fontWeight: "600",
  },
  fetchText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});

export default BrowserUrlAction;
