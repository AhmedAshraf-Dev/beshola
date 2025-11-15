import { MaterialIcons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppState, Platform, View } from "react-native";
import { useSelector } from "react-redux";
import { Text } from "../components/ui";
import { SetIsOnline } from "../request";
import { styles } from "../src/components/splash/styles";
import { isRTL } from "../src/utils/operation/isRTL";
import { RunOnlyInDeployment } from "../src/utils/operation/RunOnlyInDeployment";

type ConnectionType =
  | "wifi"
  | "cellular"
  | "ethernet"
  | "none"
  | "unknown"
  | "bluetooth"
  | "vpn"
  | "other";

type NetworkStatus = {
  isConnected: boolean;
  isInternetReachable: boolean;
  connectionType: ConnectionType;
  lastUpdated: Date | null;
};

type NetworkContextType = {
  status: NetworkStatus;
  isOnline: boolean;
  checkNetwork: () => Promise<void>;
};

const NetworkContext = createContext<NetworkContextType>({
  status: {
    isConnected: true,
    isInternetReachable: true,
    connectionType: "unknown",
    lastUpdated: null,
  },
  isOnline: true,
  checkNetwork: async () => {},
});

export const NetworkProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [status, setStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    connectionType: "unknown",
    lastUpdated: null,
  });

  const [isOnline, setIsOnline] = useState(true);
  const [speedLevel, setSpeedLevel] = useState(4);

  const [lastChecked, setLastChecked] = useState(Date.now());
  const localization = useSelector((state) => state.localization.localization);

  const checkNetwork = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();

      setStatus({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? false,
        connectionType: (state.type as ConnectionType) || "unknown",
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error("Network check failed:", error);
      setStatus({
        isConnected: false,
        isInternetReachable: false,
        connectionType: "unknown",
        lastUpdated: new Date(),
      });
    }
  }, []);
  const testNetworkSpeed = async () => {
    try {
      const start = Date.now();
      const response = await fetch("https://ihs-solutions.com:8882/test", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Network ping failed");

      const end = Date.now();
      const duration = end - start; // ms ping

      // Map ms → speed level (tweak thresholds as needed)
      if (duration > 2000) {
        setSpeedLevel(0); // 🚫 very poor
        // setIsOnline(false);
      } else if (duration > 1000) setSpeedLevel(1); // weak
      else if (duration > 500) setSpeedLevel(2); // fair
      else if (duration > 200) setSpeedLevel(3); // good
      else setSpeedLevel(4); // excellent
    } catch (error) {
      setSpeedLevel(0);
      //setIsOnline(false);
    }
  };
  // Continuous internet verification every 2 seconds

  const verifyInternet = async () => {
    try {
      const netState = await NetInfo.fetch();
      if (!netState.isConnected || !netState.isInternetReachable) {
        SetIsOnline(false);
        setIsOnline(false);
        // showErrorToast("connection Error", "please connect to internet ");

        return;
      }

      // After connectivity check, test speed
      RunOnlyInDeployment(async () => {
        // await testNetworkSpeed();
      });

      // Only reload if enough time has passed since the last check (e.g., 5 minutes)

      if (netState.isConnected !== isOnline && Platform.OS === "web") {
        window.location.reload();
      }

      // Optional: log type of connection

      // Now test actual API reachability
      // const response = await fetch('http://41.196.0.25:8000/BrandingMartAccounting/api/Accounting/GetAccountInfo', {
      //   method: 'GET',
      //   cache: 'no-store',
      // });

      // if (response.status === 204) {
      //   console.log('🟢 Connected to API');
      //   setIsOnline(true);
      // } else {
      //   console.log('🔴 API responded with unexpected status:', response.status);
      //   setIsOnline(false);
      // }
    } catch (error) {
      console.log("error", error);
      SetIsOnline(false);
      setIsOnline(false);
    }
  };
  useEffect(() => {
    if (Platform.OS === "web") {
      // 👇 This function will run every time tab visibility changes
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          console.log("Tab became active again, reloading...");
          RunOnlyInDeployment(() => {
            // window.location.reload();
          });
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      // cleanup
      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(verifyInternet, 2000);
    return () => clearInterval(intervalId);
  }, [verifyInternet, isOnline]);

  // Listen to app state and network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setStatus({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? false,
        connectionType: (state.type as ConnectionType) || "unknown",
        lastUpdated: new Date(),
      });
    });

    const appStateListener = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState === "active") {
          checkNetwork();
        }
      }
    );

    checkNetwork();

    return () => {
      unsubscribe();
      appStateListener.remove();
    };
  }, [checkNetwork]);
  const renderWifiIcon = () => {
    switch (speedLevel) {
      case 1:
        return (
          <MaterialIcons name="network-wifi-1-bar" size={20} color="white" />
        );
      case 2:
        return (
          <MaterialIcons name="network-wifi-2-bar" size={20} color="white" />
        );
      case 3:
        return (
          <MaterialIcons name="network-wifi-3-bar" size={20} color="white" />
        );
      case 4:
        return <MaterialIcons name="network-wifi" size={20} color="white" />;
      default:
        return <MaterialIcons name="wifi-off" size={20} color="white" />;
    }
  };

  return (
    <NetworkContext.Provider value={{ status, isOnline, checkNetwork }}>
      {/* Offline full-width banner */}
      {!isOnline && (
        <View className="bg-red-500 py-2 w-full absolute top-0 z-50">
          <Text className="text-white text-center font-bold">
            {localization.Hum_screens.offLine}
          </Text>
        </View>
      )}

      {/* Online but slow -> floating banner */}
      {isOnline && speedLevel >= 0 && speedLevel < 4 && (
        <View
          style={[
            styles.networkContainer,
            { backgroundColor: "rgba(0,0,0,0.7)" },
            isRTL() ? { left: 20 } : { right: 20 },
            { top: 40 },
          ]}
        >
          {renderWifiIcon()}
          <Text style={styles.networkText}>
            {localization.Hum_screens.slowConnection}
          </Text>
        </View>
      )}

      {/* Main Content */}
      <View
        style={{
          paddingTop: !isOnline ? 40 : 0, // 👈 Only push down if offline banner shows
          flex: 1,
        }}
      >
        {children}
      </View>
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  return useContext(NetworkContext);
};
