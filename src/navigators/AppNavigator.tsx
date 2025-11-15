import React, { Suspense, lazy, useEffect, useState } from "react";
import { View, Dimensions, Platform, StyleSheet } from "react-native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import HeaderParent from "../components/header/HeaderParent";
import RenderItemsView from "../utils/component/renderItemsView";
import { SetResponsiveContainer } from "../utils/component/SetResponsiveContainer";
import { selectedRoutes } from "../utils/operation/routes";
import { useAuth } from "../../context/auth";
import { scale } from "react-native-size-matters";
import { theme } from "../Theme";
import LoadingScreen from "../kitchensink-components/loading/LoadingScreen";
import DetailsScreen from "../components/company-components/DetailsScreen";
import { clearRedirect } from "../reducers/redirectReducer";
import { deleteKey } from "../store/secureStore";
import { useDisplayToast } from "../components/form-container/ShowToast";
import { isRTL } from "../utils/operation/isRTL";
import ErrorScreen from "../components/privacy/ErrorScreen";
import BottomBarIcon from "../components/BottomBarIcon";
import { getTabBarVisibility } from "../utils/operation/getTabBarVisibility";
import {
  Feather,
  Fontisto,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

// ✅ Lazy-loaded screens
const MenuFilter = lazy(() => import("../components/filters/MenuFilter"));
const CartPage = lazy(() => import("../kitchensink-components/cart/CartPage"));
const CheckoutScreen = lazy(
  () => import("../kitchensink-components/cart/CheckoutScreen")
);
const NotificationScreen = lazy(
  () => import("../components/notification/NotificationScreen")
);
const SignIn = lazy(() => import("../kitchensink-components/auth/signin"));
const SignUp = lazy(() => import("../kitchensink-components/auth/signup"));
const ForgotPassword = lazy(
  () => import("../kitchensink-components/auth/forgot-password")
);
const VerifyScreen = lazy(
  () => import("../kitchensink-components/auth/verfiy")
);
const PrivacyPolicy = lazy(() => import("../components/privacy/PrivacyPolicy"));

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/* ------------------------- Shared Stack (Web + Mobile) ------------------------ */
const AppStack = ({ userGust }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation:
          Platform.OS === "web"
            ? "none"
            : CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      {selectedRoutes(userGust).routes.map((item) => (
        <Stack.Screen
          key={item.routePath}
          name={item.routePath}
          options={{ headerShown: false }}
        >
          {(props) => (
            <View style={{ flex: 1 }} className="!bg-body !text-text">
              <View
                style={[
                  styles.container,
                  { width: "100%", alignSelf: "center" },
                ]}
              >
                <HeaderParent />
              </View>
              <RenderItemsView {...props} routePath={item.routePath} />
            </View>
          )}
        </Stack.Screen>
      ))}

      {/* Shared Screens */}
      <Stack.Screen name="ErrorScreen" component={ErrorScreen} />

      {!userGust && (
        <Stack.Screen name="Cart">
          {(props) => (
            <Suspense fallback={<LoadingScreen />}>
              {SetResponsiveContainer(<CartPage {...props} />, true)}
            </Suspense>
          )}
        </Stack.Screen>
      )}

      <Stack.Screen name="MenuFilter">
        {(props) => (
          <Suspense fallback={<LoadingScreen />}>
            {SetResponsiveContainer(<MenuFilter {...props} />, true)}
          </Suspense>
        )}
      </Stack.Screen>

      <Stack.Screen name="DetailsProductScreen" component={DetailsScreen} />

      {!userGust && (
        <Stack.Screen name="NotificationScreen">
          {(props) => (
            <Suspense fallback={<LoadingScreen />}>
              {SetResponsiveContainer(<NotificationScreen {...props} />, true)}
            </Suspense>
          )}
        </Stack.Screen>
      )}

      {/* Auth Screens */}
      <Stack.Screen name="SignIn">
        {(props) => (
          <Suspense fallback={<LoadingScreen />}>
            <SignIn {...props} />
          </Suspense>
        )}
      </Stack.Screen>

      <Stack.Screen name="SignUp">
        {(props) => (
          <Suspense fallback={<LoadingScreen />}>
            <SignUp {...props} />
          </Suspense>
        )}
      </Stack.Screen>

      <Stack.Screen name="Verify">
        {(props) => (
          <Suspense fallback={<LoadingScreen />}>
            <VerifyScreen {...props} />
          </Suspense>
        )}
      </Stack.Screen>

      <Stack.Screen name="ForgetPassword">
        {(props) => (
          <Suspense fallback={<LoadingScreen />}>
            <ForgotPassword {...props} />
          </Suspense>
        )}
      </Stack.Screen>

      <Stack.Screen name="Checkout">
        {(props) => (
          <Suspense fallback={<LoadingScreen />}>
            {SetResponsiveContainer(<CheckoutScreen {...props} />, true)}
          </Suspense>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

/* ---------------------------- Mobile Tab Navigator ---------------------------- */
const MobileTabs = ({ userGust }) => {
  const routes = selectedRoutes(userGust).routes;

  const icons = {
    Home: (color) => (
      <MaterialCommunityIcons name="home" size={24} color={color} />
    ),
    Profile: (color) => (
      <MaterialCommunityIcons name="account" size={24} color={color} />
    ),
    Orders: (color) => <MaterialIcons name="receipt" size={24} color={color} />,
    default: (color) => <Feather name="search" size={24} color={color} />,
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 65,
          backgroundColor: "#fff",
          borderTopColor: "#eee",
          borderTopWidth: 1,
        },
      }}
    >
      {routes.map((item) => {
        const Icon = icons[item.routePath] || icons.default;

        return (
          <Tab.Screen
            key={item.routePath}
            name={item.routePath}
            options={({ route }) => {
              const visibility = getTabBarVisibility(route);
              return {
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                  <View style={{ alignItems: "center" }}>
                    {focused && (
                      <View
                        style={{
                          width: 30,
                          height: 3,
                          backgroundColor: theme.accent,
                          borderRadius: 2,
                          marginBottom: 4,
                        }}
                      />
                    )}
                    <Icon color={focused ? theme.accent : theme.primary} />
                  </View>
                ),
                tabBarStyle: [
                  { backgroundColor: theme.body },
                  visibility === "none" && { display: "none" },
                ],
              };
            }}
          >
            {(props) => (
              <View style={{ flex: 1 }} className="!bg-body !text-text">
                <View
                  style={[
                    styles.container,
                    { width: "100%", alignSelf: "center" },
                  ]}
                >
                  <HeaderParent />
                </View>
                {/* 👇 Render only that route’s content */}
                <RenderItemsView {...props} routePath={item.routePath} />
              </View>
            )}
          </Tab.Screen>
        );
      })}
    </Tab.Navigator>
  );
};

/* ------------------------------- Main Component ------------------------------- */
const AppNavigator = () => {
  const { userGust, setUser } = useAuth();
  const dispatch = useDispatch();
  const { showToast } = useDisplayToast();
  const navigation = useNavigation();
  const redirect = useSelector((state) => state.redirect);
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );

  useEffect(() => {
    if (Platform.OS === "web") {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    const handleRedirect = async () => {
      if (redirect?.route) {
        if (redirect?.route === "SignIn") {
          setUser(undefined);
          await deleteKey("token");
          await deleteKey("rememberMe");
          dispatch({ type: "RESET_STORE" });
        }

        if (redirect?.mess) {
          showToast(
            redirect.mess,
            "",
            "info",
            "outline",
            isRTL() ? "top left" : "top right"
          );
        }

        navigation.navigate(redirect.route);
        dispatch(clearRedirect());
      }
    };

    handleRedirect();
  }, [redirect]);

  // ✅ Web uses Stack only, Mobile uses Tabs
  if (Platform.OS === "web") {
    return (
      <View style={{ flex: 1 }}>
        <AppStack userGust={userGust} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MobileTabs userGust={userGust} />
    </View>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(8),
    alignSelf: "center",
    color: theme.text,
    backgroundColor: theme.body,
  },
});
