// import React, { useEffect } from "react";
// import { View, Text } from "react-native";
// import WebSocketClient from "./src/components/notification/TestWithStaticServer";
// import { registerBackgroundFetch } from "./src/components/notification/registerBackgroundFetch";

// const App = () => {
//   useEffect(() => {
//     registerBackgroundFetch();
//   }, []);

//   return (
//     <View>
//       <Text>Expo WebSocket Notifications</Text>
//       <WebSocketClient />
//     </View>
//   );
// };

// export default App;
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";

const API_URL =
  "https://ihs-solutions.com:8882/BrandingMartLanguage/api/Language/GetLanguages?PageSize=1000&PageNumber=1&ActiveStatus=1";

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testApiConnection = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      console.log("Testing API:", API_URL);

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      setData(result);
      Alert.alert("Success", "API connection successful!");
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message);
      Alert.alert("Error", `Failed to connect: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderData = () => {
    if (!data) return null;

    return (
      <View style={styles.dataContainer}>
        <Text style={styles.sectionTitle}>API Response:</Text>
        <ScrollView style={styles.jsonContainer}>
          <Text style={styles.jsonText}>{JSON.stringify(data, null, 2)}</Text>
        </ScrollView>
      </View>
    );
  };

  const renderError = () => {
    if (!error) return null;

    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error:</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#007AFF" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>API Configuration Test</Text>
        <Text style={styles.urlText}>{API_URL}</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={testApiConnection}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Test API Connection</Text>
          )}
        </TouchableOpacity>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Connecting to API...</Text>
          </View>
        )}

        {renderError()}
        {renderData()}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {data
            ? ` Data loaded successfully `
            : "Press button to test connection"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  urlText: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666666",
  },
  errorContainer: {
    backgroundColor: "#FFE6E6",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FF3B30",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF3B30",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#666666",
  },
  dataContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333333",
  },
  jsonContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  jsonText: {
    fontSize: 12,
    fontFamily: "monospace",
  },
  footer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  footerText: {
    textAlign: "center",
    color: "#666666",
    fontSize: 14,
  },
});
