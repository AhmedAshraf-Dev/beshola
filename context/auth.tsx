import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
  useRef,
} from "react";
import { deleteKey, retrieveSecureValue } from "../src/store/secureStore";
import { DevSettings, Platform } from "react-native";
import { useDeviceInfo } from "../src/utils/component/useDeviceInfo";
import { jwtDecode } from "jwt-decode";
import { checkOnboarding } from "../src/utils/operation/checkOnboarding";
import { persistor } from "../src/store/reduxStore";
import { useDisplayToast } from "../src/components/form-container/ShowToast";
import { isRTL } from "../src/utils/operation/isRTL";
import { useDispatch } from "react-redux";
function AuthProvider(props) {
  const [user, setUser] = useState(null);
  const [profileInfo, setProfileInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [hasOnboarded, setHasOnboarded] = useState<null | boolean>(false);
  const { os } = useDeviceInfo();
  const [userGust, setUserGust] = useState(true); //TODO:make sure type of  user
  const { showToast } = useDisplayToast();
  const dispatch = useDispatch();

  useEffect(() => {
    (async function () {
      const result = await retrieveSecureValue("token");
      // const remember = await retrieveSecureValue("rememberMe");
      const onboarded = await checkOnboarding();
      setHasOnboarded(onboarded);
      if ("true" !== "true" && Platform.OS !== "web") {
        // either "false" or missing → wipe out the token
        await deleteKey("token");
        await deleteKey("rememberMe");
      } else {
        if (result) {
          const decodedToken = jwtDecode(result);
          const user = {
            avatarUrl:
              "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
            ...decodedToken,
          };
          setUser(user);
          setUserGust(false);
        }
      }
      setLoading(false);
    })();
  }, []);
  useEffect(() => {
    if (notifications.length > 0) {
      // Copy notifications to avoid mutation issues
      const notifsToShow = [...notifications];

      notifsToShow.forEach((notification) => {
        if (notification) {
          showToast(
            notification.mess,
            "",
            notification.status || "success",
            "outline",
            isRTL() ? "top left" : "top right"
          );
        }
      });

      // Clear AFTER the tick to avoid race condition
      setTimeout(() => setNotifications([]), 0);
    }
  }, [notifications]);

  const signOut = useCallback(async () => {
    setUser(undefined);
    await deleteKey("token");
    await deleteKey("rememberMe");

    // ✅ Reset Redux except localization
    dispatch({ type: "RESET_STORE" });
    // persistor.purge();

    if (Platform.OS === "web") {
      window.location.href = "/";
    } else {
      DevSettings.reload();
    }
  }, []);

  function CheckPortalMenuItem(menuItemID) {
    const usersGroupDashboardMenuItemsJson = JSON.parse(
      user?.UsersGroupDashboardMenuItems
    );

    const menuItemIDFind = usersGroupDashboardMenuItemsJson?.find(
      (item) => item.DashboardItemID === menuItemID
    );
    if (!menuItemIDFind || menuItemID === "home") {
      signOut();
      return false;
    }
    return true;
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signOut,
        loading,
        CheckPortalMenuItem,
        notifications,
        setNotifications,
        userGust,
        setUserGust,
        setHasOnboarded,
        hasOnboarded,
        profileInfo,
        setProfileInfo,
      }}
      {...props}
    />
  );
}

const AuthContext = createContext({ loading: false });
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
