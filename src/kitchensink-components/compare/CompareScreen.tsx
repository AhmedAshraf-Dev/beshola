import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { initCompanyRows } from "../../components/company-components/tabsData";
import GoBackHeader from "../../components/header/GoBackHeader";
import { LogoutButton } from "../profile/LogoutButton";
import CompareCards from "./CompareCards";
import { theme } from "../../Theme";
import { Feather } from "@expo/vector-icons";
import { useContext, useEffect } from "react";
import { CompareContext } from "../../../context/CompareProvider";

export default function CompareScreen() {
  const { setDisplayCompare, setCompareItems } = useContext(CompareContext);
  useEffect(() => {
    setDisplayCompare(false); // hide button on this screen
    return () => setDisplayCompare(true); // restore when leaving
  }, []);

  return (
    <View className="bg-body">
      <GoBackHeader
        title={"Compare"}
        rightComponent={
          <TouchableOpacity
            onPress={() => {
              setCompareItems([]);
            }}
            className="flex-row items-center px-3 py-1 rounded-full"
            style={{
              backgroundColor: theme.error + "15", // light error background
              borderWidth: 1,
              borderColor: theme.error,
              direction: "inherit",
            }}
          >
            <Feather name="x-circle" size={16} color={theme.error} />
            <Text
              className="text-xs mx-2 font-semibold ml-1"
              style={{ color: theme.error }}
            >
              Stop
            </Text>
          </TouchableOpacity>
        }
      />
      <CompareCards />
    </View>
  );
}
