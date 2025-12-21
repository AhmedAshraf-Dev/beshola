import { ToastProvider } from "@gluestack-ui/toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GluestackUIProvider } from "./components/ui";
import { AuthProvider } from "./context/auth";
import { CartProvider } from "./context/CartProvider";
import { LocalizationProvider } from "./context/LocalizationContext";
import { SearchProvider } from "./context/SearchProvider";
import { NetworkProvider } from "./context/NetworkContext";
import { PreparingApp } from "./context/PreparingApp";
import { SchemaProvider } from "./context/SchemaProvider";
import { ShopNodeProvider } from "./context/ShopNodeProvider";
import { WSProvider } from "./context/WSProvider";
import "./global.css";
import RootStack from "./src/navigators/RootStack";
import { persistor, store } from "./src/store/reduxStore";
import { theme } from "./src/Theme";
import "./patch-registerWebModule";
import { CompareProvider } from "./context/CompareProvider";

const queryClient = new QueryClient();

export default function App() {
  // const [iconsLoaded, setIconsLoaded] = useState(false);
  // let [poppinsLoaded] = usePoppins({
  //   Poppins_400Regular,
  //   Poppins_700Bold,
  // });

  // let [latoLoaded] = useLato({
  //   Lato_400Regular,
  //   Lato_700Bold,
  // });

  // const fontsLoaded = poppinsLoaded && latoLoaded;

  // // ⏳ Show loader until fonts are ready
  // if (!fontsLoaded) {
  //   return (
  // <View style={styles.loader}>
  //   <ActivityIndicator size="large" color={theme.accentHover} />
  // </View>
  //   );
  // }

  // // 🌍 Apply global font (default for all <Text>)
  // if (Text.defaultProps == null) Text.defaultProps = {};
  // Text.defaultProps.style = { fontFamily: "Poppins_400Regular" };
  // if (Platform.OS === "web") {
  //   const style = document.createElement("style");
  //   style.innerHTML = `
  //   @font-face {
  //     font-family: "Ionicons";
  //     src: url(${require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf")}) format("truetype");
  //     font-display: swap;
  //   }
  // `;
  //   document.head.appendChild(style);
  // }

  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <PersistGate
          loading={
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={theme.accentHover} />
            </View>
          }
          persistor={persistor}
        >
          <ToastProvider>
            <QueryClientProvider client={queryClient}>
              <GluestackUIProvider mode="light">
                <LocalizationProvider>
                  {/* <NetworkProvider> */}
                  <SchemaProvider>
                    {/* put localization provider */}
                    <AuthProvider>
                      <WSProvider>
                        <ShopNodeProvider>
                          <PreparingApp>
                            <SafeAreaView
                              style={{ flex: 1, overflow: "scroll" }}
                            >
                              <CartProvider>
                                <SearchProvider>
                                  <RootStack />
                                </SearchProvider>
                              </CartProvider>
                            </SafeAreaView>
                          </PreparingApp>
                        </ShopNodeProvider>
                      </WSProvider>
                    </AuthProvider>
                  </SchemaProvider>
                  {/* </NetworkProvider> */}
                </LocalizationProvider>
              </GluestackUIProvider>
            </QueryClientProvider>
          </ToastProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
